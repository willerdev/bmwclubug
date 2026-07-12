"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "panel" | "frosted";
}

const variantStyles = {
  default: "glass",
  panel: "glass-panel",
  frosted: "glass-frosted",
};

export function GlassCard({
  children,
  className,
  hover = true,
  variant = "panel",
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variantStyles[variant],
        hover && "hover:glass-strong hover:border-white/25",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
