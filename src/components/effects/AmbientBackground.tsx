"use client";

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="page-ambient" />
      <div
        className="absolute top-0 left-1/4 w-[min(500px,80vw)] h-[min(500px,80vw)] rounded-full opacity-30 blur-[100px] animate-pulse-glow"
        style={{ background: "rgba(28, 105, 212, 0.4)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[min(400px,70vw)] h-[min(400px,70vw)] rounded-full opacity-20 blur-[90px] animate-pulse-glow"
        style={{ background: "rgba(235, 1, 41, 0.35)", animationDelay: "1.5s" }}
      />
    </div>
  );
}
