"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApiList } from "@/hooks/useApiData";
import type { ShopProduct } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ShopPreview() {
  const { data: shopProducts } = useApiList<ShopProduct>("/api/products");

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <SectionHeading
          title="Club Shop"
          subtitle="Official BMW Club Uganda merchandise for members"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shopProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href="/shop">
                <GlassCard className="p-0 overflow-hidden group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-bmw-blue uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-semibold mt-1 group-hover:text-bmw-blue-light transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-white/45 mt-2 line-clamp-2">{product.description}</p>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button href="/shop" variant="secondary">View Shop</Button>
        </div>
      </div>
    </section>
  );
}
