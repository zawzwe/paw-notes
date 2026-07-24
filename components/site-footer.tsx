import { ThemeSwitcher } from "@/components/theme-switcher";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="w-full flex flex-col items-center gap-2 border-t pt-6 pb-8 mt-auto">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          {t("footer.privacy")}
        </Link>
        <Link href="/terms" className="hover:text-foreground transition-colors">
          {t("footer.terms")}
        </Link>
        <a href="mailto:support@paw-notes.app" className="hover:text-foreground transition-colors">
          {t("footer.contact")}
        </a>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
        <p>{t("footer.poweredBy")}</p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
