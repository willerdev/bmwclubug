"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.button
          type="button"
          onClick={scrollDown}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          aria-label="Scroll down"
        >
          <motion.span
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] sm:text-xs text-white/80 uppercase tracking-[0.3em] font-medium"
          >
            Scroll down
          </motion.span>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-12 sm:w-7 sm:h-11 glass-panel rounded-full flex items-start justify-center p-2 border border-white/25 shadow-[0_0_20px_rgba(28,105,212,0.25)]"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-bmw-blue-light"
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          >
            <ChevronDown className="w-5 h-5 text-bmw-blue-light" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
