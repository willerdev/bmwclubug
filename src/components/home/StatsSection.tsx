"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { clubStats } from "@/data/mock";
import { motion } from "framer-motion";

const STATS = [
  { key: "members" as const, label: "Members" },
  { key: "registeredBMWs" as const, label: "Registered BMWs" },
  { key: "eventsHosted" as const, label: "Events Hosted" },
  { key: "partnerGarages" as const, label: "Partner Garages" },
  { key: "roadTripsCompleted" as const, label: "Road Trips Completed" },
  { key: "citiesRepresented" as const, label: "Cities Represented" },
];

export function StatsSection() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bmw-gradient opacity-5" />
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-8 lg:p-12 carbon-texture border border-white/15"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((stat) => (
              <AnimatedCounter
                key={stat.key}
                value={clubStats[stat.key]}
                label={stat.label}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
