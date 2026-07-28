"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Play, Pause, FlaskConical } from "lucide-react";
import { samples, type SampleItem } from "@/lib/samples";
import { AnalysisResult, type AnalysisData } from "@/components/result/analysis-result";

export function SampleSound() {
  const t = useTranslations();
  const locale = useLocale();
  const [playing, setPlaying] = useState<string | null>(null);
  const [selected, setSelected] = useState<SampleItem | null>(null);
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (sample: SampleItem) => {
    if (playing === sample.id) {
      audioEl?.pause();
      setPlaying(null);
      return;
    }
    audioEl?.pause();
    const audio = new Audio(sample.audio);
    audio.onended = () => setPlaying(null);
    audio.play();
    setAudioEl(audio);
    setPlaying(sample.id);
    setSelected(sample);
  };

  const handleViewResult = (sample: SampleItem) => {
    setSelected(sample);
  };

  if (selected) {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {t("sample.badge")}
          </span>
        </div>

        {/* Context */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 p-4 text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
            {selected.emoji} {locale === "zh" ? selected.titleZh : selected.title}
          </p>
          <p className="text-muted-foreground text-xs">
            {locale === "zh" ? selected.contextZh : selected.context}
          </p>
        </div>

        {/* Play again */}
        <button
          onClick={() => handlePlay(selected)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {playing === selected.id ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {t("sample.replay")}
        </button>

        {/* Pre-generated result */}
        <AnalysisResult
          data={selected.result}
          loading={false}
          error={null}
          locale={locale}
          wasSaved={false}
        />

        {/* Back to samples */}
        <button
          onClick={() => setSelected(null)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t("sample.back")}
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 justify-center">
        <FlaskConical className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("sample.title")}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {samples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handlePlay(sample)}
            className={`
              flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all duration-200
              ${playing === sample.id
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
                : "border-muted-foreground/15 hover:border-muted-foreground/30 hover:bg-muted/30"
              }
            `}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{sample.emoji}</span>
              <span className="text-xs font-medium truncate">
                {locale === "zh" ? sample.titleZh : sample.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {playing === sample.id ? (
                <Pause className="w-3 h-3 text-amber-500" />
              ) : (
                <Play className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-[10px] text-muted-foreground">
                {playing === sample.id
                  ? t("sample.playing")
                  : t("sample.listen")}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground/60 text-center">
        {t("sample.hint")}
      </p>
    </section>
  );
}
