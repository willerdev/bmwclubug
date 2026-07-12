"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { galleryItems } from "@/data/mock";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Events", "Cars", "Road Trips", "Members", "Videos"] as const;

export default function GalleryPage() {
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (category === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === category);
  }, [category]);

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle={`${galleryItems.length} moments from our community`}
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm transition-all ${
                  category === cat ? "glass-panel border-bmw-blue/40 glow-blue" : "glass-frosted hover:glass-strong border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.slice(0, 60).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 8) * 0.05 }}
                className="break-inside-avoid"
              >
                <div className="group relative rounded-xl overflow-hidden cursor-pointer">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={400 * item.aspectRatio}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] text-bmw-blue uppercase">{item.category}</span>
                      <p className="text-sm font-medium truncate">{item.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
