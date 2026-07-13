"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useApiList } from "@/hooks/useApiData";
import type { Member } from "@/types";
import { MEMBERSHIP_LEVELS, UGANDAN_DISTRICTS } from "@/lib/constants";
import { motion } from "framer-motion";
import { Award, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function MembersPage() {
  const { data: members } = useApiList<Member>("/api/members");
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [level, setLevel] = useState("");
  const [generation, setGeneration] = useState("");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        (m.cars ?? []).some((c) => c.toLowerCase().includes(search.toLowerCase()));
      const matchDistrict = !district || m.district === district;
      const matchLevel = !level || m.membershipLevel === level;
      const matchGen = !generation || (m.cars ?? []).some((c) => c.includes(generation));
      return matchSearch && matchDistrict && matchLevel && matchGen;
    });
  }, [members, search, district, level, generation]);

  return (
    <>
      <PageHeader
        title="Members Directory"
        subtitle={`${members.length} passionate BMW enthusiasts across Uganda`}
      />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <GlassCard className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or BMW model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
                />
              </div>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="px-4 py-3 glass rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              >
                <option value="" className="bg-carbon">All Districts</option>
                {UGANDAN_DISTRICTS.map((d) => (
                  <option key={d} value={d} className="bg-carbon">{d}</option>
                ))}
              </select>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-4 py-3 glass rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              >
                <option value="" className="bg-carbon">All Levels</option>
                {MEMBERSHIP_LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-carbon">{l}</option>
                ))}
              </select>
              <select
                value={generation}
                onChange={(e) => setGeneration(e.target.value)}
                className="px-4 py-3 glass rounded-xl bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-bmw-blue/50"
              >
                <option value="" className="bg-carbon">All Generations</option>
                {["E30", "E36", "E46", "E39", "E60", "F30", "G20", "M2", "M3", "M4", "M5", "X3", "X5", "X6"].map((g) => (
                  <option key={g} value={g} className="bg-carbon">{g}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-white/40 mt-3">{filtered.length} members found</p>
          </GlassCard>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 12) * 0.03 }}
              >
                <Link href={`/members/${member.id}`}>
                  <GlassCard className="group h-full">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="rounded-full object-cover ring-2 ring-bmw-blue/20 group-hover:ring-bmw-blue transition-all"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold truncate group-hover:text-bmw-blue transition-colors">{member.name}</h3>
                        <p className="text-xs text-bmw-blue">{member.membershipLevel}</p>
                        <p className="text-xs text-white/50 truncate mt-1">{(member.cars ?? []).join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
                      <MapPin size={10} /> {member.district}
                      <Award size={10} className="ml-auto" /> {member.yearsInClub}y
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
