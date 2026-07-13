import { NextRequest } from "next/server";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getPostByIdOrSlug } from "@/lib/blog";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const post = await getPostByIdOrSlug(id);
    if (!post || !post.isPublished) return jsonError("Not found", 404);

    const body = await req.json().catch(() => ({}));
    const visitorKey = String(body.visitorKey ?? "").trim().slice(0, 120);
    if (!visitorKey) return jsonError("Missing visitor key");

    const sql = getSql();
    const existing = await sql`
      SELECT id FROM blog_likes WHERE post_id = ${post.id} AND visitor_key = ${visitorKey} LIMIT 1
    `;
    if (existing[0]) {
      await sql`DELETE FROM blog_likes WHERE post_id = ${post.id} AND visitor_key = ${visitorKey}`;
      await sql`
        UPDATE blog_posts SET likes_count = GREATEST(likes_count - 1, 0)
        WHERE id = ${post.id}
      `;
      const rows = await sql`SELECT likes_count FROM blog_posts WHERE id = ${post.id}`;
      return jsonOk({ liked: false, likesCount: Number(rows[0]?.likes_count ?? 0) });
    }

    await sql`
      INSERT INTO blog_likes (post_id, visitor_key)
      VALUES (${post.id}, ${visitorKey})
    `;
    await sql`UPDATE blog_posts SET likes_count = likes_count + 1 WHERE id = ${post.id}`;
    const rows = await sql`SELECT likes_count FROM blog_posts WHERE id = ${post.id}`;
    return jsonOk({ liked: true, likesCount: Number(rows[0]?.likes_count ?? 0) });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to like post", 500);
  }
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const post = await getPostByIdOrSlug(id);
    if (!post) return jsonError("Not found", 404);
    const visitorKey = req.nextUrl.searchParams.get("visitorKey") || "";
    const sql = getSql();
    let liked = false;
    if (visitorKey) {
      const rows = await sql`
        SELECT id FROM blog_likes WHERE post_id = ${post.id} AND visitor_key = ${visitorKey} LIMIT 1
      `;
      liked = Boolean(rows[0]);
    }
    return jsonOk({ likesCount: post.likesCount, liked });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load likes", 500);
  }
}
