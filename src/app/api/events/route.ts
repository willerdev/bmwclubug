import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapEvent } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM events ORDER BY date DESC`;
    return jsonOk(rows.map((r) => mapEvent(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load events", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      INSERT INTO events (
        title, poster_url, date, time, venue, district, description, status, capacity, registered_count
      ) VALUES (
        ${String(body.title ?? "")},
        ${String(body.poster ?? body.poster_url ?? "")},
        ${String(body.date ?? new Date().toISOString().slice(0, 10))},
        ${String(body.time ?? "")},
        ${String(body.venue ?? "")},
        ${String(body.district ?? "")},
        ${String(body.description ?? "")},
        ${body.status === "past" ? "past" : "upcoming"},
        ${Number(body.maxCapacity ?? body.capacity ?? 50)},
        ${Number(body.registeredCount ?? body.registered_count ?? 0)}
      )
      RETURNING *
    `;
    return jsonOk(mapEvent(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create event", 500);
  }
}
