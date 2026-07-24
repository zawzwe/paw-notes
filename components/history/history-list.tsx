"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

interface AnalysisRow {
  emotion_label: string | null;
  emotion_confidence: number | null;
  translated_text: string | null;
  translated_text_zh: string | null;
}

interface HistoryItem {
  id: string;
  species: "cat" | "dog";
  source: "realtime" | "upload";
  status: string;
  created_at: string;
  analysis: AnalysisRow[] | AnalysisRow | null;
  pets: { name: string; avatar: string | null } | null;
}

function formatTime(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  const fmt = locale === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleTimeString(fmt, { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return locale === "zh" ? "今天" : "Today";
  if (days === 1) return locale === "zh" ? "昨天" : "Yesterday";
  const fmt = locale === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleDateString(fmt, { month: "long", day: "numeric" });
}

function petName(species: "cat" | "dog", locale: string) {
  if (locale === "zh") return species === "cat" ? "小咪" : "旺财";
  return species === "cat" ? "Kitty" : "Buddy";
}

function petAvatar(species: "cat" | "dog") {
  return species === "cat" ? "🐱" : "🐶";
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

export function HistoryList() {
  const t = useTranslations();
  const locale = useLocale();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;

  const fetchHistory = useCallback(async (pageNum: number) => {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;
    const { data, error: fetchError } = await supabase
      .from("recordings")
      .select(`
        id, species, source, status, created_at,
        analysis:analyses(emotion_label, emotion_confidence, translated_text, translated_text_zh),
        pets(name, avatar)
      `)
      .order("created_at", { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);
    return { data, error: fetchError };
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const result = await fetchHistory(nextPage);
    if (result?.error) { setError(result.error.message); return; }
    if (result?.data) {
      setItems((prev) => [...prev, ...(result.data as unknown as HistoryItem[])]);
      setHasMore(result.data.length === PAGE_SIZE);
      setPage(nextPage);
    }
  }, [page, fetchHistory]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchHistory(0);
      setLoading(false);
      if (result?.error) { setError(result.error.message); return; }
      if (result?.data) {
        setItems(result.data as unknown as HistoryItem[]);
        setHasMore(result.data.length === PAGE_SIZE);
        setPage(0);
      }
    })();
  }, [fetchHistory]);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("recordings").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl">💬</span>
        <p className="text-sm text-muted-foreground mt-3">{t("history.empty")}</p>
      </div>
    );
  }

  // Group by date
  const grouped: Record<string, HistoryItem[]> = {};
  items.forEach((item) => {
    const label = formatDateLabel(item.created_at, locale);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(item);
  });

  return (
    <div className="flex flex-col gap-6 pb-8">
      {Object.entries(grouped).map(([dateLabel, dayItems]) => (
        <div key={dateLabel} className="flex flex-col gap-3">
          {/* Date divider */}
          <div className="flex justify-center">
            <span className="text-[11px] text-muted-foreground/60 bg-muted/40 rounded-full px-3 py-0.5">
              {dateLabel}
            </span>
          </div>

          {dayItems.map((item) => {
            const analysisData = Array.isArray(item.analysis)
              ? item.analysis[0]
              : item.analysis ?? null;
            const analysis = analysisData ?? null;
            const meta = analysis?.emotion_label
              ? (emotionMeta[analysis.emotion_label] ?? { emoji: "💬", zhLabel: analysis.emotion_label })
              : null;

            return (
              <div key={item.id} className="flex items-start gap-2.5 group">
                {/* Avatar */}
                <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 flex items-center justify-center text-lg mt-1">
                  {item.pets?.avatar || petAvatar(item.species)}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  {/* Name + time */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      {item.pets?.name || petName(item.species, locale)}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">
                      {formatTime(item.created_at, locale)}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground/30 hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bubble */}
                  <div className="relative bg-muted/70 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[90%]">
                    {/* Bubble tail */}
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-muted/70" style={{
                      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                    }} />

                    {analysis ? (
                      <p className="text-sm leading-relaxed">
                        {locale === "zh"
                          ? (analysis.translated_text_zh || analysis.translated_text || "...")
                          : (analysis.translated_text || analysis.translated_text_zh || "...")}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {item.status === "failed" ? t("common.error") : t("history.noData")}
                      </p>
                    )}
                  </div>

                  {/* Meta row */}
                  {meta && (
                    <div className="flex items-center gap-1 mt-1 ml-1">
                      <span className="text-[10px] text-muted-foreground/50">
                        {meta.emoji}{" "}
                        {locale === "zh" ? meta.zhLabel : meta.enLabel}
                        {analysis?.emotion_confidence != null
                          ? ` · ${Math.round(analysis.emotion_confidence * 100)}%`
                          : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {hasMore && (
        <button onClick={loadMore} className="text-xs text-muted-foreground hover:text-foreground py-2 transition-colors">
          {t("history.loadMore")}
        </button>
      )}
    </div>
  );
}
