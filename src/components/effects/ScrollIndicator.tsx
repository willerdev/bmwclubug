"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-xs text-white/45 uppercase tracking-widest">Scroll</span>
      <div className="w-6 h-10 glass-panel rounded-full flex items-start justify-center p-1.5 border border-white/20">
        <div className="w-1.5 h-1.5 rounded-full bg-bmw-blue-light animate-scroll-indicator" />
      </div>
      <ChevronDown className="w-4 h-4 text-bmw-blue/50 animate-bounce" />
    </motion.div>
  );
}
