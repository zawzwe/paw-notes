import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";

export default async function PrivacyPage() {
  const t = await getTranslations();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-amber-50 via-orange-50/50 to-background dark:from-amber-950/30 dark:via-orange-950/10 dark:to-background">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href={"/"} className="font-semibold">
              {t("home.title")}
            </Link>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <Suspense><AuthButton /></Suspense>
            </div>
          </div>
        </nav>

        <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 prose prose-sm dark:prose-invert">
          <h1>{t("privacy.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("privacy.lastUpdated")}</p>

          <h2>1. {t("privacy.s1Title")}</h2>
          <p>{t("privacy.s1")}</p>

          <h2>2. {t("privacy.s2Title")}</h2>
          <p>{t("privacy.s2")}</p>

          <h2>3. {t("privacy.s3Title")}</h2>
          <p>{t("privacy.s3")}</p>

          <h2>4. {t("privacy.s4Title")}</h2>
          <p>{t("privacy.s4")}</p>

          <h2>5. {t("privacy.s5Title")}</h2>
          <p>{t("privacy.s5")}</p>

          <h2>6. {t("privacy.s6Title")}</h2>
          <p>{t("privacy.s6")}</p>

          <h2>7. {t("privacy.s7Title")}</h2>
          <p>{t("privacy.s7")}</p>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 mt-auto">
          <p>{t("footer.poweredBy")}</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
