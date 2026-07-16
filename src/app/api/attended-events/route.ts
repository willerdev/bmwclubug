import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

function mapAttendedEvent(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    date: String(row.event_date ?? row.date ?? "").slice(0, 10),
    venue: String(row.venue ?? ""),
    district: String(row.district ?? ""),
    poster: String(row.poster_url ?? ""),
    description: String(row.description ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM attended_events
      ORDER BY sort_order ASC, event_date DESC
    `;
    return jsonOk(rows.map((r) => mapAttendedEvent(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load attended events", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) return jsonError("Title is required");

    const sql = getSql();
    const rows = await sql`
      INSERT INTO attended_events (
        title, event_date, venue, district, poster_url, description, sort_order
      ) VALUES (
        ${title},
        ${String(body.date ?? body.event_date ?? new Date().toISOString().slice(0, 10))},
        ${String(body.venue ?? "")},
        ${String(body.district ?? "Kampala")},
        ${String(body.poster ?? body.poster_url ?? "")},
        ${String(body.description ?? "")},
        ${Number(body.sortOrder ?? body.sort_order ?? 0)}
      )
      RETURNING *
    `;
    return jsonOk(mapAttendedEvent(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create attended event", 500);
  }
}
