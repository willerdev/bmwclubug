import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapGarage } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const sql = getSql();
    const services = Array.isArray(body.services)
      ? body.services.map(String)
      : String(body.services ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    const rows = await sql`
      UPDATE garages SET
        name = ${String(body.name ?? "")},
        logo_url = ${String(body.logo ?? body.logo_url ?? "")},
        cover_url = ${String(body.cover ?? body.cover_url ?? "")},
        services = ${services},
        phone = ${String(body.phone ?? "")},
        email = ${String(body.email ?? "")},
        hours = ${String(body.hours ?? "")},
        location = ${String(body.location ?? "")},
        district = ${String(body.district ?? "")},
        rating = ${Number(body.rating ?? 4.5)},
        reviews = ${Number(body.reviews ?? 0)},
        lat = ${Number(body.lat ?? 0.3476)},
        lng = ${Number(body.lng ?? 32.5825)},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapGarage(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update garage", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM garages WHERE id = ${id}`;
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete garage", 500);
  }
}
