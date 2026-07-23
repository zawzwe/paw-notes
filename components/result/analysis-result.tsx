"use client";

import { useTranslations } from "next-intl";
import { Volume2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export interface AnalysisData {
  emotion: string;
  confidence: number;
  text: string;
  text_zh: string;
  tts_url: string | null;
}

interface AnalysisResultProps {
  data: AnalysisData | null;
  loading: boolean;
  error: string | null;
  locale: string;
  onPlayTTS?: () => void;
}

const emotionMeta: Record<string, { emoji: string; zhLabel: string; enLabel: string }> = {
  happy:    { emoji: "😊", zhLabel: "开心",    enLabel: "Happy" },
  sad:      { emoji: "😢", zhLabel: "难过",    enLabel: "Sad" },
  angry:    { emoji: "😤", zhLabel: "生气",    enLabel: "Angry" },
  fear:     { emoji: "😨", zhLabel: "害怕",    enLabel: "Scared" },
  excited:  { emoji: "🤩", zhLabel: "兴奋",    enLabel: "Excited" },
  hungry:   { emoji: "🍽️", zhLabel: "饿了",    enLabel: "Hungry" },
  pain:     { emoji: "🤕", zhLabel: "疼痛",    enLabel: "In pain" },
  playful:  { emoji: "🎾", zhLabel: "想玩",    enLabel: "Playful" },
  anxious:  { emoji: "😰", zhLabel: "焦虑",    enLabel: "Anxious" },
};

export function AnalysisResult({
  data,
  loading,
  error,
  locale,
}: AnalysisResultProps) {
  const t = useTranslations();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTTS = () => {
    const audio = audioRef.current;
    if (!audio || !data?.tts_url) return;
    if (isPlaying) {
      audio.pause();
      return;
    }
    audio.play();
    setIsPlaying(true);
  };

  // Loading state
  if (loading) {
    return (
      <section className="flex flex-col items-center gap-4 py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {t("result.analyzing")}
        </p>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 p-6 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs text-red-500 underline"
        >
          {t("common.retry")}
        </button>
      </section>
    );
  }

  // Empty
  if (!data) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground text-center">
          {t("result.noResult")}
        </h2>
        <div className="border border-dashed border-muted-foreground/30 rounded-2xl p-8 text-center text-sm text-muted-foreground">
          {t("result.analyzing")}
        </div>
      </section>
    );
  }

  // Result
  const meta = emotionMeta[data.emotion] || { emoji: "💬", zhLabel: data.emotion, enLabel: data.emotion };
  const confidencePct = Math.round(data.confidence * 100);
  const displayText = locale === "zh" ? data.text_zh || data.text : data.text;

  return (
    <section className="flex flex-col gap-4">
      {/* Emotion card */}
      <div className="rounded-2xl border border-muted-foreground/20 bg-card p-6 shadow-sm">
        {/* Header: emoji + emotion + confidence */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <p className="text-lg font-semibold">
                {locale === "zh" ? meta.zhLabel : meta.enLabel}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("result.emotion")}: {data.emotion}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{confidencePct}%</p>
            <p className="text-xs text-muted-foreground">{t("result.confidence")}</p>
          </div>
        </div>

        {/* Pet speaking text */}
        <div className="rounded-xl bg-muted/50 p-4">
          <p className="text-sm italic leading-relaxed">
            &ldquo;{displayText}&rdquo;
          </p>
        </div>
      </div>

      {/* TTS Play Button */}
      {data.tts_url && (
        <button
          onClick={handlePlayTTS}
          className={`
            flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm
            transition-all active:scale-[0.98]
            ${
              isPlaying
                ? "bg-primary/10 text-primary"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }
          `}
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
          {isPlaying ? "Playing..." : t("result.playTTS")}
        </button>
      )}

      <audio
        ref={audioRef}
        src={data.tts_url || undefined}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
    </section>
  );
}
