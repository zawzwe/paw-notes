"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type RecordingState = "idle" | "recording" | "preview";

interface UseRecordingOptions {
  maxDuration?: number; // seconds
}

export function useRecording({ maxDuration = 30 }: UseRecordingOptions = {}) {
  const [state, setState] = useState<RecordingState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopStream();
      revokeUrl();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const revokeUrl = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    revokeUrl();
    setAudioUrl(null);

    // Browser compatibility check
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Audio recording is not supported in this browser. Please use Chrome, Edge, or Firefox."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Pick a supported MIME type (try most common first)
      const candidates = [
        "audio/webm",
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];
      const mimeType = candidates.find((t) => MediaRecorder.isTypeSupported(t));

      if (!mimeType) {
        throw new Error(
          "Your browser does not support audio recording. Please try Chrome, Edge, or Firefox."
        );
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState("preview");
        stopStream();
        stopTimer();
      };

      recorder.onerror = () => {
        setError("Recording failed");
        setState("idle");
        stopStream();
        stopTimer();
      };

      recorder.start(250); // Collect data every 250ms
      startTimeRef.current = Date.now();
      setState("recording");
      setDuration(0);

      // Update timer
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setDuration(elapsed);

        if (elapsed >= maxDuration) {
          recorder.stop();
        }
      }, 100);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access was denied — please allow microphone in your browser settings"
          : err instanceof Error
          ? err.message
          : "Could not start recording";
      setError(message);
    }
  }, [maxDuration, revokeUrl, stopStream, stopTimer]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    stopTimer();
    stopStream();
    revokeUrl();
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    setState("idle");
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, [stopTimer, stopStream, revokeUrl]);

  return {
    state,
    audioBlob,
    audioUrl,
    duration,
    error,
    startRecording,
    stopRecording,
    reset,
  };
}
