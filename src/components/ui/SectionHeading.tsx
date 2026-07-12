"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({ title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 lg:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
        {title.split(" ").map((word, i) => {
          const lower = word.toLowerCase();
          if (lower.includes("bmw") || lower.includes("club")) {
            return <span key={i} className="text-bmw-blue-light text-glow">{word} </span>;
          }
          if (lower.includes("uganda")) {
            return <span key={i} className="text-white">{word} </span>;
          }
          return <span key={i}>{word} </span>;
        })}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className={`mt-6 accent-line w-24 ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
