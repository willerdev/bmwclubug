"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CarDetailModal } from "@/components/cars/CarDetailModal";
import { carGallery, type SlideCar } from "@/components/cars/types";
import { useApiList } from "@/hooks/useApiData";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function isDesktop() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(min-width: 768px)").matches;
}

export function ModelsCarousel() {
  const { data: cars } = useApiList<SlideCar>("/api/cars");
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<SlideCar | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setActiveIndex((prev) =>
      dir === "left" ? Math.max(0, prev - 1) : Math.min(Math.max(cars.length - 1, 0), prev + 1)
    );
  };

  const currentImage = (car: SlideCar) => {
    const imgs = carGallery(car);
    const idx = imageIndex[car.id] ?? 0;
    return imgs[idx % imgs.length];
  };

  const openCar = (car: SlideCar) => {
    if (isDesktop()) {
      setSelected(car);
      return;
    }
    router.push(`/cars/${car.id}`);
  };

  if (cars.length === 0) return null;

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
            {cars.map((model, i) => {
              const src = currentImage(model);
              const imgs = carGallery(model);
              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="snap-start shrink-0 w-[min(20rem,calc(100vw-2rem))]"
                >
                  <GlassCard className="p-0 overflow-hidden h-full">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => openCar(model)}
                    >
                      <div className="relative h-48 overflow-hidden group">
                        <Image
                          src={src}
                          alt={model.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="320px"
                          unoptimized={src.startsWith("/api/media")}
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
                      </div>
                    </button>
                    {imgs.length > 1 && (
                      <div className="px-5 pb-2 flex justify-center gap-1">
                        {imgs.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            aria-label={`Photo ${idx + 1}`}
                            className={`w-1.5 h-1.5 rounded-full ${(imageIndex[model.id] ?? 0) === idx ? "bg-bmw-blue" : "bg-white/40"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageIndex((prev) => ({ ...prev, [model.id]: idx }));
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="px-5 pb-5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openCar(model)}
                      >
                        View Details
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors hidden md:flex"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <p className="sr-only">Active slide {activeIndex + 1}</p>
      </div>

      {selected && (
        <CarDetailModal car={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
