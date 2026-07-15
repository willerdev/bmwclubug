"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminButton } from "@/components/admin/AdminUi";

type Registration = {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  notes: string;
  status: string;
  createdAt: string;
};

export default function AdminEventRegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const load = useCallback(async () => {
    const q = filter === "all" ? "" : `?status=${filter}`;
    setItems(await (await fetch(`/api/event-registrations${q}`)).json());
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/event-registrations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Event Registrations</h1>
        <p className="text-white/50 mt-1 text-sm">People who signed up for club events from the public site</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
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
        {items.length === 0 && <GlassCard>No event registrations yet.</GlassCard>}
        {items.map((item) => (
          <GlassCard key={item.id}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{item.fullName}</h3>
                  <span className="text-xs glass px-2 py-0.5 rounded-full capitalize">{item.status}</span>
                </div>
                <p className="text-sm text-bmw-blue">{item.eventTitle}</p>
                <p className="text-sm text-white/60 mt-1">
                  {item.email} · {item.phone}
                </p>
                <p className="text-sm text-white/50 mt-1">Guests: {item.guests}</p>
                {item.notes && <p className="text-sm text-white/70 mt-2">{item.notes}</p>}
                <p className="text-xs text-white/40 mt-2">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdminButton onClick={() => setStatus(item.id, "confirmed")}>Confirm</AdminButton>
                <AdminButton variant="secondary" onClick={() => setStatus(item.id, "pending")}>
                  Pending
                </AdminButton>
                <AdminButton variant="danger" onClick={() => setStatus(item.id, "cancelled")}>
                  Cancel
                </AdminButton>
                <AdminButton
                  variant="danger"
                  onClick={async () => {
                    await fetch(`/api/event-registrations/${item.id}`, { method: "DELETE" });
                    await load();
                  }}
                >
                  Delete
                </AdminButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
