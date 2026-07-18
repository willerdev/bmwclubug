import { getSql } from "@/lib/db";

export type EventPost = {
  id: string;
  title: string;
  content: string;
  images: string[];
  createdAt: string;
};

export type EventContent = {
  gallery: string[];
  posts: EventPost[];
};

export const emptyEventContent: EventContent = { gallery: [], posts: [] };

export function normalizeEventContent(value: unknown): EventContent {
  if (!value || typeof value !== "object") return emptyEventContent;
  const data = value as Record<string, unknown>;
  const gallery = Array.isArray(data.gallery)
    ? data.gallery.map(String).filter(Boolean).slice(0, 30)
    : [];
  const posts = Array.isArray(data.posts)
    ? data.posts
        .filter((post): post is Record<string, unknown> => Boolean(post && typeof post === "object"))
        .map((post) => ({
          id: String(post.id ?? crypto.randomUUID()),
          title: String(post.title ?? ""),
          content: String(post.content ?? ""),
          images: Array.isArray(post.images)
            ? post.images.map(String).filter(Boolean).slice(0, 30)
            : [],
          createdAt: String(post.createdAt ?? new Date().toISOString()),
        }))
    : [];
  return { gallery, posts };
}

export async function getEventContent(eventId: string): Promise<EventContent> {
  const sql = getSql();
  const key = `event_content_${eventId}`;
  const rows = await sql`SELECT value FROM site_settings WHERE key = ${key} LIMIT 1`;
  return normalizeEventContent(rows[0]?.value);
}

export async function saveEventContent(eventId: string, content: EventContent) {
  const sql = getSql();
  const key = `event_content_${eventId}`;
  const normalized = normalizeEventContent(content);
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, ${JSON.stringify(normalized)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = NOW()
  `;
  return normalized;
}

export async function deleteEventContent(eventId: string) {
  const sql = getSql();
  const key = `event_content_${eventId}`;
  await sql`DELETE FROM site_settings WHERE key = ${key}`;
}
