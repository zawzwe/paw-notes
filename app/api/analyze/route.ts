import { NextRequest, NextResponse } from "next/server";
import { createApiClient } from "@/lib/supabase/api";
import { analyzePetAudio, generateTTS } from "@/lib/qwen";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const species = formData.get("species") as string | null;
    const source = formData.get("source") as string | null;
    const locale = (formData.get("locale") as string) || "zh";

    // Validate
    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }
    if (!species || !["cat", "dog"].includes(species)) {
      return NextResponse.json(
        { error: "Invalid species, must be 'cat' or 'dog'" },
        { status: 400 }
      );
    }
    if (!source || !["realtime", "upload"].includes(source)) {
      return NextResponse.json(
        { error: "Invalid source, must be 'realtime' or 'upload'" },
        { status: 400 }
      );
    }

    const supabase = await createApiClient();

    // 2. Get current user (may be null for unauthenticated)
    const { data: userData } = await supabase.auth.getClaims();
    const userId = userData?.claims?.sub;

    // 3. Upload audio file to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${crypto.randomUUID()}.webm`;
    const filePath = `${userId || "anonymous"}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("audio-uploads")
      .upload(filePath, fileBuffer, {
        contentType: file.type || "audio/webm",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload audio file" },
        { status: 500 }
      );
    }

    // 4. Get signed URL (valid 5 min) for Qwen API
    const { data: signedUrlData } = await supabase.storage
      .from("audio-uploads")
      .createSignedUrl(filePath, 300);

    const audioUrl = signedUrlData?.signedUrl;
    if (!audioUrl) {
      return NextResponse.json(
        { error: "Failed to generate signed URL" },
        { status: 500 }
      );
    }

    // 5. Create recording record (if authenticated)
    let recordingId: string | null = null;
    if (userId) {
      const { data: recording, error: recordingError } = await supabase
        .from("recordings")
        .insert({
          user_id: userId,
          source,
          species,
          file_path: filePath,
          status: "processing",
        })
        .select("id")
        .single();

      if (recordingError) {
        console.error("Recording insert error:", recordingError);
        // Continue anyway — don't block the user
      } else {
        recordingId = recording.id;
      }
    }

    // 6. Call Qwen for analysis
    let analysisResult;
    try {
      analysisResult = await analyzePetAudio(
        audioUrl,
        species as "cat" | "dog",
        locale as "zh" | "en"
      );
    } catch (aiError) {
      console.error("AI analysis error:", aiError);
      // Update recording status if we have one
      if (recordingId) {
        await supabase
          .from("recordings")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("id", recordingId);
      }
      return NextResponse.json(
        {
          error:
            aiError instanceof Error
              ? aiError.message
              : "Analysis failed, please try again",
        },
        { status: 502 }
      );
    }

    // 7. Generate TTS
    const textForTTS =
      locale === "zh" && analysisResult.translated_text_zh
        ? analysisResult.translated_text_zh
        : analysisResult.translated_text;

    let ttsPath: string | null = null;
    try {
      const ttsBuffer = await generateTTS(textForTTS, locale as "zh" | "en");
      const ttsFileName = `tts-${Date.now()}.mp3`;
      ttsPath = `${userId || "anonymous"}/${ttsFileName}`;

      const { error: ttsUploadError } = await supabase.storage
        .from("tts-output")
        .upload(ttsPath, ttsBuffer, {
          contentType: "audio/mpeg",
          upsert: false,
        });

      if (ttsUploadError) {
        console.error("TTS upload error:", ttsUploadError);
        ttsPath = null; // Continue without TTS if upload fails
      }
    } catch (ttsError) {
      console.error("TTS error:", ttsError);
      // Continue without TTS
    }

    // 8. Get TTS signed URL
    let ttsUrl: string | null = null;
    if (ttsPath) {
      const { data: ttsSigned } = await supabase.storage
        .from("tts-output")
        .createSignedUrl(ttsPath, 3600); // 1 hour
      ttsUrl = ttsSigned?.signedUrl || null;
    }

    // 9. Save analysis record (if authenticated)
    if (recordingId) {
      const { error: analysisError } = await supabase.from("analyses").insert({
        recording_id: recordingId,
        emotion_label: analysisResult.emotion_label,
        emotion_confidence: analysisResult.emotion_confidence,
        translated_text: analysisResult.translated_text,
        translated_text_zh: analysisResult.translated_text_zh,
        tts_audio_path: ttsPath,
        tts_language: locale,
      });

      if (analysisError) {
        console.error("Analysis insert error:", analysisError);
      }

      // Update recording status
      await supabase
        .from("recordings")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", recordingId);
    }

    // 10. Return result
    return NextResponse.json({
      success: true,
      recording_id: recordingId,
      emotion: analysisResult.emotion_label,
      confidence: analysisResult.emotion_confidence,
      text: analysisResult.translated_text,
      text_zh: analysisResult.translated_text_zh,
      tts_url: ttsUrl,
      recorded: !!recordingId,
    });
  } catch (err) {
    console.error("Unhandled API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
