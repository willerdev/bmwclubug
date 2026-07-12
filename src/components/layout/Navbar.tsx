"use client";

import { ClubLogo } from "@/components/ui/ClubLogo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-strong py-3 shadow-lg shadow-bmw-dark-blue/20 border-b border-white/10"
            : "glass-frosted py-5 border-b border-white/5"
        )}
      >
        <div className="container-custom flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <ClubLogo size="sm" />

          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/70 hover:text-white transition-colors relative group rounded-lg hover:bg-white/5"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 accent-line transition-all group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-white/70 hover:text-white glass-frosted rounded-full border border-white/10 hover:border-white/20 transition-all"
            >
              Login
            </Link>
            <Link
              href="/join"
              className="px-5 py-2.5 text-sm glass-panel rounded-full font-medium glow-blue hover:bg-white/10 border border-bmw-blue/30 transition-all"
            >
              Join Club
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 text-white glass-frosted rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <div className="absolute inset-0 bg-bmw-navy/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 glass-strong p-6 pt-24 overflow-y-auto border-l border-white/15">
              <div className="bmw-m-stripe h-1 w-full rounded-full mb-6 opacity-70" />
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-white/80 hover:text-white glass-frosted rounded-xl mb-1 hover:border-white/20 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-white/10 mt-4 pt-4 flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-center text-white/70 glass-frosted rounded-xl">
                    Login
                  </Link>
                  <Link href="/join" onClick={() => setMobileOpen(false)} className="px-4 py-3 text-center glass-panel rounded-full font-medium border border-bmw-blue/30">
                    Join Club
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
