import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapGarage } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM garages ORDER BY name ASC`;
    return jsonOk(rows.map((r) => mapGarage(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load garages", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const services = Array.isArray(body.services)
      ? body.services.map(String)
      : String(body.services ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    const rows = await sql`
      INSERT INTO garages (
        name, logo_url, cover_url, services, phone, email, hours,
        location, district, rating, reviews, lat, lng
      ) VALUES (
        ${String(body.name ?? "")},
        ${String(body.logo ?? body.logo_url ?? "")},
        ${String(body.cover ?? body.cover_url ?? "")},
        ${services},
        ${String(body.phone ?? "")},
        ${String(body.email ?? "")},
        ${String(body.hours ?? "")},
        ${String(body.location ?? "")},
        ${String(body.district ?? "")},
        ${Number(body.rating ?? 4.5)},
        ${Number(body.reviews ?? 0)},
        ${Number(body.lat ?? 0.3476)},
        ${Number(body.lng ?? 32.5825)}
      )
      RETURNING *
    `;
    return jsonOk(mapGarage(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create garage", 500);
  }
}
