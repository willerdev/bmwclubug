"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-bmw-blue/5 rounded-3xl" />
      <div className="container-custom relative max-w-4xl">
        <SectionHeading title="What Members Say" subtitle="Stories from our community" />

        <div className="relative glass-panel rounded-3xl p-8 lg:p-12 border border-white/15">
          <Quote className="absolute top-6 left-6 w-12 h-12 text-bmw-blue-light/25" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Image
                  src={testimonials[current].photo}
                  alt={testimonials[current].name}
                  fill
                  className="rounded-full object-cover ring-2 ring-bmw-blue/30"
                  sizes="80px"
                />
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-lg lg:text-xl text-white/80 italic leading-relaxed max-w-2xl mx-auto">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="font-bold">{testimonials[current].name}</p>
                <p className="text-sm text-bmw-blue">{testimonials[current].car}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-bmw-blue w-6" : "bg-white/20"}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Next">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
