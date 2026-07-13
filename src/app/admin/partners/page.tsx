"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

type Item = { id: string; name: string; logo: string; category: string };

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ name: "", logo: "/images/club-logo.jpeg", category: "Partner" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/partners")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    await fetch(editingId ? `/api/partners/${editingId}` : "/api/partners", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", logo: "/images/club-logo.jpeg", category: "Partner" });
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Partners</h1>
      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Name"><input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></AdminField>
          <AdminField label="Category"><input className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></AdminField>
          <div className="md:col-span-2"><ImagePicker value={form.logo} onChange={(logo) => setForm({ ...form, logo })} label="Logo" /></div>
        </div>
        <AdminButton onClick={save}>{editingId ? "Update" : "Create"}</AdminButton>
      </GlassCard>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id}>
            <div className="relative w-14 h-14 rounded-full overflow-hidden mb-3">
              <Image src={item.logo || "/images/club-logo.jpeg"} alt="" fill className="object-cover" sizes="56px" unoptimized={item.logo?.startsWith("/api/media")} />
            </div>
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-xs text-white/50">{item.category}</p>
            <div className="flex gap-2 mt-3">
              <AdminButton variant="secondary" onClick={() => { setEditingId(item.id); setForm({ name: item.name, logo: item.logo, category: item.category }); }}>Edit</AdminButton>
              <AdminButton variant="danger" onClick={async () => { await fetch(`/api/partners/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
