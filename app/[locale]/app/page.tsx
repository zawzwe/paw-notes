import { getTranslations } from "next-intl/server";
import { AuthButton } from "@/components/auth-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { HomeContent } from "@/components/home-content";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default async function AppPage() {
  const t = await getTranslations();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-amber-50 via-orange-50/50 to-background dark:from-amber-950/30 dark:via-orange-950/10 dark:to-background">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex items-center gap-5">
              <Link href={"/"} className="font-semibold">
                {t("home.title")}
              </Link>
              <Link
                href={"/history"}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.history")}
              </Link>
              <Link
                href={"/protected"}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.profile")}
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </nav>

        <HomeContent />

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 mt-auto">
          <p>{t("footer.poweredBy")}</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
