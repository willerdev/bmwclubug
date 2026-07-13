import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapMember } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    const rows = await sql`SELECT * FROM members WHERE id = ${id}`;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapMember(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load member", 500);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
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
      UPDATE members SET
        name = ${String(body.name ?? "")},
        email = ${String(body.email ?? "")},
        photo_url = ${String(body.photo ?? body.photo_url ?? "")},
        bio = ${String(body.bio ?? "")},
        district = ${String(body.district ?? "")},
        membership_level = ${String(body.membershipLevel ?? body.membership_level ?? "Enthusiast")},
        years_in_club = ${Number(body.yearsInClub ?? body.years_in_club ?? 1)},
        rank = ${String(body.rank ?? "Active Member")},
        badges = ${badges},
        favorite_route = ${String(body.favoriteRoute ?? body.favorite_route ?? "")},
        cars = ${cars},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapMember(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update member", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM members WHERE id = ${id}`;
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete member", 500);
  }
}
