import { NextResponse } from "next/server";
import type { GalleryItem, Member } from "@/types";
import { yearsSinceJoined } from "@/lib/utils";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function mapEvent(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    poster: String(row.poster_url ?? ""),
    date: String(row.date).slice(0, 10),
    time: String(row.time ?? ""),
    venue: String(row.venue ?? ""),
    district: String(row.district ?? ""),
    description: String(row.description ?? ""),
    status: (row.status === "past" ? "past" : "upcoming") as "upcoming" | "past",
    maxCapacity: Number(row.capacity ?? 0),
    registeredCount: Number(row.registered_count ?? 0),
    gallery: [String(row.poster_url ?? "")].filter(Boolean),
    location: { lat: 0.3476, lng: 32.5825 },
  };
}

export function mapPartner(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    logo: String(row.logo_url ?? ""),
    category: String(row.category ?? ""),
  };
}

export function mapGarage(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    logo: String(row.logo_url ?? ""),
    cover: String(row.cover_url ?? ""),
    services: Array.isArray(row.services) ? row.services.map(String) : [],
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    hours: String(row.hours ?? ""),
    location: String(row.location ?? ""),
    district: String(row.district ?? ""),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    lat: Number(row.lat),
    lng: Number(row.lng),
  };
}

export function mapProduct(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    image: String(row.image_url ?? ""),
    category: String(row.category ?? ""),
    description: String(row.description ?? ""),
    price: Number(row.price ?? 0),
  };
}

export function parseCsvOrArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((s) => s.trim()).filter(Boolean);
  }
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mapMember(row: Record<string, unknown>) {
  const joinedAt = row.joined_at
    ? String(row.joined_at).slice(0, 10)
    : row.created_at
      ? String(row.created_at).slice(0, 10)
      : "";

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    photo: String(row.photo_url ?? ""),
    bio: String(row.bio ?? ""),
    district: String(row.district ?? ""),
    membershipLevel: row.membership_level as Member["membershipLevel"],
    joinedAt,
    yearsInClub: yearsSinceJoined(joinedAt),
    rank: String(row.rank ?? ""),
    badges: Array.isArray(row.badges) ? row.badges.map(String) : [],
    favoriteRoute: String(row.favorite_route ?? ""),
    cars: Array.isArray(row.cars) ? row.cars.map(String) : [],
    garage: undefined as string | undefined,
    social: {
      instagram: String(row.social_instagram ?? "") || undefined,
      twitter: String(row.social_twitter ?? "") || undefined,
      facebook: String(row.social_facebook ?? "") || undefined,
    } as Member["social"],
    friends: [] as string[],
    awards: Array.isArray(row.awards) ? row.awards.map(String) : [],
    eventHistory: [] as string[],
    gallery: Array.isArray(row.gallery_urls) ? row.gallery_urls.map(String) : [],
  };
}

export function mapGallery(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    image: String(row.image_url ?? ""),
    category: String(row.category ?? "Cars") as GalleryItem["category"],
    title: String(row.title ?? ""),
    aspectRatio: Number(row.aspect_ratio) || 1,
  };
}
