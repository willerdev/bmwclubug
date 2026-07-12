"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-0 w-[420px] h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(28,105,212,0.12) 0%, transparent 70%)",
          left: position.x - 210,
          top: position.y - 210,
        }}
        animate={{ left: position.x - 210, top: position.y - 210 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      <motion.div
        className="fixed pointer-events-none z-0 w-[280px] h-[280px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(235,1,41,0.06) 0%, transparent 70%)",
          left: position.x - 140,
          top: position.y - 140,
        }}
        animate={{ left: position.x - 140, top: position.y - 140 }}
        transition={{ type: "spring", damping: 35, stiffness: 180 }}
      />
    </>
  );
}
