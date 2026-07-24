"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export type Animal = "cat" | "dog";

interface AnimalSelectorProps {
  selected: Animal | null;
  onSelect: (animal: Animal) => void;
}

const animals = [
  {
    id: "cat" as Animal,
    src: "/pets/cat-icon-v3.png",
    gradient: "from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-950/10",
    shadow: "shadow-lg shadow-orange-100/40 dark:shadow-orange-900/10",
  },
  {
    id: "dog" as Animal,
    src: "/pets/dog-icon-v3.png",
    gradient: "from-sky-50 to-blue-100 dark:from-sky-950/20 dark:to-blue-950/10",
    shadow: "shadow-lg shadow-sky-100/40 dark:shadow-sky-900/10",
  },
];

export function AnimalSelector({ selected, onSelect }: AnimalSelectorProps) {
  const t = useTranslations();

  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        {t("animal.select")}
      </h2>
      <div className="flex items-center gap-10">
        {animals.map(({ id, src, gradient, shadow }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`
                flex flex-col items-center gap-3 transition-all duration-300 ease-out
                ${isSelected ? "scale-105" : "hover:scale-105 active:scale-95"}
              `}
            >
              <div
                className={`
                  w-28 h-28 rounded-full bg-gradient-to-b ${gradient} ${shadow}
                  flex items-center justify-center overflow-hidden
                  transition-all duration-300
                  ${isSelected ? "ring-2 ring-amber-400/60" : ""}
                `}
              >
                <Image
                  src={src}
                  alt={id === "cat" ? "Cat" : "Dog"}
                  width={112}
                  height={112}
                  className={`object-contain p-3 transition-transform duration-300 ${
                    isSelected ? "scale-110" : ""
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  isSelected ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t(`animal.${id}`)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
