import { Button } from "@/components/ui/Button";
import { MemberPhoto } from "@/components/members/MemberPhoto";
import { fetchMemberById, fetchMembers } from "@/lib/public-data";
import { formatMemberTenure } from "@/lib/utils";
import { Award, Car, Globe, MapPin, Navigation, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
  const tenure = formatMemberTenure(member.joinedAt);
  const recognition = [...badges, ...awards];
  const joinedLabel = member.joinedAt
    ? new Date(`${member.joinedAt}T12:00:00`).toLocaleDateString("en-UG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const hasSocial = Boolean(social.instagram || social.twitter || social.facebook);

  return (
    <>
      <section className="relative pt-28 sm:pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bmw-blue/15 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="container-custom relative px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 mx-auto md:mx-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-bmw-blue via-bmw-red/60 to-bmw-blue-light opacity-70 blur-[2px]" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-carbon">
                <MemberPhoto
                  src={member.photo}
                  alt={member.name}
                  className="rounded-full"
                  sizes="176px"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left min-w-0 pb-1">
              <p className="text-bmw-blue text-sm font-medium tracking-wide uppercase">
                {member.membershipLevel}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-1 break-words">
                {member.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-white/55">
                {member.rank && <span>{member.rank}</span>}
                {member.district && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} className="text-bmw-blue" />
                    {member.district}
                  </span>
                )}
                {joinedLabel && <span>Member since {joinedLabel}</span>}
              </div>

              {hasSocial && (
                <div className="flex justify-center md:justify-start gap-2 mt-4">
                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-bmw-blue/40 hover:text-bmw-blue transition-colors"
                      aria-label="Instagram"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                  {social.twitter && (
                    <a
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-bmw-blue/40 hover:text-bmw-blue transition-colors"
                      aria-label="Twitter"
                    >
                      <Share2 size={16} />
                    </a>
                  )}
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-bmw-blue/40 hover:text-bmw-blue transition-colors"
                      aria-label="Facebook"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto md:mx-0">
            <div className="glass-panel rounded-2xl px-4 py-4 text-center">
              <div className="text-2xl font-bold text-bmw-blue">{tenure.short}</div>
              <div className="text-[11px] uppercase tracking-wider text-white/40 mt-1">In Club</div>
            </div>
            <div className="glass-panel rounded-2xl px-4 py-4 text-center">
              <div className="text-2xl font-bold text-bmw-blue">{cars.length}</div>
              <div className="text-[11px] uppercase tracking-wider text-white/40 mt-1">BMWs</div>
            </div>
            <div className="glass-panel rounded-2xl px-4 py-4 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-bmw-blue">{recognition.length}</div>
              <div className="text-[11px] uppercase tracking-wider text-white/40 mt-1">Badges</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-custom max-w-4xl space-y-8">
          {member.bio ? (
            <div>
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-white/70 leading-relaxed text-base sm:text-lg">{member.bio}</p>
            </div>
          ) : null}

          {cars.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Car size={18} className="text-bmw-blue" />
                Cars Owned
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {cars.map((car) => (
                  <div
                    key={car}
                    className="glass-panel rounded-2xl px-5 py-4 flex items-center gap-3 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-bmw-blue/15 flex items-center justify-center shrink-0">
                      <Car size={18} className="text-bmw-blue-light" />
                    </div>
                    <span className="font-medium">{car}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recognition.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award size={18} className="text-bmw-blue" />
                Badges & Awards
              </h2>
              <div className="flex flex-wrap gap-2">
                {recognition.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm border border-bmw-blue/20"
                  >
                    <Award size={14} className="text-bmw-blue" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {member.favoriteRoute && (
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Navigation size={18} className="text-bmw-blue" />
                Favorite Route
              </h2>
              <p className="text-white/70 text-lg">{member.favoriteRoute}</p>
            </div>
          )}

          {gallery.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <div
                    key={`${img}-${i}`}
                    className={`relative overflow-hidden rounded-2xl bg-carbon ${
                      i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto md:min-h-[280px]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${member.name} gallery ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes={i === 0 ? "(max-width: 768px) 100vw, 500px" : "200px"}
                      unoptimized={img.startsWith("/api/media")}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!member.bio && cars.length === 0 && recognition.length === 0 && !member.favoriteRoute && gallery.length === 0 && (
            <p className="text-white/45 text-center py-8">
              Profile details for this member will appear here once added in admin.
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/members" variant="secondary">
              Back to Directory
            </Button>
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium glass border border-bmw-blue/40 text-bmw-blue-light hover:bg-bmw-blue/10 transition-colors"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
