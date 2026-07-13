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

  return (
    <section className="relative min-h-[100svh] h-[100svh] w-full max-w-full flex items-end sm:items-center justify-center overflow-hidden">
      <Image
        src={heroSrc}
        alt="BMW Club Uganda members"
        fill
        priority
        className="object-cover object-[center_35%] sm:object-center opacity-80 sm:opacity-70"
        sizes="100vw"
        unoptimized={heroSrc.startsWith("/api/media")}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-bmw-navy/55 via-bmw-dark-blue/35 to-background sm:from-bmw-navy/70 sm:via-bmw-dark-blue/50 sm:to-background/95" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-16 w-56 h-56 sm:w-96 sm:h-96 bg-bmw-blue/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 -right-16 w-56 h-56 sm:w-96 sm:h-96 bg-bmw-red/12 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4 sm:px-6 pb-24 pt-24 sm:pb-24 sm:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex max-w-full items-center gap-2 glass-panel px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-8">
            <div className="relative w-5 h-5 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0">
              <Image src={LOCAL_IMAGES.logo} alt="" fill className="object-cover" sizes="28px" />
            </div>
            <span className="text-[11px] sm:text-sm text-white/85 truncate">
              Official BMW Enthusiast Community
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="text-[1.75rem] leading-[1.15] sm:text-5xl md:text-7xl font-bold tracking-tight px-1"
        >
          Welcome to{" "}
          <span className="text-bmw-blue-light text-glow">BMW Club</span>{" "}
          <span className="text-white">Uganda</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bmw-m-stripe h-1 w-20 sm:w-32 mx-auto mt-4 sm:mt-6 rounded-full opacity-80"
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-3 sm:mt-6 text-sm sm:text-xl text-white/80 max-w-xl mx-auto"
        >
          Driven by Passion. United by Performance. Built for Uganda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-5 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-4"
        >
          <Button href="/join" size="md" className="w-full sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
            <Users size={18} />
            Become a Member
          </Button>
          <Button
            href="/events"
            variant="secondary"
            size="md"
            className="w-full sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
          >
            <Calendar size={18} />
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
          className="mt-4 sm:mt-10 flex items-center justify-center gap-2 text-white/55 text-[11px] sm:text-sm glass-frosted px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit mx-auto"
        >
          <MapPin size={12} className="text-bmw-red shrink-0" />
          Kampala &bull; {memberCount} Members
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
