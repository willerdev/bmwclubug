"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { marketplaceListings } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MarketplacePreview() {
  const featured = marketplaceListings.slice(0, 8);

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          title="Marketplace"
          subtitle="Buy and sell BMW cars, parts, and accessories within the community"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/marketplace/${item.id}`}>
                <GlassCard className="p-0 overflow-hidden group h-full">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <span className="absolute top-2 left-2 glass px-2 py-0.5 rounded-full text-[10px]">
                      {item.condition}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-bmw-blue uppercase tracking-wider">{item.category}</p>
                    <h3 className="font-semibold text-sm mt-1 line-clamp-2 group-hover:text-bmw-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-lg font-bold text-bmw-blue mt-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                      <span className="flex items-center gap-1"><MapPin size={10} />{item.location}</span>
                      <span className="flex items-center gap-1"><Tag size={10} />{item.seller.split(" ")[0]}</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/marketplace" variant="secondary">Browse Marketplace</Button>
        </div>
      </div>
    </section>
  );
}
