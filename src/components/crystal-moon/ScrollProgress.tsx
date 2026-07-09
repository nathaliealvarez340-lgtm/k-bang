"use client";

import { useEffect } from "react";

export function ScrollProgress() {
  useEffect(() => {
    const updateProgress = () => {
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        documentHeight > 0 ? window.scrollY / documentHeight : 0;

      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(Math.min(Math.max(nextProgress, 0), 1)),
      );
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__line" />
      <span className="scroll-progress__moon" />
    </div>
  );
}
