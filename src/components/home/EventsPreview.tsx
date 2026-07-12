"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { events } from "@/data/mock";
import { formatDate, getCountdown } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState(getCountdown(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getCountdown(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { value: time.days, label: "Days" },
    { value: time.hours, label: "Hours" },
    { value: time.minutes, label: "Min" },
    { value: time.seconds, label: "Sec" },
  ];

  return (
    <div className="flex gap-2">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="w-12 h-12 glass rounded-lg flex items-center justify-center text-lg font-bold text-bmw-blue">
            {u.value}
          </div>
          <div className="text-[10px] text-white/40 mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  );
}

export function EventsPreview() {
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 4);

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          title="Upcoming Events"
          subtitle="Join us for unforgettable drives and meetups across Uganda"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {upcoming.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/events/${event.id}`}>
                <GlassCard className="p-0 overflow-hidden group">
                  <div className="grid sm:grid-cols-2">
                    <div className="relative h-48 sm:h-auto min-h-[200px] overflow-hidden">
                      <Image
                        src={event.poster}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 300px"
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
                        <CountdownTimer targetDate={event.date} />
                      </div>
                      <Button variant="primary" size="sm" className="mt-4 w-full">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </Link>
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
