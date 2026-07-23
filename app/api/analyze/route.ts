import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createApiClient } from "@/lib/supabase/api";
import { analyzePetAudio, generateTTS } from "@/lib/qwen";

// Service role client for server-side operations (bypasses RLS)
function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

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

    // Use service role client for storage/DB (bypasses RLS)
    const serviceClient = createServiceClient();

    // Use anon client to check auth
    const authClient = await createApiClient();
    const { data: userData } = await authClient.auth.getClaims();
    const userId = userData?.claims?.sub;

    // 2. Billing check for authenticated users
    let userProfile: { plan: string; daily_usage_count: number; daily_usage_date: string | null } | null = null;
    if (userId) {
      const { data: profile } = await serviceClient
        .from("profiles")
        .select("plan, daily_usage_count, daily_usage_date")
        .eq("user_id", userId)
        .maybeSingle();

      userProfile = profile ?? null;

      if (userProfile && userProfile.plan === "free") {
        const today = new Date().toISOString().split("T")[0];
        const usageDate = userProfile.daily_usage_date;
        const currentCount =
          usageDate === today ? userProfile.daily_usage_count : 0;

        if (currentCount >= 3) {
          return NextResponse.json(
            {
              error: "free_limit_reached",
              message: "今日免费次数已用完（3次），升级月度会员畅享无限分析",
            },
            { status: 429 }
          );
        }
      }
    }

    // 3. Upload audio file to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // Detect MIME from extension (FormData may not set proper MIME)
    const ext = file.name.split(".").pop()?.toLowerCase() || "webm";
    const mimeMap: Record<string, string> = {
      wav: "audio/wav", mp3: "audio/mpeg", m4a: "audio/x-m4a",
      ogg: "audio/ogg", webm: "audio/webm",
    };
    const mimeType = mimeMap[ext] || "audio/webm";
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const filePath = `${userId || "anonymous"}/${fileName}`;

    const { error: uploadError } = await serviceClient.storage
      .from("audio-uploads")
      .upload(filePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", JSON.stringify(uploadError));
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 4. Get signed URL (valid 5 min) for Qwen API
    const { data: signedUrlData } = await serviceClient.storage
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
      const { data: recording, error: recordingError } = await serviceClient
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
        await serviceClient
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
      if (!ttsBuffer) { ttsPath = null; } else {
      const ttsFileName = `tts-${Date.now()}.mp3`;
      ttsPath = `${userId || "anonymous"}/${ttsFileName}`;

      const { error: ttsUploadError } = await serviceClient.storage
        .from("tts-output")
        .upload(ttsPath, ttsBuffer, {
          contentType: "audio/mpeg",
          upsert: false,
        });

      if (ttsUploadError) {
        console.error("TTS upload error:", ttsUploadError);
        ttsPath = null; // Continue without TTS if upload fails
      }
      } // end else (ttsBuffer exists)
    } catch (ttsError) {
      console.error("TTS error:", ttsError);
      // Continue without TTS
    }

    // 8. Get TTS signed URL
    let ttsUrl: string | null = null;
    if (ttsPath) {
      const { data: ttsSigned } = await serviceClient.storage
        .from("tts-output")
        .createSignedUrl(ttsPath, 3600); // 1 hour
      ttsUrl = ttsSigned?.signedUrl || null;
    }

    // 9. Save analysis record (if authenticated)
    if (recordingId) {
      const { error: analysisError } = await serviceClient.from("analyses").insert({
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
      await serviceClient
        .from("recordings")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", recordingId);

      // Increment daily usage
      const today = new Date().toISOString().split("T")[0];
      if (userProfile && userProfile.plan === "free") {
        await serviceClient
          .from("profiles")
          .update({
            daily_usage_count:
              (userProfile.daily_usage_date === today
                ? userProfile.daily_usage_count
                : 0) + 1,
            daily_usage_date: today,
          })
          .eq("user_id", userId);
      }
    }

    // 10. Return result
    const now = new Date().toISOString().split("T")[0];
    const dailyRemaining =
      userProfile?.plan === "free"
        ? Math.max(0, 3 - (now === userProfile.daily_usage_date ? userProfile.daily_usage_count + 1 : 1))
        : null;

    return NextResponse.json({
      success: true,
      recording_id: recordingId,
      emotion: analysisResult.emotion_label,
      confidence: analysisResult.emotion_confidence,
      text: analysisResult.translated_text,
      text_zh: analysisResult.translated_text_zh,
      tts_url: ttsUrl,
      recorded: !!recordingId,
      plan: userProfile?.plan || "free",
      dailyRemaining,
    });
  } catch (err) {
    console.error("Unhandled API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
