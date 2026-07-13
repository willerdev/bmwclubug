"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

type Item = { id: string; image: string; category: string; title: string };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ image: "/images/bmw_cars_1.jpeg", category: "Cars", title: "" });

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/gallery")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ image: "/images/bmw_cars_1.jpeg", category: "Cars", title: "" });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gallery</h1>
      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Title"><input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></AdminField>
          <AdminField label="Category">
            <select className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["Events", "Cars", "Road Trips", "Members", "Videos"].map((c) => (
                <option key={c} value={c} className="bg-carbon">{c}</option>
              ))}
            </select>
          </AdminField>
          <div className="md:col-span-2"><ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} /></div>
        </div>
        <AdminButton onClick={save}>Add to gallery</AdminButton>
      </GlassCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative aspect-square">
              <Image src={item.image} alt="" fill className="object-cover" sizes="200px" unoptimized={item.image?.startsWith("/api/media")} />
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs truncate">{item.title || item.category}</p>
              </div>
              <AdminButton variant="danger" onClick={async () => { await fetch(`/api/gallery/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
