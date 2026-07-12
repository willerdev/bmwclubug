"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { clubStats } from "@/data/mock";
import {
  BarChart3, Calendar, Car, Image, MapPin, MessageSquare,
  Settings, Shield, ShoppingBag, Users, Wrench,
} from "lucide-react";

const ADMIN_SECTIONS = [
  { label: "Members", icon: Users, count: clubStats.members, color: "text-blue-400" },
  { label: "Applications", icon: Shield, count: 12, color: "text-green-400" },
  { label: "Events", icon: Calendar, count: clubStats.eventsHosted, color: "text-purple-400" },
  { label: "Marketplace", icon: ShoppingBag, count: 50, color: "text-amber-400" },
  { label: "Garages", icon: Wrench, count: clubStats.partnerGarages, color: "text-red-400" },
  { label: "Sponsors", icon: Shield, count: 20, color: "text-cyan-400" },
  { label: "Routes", icon: MapPin, count: clubStats.roadTripsCompleted, color: "text-pink-400" },
  { label: "Gallery", icon: Image, count: 300, color: "text-indigo-400" },
  { label: "Forum", icon: MessageSquare, count: 150, color: "text-orange-400" },
  { label: "Vehicles", icon: Car, count: clubStats.registeredBMWs, color: "text-teal-400" },
  { label: "Analytics", icon: BarChart3, count: null, color: "text-bmw-blue" },
  { label: "Settings", icon: Settings, count: null, color: "text-white/50" },
];

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage BMW Club Uganda platform"
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
            {[
              { label: "Total Members", value: clubStats.members, change: "+12 this month" },
              { label: "Active Events", value: 8, change: "3 this week" },
              { label: "Marketplace Items", value: 50, change: "+5 new" },
              { label: "Monthly Revenue", value: "UGX 2.4M", change: "+18%" },
            ].map((stat) => (
              <GlassCard key={stat.label}>
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="text-3xl font-bold mt-2 text-bmw-blue">{stat.value}</p>
                <p className="text-xs text-green-400 mt-1">{stat.change}</p>
              </GlassCard>
            ))}
          </div>

          <h3 className="text-xl font-bold mb-6">Management Tools</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ADMIN_SECTIONS.map((section) => (
              <GlassCard key={section.label} className="cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <section.icon size={22} className={section.color} />
                  </div>
                  <div>
                    <p className="font-bold group-hover:text-bmw-blue transition-colors">{section.label}</p>
                    {section.count !== null && (
                      <p className="text-sm text-white/40">{section.count} items</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="mt-8">
            <h3 className="font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                "New member application from David Okello",
                "Event 'Kampala Cars & Coffee' - 15 new registrations",
                "Marketplace listing approved: E46 330i",
                "New partner garage added: AutoHaus Uganda",
                "Forum post reported for review",
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/60 py-2 border-b border-white/5 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-bmw-blue shrink-0" />
                  {activity}
                  <span className="text-[10px] text-white/30 ml-auto">{i + 1}h ago</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
