"use client";

import { useEffect, useState } from "react";

export function useScrollCompact(threshold = 110) {
  const [progress, setProgress] = useState(0);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setProgress(Math.min(1, y / threshold));
      setCompact(y > threshold * 0.82);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { progress, compact };
}
