"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      aria-label={locale === "en" ? "Switch to Chinese" : "切换到英文"}
    >
      <Globe size={14} />
      <span>{locale === "en" ? "中文" : "EN"}</span>
    </button>
  );
}
