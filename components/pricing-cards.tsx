"use client";

import { useTranslations } from "next-intl";
import { Check, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function PricingCards() {
  const t = useTranslations();
  const { isLoggedIn } = useAuth();

  const handleUpgrade = () => {
    if (!isLoggedIn) {
      window.location.href = "/auth/sign-up";
      return;
    }
    // TODO: 接入支付 (Zpay for CNY / Creem for USD)
    alert(
      t("pricing.comingSoon")
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Free Plan */}
      <div className="rounded-2xl border border-muted-foreground/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-muted-foreground/40">
        <h3 className="font-semibold text-lg mb-1">{t("pricing.free.name")}</h3>
        <p className="text-3xl font-bold mb-4">
          {t("pricing.free.price")}
          <span className="text-sm font-normal text-muted-foreground">
            /{t("pricing.free.period")}
          </span>
        </p>
        <ul className="flex flex-col gap-2 mb-6">
          {["free_1", "free_2", "free_3"].map((key) => (
            <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/60" />
              {t(`pricing.free.${key}`)}
            </li>
          ))}
        </ul>
        <div className="h-10" /> {/* spacer for alignment */}
      </div>

      {/* Monthly Plan */}
      <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/20 p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-200/50 dark:hover:shadow-amber-900/20">
        {/* Badge */}
        <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-bl-xl">
          <Zap className="w-3 h-3 inline mr-1" />
          {t("pricing.monthly.badge")}
        </div>

        <h3 className="font-semibold text-lg mb-1">{t("pricing.monthly.name")}</h3>
        <div className="mb-4">
          <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">
            {t("pricing.monthly.price")}
            <span className="text-sm font-normal text-muted-foreground">
              /{t("pricing.monthly.period")}
            </span>
          </p>
        </div>
        <ul className="flex flex-col gap-2 mb-6">
          {["monthly_1", "monthly_2", "monthly_3", "monthly_4"].map((key) => (
            <li key={key} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
              {t(`pricing.monthly.${key}`)}
            </li>
          ))}
        </ul>
        <button
          onClick={handleUpgrade}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors"
        >
          {isLoggedIn
            ? t("pricing.monthly.cta")
            : t("pricing.monthly.ctaSignUp")}
        </button>
      </div>
    </div>
  );
}
