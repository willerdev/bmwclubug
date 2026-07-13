"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

type EventItem = {
  id: string;
  title: string;
  poster: string;
  date: string;
  time: string;
  venue: string;
  district: string;
  description: string;
  status: "upcoming" | "past";
  maxCapacity: number;
  registeredCount: number;
};

const empty: Omit<EventItem, "id"> = {
  title: "",
  poster: "/images/event_1.jpeg",
  date: new Date().toISOString().slice(0, 10),
  time: "9:00 AM",
  venue: "",
  district: "Kampala",
  description: "",
  status: "upcoming",
  maxCapacity: 50,
  registeredCount: 0,
};

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setItems(data);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setMessage("");
    const res = await fetch(editingId ? `/api/events/${editingId}` : "/api/events", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Save failed");
      return;
    }
    setForm(empty);
    setEditingId(null);
    setMessage("Saved");
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-white/50 mt-1">Create and edit club events</p>
      </div>

      <GlassCard className="space-y-4">
        <h2 className="font-bold text-lg">{editingId ? "Edit event" : "New event"}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Title">
            <input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdminField>
          <AdminField label="Date">
            <input type="date" className={adminInput} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </AdminField>
          <AdminField label="Time">
            <input className={adminInput} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </AdminField>
          <AdminField label="Venue">
            <input className={adminInput} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </AdminField>
          <AdminField label="District">
            <input className={adminInput} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          </AdminField>
          <AdminField label="Status">
            <select className={adminInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "upcoming" | "past" })}>
              <option value="upcoming" className="bg-carbon">Upcoming</option>
              <option value="past" className="bg-carbon">Past</option>
            </select>
          </AdminField>
          <AdminField label="Capacity">
            <input type="number" className={adminInput} value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Registered">
            <input type="number" className={adminInput} value={form.registeredCount} onChange={(e) => setForm({ ...form, registeredCount: Number(e.target.value) })} />
          </AdminField>
          <AdminField label="Description" className="md:col-span-2">
            <textarea className={adminInput} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </AdminField>
          <div className="md:col-span-2">
            <ImagePicker value={form.poster} onChange={(poster) => setForm({ ...form, poster })} label="Event poster" />
          </div>
        </div>
        <div className="flex gap-3">
          <AdminButton onClick={save}>{editingId ? "Update" : "Create"}</AdminButton>
          {editingId && (
            <AdminButton variant="secondary" onClick={() => { setEditingId(null); setForm(empty); }}>
              Cancel
            </AdminButton>
          )}
        </div>
        {message && <p className="text-sm text-bmw-blue-light">{message}</p>}
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-0 overflow-hidden">
            <div className="relative h-36">
              <Image src={item.poster || "/images/event_1.jpeg"} alt="" fill className="object-cover" sizes="400px" unoptimized={item.poster?.startsWith("/api/media")} />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-xs text-white/50">{item.date} · {item.district} · {item.status}</p>
              <div className="flex gap-2 pt-2">
                <AdminButton variant="secondary" onClick={() => { setEditingId(item.id); setForm({ ...item }); }}>Edit</AdminButton>
                <AdminButton variant="danger" onClick={() => remove(item.id)}>Delete</AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
