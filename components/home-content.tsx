"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Mic, Upload } from "lucide-react";

type Animal = "cat" | "dog" | null;
type Step = "select" | "record" | "result";

export function HomeContent() {
  const t = useTranslations();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(null);
  const [step, setStep] = useState<Step>("select");

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col gap-8 px-4 py-8">
      {/* ── 动物选择区 ── */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">
          {t("animal.select")}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedAnimal("cat")}
            className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all min-h-[120px] ${
              selectedAnimal === "cat"
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            }`}
          >
            <span className="text-4xl">🐱</span>
            <span className="text-sm font-medium">{t("animal.cat")}</span>
          </button>
          <button
            onClick={() => setSelectedAnimal("dog")}
            className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all min-h-[120px] ${
              selectedAnimal === "dog"
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            }`}
          >
            <span className="text-4xl">🐶</span>
            <span className="text-sm font-medium">{t("animal.dog")}</span>
          </button>
        </div>
      </section>

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
