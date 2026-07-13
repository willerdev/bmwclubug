"use client";

import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApiList } from "@/hooks/useApiData";
import type { GalleryItem } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function GalleryPreview() {
  const { data: galleryItems } = useApiList<GalleryItem>("/api/gallery");
  const preview = galleryItems.slice(0, 12);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          title="Gallery"
          subtitle="Moments captured from events, road trips, and our vibrant community"
        />

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {preview.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1 }}
              className="break-inside-avoid"
            >
              <Link href="/gallery" className="block group relative rounded-xl overflow-hidden">
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
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/gallery" variant="secondary">View Full Gallery</Button>
        </div>
      </div>
    </section>
  );
}
