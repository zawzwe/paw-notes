import { getTranslations } from "next-intl/server";
import { AuthButton } from "@/components/auth-button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PricingCards } from "@/components/pricing-cards";
import Link from "next/link";
import { Suspense } from "react";

export default async function PricingPage() {
  const t = await getTranslations();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href={"/"} className="font-semibold">
              {t("home.title")}
            </Link>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </div>
        </nav>

        <div className="flex-1 w-full max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">{t("pricing.title")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("pricing.subtitle")}
            </p>
          </div>
          <PricingCards />
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 mt-auto">
          <p>{t("footer.poweredBy")}</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
