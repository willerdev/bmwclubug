import { NextRequest } from "next/server";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getPostByIdOrSlug } from "@/lib/blog";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const post = await getPostByIdOrSlug(id);
    if (!post || !post.isPublished) return jsonError("Not found", 404);
    const sql = getSql();
    const rows = await sql`
      SELECT id, author_name, content, created_at
      FROM blog_comments
      WHERE post_id = ${post.id}
      ORDER BY created_at DESC
    `;
    return jsonOk(
      rows.map((r) => ({
        id: String(r.id),
        authorName: String(r.author_name ?? ""),
        content: String(r.content ?? ""),
        createdAt: r.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load comments", 500);
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const post = await getPostByIdOrSlug(id);
    if (!post || !post.isPublished) return jsonError("Not found", 404);
    const body = await req.json();
    const authorName = String(body.authorName ?? "").trim().slice(0, 80);
    const content = String(body.content ?? "").trim().slice(0, 2000);
    if (!authorName || !content) return jsonError("Name and comment are required");

    const sql = getSql();
    const rows = await sql`
      INSERT INTO blog_comments (post_id, author_name, content)
      VALUES (${post.id}, ${authorName}, ${content})
      RETURNING id, author_name, content, created_at
    `;
    await sql`UPDATE blog_posts SET comments_count = comments_count + 1 WHERE id = ${post.id}`;
    return jsonOk(
      {
        id: String(rows[0].id),
        authorName: String(rows[0].author_name),
        content: String(rows[0].content),
        createdAt: rows[0].created_at,
      },
      201
    );
  } catch (err) {
    console.error(err);
    return jsonError("Failed to post comment", 500);
  }
}
