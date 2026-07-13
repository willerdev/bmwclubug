"use client";

import { ClubLogo } from "@/components/ui/ClubLogo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Camera,
  Car,
  Home,
  Info,
  LogIn,
  Map,
  Menu,
  MessageSquare,
  Phone,
  ShoppingBag,
  Store,
  Users,
  Wrench,
  X,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MOBILE_MENU = [
  {
    title: "Discover",
    links: [
      { href: "/", label: "Home", icon: Home },
      { href: "/about", label: "About", icon: Info },
      { href: "/members", label: "Members", icon: Users },
      { href: "/events", label: "Events", icon: Calendar },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/garages", label: "Garages", icon: Wrench },
      { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
      { href: "/routes", label: "Routes", icon: Map },
      { href: "/gallery", label: "Gallery", icon: Camera },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/forum", label: "Forum", icon: MessageSquare },
      { href: "/partners", label: "Partners", icon: Store },
      { href: "/shop", label: "Club Shop", icon: Car },
      { href: "/contact", label: "Contact", icon: Phone },
    ],
  },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || mobileOpen
            ? "glass-strong py-3 shadow-lg shadow-bmw-dark-blue/25 border-b border-white/10"
            : "bg-gradient-to-b from-bmw-navy/80 to-transparent py-4 border-b border-transparent"
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
            onClick={() => setMobileOpen((open) => !open)}
            className="xl:hidden inline-flex items-center gap-2 px-3 py-2 text-white glass-panel rounded-full border border-white/15"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            <span className="text-xs font-medium tracking-wide">{mobileOpen ? "Close" : "Menu"}</span>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <button
              className="absolute inset-0 bg-bmw-navy/70 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu overlay"
            />

            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="absolute top-[4.5rem] left-3 right-3 bottom-3 glass-strong rounded-3xl border border-white/15 overflow-hidden flex flex-col"
            >
              <div className="bmw-m-stripe h-1 w-full opacity-80" />
              <div className="px-5 pt-5 pb-3">
                <p className="text-xs uppercase tracking-[0.25em] text-bmw-blue-light">BMW Club Uganda</p>
                <h2 className="text-xl font-bold mt-1">Menu</h2>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5">
                {MOBILE_MENU.map((group, groupIndex) => (
                  <div key={group.title}>
                    <p className="text-[11px] uppercase tracking-widest text-white/40 px-2 mb-2">
                      {group.title}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.links.map((link, i) => {
                        const Icon = link.icon;
                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: groupIndex * 0.08 + i * 0.04 }}
                          >
                            <Link
                              href={link.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 glass-frosted rounded-2xl px-3 py-3 border border-white/10 active:scale-[0.98] transition-transform"
                            >
                              <span className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-bmw-blue-light shrink-0">
                                <Icon size={16} />
                              </span>
                              <span className="text-sm font-medium text-white/90">{link.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm glass-frosted rounded-full border border-white/10"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  href="/join"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm glass-panel rounded-full font-medium border border-bmw-blue/30 glow-blue"
                >
                  <UserPlus size={16} />
                  Join
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
