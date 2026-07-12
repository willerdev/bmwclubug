"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { drivingRoutes } from "@/data/mock";
import { motion } from "framer-motion";
import { Clock, MapPin, Mountain, Route } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function RoutesPreview() {
  const featured = drivingRoutes.slice(0, 6);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          title="Driving Routes"
          subtitle="Discover Uganda's most scenic roads with fellow BMW enthusiasts"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/routes">
                <GlassCard className="p-0 overflow-hidden group">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={route.photos[0]}
                      alt={route.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-bold text-lg">{route.name}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Route size={14} className="text-bmw-blue" />
                        {route.distance}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-bmw-blue" />
                        {route.estimatedTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-bmw-blue" />
                        Quality: {route.roadQuality}/5
                      </div>
                      <div className="flex items-center gap-2">
                        <Mountain size={14} className="text-bmw-blue" />
                        Scenic: {route.scenicRating}/5
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {route.stops.slice(0, 2).map((stop) => (
                        <span key={stop} className="text-[10px] glass px-2 py-0.5 rounded-full text-white/50">{stop}</span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/routes" variant="secondary">Explore All Routes</Button>
        </div>
      </div>
    </section>
  );
}
