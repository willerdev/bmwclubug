"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApiList } from "@/hooks/useApiData";
import type { Partner } from "@/types";
import Image from "next/image";

export function SponsorsSection() {
  const { data: partners } = useApiList<Partner>("/api/partners");
  const doubled = partners.length > 0 ? [...partners, ...partners] : [];

  return (
    <section className="section-padding overflow-hidden w-full max-w-full">
      <div className="container-custom mb-12">
        <SectionHeading
          title="Sponsors & Partners"
          subtitle="Proud to collaborate with Uganda's finest automotive brands"
        />
      </div>

      <div className="relative w-full max-w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee">
          {doubled.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex items-center gap-4 mx-4 sm:mx-8 glass-panel px-5 sm:px-8 py-3 sm:py-4 rounded-2xl shrink-0 border border-white/10"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0">
                <Image src={partner.logo} alt={partner.name} fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0">
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
