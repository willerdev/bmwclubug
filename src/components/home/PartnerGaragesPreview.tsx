"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { garages } from "@/data/mock";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PartnerGaragesPreview() {
  const featured = garages.slice(0, 6);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          title="Partner Garages"
          subtitle="Trusted BMW specialists across Uganda"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((garage, i) => (
            <motion.div
              key={garage.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/garages#${garage.id}`}>
                <GlassCard className="p-0 overflow-hidden group h-full">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={garage.cover}
                      alt={garage.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                      <Image src={garage.logo} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      {garage.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold group-hover:text-bmw-blue transition-colors">{garage.name}</h3>
                    <p className="text-sm text-white/50 mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {garage.district}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {garage.services.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] glass px-2 py-0.5 rounded-full text-white/50">{s}</span>
                      ))}
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-white/40">
                      <div className="flex items-center gap-2"><Phone size={10} /> {garage.phone}</div>
                      <div className="flex items-center gap-2"><Clock size={10} /> {garage.hours}</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4 w-full">Book Appointment</Button>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/garages" variant="secondary">View All Garages</Button>
        </div>
      </div>
    </section>
  );
}
