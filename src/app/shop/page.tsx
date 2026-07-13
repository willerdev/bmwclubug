"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApiList } from "@/hooks/useApiData";
import type { ShopProduct } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ShopPage() {
  const { data: shopProducts } = useApiList<ShopProduct>("/api/products");

  return (
    <>
      <PageHeader
        title="BMW Club Shop"
        subtitle="Official merchandise for BMW Club Uganda members"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-0 overflow-hidden group h-full">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-bmw-blue uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-bold mt-1">{product.name}</h3>
                    <p className="text-sm text-white/50 mt-2 line-clamp-2">{product.description}</p>
                    <Button size="sm" className="mt-4 w-full" href="/contact">
                      Enquire
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
