"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/providers/CartProvider";
import { useApiList } from "@/hooks/useApiData";
import type { ShopProduct } from "@/types";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ShopPage() {
  const { data: shopProducts } = useApiList<ShopProduct>("/api/products");
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (product: ShopProduct) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      <PageHeader
        title="BMW Club Shop"
        subtitle="Official merchandise for BMW Club Uganda members — pay on delivery"
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
                <GlassCard hover={false} className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      unoptimized={product.image.startsWith("/api/media")}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] text-bmw-blue uppercase tracking-wider">{product.category}</p>
                    <h3 className="font-bold mt-1">{product.name}</h3>
                    <p className="text-sm text-white/50 mt-2 line-clamp-2 flex-1">{product.description}</p>
                    <p className="text-lg font-bold text-bmw-blue mt-3">
                      {product.price > 0 ? formatPrice(product.price) : "Price on request"}
                    </p>
                    <Button
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => handleAdd(product)}
                    >
                      <ShoppingCart size={14} />
                      {addedId === product.id ? "Added!" : "Add to Cart"}
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
