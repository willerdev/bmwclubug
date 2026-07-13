import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapMember } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM members ORDER BY name ASC`;
    return jsonOk(rows.map((r) => mapMember(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load members", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const badges = Array.isArray(body.badges) ? body.badges.map(String) : [];
    const cars = Array.isArray(body.cars)
      ? body.cars.map(String)
      : String(body.cars ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    const rows = await sql`
      INSERT INTO members (
        name, email, photo_url, bio, district, membership_level,
        years_in_club, rank, badges, favorite_route, cars
      ) VALUES (
        ${String(body.name ?? "")},
        ${String(body.email ?? "")},
        ${String(body.photo ?? body.photo_url ?? "")},
        ${String(body.bio ?? "")},
        ${String(body.district ?? "")},
        ${String(body.membershipLevel ?? body.membership_level ?? "Enthusiast")},
        ${Number(body.yearsInClub ?? body.years_in_club ?? 1)},
        ${String(body.rank ?? "Active Member")},
        ${badges},
        ${String(body.favoriteRoute ?? body.favorite_route ?? "")},
        ${cars}
      )
      RETURNING *
    `;
    return jsonOk(mapMember(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create member", 500);
  }
}
