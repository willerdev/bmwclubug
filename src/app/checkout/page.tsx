"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle, Truck } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  if (items.length === 0 && status !== "done") {
    return (
      <>
        <PageHeader title="Checkout" subtitle="Your cart is empty" />
        <section className="section-padding pt-0">
          <div className="container-custom max-w-lg text-center">
            <GlassCard>
              <p className="text-white/60 mb-6">Add items from the shop before checking out.</p>
              <Button href="/shop">Go to Shop</Button>
            </GlassCard>
          </div>
        </section>
      </>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      setOrderId(String(data.id || ""));
      clearCart();
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Checkout failed");
    }
  };

  if (status === "done") {
    return (
      <>
        <PageHeader title="Order Placed" subtitle="Pay on delivery" />
        <section className="section-padding pt-0">
          <div className="container-custom max-w-lg">
            <GlassCard className="text-center space-y-4">
              <CheckCircle size={48} className="text-bmw-blue mx-auto" />
              <h2 className="text-xl font-bold">Thank you for your order!</h2>
              <p className="text-white/60">
                We&apos;ll contact you to confirm delivery. Payment is due when your order arrives.
              </p>
              {orderId && (
                <p className="text-xs text-white/40 font-mono">Order ref: {orderId.slice(0, 8)}</p>
              )}
              <div className="flex gap-3 justify-center pt-2">
                <Button href="/shop" variant="secondary">Continue Shopping</Button>
                <Button onClick={() => router.push("/")}>Back Home</Button>
              </div>
            </GlassCard>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Checkout" subtitle="Pay on delivery — no online payment required" />

      <section className="section-padding pt-0">
        <div className="container-custom max-w-4xl">
          <div className="grid lg:grid-cols-5 gap-8">
            <form onSubmit={submit} className="lg:col-span-3 space-y-4">
              <GlassCard className="space-y-4">
                <h2 className="font-bold text-lg">Delivery Details</h2>
                <input
                  className={inputClass}
                  required
                  placeholder="Full name"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
                <input
                  className={inputClass}
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className={inputClass}
                  required
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <textarea
                  className={inputClass}
                  required
                  rows={3}
                  placeholder="Delivery address (street, area, city)"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <textarea
                  className={inputClass}
                  rows={2}
                  placeholder="Delivery notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </GlassCard>

              <GlassCard className="flex items-start gap-3 border border-bmw-blue/20">
                <Truck size={20} className="text-bmw-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Pay on Delivery</p>
                  <p className="text-sm text-white/55 mt-1">
                    You pay when your order is delivered. No card or mobile money required now.
                  </p>
                </div>
              </GlassCard>

              {message && <p className="text-sm text-bmw-red">{message}</p>}

              <Button type="submit" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Placing order..." : "Place Order — Pay on Delivery"}
              </Button>
            </form>

            <div className="lg:col-span-2">
              <GlassCard className="sticky top-28 space-y-4">
                <h2 className="font-bold">Order Summary</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-carbon">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized={item.image.startsWith("/api/media")}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-white/45">× {item.quantity}</p>
                      </div>
                      <p className="text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-bmw-blue">{formatPrice(total)}</span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
