import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

async function getUserProfile() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, plan, daily_usage_count, daily_usage_date")
    .eq("user_id", authData.claims.sub)
    .single();

  const today = new Date().toISOString().split("T")[0];
  const usageCount =
    profile?.daily_usage_date === today ? (profile?.daily_usage_count ?? 0) : 0;

  return {
    userId: authData.claims.sub as string,
    email: authData.claims.email as string,
    nickname: (profile?.nickname as string) || "",
    plan: (profile?.plan as string) || "free",
    usageCount,
  };
}

export default async function ProfilePage() {
  const t = await getTranslations();
  const profile = await getUserProfile();

  async function saveNickname(formData: FormData) {
    "use server";

    const nickname = (formData.get("nickname") as string).trim().slice(0, 20);
    if (!nickname) return;

    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getClaims();
    if (!authData?.claims) return;

    const userId = authData.claims.sub;

    // Check if profile exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("profiles")
        .update({ nickname, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("profiles")
        .insert({ user_id: userId, nickname });
    }

    revalidatePath("/", "layout");
    redirect("/protected");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-md mx-auto">
      <div>
        <h2 className="font-bold text-2xl mb-2">
          {t("profile.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("profile.desc")}
        </p>
      </div>

      {/* Nickname form */}
      <form action={saveNickname} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="nickname" className="text-sm font-medium">
            {t("profile.nickname")}
          </label>
          <div className="flex gap-2">
            <input
              id="nickname"
              name="nickname"
              type="text"
              defaultValue={profile.nickname}
              maxLength={20}
              placeholder={t("profile.nicknamePlaceholder")}
              className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t("common.save")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("profile.nicknameHint")}
          </p>
        </div>
      </form>

      {/* Plan info */}
      <div className="flex flex-col gap-3 pt-4 border-t border-muted-foreground/10">
        <p className="text-xs text-muted-foreground">{t("profile.plan")}</p>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              profile.plan === "monthly"
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {profile.plan === "monthly" ? "⭐ Monthly" : t("pricing.free.name")}
          </span>
          {profile.plan === "free" && profile.usageCount != null && (
            <span className="text-xs text-muted-foreground">
              {t("profile.usedToday", { count: profile.usageCount })}
            </span>
          )}
        </div>
        {profile.plan === "free" && (
          <a
            href="/pricing"
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
          >
            {t("profile.upgrade")} →
          </a>
        )}
      </div>

      {/* Email display */}
      <div className="flex flex-col gap-1 pt-4 border-t border-muted-foreground/10">
        <p className="text-xs text-muted-foreground">{t("profile.email")}</p>
        <p className="text-sm">{profile.email}</p>
      </div>
    </div>
  );
}
