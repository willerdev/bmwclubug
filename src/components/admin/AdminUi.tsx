"use client";

import { cn } from "@/lib/utils";

export const adminInput =
  "w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50";

export function AdminField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm text-white/70">{label}</label>
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-4 py-2.5 rounded-full text-sm font-medium transition-all disabled:opacity-50",
        variant === "primary" && "glass-panel border border-bmw-blue/40",
        variant === "secondary" && "glass-frosted border border-white/10",
        variant === "danger" && "bg-bmw-red/20 border border-bmw-red/40 text-white"
      )}
    >
      {children}
    </button>
  );
}
