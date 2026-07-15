import { NextRequest } from "next/server";
import { requireBlogSession, isBloggerOnly } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { mapBlogPost, slugify } from "@/lib/blog";
import { MAX_BLOG_IMAGES } from "@/lib/media-limits";

export async function GET(req: NextRequest) {
  const adminAll = req.nextUrl.searchParams.get("all") === "1";
  try {
    const sql = getSql();
    if (adminAll) {
      const { session, error } = await requireBlogSession();
      if (error) return error;
      const rows = isBloggerOnly(session!)
        ? await sql`
            SELECT * FROM blog_posts
            WHERE author_id = ${session!.id}
            ORDER BY created_at DESC
          `
        : await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
      return jsonOk(rows.map((r) => mapBlogPost(r as Record<string, unknown>)));
    }
    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE is_published = TRUE
      ORDER BY created_at DESC
    `;
    return jsonOk(rows.map((r) => mapBlogPost(r as Record<string, unknown>)));
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load blog posts", 500);
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireBlogSession();
  if (error) return error;
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    const content = String(body.content ?? "").trim();
    if (!title) return jsonError("Title is required");
    if (!content && !(Array.isArray(body.mediaUrls) && body.mediaUrls.length) && !body.videoUrl) {
      return jsonError("Add story text, photos, or a video");
    }

    const mediaUrls = Array.isArray(body.mediaUrls)
      ? body.mediaUrls.map(String).filter(Boolean).slice(0, MAX_BLOG_IMAGES)
      : [];
    const postType = ["update", "story", "photo", "video"].includes(body.postType)
      ? body.postType
      : mediaUrls.length
        ? "photo"
        : body.videoUrl
          ? "video"
          : "update";
    const excerpt = String(body.excerpt ?? content.slice(0, 160));
    const coverUrl = String(body.coverUrl ?? mediaUrls[0] ?? "");
    const slug = slugify(title);

    const sql = getSql();
    const rows = await sql`
      INSERT INTO blog_posts (
        author_id, author_name, title, slug, excerpt, content,
        cover_url, media_urls, video_url, post_type, is_published
      ) VALUES (
        ${session!.id},
        ${session!.name || session!.email},
        ${title},
        ${slug},
        ${excerpt},
        ${content},
        ${coverUrl},
        ${mediaUrls},
        ${String(body.videoUrl ?? "")},
        ${postType},
        ${body.isPublished !== false}
      )
      RETURNING *
    `;
    const post = mapBlogPost(rows[0] as Record<string, unknown>);
    await logActivity(session, "create", "blog_posts", post.id, { title, postType });
    return jsonOk(post, 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create post", 500);
  }
}
