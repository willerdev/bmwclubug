"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import { formatPrice } from "@/lib/utils";

type Item = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
  total: number;
  createdAt: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
};

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "delivered" | "cancelled">("all");

  const load = useCallback(async () => {
    const q = filter === "all" ? "" : `?status=${filter}`;
    setItems(await (await fetch(`/api/orders${q}`)).json());
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shop Orders</h1>
        <p className="text-white/50 mt-1 text-sm">Pay-on-delivery orders from the club shop</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm capitalize ${
              filter === s ? "glass-panel border border-bmw-blue/40" : "glass-frosted text-white/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {items.length === 0 && <GlassCard>No orders yet.</GlassCard>}
        {items.map((order) => (
          <GlassCard key={order.id}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{order.customerName}</h3>
                  <span className="text-xs glass px-2 py-0.5 rounded-full capitalize">{order.status}</span>
                  <span className="text-sm text-bmw-blue font-medium">{formatPrice(order.total)}</span>
                </div>
                <p className="text-sm text-white/60">{order.email} · {order.phone}</p>
                <p className="text-sm text-white/50 mt-1">{order.address}</p>
                {order.notes && <p className="text-sm text-white/45 mt-1">Notes: {order.notes}</p>}
                <ul className="mt-3 space-y-1 text-sm text-white/70">
                  {order.items?.map((item, i) => (
                    <li key={i}>
                      {item.productName} × {item.quantity} — {formatPrice(item.unitPrice * item.quantity)}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-white/40 mt-2">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminButton onClick={() => setStatus(order.id, "confirmed")}>Confirm</AdminButton>
                <AdminButton variant="secondary" onClick={() => setStatus(order.id, "delivered")}>Delivered</AdminButton>
                <AdminButton variant="danger" onClick={() => setStatus(order.id, "cancelled")}>Cancel</AdminButton>
                <AdminButton variant="danger" onClick={async () => { await fetch(`/api/orders/${order.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
