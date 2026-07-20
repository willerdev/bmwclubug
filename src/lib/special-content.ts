import { getSql } from "@/lib/db";

export type SpecialItem = {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
};

const SETTINGS_KEY = "special_items";

export function normalizeSpecialItems(value: unknown): SpecialItem[] {
  const list = Array.isArray(value)
    ? value
    : value && typeof value === "object" && Array.isArray((value as { items?: unknown }).items)
      ? (value as { items: unknown[] }).items
      : [];

  return list
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => {
      const mediaUrl = String(item.mediaUrl ?? item.url ?? "");
      const mime = String(item.mime ?? item.mediaType ?? "");
      const mediaType: "image" | "video" =
        mime === "video" || mime.startsWith("video/")
          ? "video"
          : mediaUrl.match(/\.(mp4|webm|mov|m4v)(\?|$)/i)
            ? "video"
            : "image";
      return {
        id: String(item.id ?? crypto.randomUUID()),
        title: String(item.title ?? ""),
        description: String(item.description ?? ""),
        mediaUrl,
        mediaType,
        createdAt: String(item.createdAt ?? new Date().toISOString()),
      };
    })
    .filter((item) => item.mediaUrl);
}

export async function getSpecialItems(): Promise<SpecialItem[]> {
  const sql = getSql();
  const rows = await sql`SELECT value FROM site_settings WHERE key = ${SETTINGS_KEY} LIMIT 1`;
  return normalizeSpecialItems(rows[0]?.value);
}

export async function saveSpecialItems(items: SpecialItem[]) {
  const sql = getSql();
  const normalized = normalizeSpecialItems(items);
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${SETTINGS_KEY}, ${JSON.stringify({ items: normalized })}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value, updated_at = NOW()
  `;
  return normalized;
}
