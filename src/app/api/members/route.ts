import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapMember, parseCsvOrArray } from "@/lib/api-helpers";

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
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const badges = parseCsvOrArray(body.badges);
    const awards = parseCsvOrArray(body.awards);
    const cars = parseCsvOrArray(body.cars);
    const gallery = parseCsvOrArray(body.gallery ?? body.gallery_urls);
    const joinedAt = String(body.joinedAt ?? body.joined_at ?? "").slice(0, 10) || new Date().toISOString().slice(0, 10);
    const badgesJson = JSON.stringify(badges);
    const awardsJson = JSON.stringify(awards);
    const carsJson = JSON.stringify(cars);
    const galleryJson = JSON.stringify(gallery);

    const rows = await sql`
      INSERT INTO members (
        name, email, photo_url, bio, district, membership_level,
        years_in_club, rank, badges, favorite_route, cars,
        joined_at, social_instagram, social_twitter, social_facebook, awards, gallery_urls
      ) VALUES (
        ${String(body.name ?? "")},
        ${String(body.email ?? "")},
        ${String(body.photo ?? body.photo_url ?? "")},
        ${String(body.bio ?? "")},
        ${String(body.district ?? "")},
        ${String(body.membershipLevel ?? body.membership_level ?? "Enthusiast")},
        ${0},
        ${String(body.rank ?? "Active Member")},
        COALESCE((SELECT array_agg(v) FROM jsonb_array_elements_text(${badgesJson}::jsonb) AS t(v)), '{}'::text[]),
        ${String(body.favoriteRoute ?? body.favorite_route ?? "")},
        COALESCE((SELECT array_agg(v) FROM jsonb_array_elements_text(${carsJson}::jsonb) AS t(v)), '{}'::text[]),
        ${joinedAt},
        ${String(body.social?.instagram ?? body.socialInstagram ?? body.social_instagram ?? "")},
        ${String(body.social?.twitter ?? body.socialTwitter ?? body.social_twitter ?? "")},
        ${String(body.social?.facebook ?? body.socialFacebook ?? body.social_facebook ?? "")},
        COALESCE((SELECT array_agg(v) FROM jsonb_array_elements_text(${awardsJson}::jsonb) AS t(v)), '{}'::text[]),
        COALESCE((SELECT array_agg(v) FROM jsonb_array_elements_text(${galleryJson}::jsonb) AS t(v)), '{}'::text[])
      )
      RETURNING *
    `;
    return jsonOk(mapMember(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create member", 500);
  }
}
