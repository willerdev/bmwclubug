import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

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

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin("view");
  if (unauthorized) return unauthorized;
  try {
    const status = req.nextUrl.searchParams.get("status");
    const eventId = req.nextUrl.searchParams.get("eventId");
    const sql = getSql();
    let rows;
    if (eventId && status) {
      rows = await sql`
        SELECT * FROM event_registrations
        WHERE event_id = ${eventId} AND status = ${status}
        ORDER BY created_at DESC
      `;
    } else if (eventId) {
      rows = await sql`
        SELECT * FROM event_registrations
        WHERE event_id = ${eventId}
        ORDER BY created_at DESC
      `;
    } else if (status) {
      rows = await sql`
        SELECT * FROM event_registrations
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`SELECT * FROM event_registrations ORDER BY created_at DESC`;
    }
    return jsonOk(rows.map((r) => mapRegistration(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load event registrations", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventId = String(body.eventId ?? "").trim();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const guests = Math.min(10, Math.max(1, Number(body.guests ?? 1) || 1));
    const notes = String(body.notes ?? "").trim();

    if (!eventId) return jsonError("Event is required");
    if (!fullName) return jsonError("Full name is required");
    if (!email) return jsonError("Email is required");
    if (!phone) return jsonError("Phone is required");

    const sql = getSql();
    const events = await sql`SELECT id, title, status, capacity, registered_count FROM events WHERE id = ${eventId}`;
    const event = events[0] as
      | { id: string; title: string; status: string; capacity: number; registered_count: number }
      | undefined;
    if (!event) return jsonError("Event not found", 404);
    if (event.status !== "upcoming") return jsonError("Registration is closed for this event");

    const capacity = Number(event.capacity ?? 0);
    const registered = Number(event.registered_count ?? 0);
    if (capacity > 0 && registered + guests > capacity) {
      return jsonError("Not enough spots left for this event");
    }

    const eventTitle = String(body.eventTitle ?? event.title ?? "");

    const rows = await sql`
      INSERT INTO event_registrations (
        event_id, event_title, full_name, email, phone, guests, notes, status
      ) VALUES (
        ${eventId},
        ${eventTitle},
        ${fullName},
        ${email},
        ${phone},
        ${guests},
        ${notes},
        'pending'
      )
      RETURNING *
    `;

    await sql`
      UPDATE events SET
        registered_count = registered_count + ${guests},
        updated_at = NOW()
      WHERE id = ${eventId}
    `;

    return jsonOk(mapRegistration(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to register for event", 500);
  }
}
