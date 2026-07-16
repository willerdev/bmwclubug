"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import { formatPrice } from "@/lib/utils";

type Item = { id: string; name: string; image: string; category: string; description: string; price: number };

export default function AdminProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ name: "", image: "/images/product_1.jpeg", category: "Apparel", description: "", price: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/products")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", image: "/images/product_1.jpeg", category: "Apparel", description: "", price: 0 });
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products / Shop</h1>
      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Name"><input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></AdminField>
          <AdminField label="Category"><input className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></AdminField>
          <AdminField label="Price (UGX)">
            <input type="number" className={adminInput} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Description" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </AdminField>
          <div className="md:col-span-2"><ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} /></div>
        </div>
        <AdminButton onClick={save}>{editingId ? "Update" : "Create"}</AdminButton>
      </GlassCard>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative h-40">
              <Image src={item.image || "/images/product_1.jpeg"} alt="" fill className="object-cover" sizes="250px" unoptimized={item.image?.startsWith("/api/media")} />
            </div>
            <div className="p-4">
              <p className="text-[10px] text-bmw-blue uppercase">{item.category}</p>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-bmw-blue mt-1">{formatPrice(item.price)}</p>
              <div className="flex gap-2 mt-3">
                <AdminButton variant="secondary" onClick={() => { setEditingId(item.id); setForm({ name: item.name, image: item.image, category: item.category, description: item.description, price: item.price }); }}>Edit</AdminButton>
                <AdminButton variant="danger" onClick={async () => { await fetch(`/api/products/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
