"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useCallback } from "react";
import { Sparkles, LogIn } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimalSelector, type Animal } from "@/components/recording/animal-selector";
import { Recorder } from "@/components/recording/recorder";
import { AudioUploader } from "@/components/recording/audio-uploader";
import { AnalysisResult, type AnalysisData } from "@/components/result/analysis-result";
import { useRecording } from "@/hooks/use-recording";
import { useAuth } from "@/hooks/use-auth";

type AnalyzeState = {
  loading: boolean;
  error: string | null;
  data: AnalysisData | null;
};

export function HomeContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedDuration, setUploadedDuration] = useState(0);
  const recording = useRecording({ maxDuration: 30 });
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [wasSaved, setWasSaved] = useState(false);
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>({
    loading: false,
    error: null,
    data: null,
  });

  // Get the current audio blob (recording or upload)
  const audioBlob =
    recording.state === "preview" ? recording.audioBlob : null;
  const hasAudio = audioBlob || uploadedFile;

  const handleFileSelected = useCallback((file: File, duration: number) => {
    setUploadedFile(file);
    setUploadedDuration(duration);
    setAnalyzeState({ loading: false, error: null, data: null });
  }, []);

  const handleAnalyze = useCallback(async () => {
    const fileToAnalyze = audioBlob || uploadedFile;
    if (!fileToAnalyze || !selectedAnimal) return;

    setAnalyzeState({ loading: true, error: null, data: null });

    try {
      const formData = new FormData();
      formData.append(
        "file",
        fileToAnalyze,
        audioBlob ? "recording.webm" : uploadedFile!.name
      );
      formData.append("species", selectedAnimal);
      formData.append(
        "source",
        audioBlob ? "realtime" : "upload"
      );
      formData.append("locale", locale);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setWasSaved(result.recorded ?? false);

      setAnalyzeState({
        loading: false,
        error: null,
        data: {
          emotion: result.emotion,
          confidence: result.confidence,
          text: result.text,
          text_zh: result.text_zh,
          tts_url: result.tts_url,
        },
      });
    } catch (err) {
      setAnalyzeState({
        loading: false,
        error:
          err instanceof Error ? err.message : "Analysis failed",
        data: null,
      });
    }
  }, [audioBlob, uploadedFile, selectedAnimal, locale]);

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col gap-8 px-4 py-8">
      {/* ── 动物选择区 ── */}
      <AnimalSelector
        selected={selectedAnimal}
        onSelect={setSelectedAnimal}
      />

      {/* ── 录音操作区 ── */}
      <Recorder
        state={recording.state}
        duration={recording.duration}
        audioUrl={recording.audioUrl}
        onStart={recording.startRecording}
        onStop={recording.stopRecording}
        onReset={() => {
          recording.reset();
          setAnalyzeState({ loading: false, error: null, data: null });
        }}
        disabled={!selectedAnimal}
      />
      {recording.error && (
        <p className="text-xs text-red-500 text-center -mt-4">
          {recording.error}
        </p>
      )}

      {/* ── 文件上传区 ── */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-muted-foreground">
          {t("recording.uploadFile")}
        </p>
        <AudioUploader
          onFileSelected={handleFileSelected}
          disabled={!selectedAnimal}
        />
      </div>

      {/* ── 分析按钮 ── */}
      {hasAudio && !analyzeState.loading && !analyzeState.data && (
        <button
          onClick={handleAnalyze}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md transition-all active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          {t("recording.analyze")}
        </button>
      )}

      {/* ── 结果展示区 ── */}
      <AnalysisResult
        data={analyzeState.data}
        loading={analyzeState.loading}
        error={analyzeState.error}
        locale={locale}
        wasSaved={wasSaved}
      />

      {/* ── 未登录提示 ── */}
      {!isLoggedIn && !authLoading && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
            {locale === "zh"
              ? "登录后可以保存分析记录，随时回顾哦～"
              : "Sign in to save your recordings and revisit them anytime!"}
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
          >
            <LogIn className="w-4 h-4" />
            {locale === "zh" ? "去登录" : "Sign in"}
          </Link>
        </div>
      )}
    </div>
  );
}
