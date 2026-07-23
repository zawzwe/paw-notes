"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Mic, Upload } from "lucide-react";
import { AnimalSelector, type Animal } from "@/components/recording/animal-selector";

export function HomeContent() {
  const t = useTranslations();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col gap-8 px-4 py-8">
      {/* ── 动物选择区 ── */}
      <AnimalSelector
        selected={selectedAnimal}
        onSelect={setSelectedAnimal}
      />

      {/* ── 录音操作区 ── */}
      <section className="flex flex-col items-center gap-4">
        {/* 大圆录音按钮 */}
        <button
          disabled={!selectedAnimal}
          className="w-28 h-28 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
          aria-label={t("recording.tapToRecord")}
        >
          <Mic className="w-10 h-10 text-white" />
        </button>
        <p className="text-xs text-muted-foreground">
          {t("recording.maxDuration")}
        </p>

        {/* 文件上传 */}
        <button
          disabled={!selectedAnimal}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Upload size={16} />
          {t("recording.uploadFile")}
        </button>
      </section>

      {/* ── 结果展示区 ── */}
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
