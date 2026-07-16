import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

function mapAttendedEvent(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    date: String(row.event_date ?? "").slice(0, 10),
    venue: String(row.venue ?? ""),
    district: String(row.district ?? ""),
    poster: String(row.poster_url ?? ""),
    description: String(row.description ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      UPDATE attended_events SET
        title = ${String(body.title ?? "")},
        event_date = ${String(body.date ?? body.event_date ?? new Date().toISOString().slice(0, 10))},
        venue = ${String(body.venue ?? "")},
        district = ${String(body.district ?? "")},
        poster_url = ${String(body.poster ?? body.poster_url ?? "")},
        description = ${String(body.description ?? "")},
        sort_order = ${Number(body.sortOrder ?? body.sort_order ?? 0)},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapAttendedEvent(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update attended event", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM attended_events WHERE id = ${id}`;
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete attended event", 500);
  }
}
