"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CountdownBoxes } from "@/components/ui/LiveCountdown";
import { useApiList } from "@/hooks/useApiData";
import type { Event } from "@/types";
import { cn, formatDate, isEventUrgent } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function EventsPreview() {
  const { data: events } = useApiList<Event>("/api/events");
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 4);

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          title="Upcoming Events"
          subtitle="Join us for unforgettable drives and meetups across Uganda"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {upcoming.map((event, i) => {
            const urgent = isEventUrgent(event.date, event.time);
            return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/events/${event.id}`}>
                <GlassCard className={cn("p-0 overflow-hidden group", urgent && "event-urgent")}>
                  <div className="grid sm:grid-cols-2">
                    <div className="relative h-48 sm:h-auto min-h-[200px] overflow-hidden">
                      <Image
                        src={event.poster}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 300px"
                        unoptimized={event.poster.startsWith("/api/media")}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold group-hover:text-bmw-blue transition-colors">
                        {event.title}
                      </h3>
                      <div className="mt-3 space-y-2 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-bmw-blue" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-bmw-blue" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-bmw-blue" />
                          {event.venue}, {event.district}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-bmw-blue" />
                          {event.registeredCount}/{event.maxCapacity} registered
                        </div>
                      </div>
                      <div className="mt-4">
                        <CountdownBoxes date={event.date} time={event.time} />
                      </div>
                      <Button href={`/events/${event.id}`} variant="primary" size="sm" className="mt-4 w-full">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button href="/events" variant="secondary">View All Events</Button>
        </div>
      </div>
    </section>
  );
}
