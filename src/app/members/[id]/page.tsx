import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { fetchMemberById, fetchMembers } from "@/lib/public-data";
import { Award, Globe, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const members = await fetchMembers();
    return members.map((m) => ({ id: String(m.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const member = await fetchMemberById(id);
    if (!member) return { title: "Member Not Found" };
    return { title: member.name, description: member.bio };
  } catch {
    return { title: "Member" };
  }
}

export default async function MemberProfilePage({ params }: Props) {
  const { id } = await params;
  const member = await fetchMemberById(id);
  if (!member) notFound();

  const cars = member.cars ?? [];
  const badges = member.badges ?? [];
  const awards = member.awards ?? [];
  const gallery = member.gallery ?? [];
  const social = member.social ?? {};

  return (
    <>
      <PageHeader title={member.name} subtitle={member.membershipLevel} />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <GlassCard className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image src={member.photo} alt={member.name} fill className="rounded-full object-cover ring-4 ring-bmw-blue/30" sizes="128px" />
                </div>
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <p className="text-bmw-blue mt-1">{member.membershipLevel}</p>
                <p className="text-white/50 text-sm mt-2 flex items-center justify-center gap-1">
                  <MapPin size={14} /> {member.district}
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  {social.instagram && (
                    <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-bmw-blue transition-colors">
                      <Globe size={18} />
                    </a>
                  )}
                  {social.twitter && (
                    <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-bmw-blue transition-colors">
                      <Share2 size={18} />
                    </a>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-bmw-blue">{member.yearsInClub}</div>
                      <div className="text-xs text-white/40">Years in Club</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-bmw-blue">{cars.length}</div>
                      <div className="text-xs text-white/40">BMWs Owned</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Biography</h3>
                <p className="text-white/70 leading-relaxed">{member.bio}</p>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Cars Owned</h3>
                <div className="flex flex-wrap gap-2">
                  {cars.map((car) => (
                    <span key={car} className="glass px-4 py-2 rounded-full text-sm">{car}</span>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Badges & Awards</h3>
                <div className="flex flex-wrap gap-2">
                  {[...badges, ...awards].map((badge) => (
                    <span key={badge} className="flex items-center gap-1 glass px-3 py-1.5 rounded-full text-sm">
                      <Award size={14} className="text-bmw-blue" /> {badge}
                    </span>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Favorite Route</h3>
                <p className="text-white/70">{member.favoriteRoute}</p>
              </GlassCard>

              {gallery.length > 0 && (
                <GlassCard>
                  <h3 className="font-bold text-lg mb-3">Photo Gallery</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                        <Image src={img} alt="" fill className="object-cover" sizes="200px" />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button href="/members" variant="secondary">Back to Directory</Button>
          </div>
        </div>
      </section>
    </>
  );
}
