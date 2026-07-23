"use client";

import { useTranslations } from "next-intl";
import { Mic, Square, RotateCcw, Play, Pause } from "lucide-react";
import { useRef, useState } from "react";
import { type RecordingState } from "@/hooks/use-recording";

interface RecorderProps {
  state: RecordingState;
  duration: number;
  audioUrl: string | null;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  disabled?: boolean;
}

function formatTime(seconds: number): string {
  const s = Math.floor(seconds);
  const ms = Math.floor((seconds - s) * 10);
  return `${String(s).padStart(2, "0")}:${String(ms).padStart(1, "0")}`;
}

export function Recorder({
  state,
  duration,
  audioUrl,
  onStart,
  onStop,
  onReset,
  disabled,
}: RecorderProps) {
  const t = useTranslations();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="flex flex-col items-center gap-4">
      {/* Idle: 大圆录音按钮 */}
      {state === "idle" && (
        <>
          <button
            onClick={onStart}
            disabled={disabled}
            className="w-28 h-28 rounded-full bg-red-500 enabled:hover:bg-red-600 disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center shadow-lg enabled:hover:shadow-xl transition-all enabled:active:scale-95"
            aria-label={t("recording.tapToRecord")}
          >
            <Mic className="w-10 h-10 text-white" />
          </button>
          <p className="text-xs text-muted-foreground">
            {disabled ? t("animal.select") : t("recording.tapToRecord")}
          </p>
        </>
      )}

      {/* Recording: 录音中 */}
      {state === "recording" && (
        <>
          <button
            onClick={onStop}
            className="w-28 h-28 rounded-full bg-red-500 animate-pulse flex items-center justify-center shadow-lg transition-all"
            aria-label={t("recording.stopRecording")}
          >
            <Square className="w-10 h-10 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-mono tabular-nums text-red-500 font-medium">
              {formatTime(duration)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("recording.stopRecording")}
          </p>
        </>
      )}

      {/* Preview: 预览播放 */}
      {state === "preview" && audioUrl && (
        <>
          <div className="flex items-center gap-4">
            {/* Play/Pause button */}
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-primary-foreground" />
              ) : (
                <Play className="w-6 h-6 text-primary-foreground ml-1" />
              )}
            </button>

            {/* Re-record button */}
            <button
              onClick={onReset}
              className="w-12 h-12 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center hover:border-muted-foreground/60 transition-colors"
              aria-label={t("recording.reRecord")}
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("recording.preview")} · {formatTime(duration)}
          </p>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        </>
      )}

      {/* Duration hint (idle only) */}
      {state === "idle" && (
        <p className="text-xs text-muted-foreground">
          {t("recording.maxDuration")}
        </p>
      )}
    </section>
  );
}
