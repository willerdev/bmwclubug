"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { adminInput, AdminField } from "@/components/admin/AdminUi";

type Activity = {
  id: string;
  userId: string | null;
  userEmail: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown>;
  createdAt: string;
};

type User = { id: string; name: string; email: string };

export default function AdminActivityPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");

  const load = useCallback(async () => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const [activityRes, usersRes] = await Promise.all([
      fetch(`/api/admin/activity${qs}`),
      fetch("/api/admin/users"),
    ]);
    if (activityRes.ok) setItems(await activityRes.json());
    if (usersRes.ok) setUsers(await usersRes.json());
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-white/50 mt-1 text-sm">Track actions performed by staff accounts on the CMS.</p>
      </div>

      <GlassCard>
        <AdminField label="Filter by user">
          <select className={adminInput} value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="" className="bg-carbon">All users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-carbon">
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </AdminField>
      </GlassCard>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/40 border-b border-white/10">
              <th className="py-3 pr-4">When</th>
              <th className="py-3 pr-4">User</th>
              <th className="py-3 pr-4">Action</th>
              <th className="py-3 pr-4">Entity</th>
              <th className="py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/5 align-top">
                <td className="py-3 pr-4 whitespace-nowrap text-white/50">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                </td>
                <td className="py-3 pr-4">
                  <div className="font-medium">{item.userName || "—"}</div>
                  <div className="text-xs text-white/40">{item.userEmail}</div>
                </td>
                <td className="py-3 pr-4 capitalize text-bmw-blue-light">{item.action}</td>
                <td className="py-3 pr-4">
                  {item.entity}
                  {item.entityId ? (
                    <div className="text-[10px] text-white/30 truncate max-w-[140px]">{item.entityId}</div>
                  ) : null}
                </td>
                <td className="py-3 text-white/45 text-xs max-w-xs truncate">
                  {Object.keys(item.details || {}).length ? JSON.stringify(item.details) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-white/40 text-sm py-8 text-center">No activity yet.</p>}
      </div>
    </div>
  );
}
