import { PageHeader } from "@/components/ui/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getListingById, marketplaceListings } from "@/data/mock";
import { formatPrice } from "@/lib/utils";
import { MapPin, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return marketplaceListings.slice(0, 10).map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing Not Found" };
  return { title: listing.title, description: listing.description };
}

export default async function MarketplaceDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const related = marketplaceListings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 4);

  return (
    <>
      <PageHeader title={listing.title} subtitle={listing.category} />

      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="600px" priority />
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={img} alt="" fill className="object-cover" sizes="150px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <GlassCard>
                <p className="text-3xl font-bold text-bmw-blue">{formatPrice(listing.price)}</p>
                <div className="flex gap-2 mt-3">
                  <span className="glass px-3 py-1 rounded-full text-xs">{listing.condition}</span>
                  <span className="glass px-3 py-1 rounded-full text-xs">{listing.category}</span>
                </div>
                <div className="mt-4 space-y-2 text-sm text-white/60">
                  <div className="flex items-center gap-2"><Tag size={14} className="text-bmw-blue" /> Seller: {listing.seller}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-bmw-blue" /> {listing.location}</div>
                </div>
                <Button className="mt-6 w-full">Contact Seller</Button>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold mb-3">Description</h3>
                <p className="text-white/70 leading-relaxed">{listing.description}</p>
              </GlassCard>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Related Listings</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map((item) => (
                  <Link key={item.id} href={`/marketplace/${item.id}`}>
                    <GlassCard className="p-0 overflow-hidden group">
                      <div className="relative h-32 overflow-hidden">
                        <Image src={item.images[0]} alt={item.title} fill className="object-cover" sizes="250px" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-semibold truncate group-hover:text-bmw-blue transition-colors">{item.title}</h4>
                        <p className="text-bmw-blue font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
