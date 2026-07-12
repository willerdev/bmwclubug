"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { InteractiveMap } from "@/components/ui/InteractiveMap";
import { drivingRoutes, events, garages, members } from "@/data/mock";
import { motion } from "framer-motion";
import { Clock, MapPin, Mountain, Route } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState(drivingRoutes[0]);

  const mapPins = [
    ...members.slice(0, 20).map((m) => ({
      lat: 0.3 + Math.random() * 2,
      lng: 32.5 + Math.random() * 1.5,
      label: m.name,
      description: m.district,
    })),
    ...events.slice(0, 5).map((e) => ({
      lat: e.location.lat,
      lng: e.location.lng,
      label: e.title,
      description: e.district,
    })),
    ...garages.slice(0, 10).map((g) => ({
      lat: g.lat,
      lng: g.lng,
      label: g.name,
      description: g.district,
    })),
  ];

  return (
    <>
      <PageHeader
        title="Driving Routes"
        subtitle="Explore Uganda's most scenic roads recommended by our community"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <GlassCard className="mb-8 p-2">
            <InteractiveMap pins={mapPins} height="400px" />
          </GlassCard>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
              {drivingRoutes.map((route, i) => (
                <motion.button
                  key={route.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i % 10) * 0.03 }}
                  onClick={() => setSelectedRoute(route)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedRoute.id === route.id ? "glass-strong ring-2 ring-bmw-blue/50" : "glass hover:bg-white/5"
                  }`}
                >
                  <h3 className="font-bold text-sm">{route.name}</h3>
                  <div className="flex gap-3 mt-2 text-xs text-white/50">
                    <span>{route.distance}</span>
                    <span>{route.estimatedTime}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="lg:col-span-2">
              <GlassCard>
                <div className="relative h-56 rounded-xl overflow-hidden mb-6">
                  <Image src={selectedRoute.photos[0]} alt={selectedRoute.name} fill className="object-cover" sizes="600px" />
                </div>
                <h2 className="text-2xl font-bold">{selectedRoute.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="glass p-3 rounded-xl text-center">
                    <Route size={20} className="text-bmw-blue mx-auto mb-1" />
                    <div className="text-sm font-bold">{selectedRoute.distance}</div>
                    <div className="text-[10px] text-white/40">Distance</div>
                  </div>
                  <div className="glass p-3 rounded-xl text-center">
                    <Clock size={20} className="text-bmw-blue mx-auto mb-1" />
                    <div className="text-sm font-bold">{selectedRoute.estimatedTime}</div>
                    <div className="text-[10px] text-white/40">Est. Time</div>
                  </div>
                  <div className="glass p-3 rounded-xl text-center">
                    <MapPin size={20} className="text-bmw-blue mx-auto mb-1" />
                    <div className="text-sm font-bold">{selectedRoute.roadQuality}/5</div>
                    <div className="text-[10px] text-white/40">Road Quality</div>
                  </div>
                  <div className="glass p-3 rounded-xl text-center">
                    <Mountain size={20} className="text-bmw-blue mx-auto mb-1" />
                    <div className="text-sm font-bold">{selectedRoute.scenicRating}/5</div>
                    <div className="text-[10px] text-white/40">Scenic Rating</div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-bold mb-3">Stops Along the Way</h3>
                  <div className="space-y-2">
                    {selectedRoute.stops.map((stop) => (
                      <div key={stop} className="flex items-center gap-2 text-sm text-white/70">
                        <div className="w-2 h-2 rounded-full bg-bmw-blue" />
                        {stop}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {selectedRoute.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                      <Image src={photo} alt="" fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
