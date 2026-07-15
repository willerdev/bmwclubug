import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

function mapRegistration(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    eventId: String(row.event_id),
    eventTitle: String(row.event_title ?? ""),
    fullName: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    guests: Number(row.guests ?? 1),
    notes: String(row.notes ?? ""),
    status: String(row.status ?? "pending"),
    createdAt: row.created_at,
  };
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const status = String(body.status ?? "pending");
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return jsonError("Invalid status");
    }
    const sql = getSql();
    const rows = await sql`
      UPDATE event_registrations SET
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapRegistration(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update registration", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    const existing = await sql`SELECT * FROM event_registrations WHERE id = ${id}`;
    if (!existing[0]) return jsonError("Not found", 404);
    const row = existing[0] as { event_id: string; guests: number; status: string };
    await sql`DELETE FROM event_registrations WHERE id = ${id}`;
    if (row.status !== "cancelled") {
      await sql`
        UPDATE events SET
          registered_count = GREATEST(0, registered_count - ${Number(row.guests ?? 1)}),
          updated_at = NOW()
        WHERE id = ${row.event_id}
      `;
    }
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete registration", 500);
  }
}
