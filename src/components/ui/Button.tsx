"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "red";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variants = {
  primary:
    "glass-panel text-white border-bmw-blue/30 hover:border-bmw-blue/50 glow-blue hover:bg-white/10",
  secondary:
    "glass-frosted text-white hover:glass-strong border-white/15 hover:border-white/25",
  ghost:
    "text-white/75 hover:text-white glass-frosted border-transparent hover:border-white/15",
  outline:
    "glass border-bmw-blue/40 text-bmw-blue-light hover:border-bmw-blue hover:bg-bmw-blue/10",
  red:
    "glass-panel text-white border-bmw-red/40 hover:border-bmw-red/60 glow-red bg-bmw-red/10 hover:bg-bmw-red/20",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 backdrop-blur-xl",
    variants[variant],
    sizes[size],
    disabled && "opacity-50 pointer-events-none",
    className
  );

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={cn("inline-flex max-w-full", className?.includes("w-full") && "w-full")}
      >
        <Link href={href} className={cn(classes, className?.includes("w-full") && "w-full")}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
