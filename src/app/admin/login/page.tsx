"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ClubLogo } from "@/components/ui/ClubLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { adminInput, AdminButton } from "@/components/admin/AdminUi";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      router.push(search.get("next") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md">
        <div className="mb-6">
          <ClubLogo />
          <h1 className="text-2xl font-bold mt-6">Admin Login</h1>
          <p className="text-sm text-white/50 mt-2">Enter the shared admin password</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            className={adminInput}
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-bmw-red">{error}</p>}
          <AdminButton type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </AdminButton>
        </form>
      </GlassCard>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
