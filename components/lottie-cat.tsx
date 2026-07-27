"use client";

import { useEffect, useRef } from "react";

interface LottieAnimationProps {
  src: string;
  className?: string;
}

export function LottieAnimation({ src, className }: LottieAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let cancelled = false;

    void import("@lottiefiles/lottie-player").then(() => {
      if (cancelled) return;

      const player = document.createElement("lottie-player");
      player.setAttribute("src", src);
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
  }, [src]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

interface LottieCatProps {
  className?: string;
}

export function LottieCat({ className }: LottieCatProps) {
  return <LottieAnimation src="/Slipper.json" className={className} />;
}
