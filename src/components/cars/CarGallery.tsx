"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carGallery, type SlideCar } from "@/components/cars/types";

export function CarGallery({ car }: { car: SlideCar }) {
  const images = carGallery(car);
  const [index, setIndex] = useState(0);
  const src = images[index % images.length];

  return (
    <div className="space-y-3">
      <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-carbon">
        <Image
          src={src}
          alt={car.name}
          fill
          className="object-cover"
          sizes="800px"
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
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
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
  );
}
