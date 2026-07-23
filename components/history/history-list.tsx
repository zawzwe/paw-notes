"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { User } from "@supabase/supabase-js";

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
}

const emotionMeta: Record<string, { emoji: string; zhLabel: string }> = {
  happy:    { emoji: "😊", zhLabel: "开心" },
  sad:      { emoji: "😢", zhLabel: "难过" },
  angry:    { emoji: "😤", zhLabel: "生气" },
  fear:     { emoji: "😨", zhLabel: "害怕" },
  excited:  { emoji: "🤩", zhLabel: "兴奋" },
  hungry:   { emoji: "🍽️", zhLabel: "饿了" },
  pain:     { emoji: "🤕", zhLabel: "疼痛" },
  playful:  { emoji: "🎾", zhLabel: "想玩" },
  anxious:  { emoji: "😰", zhLabel: "焦虑" },
};

function formatDate(dateStr: string, locale: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryList() {
  const t = useTranslations();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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
        analysis:analyses(emotion_label, emotion_confidence, translated_text, translated_text_zh)
      `)
      .order("created_at", { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

    return { data, error: fetchError };
  }, []);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    const result = await fetchHistory(nextPage);
    if (result?.error) {
      setError(result.error.message);
      return;
    }
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
      if (result?.error) {
        setError(result.error.message);
        return;
      }
      if (result?.data) {
        setItems(result.data as unknown as HistoryItem[]);
        setHasMore(result.data.length === PAGE_SIZE);
        setPage(0);
      }
    })();
  }, [fetchHistory]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const supabase = createClient();
    await supabase.from("recordings").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-xs underline text-muted-foreground"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  // Empty
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-muted-foreground">
          {t("history.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const analysisData = Array.isArray(item.analysis)
          ? item.analysis[0]
          : item.analysis ?? null;
        const analysis = analysisData ?? null;
        const el = analysis?.emotion_label;
        const meta = el && emotionMeta[el]
          ? emotionMeta[el]
          : el
          ? { emoji: "💬", zhLabel: el }
          : null;
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id}
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
            className="rounded-xl border border-muted-foreground/20 bg-card p-4 cursor-pointer hover:border-muted-foreground/40 transition-colors"
          >
            {/* Row: animal + emotion + date + delete */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {item.species === "cat" ? "🐱" : "🐶"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {meta ? (
                    <span className="text-sm font-medium">
                      {meta.emoji} {meta.zhLabel}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {item.status === "completed"
                        ? t("history.analyzed")
                        : t("history.processing")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(item.created_at, "zh")}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </div>

            {/* Expanded: detail text */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-muted-foreground/10">
                {analysis ? (
                  <>
                    <p className="text-sm italic leading-relaxed">
                      &ldquo;{analysis.translated_text_zh || analysis.translated_text}&rdquo;
                    </p>
                    {analysis.emotion_confidence != null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("result.confidence")}:{" "}
                        {Math.round(analysis.emotion_confidence * 100)}%
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {item.status === "failed"
                      ? t("common.error")
                      : item.status === "processing"
                      ? t("history.processing")
                      : t("history.noData")}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Load more */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
        >
          {t("history.loadMore")}
        </button>
      )}
    </div>
  );
}
