"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { marketplaceListings } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, MapPin, Search, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All", "BMW Cars", "Spare Parts", "Wheels", "Tyres",
  "Performance Parts", "Interior Accessories", "Detailing Products", "Merchandise",
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return marketplaceListings.filter((item) => {
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || item.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Buy and sell BMW cars, parts, and accessories within the community"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <GlassCard className="mb-8">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                    category === cat ? "glass-panel border-bmw-blue/30 text-white" : "glass-frosted hover:glass-strong border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 12) * 0.03 }}
              >
                <Link href={`/marketplace/${item.id}`}>
                  <GlassCard className="p-0 overflow-hidden group h-full relative">
                    <button
                      onClick={(e) => { e.preventDefault(); toggleWishlist(item.id); }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 glass rounded-full flex items-center justify-center"
                      aria-label="Add to wishlist"
                    >
                      <Heart size={14} className={wishlist.includes(item.id) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                    <div className="relative h-44 overflow-hidden">
                      <Image src={item.images[0]} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                      <span className="absolute top-3 left-3 glass px-2 py-0.5 rounded-full text-[10px]">{item.condition}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-bmw-blue uppercase">{item.category}</p>
                      <h3 className="font-semibold text-sm mt-1 line-clamp-2 group-hover:text-bmw-blue transition-colors">{item.title}</h3>
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
        </div>
      </section>
    </>
  );
}
