"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

type Item = {
  id: string;
  name: string;
  logo: string;
  cover: string;
  services: string[];
  phone: string;
  email: string;
  hours: string;
  location: string;
  district: string;
  rating: number;
  reviews: number;
};

const empty = {
  name: "",
  logo: "/images/club-logo.jpeg",
  cover: "/images/event_1.jpeg",
  services: "",
  phone: "",
  email: "",
  hours: "Mon-Fri: 8AM-6PM",
  location: "",
  district: "Kampala",
  rating: 4.5,
  reviews: 0,
};

export default function AdminGaragesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/garages")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    await fetch(editingId ? `/api/garages/${editingId}` : "/api/garages", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, services: form.services }),
    });
    setForm(empty);
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Garages</h1>
      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Name"><input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></AdminField>
          <AdminField label="District"><input className={adminInput} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></AdminField>
          <AdminField label="Phone"><input className={adminInput} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></AdminField>
          <AdminField label="Email"><input className={adminInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></AdminField>
          <AdminField label="Hours"><input className={adminInput} value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></AdminField>
          <AdminField label="Location"><input className={adminInput} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></AdminField>
          <AdminField label="Services (comma separated)" className="md:col-span-2">
            <input className={adminInput} value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} />
          </AdminField>
          <div><ImagePicker value={form.logo} onChange={(logo) => setForm({ ...form, logo })} label="Logo" /></div>
          <div><ImagePicker value={form.cover} onChange={(cover) => setForm({ ...form, cover })} label="Cover" /></div>
        </div>
        <AdminButton onClick={save}>{editingId ? "Update" : "Create"}</AdminButton>
      </GlassCard>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative h-32">
              <Image src={item.cover || "/images/event_1.jpeg"} alt="" fill className="object-cover" sizes="400px" unoptimized={item.cover?.startsWith("/api/media")} />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-xs text-white/50">{item.district} · {item.phone}</p>
              <div className="flex gap-2 mt-3">
                <AdminButton variant="secondary" onClick={() => {
                  setEditingId(item.id);
                  setForm({
                    name: item.name,
                    logo: item.logo,
                    cover: item.cover,
                    services: (item.services || []).join(", "),
                    phone: item.phone,
                    email: item.email,
                    hours: item.hours,
                    location: item.location,
                    district: item.district,
                    rating: item.rating,
                    reviews: item.reviews,
                  });
                }}>Edit</AdminButton>
                <AdminButton variant="danger" onClick={async () => { await fetch(`/api/garages/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
