"use client";

import { useTranslations } from "next-intl";
import { Upload, FileAudio, X, CheckCircle2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const ALLOWED_TYPES = [
  "audio/wav",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
  "audio/webm",
  "audio/x-m4a",
];
const ALLOWED_EXTENSIONS = ".wav,.mp3,.m4a,.ogg,.webm";
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

interface AudioUploaderProps {
  onFileSelected: (file: File, duration: number) => void;
  disabled?: boolean;
}

export function AudioUploader({ onFileSelected, disabled }: AudioUploaderProps) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSet = useCallback(
    (f: File) => {
      setError(null);

      if (!ALLOWED_TYPES.includes(f.type) && f.type !== "") {
        setError(t("upload.invalidFormat"));
        return;
      }
      if (f.size > MAX_SIZE) {
        setError(t("upload.fileTooLarge"));
        return;
      }

      setFile(f);

      // Detect duration
      const url = URL.createObjectURL(f);
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener(
        "loadedmetadata",
        () => {
          onFileSelected(f, audio.duration);
          URL.revokeObjectURL(url);
        },
        { once: true }
      );
      // Fallback if metadata doesn't load
      setTimeout(() => {
        if (!audio.duration || isNaN(audio.duration)) {
          onFileSelected(f, 0);
          URL.revokeObjectURL(url);
        }
      }, 2000);
    },
    [onFileSelected, t]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSet(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files[0];
    if (f) validateAndSet(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleRemove = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="flex flex-col items-center gap-3">
      {/* Upload area */}
      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            w-full max-w-sm rounded-2xl border-2 border-dashed p-8 text-center
            transition-colors cursor-pointer
            ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/40"
            }
            ${disabled ? "opacity-40 cursor-not-allowed" : ""}
          `}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          aria-label={t("recording.uploadFile")}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("upload.dropOrClick")}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {t("upload.supportedFormats")}: MP3, WAV, M4A, OGG, WebM ·{" "}
            {t("upload.maxSize")}
          </p>
        </div>
      )}

      {/* Selected file */}
      {file && (
        <div className="w-full max-w-sm rounded-2xl border border-muted-foreground/20 p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatSize(file.size)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="shrink-0 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </section>
  );
}
