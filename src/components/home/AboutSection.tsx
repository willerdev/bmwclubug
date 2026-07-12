"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { LOCAL_IMAGES } from "@/lib/constants";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

const MISSION_POINTS = [
  "Bringing together BMW owners and enthusiasts in Uganda",
  "Organizing road trips and meetups across the country",
  "Supporting local businesses and partner garages",
  "Promoting safe and responsible driving",
  "Building lifelong friendships through a shared passion for BMW",
];

export function AboutSection() {
  return (
    <section id="about" className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          title="About BMW Club Uganda"
          subtitle="More than a club — a community united by the ultimate driving machine"
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={LOCAL_IMAGES.events[1]}
                alt="BMW Club Uganda community event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden border-4 border-background/80 glass-panel hidden md:block">
              <Image
                src={LOCAL_IMAGES.m4[1]}
                alt="BMW M4"
                fill
                className="object-cover"
                sizes="192px"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              BMW Club Uganda is the premier community for BMW owners and enthusiasts across the Pearl of Africa.
              From the streets of Kampala to the scenic routes of Fort Portal, we celebrate the joy of driving
              and the bonds that form when passion meets the open road.
            </p>
            <ul className="space-y-4">
              {MISSION_POINTS.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-bmw-blue shrink-0 mt-0.5" />
                  <span className="text-white/80">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
