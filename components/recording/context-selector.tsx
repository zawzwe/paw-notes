"use client";

import { useTranslations } from "next-intl";

export const contextLabels = [
  { key: "someone_arrived", emoji: "🚶" },
  { key: "food_nearby", emoji: "🍽️" },
  { key: "playing", emoji: "🎾" },
  { key: "left_alone", emoji: "🏠" },
  { key: "doorbell_noise", emoji: "🔔" },
  { key: "seeking_attention", emoji: "👋" },
  { key: "new_place", emoji: "🆕" },
  { key: "not_sure", emoji: "🤷" },
] as const;

export type ContextKey = (typeof contextLabels)[number]["key"];

interface ContextSelectorProps {
  selected: ContextKey | null;
  onSelect: (key: ContextKey) => void;
}

export function ContextSelector({ selected, onSelect }: ContextSelectorProps) {
  const t = useTranslations();

  return (
    <section className="flex flex-col gap-3">
      <div className="text-center">
        <p className="text-sm font-medium">{t("context.title")}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("context.hint")}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {contextLabels.map(({ key, emoji }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              selected === key
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-400/60"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="text-sm">{emoji}</span>
            {t(`context.${key}`)}
          </button>
        ))}
      </div>
    </section>
  );
}
