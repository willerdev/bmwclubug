"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";
import { MEMBERSHIP_LEVELS } from "@/lib/constants";

type Item = {
  id: string;
  name: string;
  email: string;
  photo: string;
  bio: string;
  district: string;
  membershipLevel: string;
  yearsInClub: number;
  rank: string;
  cars: string[];
  favoriteRoute: string;
};

const empty = {
  name: "",
  email: "",
  photo: "",
  bio: "",
  district: "Kampala",
  membershipLevel: "Enthusiast",
  yearsInClub: 1,
  rank: "Active Member",
  cars: "",
  favoriteRoute: "",
};

export default function AdminMembersPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/members")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    await fetch(editingId ? `/api/members/${editingId}` : "/api/members", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, cars: form.cars }),
    });
    setForm(empty);
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Members</h1>
      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Name"><input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></AdminField>
          <AdminField label="Email"><input className={adminInput} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></AdminField>
          <AdminField label="District"><input className={adminInput} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></AdminField>
          <AdminField label="Rank"><input className={adminInput} value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} /></AdminField>
          <AdminField label="Membership level">
            <select className={adminInput} value={form.membershipLevel} onChange={(e) => setForm({ ...form, membershipLevel: e.target.value })}>
              {MEMBERSHIP_LEVELS.map((l) => <option key={l} value={l} className="bg-carbon">{l}</option>)}
            </select>
          </AdminField>
          <AdminField label="Years in club">
            <input type="number" className={adminInput} value={form.yearsInClub} onChange={(e) => setForm({ ...form, yearsInClub: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Cars (comma separated)" className="md:col-span-2">
            <input className={adminInput} value={form.cars} onChange={(e) => setForm({ ...form, cars: e.target.value })} />
          </AdminField>
          <AdminField label="Favorite route" className="md:col-span-2">
            <input className={adminInput} value={form.favoriteRoute} onChange={(e) => setForm({ ...form, favoriteRoute: e.target.value })} />
          </AdminField>
          <AdminField label="Bio" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </AdminField>
          <div className="md:col-span-2"><ImagePicker value={form.photo} onChange={(photo) => setForm({ ...form, photo })} label="Photo" /></div>
        </div>
        <AdminButton onClick={save}>{editingId ? "Update" : "Create"}</AdminButton>
      </GlassCard>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id}>
            <div className="flex gap-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image src={item.photo || "/images/club-logo.jpeg"} alt="" fill className="object-cover" sizes="56px" unoptimized={item.photo?.startsWith("/api/media")} />
              </div>
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs text-bmw-blue">{item.membershipLevel}</p>
                <p className="text-xs text-white/50">{item.district}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <AdminButton variant="secondary" onClick={() => {
                setEditingId(item.id);
                setForm({
                  name: item.name,
                  email: item.email,
                  photo: item.photo,
                  bio: item.bio,
                  district: item.district,
                  membershipLevel: item.membershipLevel,
                  yearsInClub: item.yearsInClub,
                  rank: item.rank,
                  cars: (item.cars || []).join(", "),
                  favoriteRoute: item.favoriteRoute,
                });
              }}>Edit</AdminButton>
              <AdminButton variant="danger" onClick={async () => { await fetch(`/api/members/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
