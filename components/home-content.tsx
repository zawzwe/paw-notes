"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Upload } from "lucide-react";
import { AnimalSelector, type Animal } from "@/components/recording/animal-selector";
import { Recorder } from "@/components/recording/recorder";
import { useRecording } from "@/hooks/use-recording";

export function HomeContent() {
  const t = useTranslations();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const recording = useRecording({ maxDuration: 30 });

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col gap-8 px-4 py-8">
      {/* ── 动物选择区 ── */}
      <AnimalSelector
        selected={selectedAnimal}
        onSelect={setSelectedAnimal}
      />

      {/* ── 录音操作区 ── */}
      <Recorder
        state={recording.state}
        duration={recording.duration}
        audioUrl={recording.audioUrl}
        onStart={recording.startRecording}
        onStop={recording.stopRecording}
        onReset={recording.reset}
        disabled={!selectedAnimal}
      />
      {recording.error && (
        <p className="text-xs text-red-500 text-center -mt-4">
          {recording.error}
        </p>
      )}

      {/* ── 文件上传区（placeholder，第七步实现） ── */}
      <section className="flex flex-col items-center">
        <button
          disabled={!selectedAnimal}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Upload size={16} />
          {t("recording.uploadFile")}
        </button>
      </section>

      {/* ── 结果展示区（placeholder，第九步实现） ── */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground text-center">
          {t("result.noResult")}
        </h2>
        <div className="border border-dashed border-muted-foreground/30 rounded-2xl p-8 text-center text-sm text-muted-foreground">
          {t("result.analyzing")}
        </div>
      </section>
    </div>
  );
}
