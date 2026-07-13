"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminButton, AdminField, adminInput } from "@/components/admin/AdminUi";

type Permission = "view" | "add" | "update" | "all";
type User = {
  id: string;
  name: string;
  email: string;
  permission: Permission;
  isActive: boolean;
};

const PERMS: { value: Permission; label: string; help: string }[] = [
  { value: "view", label: "View", help: "Read-only access" },
  { value: "add", label: "Add", help: "View + create content" },
  { value: "update", label: "Update", help: "View + create + edit" },
  { value: "all", label: "All", help: "Full access including delete & users" },
];

const empty = { name: "", email: "", password: "", permission: "view" as Permission, isActive: true };

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mePermission, setMePermission] = useState<Permission | null>(null);

  const load = useCallback(async () => {
    const me = await fetch("/api/admin/login").then((r) => r.json());
    setMePermission(me.user?.permission ?? null);
    const res = await fetch("/api/admin/users");
    if (!res.ok) {
      setError("Only users with All permission can manage staff accounts.");
      setItems([]);
      return;
    }
    setError("");
    setItems(await res.json());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setError("");
    const res = await fetch(editingId ? `/api/admin/users/${editingId}` : "/api/admin/users", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Failed to save user");
      return;
    }
    setForm(empty);
    setEditingId(null);
    await load();
  };

  if (mePermission && mePermission !== "all") {
    return (
      <GlassCard>
        <h1 className="text-2xl font-bold">Staff Users</h1>
        <p className="text-white/50 mt-2">You need <strong>All</strong> permission to manage staff accounts.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Users</h1>
        <p className="text-white/50 mt-1 text-sm">Create accounts with View, Add, Update, or All permissions.</p>
      </div>

      <GlassCard className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Name">
            <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </AdminField>
          <AdminField label="Email">
            <input className={adminInput} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </AdminField>
          <AdminField label={editingId ? "New password (optional)" : "Password"}>
            <input
              className={adminInput}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editingId ? "Leave blank to keep current" : "Min 6 characters"}
            />
          </AdminField>
          <AdminField label="Permission">
            <select
              className={adminInput}
              value={form.permission}
              onChange={(e) => setForm({ ...form, permission: e.target.value as Permission })}
            >
              {PERMS.map((p) => (
                <option key={p.value} value={p.value} className="bg-carbon">
                  {p.label} — {p.help}
                </option>
              ))}
            </select>
          </AdminField>
          {editingId && (
            <label className="flex items-center gap-2 text-sm text-white/70 md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active account
            </label>
          )}
        </div>
        {error && <p className="text-sm text-bmw-red">{error}</p>}
        <div className="flex gap-2">
          <AdminButton onClick={save}>{editingId ? "Update user" : "Add user"}</AdminButton>
          {editingId && (
            <AdminButton
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
            >
              Cancel
            </AdminButton>
          )}
        </div>
      </GlassCard>

      <div className="space-y-3">
        {items.map((user) => (
          <GlassCard key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-sm text-white/50">{user.email}</p>
              <p className="text-xs text-bmw-blue-light mt-1 capitalize">
                {user.permission} {user.isActive ? "" : "· inactive"}
              </p>
            </div>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setEditingId(user.id);
                  setForm({
                    name: user.name,
                    email: user.email,
                    password: "",
                    permission: user.permission,
                    isActive: user.isActive,
                  });
                }}
              >
                Edit
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={async () => {
                  await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
                  await load();
                }}
              >
                Delete
              </AdminButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
