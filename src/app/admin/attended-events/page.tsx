"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

type Item = {
  id: string;
  title: string;
  date: string;
  venue: string;
  district: string;
  poster: string;
  description: string;
  sortOrder: number;
};

const empty = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  venue: "",
  district: "Kampala",
  poster: "/images/event_1.jpeg",
  description: "",
  sortOrder: 0,
};

export default function AdminAttendedEventsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/attended-events")).json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setError("");
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    const res = await fetch(editingId ? `/api/attended-events/${editingId}` : "/api/attended-events", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save");
      return;
    }
    setForm(empty);
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events Attended</h1>
        <p className="text-white/50 mt-1 text-sm">
          Manage past events shown in the &quot;Events We&apos;ve Attended&quot; section on the homepage.
        </p>
      </div>

      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Title">
            <input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdminField>
          <AdminField label="Date">
            <input type="date" className={adminInput} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </AdminField>
          <AdminField label="Venue">
            <input className={adminInput} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </AdminField>
          <AdminField label="District">
            <input className={adminInput} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </AdminField>
          <AdminField label="Sort order">
            <input type="number" className={adminInput} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Description" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </AdminField>
          <div className="md:col-span-2">
            <ImagePicker value={form.poster} onChange={(poster) => setForm({ ...form, poster })} label="Poster image" />
          </div>
        </div>
        {error && <p className="text-sm text-bmw-red">{error}</p>}
        <div className="flex gap-2">
          <AdminButton onClick={save}>{editingId ? "Update" : "Add event"}</AdminButton>
          {editingId && (
            <AdminButton variant="secondary" onClick={() => { setEditingId(null); setForm(empty); }}>Cancel</AdminButton>
          )}
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative h-40">
              <Image src={item.poster || "/images/event_1.jpeg"} alt="" fill className="object-cover" sizes="300px" unoptimized={item.poster?.startsWith("/api/media")} />
            </div>
            <div className="p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-xs text-white/50 mt-1">{item.date} · {item.district}</p>
              <div className="flex gap-2 mt-3">
                <AdminButton variant="secondary" onClick={() => { setEditingId(item.id); setForm({ title: item.title, date: item.date, venue: item.venue, district: item.district, poster: item.poster, description: item.description, sortOrder: item.sortOrder }); }}>Edit</AdminButton>
                <AdminButton variant="danger" onClick={async () => { await fetch(`/api/attended-events/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
