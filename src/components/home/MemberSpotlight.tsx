"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useApiList } from "@/hooks/useApiData";
import type { Member } from "@/types";
import { motion } from "framer-motion";
import { Award, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MemberSpotlight() {
  const { data: members } = useApiList<Member>("/api/members");
  const spotlight = members
    .filter(
      (m) =>
        ["Founder", "Club Ambassador", "Premium Member"].includes(m.membershipLevel) ||
        m.rank === "President" ||
        m.rank === "Partner Garage" ||
        m.rank === "Partner Business"
    )
    .slice(0, 6);
  const display = spotlight.length > 0 ? spotlight : members.slice(0, 6);

  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 metallic-gradient opacity-50" />
      <div className="container-custom relative">
        <SectionHeading
          title="Member Spotlight"
          subtitle="Meet the passionate enthusiasts who make our community extraordinary"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/members/${member.id}`}>
                <GlassCard className="text-center group">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover ring-2 ring-bmw-blue/30 group-hover:ring-bmw-blue transition-all"
                      sizes="96px"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 glass-panel rounded-full flex items-center justify-center border border-bmw-red/30">
                      <Star size={14} className="text-bmw-red" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-bmw-blue transition-colors">{member.name}</h3>
                  <p className="text-bmw-blue text-sm mt-1">{member.membershipLevel}</p>
                  <p className="text-white/60 text-sm mt-2">{(member.cars ?? [])[0]}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-white/40">
                    <Award size={12} />
                    {member.yearsInClub} years in club
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 mt-3">
                    {(member.badges ?? []).slice(0, 3).map((badge) => (
                      <span key={badge} className="text-[10px] glass px-2 py-0.5 rounded-full text-white/60">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/40 mt-3 flex items-center justify-center gap-1">
                    <MapPin size={10} />
                    {member.favoriteRoute}
                  </p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
