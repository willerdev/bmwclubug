import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      UPDATE gallery_items SET
        image_url = ${String(body.image ?? body.image_url ?? "")},
        category = ${String(body.category ?? "Cars")},
        title = ${String(body.title ?? "")},
        aspect_ratio = ${Number(body.aspectRatio ?? body.aspect_ratio ?? 1)}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(rows[0]);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update gallery item", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM gallery_items WHERE id = ${id}`;
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete gallery item", 500);
  }
}
