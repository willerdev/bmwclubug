"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

type Stats = {
  events: number;
  partners: number;
  garages: number;
  products: number;
  members: number;
  pendingApplications: number;
  gallery: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    { label: "Events", value: stats?.events, href: "/admin/events" },
    { label: "Partners", value: stats?.partners, href: "/admin/partners" },
    { label: "Garages", value: stats?.garages, href: "/admin/garages" },
    { label: "Products", value: stats?.products, href: "/admin/products" },
    { label: "Members", value: stats?.members, href: "/admin/members" },
    { label: "Pending Registrations", value: stats?.pendingApplications, href: "/admin/applications" },
    { label: "Gallery", value: stats?.gallery, href: "/admin/gallery" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-white/50 mb-8">Manage BMW Club Uganda content</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <GlassCard className="hover:border-bmw-blue/30 transition-colors h-full">
              <p className="text-sm text-white/50">{card.label}</p>
              <p className="text-3xl font-bold text-bmw-blue-light mt-2">
                {card.value ?? "—"}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
