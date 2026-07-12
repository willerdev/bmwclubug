"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { partners } from "@/data/mock";
import Image from "next/image";

export function SponsorsSection() {
  const doubled = [...partners, ...partners];

  return (
    <section className="section-padding overflow-hidden">
      <div className="container-custom mb-12">
        <SectionHeading title="Sponsors & Partners" subtitle="Proud to collaborate with Uganda's finest automotive brands" />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex items-center gap-4 mx-8 glass-panel px-8 py-4 rounded-2xl shrink-0 border border-white/10"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={partner.logo} alt={partner.name} fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="font-semibold text-sm whitespace-nowrap">{partner.name}</p>
                <p className="text-xs text-white/40">{partner.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
