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
    <section className="relative min-h-[100svh] h-[100svh] flex items-end sm:items-center justify-center overflow-hidden">
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
        <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-bmw-blue/20 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-bmw-red/12 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full text-center px-4 pb-28 pt-28 sm:pb-24 sm:pt-0 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-5 sm:mb-8">
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden">
              <Image src={LOCAL_IMAGES.logo} alt="" fill className="object-cover" sizes="28px" />
            </div>
            <span className="text-xs sm:text-sm text-white/85">Official BMW Enthusiast Community</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          className="text-[2rem] leading-tight sm:text-5xl md:text-7xl font-bold tracking-tight"
        >
          Welcome to{" "}
          <span className="text-bmw-blue-light text-glow">BMW Club</span>{" "}
          <span className="text-white">Uganda</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bmw-m-stripe h-1 w-24 sm:w-32 mx-auto mt-5 sm:mt-6 rounded-full opacity-80"
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-4 sm:mt-6 text-base sm:text-xl text-white/80 max-w-xl mx-auto"
        >
          Driven by Passion. United by Performance. Built for Uganda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-7 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4"
        >
          <Button href="/join" size="lg" className="w-full sm:w-auto">
            <Users size={18} />
            Become a Member
          </Button>
          <Button href="/events" variant="secondary" size="lg" className="w-full sm:w-auto">
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
          className="mt-6 sm:mt-10 flex items-center justify-center gap-2 text-white/55 text-xs sm:text-sm glass-frosted px-4 py-2 rounded-full w-fit mx-auto"
        >
          <MapPin size={13} className="text-bmw-red" />
          Kampala &bull; {memberCount} Members
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
