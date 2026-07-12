"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { events } from "@/data/mock";
import { formatDate, getCountdown } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Countdown({ date }: { date: string }) {
  const [time, setTime] = useState(getCountdown(date));
  useEffect(() => {
    const t = setInterval(() => setTime(getCountdown(date)), 1000);
    return () => clearInterval(t);
  }, [date]);
  return (
    <span className="text-bmw-blue font-mono text-sm">
      {time.days}d {time.hours}h {time.minutes}m
    </span>
  );
}

export default function EventsPage() {
  const [tab, setTab] = useState<"upcoming" | "past" | "calendar">("upcoming");
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  const displayEvents = tab === "upcoming" ? upcoming : tab === "past" ? past : events;

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Road trips, meetups, and unforgettable experiences across Uganda"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="flex gap-2 mb-8 justify-center">
            {(["upcoming", "past", "calendar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all capitalize ${
                  tab === t ? "glass-panel border-bmw-blue/40 glow-blue text-white" : "glass-frosted hover:glass-strong border-white/10"
                }`}
              >
                {t === "calendar" ? "All Events" : t}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 9) * 0.05 }}
              >
                <Link href={`/events/${event.id}`}>
                  <GlassCard className="p-0 overflow-hidden group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={event.poster} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                      {event.status === "upcoming" && (
                        <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs">
                          <Countdown date={event.date} />
                        </div>
                      )}
                      {event.status === "past" && (
                        <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs text-white/50">Past Event</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold group-hover:text-bmw-blue transition-colors">{event.title}</h3>
                      <div className="mt-3 space-y-1.5 text-sm text-white/50">
                        <div className="flex items-center gap-2"><Calendar size={14} className="text-bmw-blue" />{formatDate(event.date)}</div>
                        <div className="flex items-center gap-2"><Clock size={14} className="text-bmw-blue" />{event.time}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} className="text-bmw-blue" />{event.venue}, {event.district}</div>
                        <div className="flex items-center gap-2"><Users size={14} className="text-bmw-blue" />{event.registeredCount}/{event.maxCapacity}</div>
                      </div>
                      {event.status === "upcoming" && (
                        <Button variant="primary" size="sm" className="mt-4 w-full">Register</Button>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
