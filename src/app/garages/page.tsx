"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApiList } from "@/hooks/useApiData";
import type { Garage } from "@/types";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Search, Star } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function GaragesPage() {
  const { data: garages } = useApiList<Garage>("/api/garages");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return garages;
    const q = search.toLowerCase();
    return garages.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        (g.services ?? []).some((s) => s.toLowerCase().includes(q))
    );
  }, [garages, search]);

  return (
    <>
      <PageHeader
        title="Partner Garages"
        subtitle="Trusted BMW specialists and service centers across Uganda"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <GlassCard className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search garages by name, district, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              />
            </div>
          </GlassCard>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((garage, i) => (
              <motion.div
                key={garage.id}
                id={garage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 9) * 0.05 }}
              >
                <GlassCard className="p-0 overflow-hidden h-full">
                  <div className="relative h-44 overflow-hidden">
                    <Image src={garage.cover} alt={garage.name} fill className="object-cover" sizes="400px" />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                      <Image src={garage.logo} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      {garage.rating.toFixed(1)} ({garage.reviews})
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{garage.name}</h3>
                    <p className="text-sm text-white/50 mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {garage.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(garage.services ?? []).map((s) => (
                        <span key={s} className="text-[10px] glass px-2 py-0.5 rounded-full text-white/50">{s}</span>
                      ))}
                    </div>
                    <div className="mt-4 space-y-1.5 text-xs text-white/40">
                      <div className="flex items-center gap-2"><Phone size={12} className="text-bmw-blue" /> {garage.phone}</div>
                      <div className="flex items-center gap-2"><Mail size={12} className="text-bmw-blue" /> {garage.email}</div>
                      <div className="flex items-center gap-2"><Clock size={12} className="text-bmw-blue" /> {garage.hours}</div>
                    </div>
                    <div className="mt-4 aspect-video rounded-xl bg-carbon flex items-center justify-center text-white/20 text-xs">
                      Google Maps Preview
                    </div>
                    <Button variant="primary" size="sm" className="mt-4 w-full">Book Appointment</Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
