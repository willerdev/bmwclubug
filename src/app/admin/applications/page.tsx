"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminButton } from "@/components/admin/AdminUi";

type Application = {
  id: string;
  status: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);

  const load = useCallback(async () => {
    setItems(await (await fetch("/api/applications")).json());
  }, []);
  useEffect(() => { void load(); }, [load]);

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Registrations</h1>
      <p className="text-white/50">Membership applications from the join form</p>
      <div className="space-y-4">
        {items.length === 0 && <GlassCard>No applications yet.</GlassCard>}
        {items.map((item) => {
          const p = item.payload || {};
          return (
            <GlassCard key={item.id}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{String(p.fullName || "Unknown")}</h3>
                    <span className="text-xs glass px-2 py-0.5 rounded-full capitalize">{item.status}</span>
                  </div>
                  <p className="text-sm text-white/60">{String(p.email || "")} · {String(p.phone || "")}</p>
                  <p className="text-sm text-white/50 mt-1">{String(p.address || "")}</p>
                  <p className="text-sm text-white/70 mt-2">
                    BMW: {String(p.bmwModel || "—")} ({String(p.yearOfManufacture || "—")}) · {String(p.plateNumber || "")}
                  </p>
                  <p className="text-xs text-white/40 mt-2">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminButton onClick={() => setStatus(item.id, "approved")}>Approve</AdminButton>
                  <AdminButton variant="secondary" onClick={() => setStatus(item.id, "pending")}>Pending</AdminButton>
                  <AdminButton variant="danger" onClick={() => setStatus(item.id, "rejected")}>Reject</AdminButton>
                  <AdminButton variant="danger" onClick={async () => { await fetch(`/api/applications/${item.id}`, { method: "DELETE" }); await load(); }}>Delete</AdminButton>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
