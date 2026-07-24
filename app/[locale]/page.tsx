import { getTranslations } from "next-intl/server";
import { AuthButton } from "@/components/auth-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { LandingHero } from "@/components/landing-hero";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { Suspense } from "react";

export default async function LandingPage() {
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
              <Link
                href={"/pricing"}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("nav.pricing")}
              </Link>
              <LocaleSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </nav>

        <LandingHero />

        <SiteFooter />
      </div>
    </main>
  );
}
