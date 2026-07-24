"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { playMeow, playBark, playBird, playSqueak, playPurr, stopAllSounds } from "@/lib/sounds";
import type { Animal } from "./animal-selector";

interface LureBarProps {
  animal: Animal;
}

interface SoundItem {
  key: string;
  icon: string;
  play: () => void;
}

const catSounds: SoundItem[] = [
  { key: "meow", icon: "🐱", play: playMeow },
  { key: "bird", icon: "🐦", play: playBird },
  { key: "purr", icon: "💤", play: playPurr },
];

const dogSounds: SoundItem[] = [
  { key: "bark", icon: "🐕", play: playBark },
  { key: "squeak", icon: "🦴", play: playSqueak },
  { key: "bird", icon: "🐦", play: playBird },
];

export function LureBar({ animal }: LureBarProps) {
  const t = useTranslations();
  const sounds = animal === "cat" ? catSounds : dogSounds;

  // Stop all sounds when switching animal
  useEffect(() => {
    return () => stopAllSounds();
  }, [animal]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted-foreground">
        {t("lure.title")}
      </p>
      <div className="flex items-center gap-2">
        {sounds.map(({ key, icon, play }) => (
          <button
            key={key}
            onClick={play}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-muted-foreground/20 hover:bg-muted/50 active:scale-95 transition-all"
            aria-label={t(`lure.${key}`)}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Volume2 className="w-2.5 h-2.5" />
              {t(`lure.${key}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
