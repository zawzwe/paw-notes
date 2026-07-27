import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function PaymentSuccessPage() {
  const t = await getTranslations();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/30 dark:to-background">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{t("payment.successTitle")}</h1>
          <p className="text-muted-foreground text-sm">{t("payment.successDesc")}</p>
        </div>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm shadow-md transition-all"
        >
          {t("payment.goAnalyze")}
        </Link>
      </div>
    </main>
  );
}
