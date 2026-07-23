const BAILIAN_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1";

interface QwenAnalysisResult {
  emotion_label: string;
  emotion_confidence: number;
  translated_text: string;
  translated_text_zh: string;
}

/**
 * Analyze pet audio using Qwen3-Omni-Flash (OpenAI-compatible, supports input_audio)
 */
export async function analyzePetAudio(
  audioUrl: string,
  species: "cat" | "dog",
  locale: "zh" | "en"
): Promise<QwenAnalysisResult> {
  const apiKey = process.env.ALIYUN_BAILIAN_API_KEY;
  if (!apiKey) throw new Error("ALIYUN_BAILIAN_API_KEY is not configured");

  const speciesText = species === "cat" ? "猫" : "狗";
  const langText = locale === "zh" ? "中文" : "English";

  const systemPrompt = `你是一位专业的宠物行为学家。请仔细聆听这段${speciesText}的叫声，分析其表达的情绪。

请严格按照以下 JSON 格式返回，不要输出任何其他内容：
{
  "emotion_label": "happy|sad|angry|fear|excited|hungry|pain|playful|anxious",
  "emotion_confidence": 0.0到1.0之间的数字,
  "translated_text": "用${langText}写一段温暖的、以宠物第一人称口吻的话，像是宠物在对主人说话",
  "translated_text_zh": "用中文写一段温暖的、以宠物第一人称口吻的话"
}`;

  const response = await fetch(`${BAILIAN_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen3-omni-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "input_audio",
              input_audio: { data: audioUrl },
            },
            {
              type: "text",
              text: `请分析这段${speciesText}的叫声`,
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qwen API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Qwen API returned empty response");
  }

  // Parse JSON from response (handle possible markdown code blocks)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Could not parse JSON from Qwen response: ${content}`);
  }

  const result: QwenAnalysisResult = JSON.parse(jsonMatch[0]);

  if (!result.emotion_label || result.emotion_confidence == null) {
    throw new Error(`Incomplete analysis result: ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Generate TTS audio from text using Qwen TTS
 */
export async function generateTTS(
  text: string,
  locale: "zh" | "en"
): Promise<Buffer> {
  const apiKey = process.env.ALIYUN_BAILIAN_API_KEY;
  if (!apiKey) throw new Error("ALIYUN_BAILIAN_API_KEY is not configured");

  const response = await fetch(`${BAILIAN_BASE}/audio/speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen3-tts-flash",
      input: text,
      voice: locale === "zh" ? "Cherry" : "Bella",
      response_format: "mp3",
      speed: 1.0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TTS API error ${response.status}: ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
