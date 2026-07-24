"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface MoodDay {
  date: string;
  emotion: string;
  emoji: string;
  count: number;
}

const emotionMeta: Record<string, { emoji: string; zhLabel: string; enLabel: string }> = {
  happy:    { emoji: "😊", zhLabel: "开心", enLabel: "Happy" },
  sad:      { emoji: "😢", zhLabel: "难过", enLabel: "Sad" },
  angry:    { emoji: "😤", zhLabel: "生气", enLabel: "Angry" },
  fear:     { emoji: "😨", zhLabel: "害怕", enLabel: "Scared" },
  excited:  { emoji: "🤩", zhLabel: "兴奋", enLabel: "Excited" },
  hungry:   { emoji: "🍽️", zhLabel: "饿了", enLabel: "Hungry" },
  pain:     { emoji: "🤕", zhLabel: "疼痛", enLabel: "In pain" },
  playful:  { emoji: "🎾", zhLabel: "想玩", enLabel: "Playful" },
  anxious:  { emoji: "😰", zhLabel: "焦虑", enLabel: "Anxious" },
};

export function MoodTrends() {
  const t = useTranslations();
  const [moodData, setMoodData] = useState<MoodDay[]>([]);
  const [stats, setStats] = useState<{ topEmotion: string; total: number; happyDays: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<7 | 30>(7);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [pets, setPets] = useState<{ id: string; name: string; avatar: string | null }[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: authData }) => {
      if (!authData.user) { setLoading(false); return; }
      // Fetch pets
      supabase.from("pets").select("id, name, avatar").eq("user_id", authData.user.id).then(({ data }) => {
        if (data && data.length > 0) {
          setPets(data);
          setSelectedPetId(data[0].id);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!selectedPetId) { setLoading(false); return; }
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - period);

    supabase
      .from("recordings")
      .select("created_at, analyses(emotion_label)")
      .eq("pet_id", selectedPetId)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;

        // Group by date
        const byDate: Record<string, string[]> = {};
        data.forEach((r: { created_at: string; analyses: { emotion_label: string }[] | null }) => {
          const date = r.created_at.split("T")[0];
          if (!byDate[date]) byDate[date] = [];
          const label = r.analyses?.[0]?.emotion_label;
          if (label) byDate[date].push(label);
        });

        // Build mood timeline
        const days: MoodDay[] = [];
        for (let i = period - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          const emotions = byDate[dateStr] || [];
          const top = emotions[0] || null;
          days.push({
            date: dateStr,
            emotion: top || "none",
            emoji: top ? (emotionMeta[top]?.emoji || "💬") : "·",
            count: emotions.length,
          });
        }

        setMoodData(days);

        // Stats
        const allEmotions = Object.values(byDate).flat();
        const total = allEmotions.length;
        if (total > 0) {
          const counts: Record<string, number> = {};
          allEmotions.forEach((e) => { counts[e] = (counts[e] || 0) + 1; });
          const topEmotion = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
          const happyDays = Object.keys(byDate).filter((d) =>
            byDate[d].some((e) => e === "happy" || e === "playful" || e === "excited")
          ).length;
          setStats({ topEmotion, total, happyDays });
        }
      });
  }, [selectedPetId, period]);

  if (loading) {
    return <div className="text-center py-12 text-sm text-muted-foreground">{t("common.loading")}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Pet selector */}
      {pets.length > 0 && (
        <div className="flex gap-2 justify-center">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedPetId === pet.id
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {pet.avatar} {pet.name}
            </button>
          ))}
        </div>
      )}

      {/* Period toggle */}
      <div className="flex gap-1 justify-center">
        {([7, 30] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              period === p ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            {p}天
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-2xl font-bold">{stats?.total || 0}</p>
          <p className="text-[10px] text-muted-foreground">{t("trends.total")}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-2xl">
            {stats?.topEmotion ? (emotionMeta[stats.topEmotion]?.emoji || "💬") : "—"}
          </p>
          <p className="text-[10px] text-muted-foreground">{t("trends.topEmotion")}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-2xl font-bold">{stats?.happyDays || 0}</p>
          <p className="text-[10px] text-muted-foreground">{t("trends.happyDays")}</p>
        </div>
      </div>

      {/* Mood calendar */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-center">{t("trends.moodTimeline")}</h3>
        <div className="flex justify-between items-end gap-1">
          {moodData.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-lg">{day.emoji}</span>
              <div
                className={`w-full rounded-full transition-all ${
                  day.emotion === "none"
                    ? "h-1 bg-muted-foreground/10"
                    : "h-6 bg-amber-200 dark:bg-amber-800/40"
                }`}
                style={{
                  opacity: day.count > 0 ? Math.min(1, 0.3 + day.count * 0.3) : 0.3,
                }}
              />
              <span className="text-[9px] text-muted-foreground/60">
                {new Date(day.date).getDate()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* No data */}
      {(!stats || stats.total === 0) && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t("trends.noData")}
        </p>
      )}
    </div>
  );
}
