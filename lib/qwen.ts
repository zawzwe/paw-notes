const BAILIAN_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const WORKSPACE_BASE = "https://ws-iacn18nt1kaevgro.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";

interface QwenAnalysisResult {
  emotion_label: string;
  emotion_confidence: number;
  translated_text: string;
  translated_text_zh: string;
}

/**
 * Step 1: Get audio description from Captioner model
 */
async function getAudioDescription(audioUrl: string): Promise<string> {
  const apiKey = process.env.ALIYUN_BAILIAN_API_KEY;
  if (!apiKey) throw new Error("ALIYUN_BAILIAN_API_KEY is not configured");

  const response = await fetch(`${WORKSPACE_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen3-omni-30b-a3b-captioner",
      messages: [{
        role: "user",
        content: [{
          type: "input_audio",
          input_audio: { data: audioUrl },
        }],
      }],
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Captioner API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Step 2: Analyze description with text model
 */
async function analyzeDescription(
  description: string,
  species: "cat" | "dog",
  locale: "zh" | "en"
): Promise<QwenAnalysisResult> {
  const apiKey = process.env.ALIYUN_BAILIAN_API_KEY;
  if (!apiKey) throw new Error("ALIYUN_BAILIAN_API_KEY is not configured");

  const speciesText = species === "cat" ? "猫" : "狗";

  const systemPrompt = `你是一位宠物行为学专家。我会给你一段${speciesText}叫声的音频描述，请根据描述判断情绪。

情绪选项：happy(开心)、sad(难过)、angry(生气)、fear(害怕)、excited(兴奋)、hungry(饥饿)、pain(疼痛)、playful(想玩)、anxious(焦虑)

判断指南：
- 叫声急促、重复、中等音高 → 可能是 hungry 或 excited
- 叫声短促轻快、有颤音或呼噜 → happy 或 playful
- 突然的高音尖叫、声音尖锐 → fear 或 pain
- 低沉咆哮、嘶嘶声 → angry
- 持续呜咽、颤抖 → sad 或 anxious
- 缓慢压抑的长啸 → pain

重要：请仔细分析描述中的声学特征，不默认任何情绪。不确定时给出 0.5-0.7 的置信度。`;

  const response = await fetch(`${BAILIAN_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "qwen-plus-latest",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `音频描述：${description}\n\n请根据以上描述分析这只${speciesText}的情绪，返回JSON：\n{\n  "emotion_label": "情绪标签",\n  "emotion_confidence": 0.0到1.0,\n  "translated_text": ${locale === "zh" ? `"用中文以宠物第一人称写一句话，贴合情绪"` : `"Write one sentence in English from the pet's first-person perspective, matching the emotion"`},\n  "translated_text_zh": "用中文以宠物第一人称写一句话，贴合情绪"\n}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Analysis API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error("Empty analysis response");

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Could not parse JSON: ${content}`);

  const result: QwenAnalysisResult = JSON.parse(jsonMatch[0]);

  if (!result.emotion_label || result.emotion_confidence == null) {
    throw new Error(`Incomplete result: ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Analyze pet audio — two-step pipeline
 * 1. Captioner describes the audio
 * 2. Text model analyzes the description for emotion
 */
export async function analyzePetAudio(
  audioUrl: string,
  species: "cat" | "dog",
  locale: "zh" | "en"
): Promise<QwenAnalysisResult> {
  // Step 1: Audio → Description
  const description = await getAudioDescription(audioUrl);

  if (!description || description.trim().length < 10) {
    throw new Error("Audio description too short or empty — try a clearer recording");
  }

  // Step 2: Description → Emotion
  return await analyzeDescription(description, species, locale);
}

/**
 * Generate TTS audio from text using Qwen TTS
 */
export async function generateTTS(
  _text: string,
  _locale: "zh" | "en"
): Promise<Buffer | null> {
  console.warn("TTS is not yet configured — skipping audio synthesis");
  return null;
}
