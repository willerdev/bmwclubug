import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { CarGallery } from "@/components/cars/CarGallery";
import { getSql } from "@/lib/db";
import { MAX_CAR_IMAGES } from "@/lib/media-limits";
import { Gauge } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SlideCar } from "@/components/cars/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchCar(id: string): Promise<SlideCar | null> {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM slide_cars
      WHERE id = ${id} AND is_published = TRUE
    `;
    if (!rows[0]) return null;
    const row = rows[0] as Record<string, unknown>;
    const images = await sql`
      SELECT image_url FROM slide_car_images
      WHERE car_id = ${id}
      ORDER BY sort_order ASC, created_at ASC
      LIMIT ${MAX_CAR_IMAGES}
    `;
    const urls = images.map((r) => String(r.image_url));
    return {
      id: String(row.id),
      name: String(row.name ?? ""),
      generation: String(row.generation ?? ""),
      year: String(row.year ?? ""),
      engine: String(row.engine ?? ""),
      horsepower: Number(row.horsepower ?? 0),
      owner: String(row.owner ?? ""),
      description: String(row.description ?? ""),
      images: urls,
      image: urls[0] || "",
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = await fetchCar(id);
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.name} · BMW Club Uganda`,
    description: car.description || `${car.generation} ${car.name} — ${car.year}`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = await fetchCar(id);
  if (!car) notFound();

  return (
    <>
      <PageHeader title={car.name} subtitle={`${car.generation} · ${car.year}`} />
      <section className="section-padding pt-0">
        <div className="container-custom max-w-3xl space-y-6">
          <CarGallery car={car} />
          <GlassCard className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span>{car.engine}</span>
              <span className="flex items-center gap-1">
                <Gauge size={14} className="text-bmw-blue" />
                {car.horsepower} HP
              </span>
              <span>Owner: {car.owner}</span>
            </div>
            {car.description ? (
              <p className="text-white/70 leading-relaxed">{car.description}</p>
            ) : (
              <p className="text-white/45 text-sm">Featured member BMW from BMW Club Uganda.</p>
            )}
          </GlassCard>
        </div>
      </section>
    </>
  );
}
