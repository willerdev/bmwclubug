"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { members, events, marketplaceListings, getMemberById } from "@/data/mock";
import { MEMBERSHIP_LEVELS } from "@/lib/constants";
import { motion } from "framer-motion";
import {
  Award, Bell, Calendar, Car, MessageSquare, QrCode,
  ShoppingBag, Star, User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const demoMember = getMemberById("member-30") ?? members[0];

const BADGE_COLORS: Record<string, string> = {
  Explorer: "from-gray-500 to-gray-700",
  Enthusiast: "from-blue-500 to-blue-700",
  "Premium Member": "from-purple-500 to-purple-700",
  "Club Ambassador": "from-amber-500 to-amber-700",
  "Executive Committee": "from-red-500 to-red-700",
  Founder: "from-bmw-blue to-blue-900",
};

export default function DashboardPage() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "cars", label: "My Cars", icon: Car },
    { id: "events", label: "Events", icon: Calendar },
    { id: "marketplace", label: "Listings", icon: ShoppingBag },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <>
      <PageHeader title="Member Dashboard" subtitle={`Welcome back, ${demoMember.name.split(" ")[0]}`} />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <GlassCard className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image src={demoMember.photo} alt="" fill className="rounded-full object-cover ring-4 ring-bmw-blue/30" sizes="96px" />
                </div>
                <h3 className="font-bold">{demoMember.name}</h3>
                <p className="text-bmw-blue text-sm">{demoMember.membershipLevel}</p>
              </GlassCard>

              <GlassCard className="p-0 overflow-hidden">
                <div className={`p-6 bg-gradient-to-br ${BADGE_COLORS[demoMember.membershipLevel]} text-center`}>
                  <QrCode size={80} className="mx-auto mb-3 opacity-80" />
                  <p className="font-bold text-sm">Membership Pass</p>
                  <p className="text-xs opacity-70 mt-1">BCU-{demoMember.id.replace("member-", "").padStart(4, "0")}</p>
                </div>
              </GlassCard>

              <div className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                      tab === id ? "glass-strong text-bmw-blue" : "hover:bg-white/5 text-white/60"
                    }`}
                  >
                    <Icon size={18} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {tab === "overview" && (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Events Attended", value: demoMember.eventHistory.length, icon: Calendar },
                      { label: "BMWs Owned", value: demoMember.cars.length, icon: Car },
                      { label: "Badges Earned", value: demoMember.badges.length, icon: Award },
                      { label: "Notifications", value: 3, icon: Bell },
                    ].map((stat) => (
                      <GlassCard key={stat.label} className="text-center">
                        <stat.icon size={24} className="text-bmw-blue mx-auto mb-2" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-white/40">{stat.label}</div>
                      </GlassCard>
                    ))}
                  </div>

                  <GlassCard>
                    <h3 className="font-bold mb-4">Membership Levels</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MEMBERSHIP_LEVELS.map((level) => (
                        <motion.div
                          key={level}
                          whileHover={{ scale: 1.05 }}
                          className={`p-4 rounded-xl text-center bg-gradient-to-br ${BADGE_COLORS[level]} ${
                            level === demoMember.membershipLevel ? "ring-2 ring-white/50" : "opacity-50"
                          }`}
                        >
                          <Star size={20} className="mx-auto mb-2" />
                          <p className="text-xs font-bold">{level}</p>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <h3 className="font-bold mb-3">Achievement Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      {demoMember.badges.map((badge) => (
                        <span key={badge} className="flex items-center gap-1 glass px-3 py-2 rounded-full text-sm">
                          <Award size={14} className="text-bmw-blue" /> {badge}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </>
              )}

              {tab === "cars" && (
                <GlassCard>
                  <h3 className="font-bold mb-4">My BMWs</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {demoMember.cars.map((car) => (
                      <div key={car} className="glass p-4 rounded-xl flex items-center gap-4">
                        <Car size={32} className="text-bmw-blue" />
                        <div>
                          <p className="font-bold">{car}</p>
                          <p className="text-xs text-white/40">Registered with club</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4">Add Vehicle</Button>
                </GlassCard>
              )}

              {tab === "events" && (
                <GlassCard>
                  <h3 className="font-bold mb-4">Event Registrations</h3>
                  <div className="space-y-3">
                    {events.filter((e) => e.status === "upcoming").slice(0, 4).map((event) => (
                      <div key={event.id} className="flex items-center gap-4 glass p-3 rounded-xl">
                        <Calendar size={20} className="text-bmw-blue shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{event.title}</p>
                          <p className="text-xs text-white/40">{event.date}</p>
                        </div>
                        <span className="text-xs text-green-400">Registered</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {tab === "marketplace" && (
                <GlassCard>
                  <h3 className="font-bold mb-4">My Listings</h3>
                  <div className="space-y-3">
                    {marketplaceListings.filter((l) => l.sellerId === demoMember.id).slice(0, 3).map((listing) => (
                      <div key={listing.id} className="flex items-center gap-4 glass p-3 rounded-xl">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={listing.images[0]} alt="" fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{listing.title}</p>
                          <p className="text-xs text-bmw-blue">{listing.price.toLocaleString()} UGX</p>
                        </div>
                      </div>
                    ))}
                    {marketplaceListings.filter((l) => l.sellerId === demoMember.id).length === 0 && (
                      <p className="text-white/40 text-sm">No active listings. Create one in the Marketplace.</p>
                    )}
                  </div>
                  <Button variant="outline" className="mt-4">Create Listing</Button>
                </GlassCard>
              )}

              {tab === "messages" && (
                <GlassCard>
                  <h3 className="font-bold mb-4">Messages</h3>
                  <div className="space-y-3">
                    {["Event reminder: Kampala Cars & Coffee", "New garage partner in Entebbe", "Your listing received an inquiry"].map((msg, i) => (
                      <div key={i} className="flex items-center gap-4 glass p-3 rounded-xl">
                        <MessageSquare size={18} className="text-bmw-blue shrink-0" />
                        <p className="text-sm flex-1">{msg}</p>
                        <span className="text-[10px] text-white/30">{i + 1}h ago</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
