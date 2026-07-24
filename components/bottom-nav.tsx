"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Mic, MessageCircle, TrendingUp, User } from "lucide-react";

const links = [
  { href: "/app", icon: Mic, key: "analyze" },
  { href: "/history", icon: MessageCircle, key: "history" },
  { href: "/trends", icon: TrendingUp, key: "trends" },
  { href: "/protected", icon: User, key: "profile" },
];

export function BottomNav() {
  const t = useTranslations();
  const pathname = usePathname();

  // Strip locale prefix for comparison
  const rawPath = pathname.replace(/^\/(en|zh)/, "") || "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around h-14 px-2">
        {links.map(({ href, icon: Icon, key }) => {
          const isActive = rawPath.startsWith(href);
          return (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{t(`nav.${key}`)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
