import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { partners } from "@/data/mock";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners",
  description: "Our sponsors and partners supporting BMW Club Uganda.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        title="Sponsors & Partners"
        subtitle="Proud to collaborate with Uganda's finest automotive brands"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <GlassCard key={partner.id} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image src={partner.logo} alt={partner.name} fill className="object-cover" sizes="80px" />
                </div>
                <h3 className="font-bold">{partner.name}</h3>
                <p className="text-sm text-bmw-blue mt-1">{partner.category}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <SponsorsSection />
    </>
  );
}
