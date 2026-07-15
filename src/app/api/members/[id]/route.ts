import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapMember, parseCsvOrArray } from "@/lib/api-helpers";

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
    const badges = parseCsvOrArray(body.badges);
    const awards = parseCsvOrArray(body.awards);
    const cars = parseCsvOrArray(body.cars);
    const gallery = parseCsvOrArray(body.gallery ?? body.gallery_urls);
    const joinedAt = String(body.joinedAt ?? body.joined_at ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10);

    const rows = await sql`
      UPDATE members SET
        name = ${String(body.name ?? "")},
        email = ${String(body.email ?? "")},
        photo_url = ${String(body.photo ?? body.photo_url ?? "")},
        bio = ${String(body.bio ?? "")},
        district = ${String(body.district ?? "")},
        membership_level = ${String(body.membershipLevel ?? body.membership_level ?? "Enthusiast")},
        rank = ${String(body.rank ?? "Active Member")},
        badges = ${badges},
        favorite_route = ${String(body.favoriteRoute ?? body.favorite_route ?? "")},
        cars = ${cars},
        joined_at = ${joinedAt},
        social_instagram = ${String(body.social?.instagram ?? body.socialInstagram ?? body.social_instagram ?? "")},
        social_twitter = ${String(body.social?.twitter ?? body.socialTwitter ?? body.social_twitter ?? "")},
        social_facebook = ${String(body.social?.facebook ?? body.socialFacebook ?? body.social_facebook ?? "")},
        awards = ${awards},
        gallery_urls = ${gallery},
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
