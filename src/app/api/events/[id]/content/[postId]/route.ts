import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getEventContent, saveEventContent } from "@/lib/event-content";

type Ctx = { params: Promise<{ id: string; postId: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id, postId } = await ctx.params;
    const body = await req.json();
    const current = await getEventContent(id);
    const posts = current.posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            title: String(body.title ?? post.title),
            content: String(body.content ?? post.content),
            images: Array.isArray(body.images)
              ? body.images.map(String).filter(Boolean).slice(0, 30)
              : post.images,
          }
        : post
    );
    if (!posts.some((post) => post.id === postId)) return jsonError("Post not found", 404);
    return jsonOk(await saveEventContent(id, { ...current, posts }));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update event post", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id, postId } = await ctx.params;
    const current = await getEventContent(id);
    return jsonOk(
      await saveEventContent(id, {
        ...current,
        posts: current.posts.filter((post) => post.id !== postId),
      })
    );
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete event post", 500);
  }
}
