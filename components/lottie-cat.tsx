"use client";

import { useEffect, useRef } from "react";

interface LottieCatProps {
  className?: string;
}

export function LottieCat({ className }: LottieCatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let cancelled = false;

    void import("@lottiefiles/lottie-player").then(() => {
      if (cancelled) return;

      const player = document.createElement("lottie-player");
      player.setAttribute("src", "/Slipper.json");
      player.setAttribute("loop", "");
      player.setAttribute("autoplay", "");
      player.style.width = "100%";
      player.style.height = "100%";

      container.replaceChildren(player);
    });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, []);

  return <div ref={ref} className={className} />;
}
