import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapGallery } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM gallery_items ORDER BY created_at DESC`;
    return jsonOk(rows.map((r) => mapGallery(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load gallery", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      INSERT INTO gallery_items (image_url, category, title, aspect_ratio)
      VALUES (
        ${String(body.image ?? body.image_url ?? "")},
        ${String(body.category ?? "Cars")},
        ${String(body.title ?? "")},
        ${Number(body.aspectRatio ?? body.aspect_ratio ?? 1)}
      )
      RETURNING *
    `;
    return jsonOk(mapGallery(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create gallery item", 500);
  }
}
