"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Your Cart" subtitle="No items yet" />
        <section className="section-padding pt-0">
          <div className="container-custom max-w-lg text-center">
            <GlassCard>
              <p className="text-white/60 mb-6">Browse the club shop and add merchandise to your cart.</p>
              <Button href="/shop">Go to Shop</Button>
            </GlassCard>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Your Cart" subtitle={`${items.length} product${items.length === 1 ? "" : "s"}`} />
      <section className="section-padding pt-0">
        <div className="container-custom max-w-3xl space-y-4">
          {items.map((item) => (
            <GlassCard key={item.productId} className="flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-carbon">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={item.image.startsWith("/api/media")}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{item.name}</h3>
                <p className="text-bmw-blue text-sm mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 glass rounded-lg flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 glass rounded-lg flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto text-white/40 hover:text-bmw-red transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="font-bold text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </GlassCard>
          ))}

          <GlassCard className="flex items-center justify-between">
            <span className="text-white/60">Subtotal</span>
            <span className="text-xl font-bold text-bmw-blue">{formatPrice(total)}</span>
          </GlassCard>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/shop" variant="secondary" className="flex-1">
              Continue Shopping
            </Button>
            <Button href="/checkout" className="flex-1">
              Checkout — Pay on Delivery
            </Button>
          </div>

          <p className="text-center text-xs text-white/40">
            Payment is collected when your order is delivered.{" "}
            <Link href="/checkout" className="text-bmw-blue-light hover:underline">
              Proceed to checkout
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
