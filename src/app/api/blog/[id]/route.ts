import { NextRequest } from "next/server";
import { requireBlogSession, isBloggerOnly } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getPostByIdOrSlug, mapBlogPost } from "@/lib/blog";
import { MAX_BLOG_IMAGES } from "@/lib/media-limits";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const post = await getPostByIdOrSlug(id);
    if (!post) return jsonError("Not found", 404);
    if (!post.isPublished) {
      const { session, error } = await requireBlogSession();
      if (error || !session) return jsonError("Not found", 404);
      if (isBloggerOnly(session) && post.authorId !== session.id) return jsonError("Not found", 404);
    }
    return jsonOk(post);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load post", 500);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { session, error } = await requireBlogSession();
  if (error) return error;
  try {
    const { id } = await ctx.params;
    const existing = await getPostByIdOrSlug(id);
    if (!existing) return jsonError("Not found", 404);
    if (isBloggerOnly(session!) && existing.authorId !== session!.id) {
      return jsonError("You can only edit your own posts", 403);
    }

    const body = await req.json();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    if (!title) return jsonError("Title is required");

    const mediaUrls = Array.isArray(body.mediaUrls)
      ? body.mediaUrls.map(String).filter(Boolean).slice(0, MAX_BLOG_IMAGES)
      : existing.mediaUrls;
    const postType = ["update", "story", "photo", "video"].includes(body.postType)
      ? body.postType
      : existing.postType;

    const sql = getSql();
    const rows = await sql`
      UPDATE blog_posts SET
        title = ${title},
        excerpt = ${String(body.excerpt ?? content.slice(0, 160))},
        content = ${content},
        cover_url = ${String(body.coverUrl ?? mediaUrls[0] ?? existing.coverUrl)},
        media_urls = ${mediaUrls},
        video_url = ${String(body.videoUrl ?? "")},
        post_type = ${postType},
        is_published = ${body.isPublished !== false},
        updated_at = NOW()
      WHERE id = ${existing.id}
      RETURNING *
    `;
    const post = mapBlogPost(rows[0] as Record<string, unknown>);
    await logActivity(session, "update", "blog_posts", post.id, { title });
    return jsonOk(post);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update post", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, error } = await requireBlogSession();
  if (error) return error;
  try {
    const { id } = await ctx.params;
    const existing = await getPostByIdOrSlug(id);
    if (!existing) return jsonError("Not found", 404);
    if (isBloggerOnly(session!) && existing.authorId !== session!.id) {
      return jsonError("You can only delete your own posts", 403);
    }
    const sql = getSql();
    await sql`DELETE FROM blog_posts WHERE id = ${existing.id}`;
    await logActivity(session, "delete", "blog_posts", existing.id);
    return jsonOk({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to delete post", 500);
  }
}
