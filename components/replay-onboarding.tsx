"use client";

import { ArrowRight } from "lucide-react";

export function ReplayOnboarding({ label }: { label: string }) {
  const handleReplay = () => {
    localStorage.removeItem("paw-notes-onboarding-done");
    window.location.href = "/app";
  };

  return (
    <button
      onClick={handleReplay}
      className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
    >
      <ArrowRight className="w-3 h-3" />
      {label}
    </button>
  );
}
