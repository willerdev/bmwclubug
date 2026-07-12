import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getEventById, events } from "@/data/mock";
import { formatDate, getCountdown } from "@/lib/utils";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return events.slice(0, 10).map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) return { title: "Event Not Found" };
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  const countdown = getCountdown(event.date);

  return (
    <>
      <PageHeader title={event.title} subtitle={`${event.district}, Uganda`} />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden">
                <Image src={event.poster} alt={event.title} fill className="object-cover" sizes="800px" priority />
              </div>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">About This Event</h3>
                <p className="text-white/70 leading-relaxed">{event.description}</p>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Event Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {event.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={img} alt="" fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard>
                <h3 className="font-bold text-lg mb-4">Event Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><Calendar size={16} className="text-bmw-blue" /><span>{formatDate(event.date)}</span></div>
                  <div className="flex items-center gap-3"><Clock size={16} className="text-bmw-blue" /><span>{event.time}</span></div>
                  <div className="flex items-center gap-3"><MapPin size={16} className="text-bmw-blue" /><span>{event.venue}, {event.district}</span></div>
                  <div className="flex items-center gap-3"><Users size={16} className="text-bmw-blue" /><span>{event.registeredCount} / {event.maxCapacity} registered</span></div>
                </div>
              </GlassCard>

              {event.status === "upcoming" && (
                <GlassCard className="text-center">
                  <h3 className="font-bold mb-4">Countdown</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { v: countdown.days, l: "Days" },
                      { v: countdown.hours, l: "Hours" },
                      { v: countdown.minutes, l: "Min" },
                      { v: countdown.seconds, l: "Sec" },
                    ].map((u) => (
                      <div key={u.l}>
                        <div className="text-2xl font-bold text-bmw-blue">{u.v}</div>
                        <div className="text-[10px] text-white/40">{u.l}</div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full">Register Now</Button>
                </GlassCard>
              )}

              <GlassCard>
                <h3 className="font-bold text-lg mb-3">Location</h3>
                <div className="aspect-video rounded-xl bg-carbon flex items-center justify-center text-white/30 text-sm">
                  Map: {event.location.lat.toFixed(2)}, {event.location.lng.toFixed(2)}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
