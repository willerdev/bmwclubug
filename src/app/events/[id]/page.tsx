import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiveCountdown } from "@/components/ui/LiveCountdown";
import { EventRegisterForm } from "@/components/events/EventRegisterForm";
import { fetchEventById, fetchEvents } from "@/lib/public-data";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const events = await fetchEvents();
    return events.slice(0, 20).map((e) => ({ id: String(e.id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const event = await fetchEventById(id);
    if (!event) return { title: "Event Not Found" };
    return { title: event.title, description: event.description };
  } catch {
    return { title: "Event" };
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await fetchEventById(id);
  if (!event) notFound();

  const gallery = event.gallery?.length ? event.gallery : [event.poster].filter(Boolean);
  const posts = event.posts ?? [];
  const lat = event.location?.lat ?? 0.3476;
  const lng = event.location?.lng ?? 32.5825;
  const spotsLeft =
    event.maxCapacity > 0 ? Math.max(0, event.maxCapacity - event.registeredCount) : null;

  return (
    <>
      <PageHeader title={event.title} subtitle={`${event.district}, Uganda`} />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
                <Image
                  src={event.poster}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="800px"
                  priority
                  unoptimized={event.poster.startsWith("/api/media")}
                />
              </div>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">About This Event</h3>
                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Event Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gallery.map((img, i) => (
                    <div key={`${img}-${i}`} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={img}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="200px"
                        unoptimized={img.startsWith("/api/media")}
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>

              {posts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl">Event Updates</h3>
                  {posts.map((post) => (
                    <GlassCard key={post.id} className="space-y-3">
                      <div>
                        <h4 className="font-bold text-lg">{post.title || "Update"}</h4>
                        <p className="text-xs text-white/40 mt-1">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {post.content && (
                        <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      )}
                      {post.images?.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {post.images.map((img, i) => (
                            <div key={`${img}-${i}`} className="relative aspect-square rounded-xl overflow-hidden">
                              <Image
                                src={img}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="220px"
                                unoptimized={img.startsWith("/api/media")}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <GlassCard>
                <h3 className="font-bold text-lg mb-4">Event Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-bmw-blue" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-bmw-blue" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-bmw-blue" />
                    <span>
                      {event.venue}, {event.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-bmw-blue" />
                    <span>
                      {event.registeredCount} / {event.maxCapacity} registered
                      {spotsLeft !== null ? ` · ${spotsLeft} spots left` : ""}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {event.status === "upcoming" && (
                <GlassCard className="text-center space-y-4">
                  <div>
                    <h3 className="font-bold mb-4">Countdown</h3>
                    <LiveCountdown date={event.date} time={event.time} variant="grid" />
                  </div>
                  {spotsLeft === 0 ? (
                    <p className="text-white/50 text-sm">This event is fully booked.</p>
                  ) : (
                    <EventRegisterForm eventId={event.id} eventTitle={event.title} />
                  )}
                </GlassCard>
              )}

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Location</h3>
                <div className="aspect-video rounded-xl bg-carbon flex items-center justify-center text-white/30 text-sm">
                  Map: {lat.toFixed(2)}, {lng.toFixed(2)}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
