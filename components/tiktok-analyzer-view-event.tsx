"use client";

import { useEffect, useRef } from "react";
import { trackTikTokEvent } from "@/lib/tiktok-events";

export function TikTokAnalyzerViewEvent() {
  const sentRef = useRef(false);

  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;

    trackTikTokEvent("ViewContent", {
      content_ids: ["pawnotes_analyzer"],
      content_type: "product",
      description: "PawNotes Pet Sound Analyzer",
    });
  }, []);

  return null;
}
