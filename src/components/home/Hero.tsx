"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ScrollIndicator } from "@/components/effects/ScrollIndicator";
import { LOCAL_IMAGES } from "@/lib/constants";
import { useApiObject } from "@/hooks/useApiData";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { data: settings } = useApiObject<{
    hero_image?: { url?: string };
  }>("/api/settings", {});
  const heroSrc = settings.hero_image?.url || LOCAL_IMAGES.hero;
  const [memberCount, setMemberCount] = useState(30);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) setMemberCount(list.length);
      })
      .catch(() => undefined);
  }, []);

  const unoptimized = heroSrc.startsWith("/api/media");

  return (
    <section className="relative min-h-[100svh] w-full max-w-full flex flex-col overflow-hidden bg-bmw-navy">
      {/* Mobile: clear photo band (not stretched full-bleed crop) */}
      <div className="relative sm:absolute sm:inset-0 w-full h-[42svh] min-h-[220px] max-h-[340px] sm:h-auto sm:min-h-0 sm:max-h-none shrink-0">
        <Image
          src={heroSrc}
          alt="BMW Club Uganda members"
          fill
          priority
          quality={92}
          className="object-cover object-center sm:object-[center_40%] opacity-100 sm:opacity-75"
          sizes="100vw"
          unoptimized={unoptimized}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bmw-navy/25 via-transparent to-bmw-navy/80 sm:hidden" />
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-bmw-navy/70 via-bmw-dark-blue/50 to-background/95" />
      </div>

      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-16 w-96 h-96 bg-bmw-blue/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 -right-16 w-96 h-96 bg-bmw-red/12 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto text-center px-4 sm:px-6 py-6 sm:py-0 sm:pb-24 sm:pt-0 -mt-8 sm:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex max-w-full items-center gap-2 glass-panel px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-3 sm:mb-8">
            <div className="relative w-4 h-4 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0">
              <Image src={LOCAL_IMAGES.logo} alt="" fill className="object-cover" sizes="28px" />
            </div>
            <span className="text-[10px] sm:text-sm text-white/85 truncate">
              Official BMW Enthusiast Community
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="text-[1.55rem] leading-[1.15] sm:text-5xl md:text-7xl font-bold tracking-tight px-1"
        >
          Welcome to{" "}
          <span className="text-bmw-blue-light text-glow">BMW Club</span>{" "}
          <span className="text-white">Uganda</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bmw-m-stripe h-0.5 sm:h-1 w-16 sm:w-32 mx-auto mt-3 sm:mt-6 rounded-full opacity-80"
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-2.5 sm:mt-6 text-xs sm:text-xl text-white/75 sm:text-white/80 max-w-xl mx-auto leading-relaxed"
        >
          Driven by Passion. United by Performance. Built for Uganda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-4 sm:mt-10 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4"
        >
          <Button
            href="/join"
            size="sm"
            className="px-3.5 py-2 text-xs gap-1.5 sm:px-8 sm:py-4 sm:text-lg sm:gap-2"
          >
            <Users size={15} />
            Become a Member
          </Button>
          <Button
            href="/events"
            variant="secondary"
            size="sm"
            className="px-3.5 py-2 text-xs gap-1.5 sm:px-8 sm:py-4 sm:text-lg sm:gap-2"
          >
            <Calendar size={15} />
            Upcoming Events
          </Button>
          <div className="hidden sm:contents">
            <Button href="/members" variant="outline" size="lg">
              <Users size={18} />
              Explore Members
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-4 sm:mt-10 mb-2 sm:mb-0 flex items-center justify-center gap-1.5 text-white/55 text-[10px] sm:text-sm glass-frosted px-2.5 sm:px-4 py-1 sm:py-2 rounded-full w-fit mx-auto"
        >
          <MapPin size={11} className="text-bmw-red shrink-0" />
          Kampala &bull; {memberCount} Members
        </motion.div>
      </div>

      <div className="hidden sm:block">
        <ScrollIndicator />
      </div>
      <div className="sm:hidden pb-5 flex justify-center">
        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight * 0.7, behavior: "smooth" })
          }
          className="flex flex-col items-center gap-0.5 text-white/50"
          aria-label="Scroll down"
        >
          <span className="text-[9px] uppercase tracking-[0.2em]">Scroll</span>
          <span className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center p-1.5">
            <span className="w-1 h-1 rounded-full bg-bmw-blue-light animate-bounce" />
          </span>
        </button>
      </div>
    </section>
  );
}
