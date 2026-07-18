import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapEvent } from "@/lib/api-helpers";
import { deleteEventContent, getEventContent } from "@/lib/event-content";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    const rows = await sql`SELECT * FROM events WHERE id = ${id}`;
    if (!rows[0]) return jsonError("Not found", 404);
    const content = await getEventContent(id);
    const event = mapEvent(rows[0] as Record<string, unknown>);
    const gallery = content.gallery.length
      ? content.gallery
      : [event.poster].filter(Boolean);
    return jsonOk({ ...event, gallery, posts: content.posts });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load event", 500);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      UPDATE events SET
        title = ${String(body.title ?? "")},
        poster_url = ${String(body.poster ?? body.poster_url ?? "")},
        date = ${String(body.date ?? new Date().toISOString().slice(0, 10))},
        time = ${String(body.time ?? "")},
        venue = ${String(body.venue ?? "")},
        district = ${String(body.district ?? "")},
        description = ${String(body.description ?? "")},
        status = ${body.status === "past" ? "past" : "upcoming"},
        capacity = ${Number(body.maxCapacity ?? body.capacity ?? 50)},
        registered_count = ${Number(body.registeredCount ?? body.registered_count ?? 0)},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapEvent(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update event", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM events WHERE id = ${id}`;
    await deleteEventContent(id);
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete event", 500);
  }
}
