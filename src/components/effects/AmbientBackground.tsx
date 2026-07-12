"use client";

export function AmbientBackground() {
  return (
    <>
      <div className="page-ambient" aria-hidden="true" />
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-30 blur-[120px] animate-pulse-glow"
        style={{ background: "rgba(28, 105, 212, 0.4)" }}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-20 blur-[100px] animate-pulse-glow"
        style={{ background: "rgba(235, 1, 41, 0.35)", animationDelay: "1.5s" }}
        aria-hidden="true"
      />
    </>
  );
}
