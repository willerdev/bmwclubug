import { getSql } from "@/lib/db";
import { MAX_BLOG_IMAGES } from "@/lib/media-limits";

export type BlogPostType = "update" | "story" | "photo" | "video";

export function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base || "post"}-${Date.now().toString(36)}`;
}

export function mapBlogPost(row: Record<string, unknown>) {
  const media = Array.isArray(row.media_urls) ? row.media_urls.map(String) : [];
  return {
    id: String(row.id),
    authorId: row.author_id ? String(row.author_id) : null,
    authorName: String(row.author_name ?? ""),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    coverUrl: String(row.cover_url ?? ""),
    mediaUrls: media.slice(0, MAX_BLOG_IMAGES),
    videoUrl: String(row.video_url ?? ""),
    postType: (row.post_type || "update") as BlogPostType,
    likesCount: Number(row.likes_count ?? 0),
    commentsCount: Number(row.comments_count ?? 0),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function youtubeEmbed(url: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    return url;
  }
  return url;
}

export async function getPostByIdOrSlug(idOrSlug: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM blog_posts
    WHERE id::text = ${idOrSlug} OR slug = ${idOrSlug}
    LIMIT 1
  `;
  return rows[0] ? mapBlogPost(rows[0] as Record<string, unknown>) : null;
}
