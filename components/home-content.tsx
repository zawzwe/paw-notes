"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { AnimalSelector, type Animal } from "@/components/recording/animal-selector";
import { Recorder } from "@/components/recording/recorder";
import { AudioUploader } from "@/components/recording/audio-uploader";
import { useRecording } from "@/hooks/use-recording";

export function HomeContent() {
  const t = useTranslations();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const recording = useRecording({ maxDuration: 30 });

  const handleFileSelected = useCallback((file: File) => {
    setUploadedFile(file);
  }, []);

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

      {/* ── 文件上传区 ── */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-muted-foreground">
          {t("recording.uploadFile")}
        </p>
        <AudioUploader
          onFileSelected={handleFileSelected}
          disabled={!selectedAnimal}
        />
      </div>

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
