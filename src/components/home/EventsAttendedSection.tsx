"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApiList } from "@/hooks/useApiData";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

type AttendedEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  district: string;
  poster: string;
  description: string;
};

export function EventsAttendedSection() {
  const { data: events } = useApiList<AttendedEvent>("/api/attended-events");

  if (events.length === 0) return null;

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          title="Events We've Attended"
          subtitle="Highlights from BMW Club Uganda meetups, drives, and gatherings"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard hover={false} className="p-0 overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.poster || "/images/event_1.jpeg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    unoptimized={event.poster?.startsWith("/api/media")}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <div className="mt-3 space-y-1.5 text-sm text-white/55">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-bmw-blue shrink-0" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-bmw-blue shrink-0" />
                      {event.venue}
                      {event.district ? `, ${event.district}` : ""}
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-sm text-white/50 mt-3 line-clamp-3">{event.description}</p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/events" variant="secondary">View All Events</Button>
        </div>
      </div>
    </section>
  );
}
