"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <PageHeader title="Member Login" subtitle="Access your BMW Club Uganda dashboard" />

      <section className="section-padding pt-0">
        <div className="container-custom max-w-md mx-auto">
          <GlassCard>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              />
              <Button className="w-full">Sign In</Button>
            </form>
            <div className="mt-6 text-center text-sm text-white/50">
              Don&apos;t have an account?{" "}
              <Link href="/join" className="text-bmw-blue hover:underline">Join the Club</Link>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <Link href="/dashboard" className="text-xs text-white/30 hover:text-white/50">
                Demo: View Dashboard →
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
