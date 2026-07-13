import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function GET() {
  const unauthorized = await requireAdmin("view");
  if (unauthorized) return unauthorized;
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, filename, mime, created_at FROM media ORDER BY created_at DESC LIMIT 100
    `;
    return jsonOk(
      rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        mime: r.mime,
        url: `/api/media/${r.id}`,
        created_at: r.created_at,
      }))
    );
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load media", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("file is required");
    if (file.size > 8 * 1024 * 1024) return jsonError("File too large (max 8MB)");
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "application/octet-stream";
    const sql = getSql();
    const rows = await sql`
      INSERT INTO media (filename, mime, data)
      VALUES (${file.name}, ${mime}, ${buffer})
      RETURNING id, filename, mime, created_at
    `;
    const row = rows[0];
    return jsonOk(
      {
        id: row.id,
        filename: row.filename,
        mime: row.mime,
        url: `/api/media/${row.id}`,
        created_at: row.created_at,
      },
      201
    );
  } catch (error) {
    console.error(error);
    return jsonError("Failed to upload media", 500);
  }
}
