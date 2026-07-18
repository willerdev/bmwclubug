import { getSql } from "@/lib/db";
import {
  mapEvent,
  mapGallery,
  mapGarage,
  mapMember,
  mapPartner,
  mapProduct,
} from "@/lib/api-helpers";
import { getEventContent } from "@/lib/event-content";
import type {
  Event,
  GalleryItem,
  Garage,
  Member,
  Partner,
  ShopProduct,
} from "@/types";

export async function fetchEvents(): Promise<Event[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM events ORDER BY date DESC`;
  return rows.map((r) => mapEvent(r as Record<string, unknown>) as Event);
}

export async function fetchEventById(id: string): Promise<(Event & { posts?: { id: string; title: string; content: string; images: string[]; createdAt: string }[] }) | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM events WHERE id = ${id}`;
  if (!rows[0]) return null;
  const event = mapEvent(rows[0] as Record<string, unknown>) as Event;
  const content = await getEventContent(id);
  return {
    ...event,
    gallery: content.gallery.length ? content.gallery : event.gallery,
    posts: content.posts,
  };
}

export async function fetchMembers(): Promise<Member[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM members ORDER BY name ASC`;
  return rows.map((r) => mapMember(r as Record<string, unknown>) as Member);
}

export async function fetchMemberById(id: string): Promise<Member | null> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM members WHERE id = ${id}`;
  if (!rows[0]) return null;
  return mapMember(rows[0] as Record<string, unknown>) as Member;
}

export async function fetchProducts(): Promise<ShopProduct[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  return rows.map((r) => mapProduct(r as Record<string, unknown>) as ShopProduct);
}

export async function fetchPartners(): Promise<Partner[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM partners ORDER BY name ASC`;
  return rows.map((r) => mapPartner(r as Record<string, unknown>) as Partner);
}

export async function fetchGarages(): Promise<Garage[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM garages ORDER BY name ASC`;
  return rows.map((r) => mapGarage(r as Record<string, unknown>) as Garage);
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const sql = getSql();
  const rows = await sql`SELECT * FROM gallery_items ORDER BY created_at DESC`;
  return rows.map((r) => mapGallery(r as Record<string, unknown>) as GalleryItem);
}

export async function fetchSettings(): Promise<Record<string, unknown>> {
  const sql = getSql();
  const rows = await sql`SELECT key, value FROM site_settings`;
  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    settings[String(row.key)] = row.value;
  }
  return settings;
}
