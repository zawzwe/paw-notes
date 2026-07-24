"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, X } from "lucide-react";

interface OnboardingProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

const TOTAL_STEPS = 3;

export function Onboarding({ step, onNext, onSkip, onFinish }: OnboardingProps) {
  const t = useTranslations();

  const isLast = step === TOTAL_STEPS - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center pb-20">
      <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center gap-6 text-center animate-in slide-in-from-bottom-6 duration-300">
        {/* Skip */}
        <button
          onClick={onSkip}
          className="self-end text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          {t("onboarding.skip")} <X className="w-3 h-3" />
        </button>

        {/* Illustration */}
        <div className="text-6xl">
          {step === 0 ? "🐱" : step === 1 ? "🎤" : "📊"}
        </div>

        {/* Title + desc */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{t(`onboarding.s${step}Title`)}</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            {t(`onboarding.s${step}Desc`)}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-amber-500" : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm shadow-md transition-all active:scale-[0.98]"
        >
          {isLast ? t("onboarding.start") : t("onboarding.next")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
