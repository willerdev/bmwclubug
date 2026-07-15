"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Gauge, X } from "lucide-react";
import { carGallery, type SlideCar } from "@/components/cars/types";

export function CarDetailModal({
  car,
  onClose,
}: {
  car: SlideCar;
  onClose: () => void;
}) {
  const images = carGallery(car);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [images.length, onClose]);

  const src = images[index % images.length];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={car.name}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/15 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        <div className="relative h-56 sm:h-80 bg-carbon">
          <Image
            src={src}
            alt={car.name}
            fill
            className="object-cover"
            sizes="900px"
            unoptimized={src.startsWith("/api/media")}
            priority
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center"
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Photo ${i + 1}`}
                    className={`w-2 h-2 rounded-full ${i === index ? "bg-bmw-blue" : "bg-white/40"}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          <div>
            <p className="text-bmw-blue text-sm font-medium">{car.generation}</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">{car.name}</h2>
            <p className="text-white/50 mt-1">{car.year}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <span>{car.engine}</span>
            <span className="flex items-center gap-1">
              <Gauge size={14} className="text-bmw-blue" />
              {car.horsepower} HP
            </span>
            <span>Owner: {car.owner}</span>
          </div>
          {car.description && (
            <p className="text-white/70 leading-relaxed">{car.description}</p>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
              {images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative aspect-square rounded-lg overflow-hidden border ${
                    i === index ? "border-bmw-blue" : "border-white/10"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="100px"
                    unoptimized={img.startsWith("/api/media")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
