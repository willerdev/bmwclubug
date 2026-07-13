"use client";

import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { clubStats } from "@/data/mock";
import { motion } from "framer-motion";

/** Official club figures (kept in sync with live Neon counts where available). */
const REAL_STATS = {
  members: 45,
  registeredBMWs: 30,
  eventsHosted: 12,
  partnerGarages: 12,
  roadTripsCompleted: 25,
  citiesRepresented: 14,
} as const;

const STATS = [
  { key: "members" as const, label: "Members" },
  { key: "registeredBMWs" as const, label: "Registered BMWs" },
  { key: "eventsHosted" as const, label: "Events Hosted" },
  { key: "partnerGarages" as const, label: "Partner Garages" },
  { key: "roadTripsCompleted" as const, label: "Road Trips Completed" },
  { key: "citiesRepresented" as const, label: "Cities Represented" },
];

export function StatsSection() {
  const [stats, setStats] = useState({ ...clubStats, ...REAL_STATS });

  useEffect(() => {
    Promise.all([
      fetch("/api/members").then((r) => r.json()).catch(() => null),
      fetch("/api/events").then((r) => r.json()).catch(() => null),
      fetch("/api/garages").then((r) => r.json()).catch(() => null),
    ]).then(([members, events, garages]) => {
      setStats({
        members: Array.isArray(members) && members.length ? members.length : REAL_STATS.members,
        registeredBMWs: REAL_STATS.registeredBMWs,
        eventsHosted: Array.isArray(events) && events.length ? events.length : REAL_STATS.eventsHosted,
        partnerGarages: Array.isArray(garages) && garages.length ? garages.length : REAL_STATS.partnerGarages,
        roadTripsCompleted: REAL_STATS.roadTripsCompleted,
        citiesRepresented: REAL_STATS.citiesRepresented,
      });
    });
  }, []);

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
                value={stats[stat.key]}
                label={stat.label}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
