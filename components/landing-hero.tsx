"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function LandingHero() {
  const t = useTranslations();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  const handleStart = () => {
    setClicked(true);
    setTimeout(() => router.push("/app"), 400);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        {/* Decorative paw prints */}
        <span className="absolute top-10 left-10 text-2xl opacity-10 animate-float select-none pointer-events-none">🐾</span>
        <span className="absolute top-20 right-8 text-xl opacity-10 animate-float select-none pointer-events-none" style={{ animationDelay: "1s" }}>🐾</span>
        <span className="absolute bottom-32 left-6 text-3xl opacity-10 animate-float select-none pointer-events-none" style={{ animationDelay: "2s" }}>🐾</span>
        <span className="absolute bottom-40 right-10 text-lg opacity-10 animate-float select-none pointer-events-none" style={{ animationDelay: "0.5s" }}>🐾</span>

        {/* Decorative gradient blob behind cat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-80 h-80 rounded-full bg-gradient-to-br from-amber-200/70 via-orange-100/50 to-amber-50/20 dark:from-amber-800/30 dark:via-orange-900/15 dark:to-amber-950/5 blur-3xl pointer-events-none" />

        {/* Tagline */}
        <div className="relative flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("landing.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("landing.subtitle")}
          </p>
        </div>

        {/* Clickable Cat */}
        <button
          onClick={handleStart}
          className={`
            relative z-10 transition-all duration-500 ease-out
            ${clicked ? "scale-150 opacity-0" : "animate-breathe hover:scale-110 active:scale-95"}
          `}
          aria-label={t("landing.cta")}
        >
          <div className="w-36 h-36 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center shadow-lg shadow-amber-200/50 dark:shadow-amber-900/20">
            <span className="text-6xl select-none">🐱</span>
          </div>
        </button>

        {/* CTA hint */}
        <p className="relative text-sm text-muted-foreground animate-pulse">
          {t("landing.cta")} &rarr;
        </p>

        {/* Trust line */}
        <p className="relative text-xs text-muted-foreground/60">
          {t("landing.tagline")}
        </p>
      </div>
    </div>
  );
}
