"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bmwModels } from "@/data/mock";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export function ModelsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setActiveIndex((prev) =>
      dir === "left" ? Math.max(0, prev - 1) : Math.min(bmwModels.length - 1, prev + 1)
    );
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <SectionHeading
          title="Featured BMW Models"
          subtitle="Iconic machines owned by our club members across Uganda"
        />

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors hidden md:flex"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {bmwModels.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="snap-start shrink-0 w-[min(20rem,calc(100vw-2rem))]"
              >
                <GlassCard className="p-0 overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={model.image}
                      alt={model.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="320px"
                    />
                    <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-medium">
                      {model.generation}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{model.name}</h3>
                    <p className="text-white/50 text-sm mt-1">{model.year}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-white/70">
                      <span>{model.engine}</span>
                      <span className="flex items-center gap-1">
                        <Gauge size={14} className="text-bmw-blue" />
                        {model.horsepower} HP
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-3">Owner: {model.owner}</p>
                    <Button href={`/members`} variant="outline" size="sm" className="mt-4 w-full">
                      Learn More
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors hidden md:flex"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
