"use client";

import { useTranslations } from "next-intl";

export type Animal = "cat" | "dog";

interface AnimalSelectorProps {
  selected: Animal | null;
  onSelect: (animal: Animal) => void;
}

const animals: { id: Animal; emoji: string }[] = [
  { id: "cat", emoji: "🐱" },
  { id: "dog", emoji: "🐶" },
];

export function AnimalSelector({ selected, onSelect }: AnimalSelectorProps) {
  const t = useTranslations();

  return (
    <section>
      <h2 className="text-sm font-medium text-muted-foreground mb-3 text-center">
        {t("animal.select")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {animals.map(({ id, emoji }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 transition-all duration-200 min-h-[120px] ${
                isSelected
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30 shadow-sm"
                  : `border-muted-foreground/20 hover:border-muted-foreground/40 hover:shadow-sm ${
                      id === "cat"
                        ? "bg-orange-50/60 dark:bg-orange-950/10"
                        : "bg-sky-50/60 dark:bg-sky-950/10"
                    }`
              }`}
            >
              <span className="text-5xl">{emoji}</span>
              <span className="text-sm font-medium">
                {t(`animal.${id}`)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
