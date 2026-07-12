"use client";

import { Button } from "@/components/ui/Button";
import { ScrollIndicator } from "@/components/effects/ScrollIndicator";
import { LOCAL_IMAGES } from "@/lib/constants";
import { REAL_MEMBER_COUNT } from "@/data/mock/realMembers";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Wrench } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Image
        src={LOCAL_IMAGES.hero}
        alt="BMW Club Uganda members"
        fill
        priority
        className="object-cover opacity-70"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-bmw-navy/70 via-bmw-dark-blue/50 to-background/95" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-bmw-blue/25 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-bmw-red/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full mb-8">
            <div className="relative w-7 h-7 rounded-full overflow-hidden">
              <Image src={LOCAL_IMAGES.logo} alt="" fill className="object-cover" sizes="28px" />
            </div>
            <span className="text-sm text-white/80">Official BMW Enthusiast Community</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight"
        >
          Welcome to{" "}
          <span className="text-bmw-blue-light text-glow">BMW Club</span>{" "}
          <span className="text-white">Uganda</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="bmw-m-stripe h-1 w-32 mx-auto mt-6 rounded-full opacity-80"
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-lg sm:text-xl text-white/75 max-w-2xl mx-auto"
        >
          Driven by Passion. United by Performance. Built for Uganda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button href="/join" size="lg">
            <Users size={20} />
            Become a Member
          </Button>
          <Button href="/events" variant="secondary" size="lg">
            <Calendar size={20} />
            Upcoming Events
          </Button>
          <Button href="/members" variant="outline" size="lg">
            <Users size={20} />
            Explore Members
          </Button>
          <Button href="/garages" variant="ghost" size="lg">
            <Wrench size={20} />
            Partner Garages
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex items-center justify-center gap-2 text-white/50 text-sm glass-frosted px-4 py-2 rounded-full w-fit mx-auto"
        >
          <MapPin size={14} className="text-bmw-red" />
          Kampala, Uganda &bull; {REAL_MEMBER_COUNT} Members &bull; 14 Cities
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
