import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import {
  getEventContent,
  normalizeEventContent,
  saveEventContent,
  type EventPost,
} from "@/lib/event-content";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    return jsonOk(await getEventContent(id));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load event content", 500);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = normalizeEventContent(await req.json());
    return jsonOk(await saveEventContent(id, body));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update event content", 500);
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const current = await getEventContent(id);
    const post: EventPost = {
      id: crypto.randomUUID(),
      title: String(body.title ?? "").trim(),
      content: String(body.content ?? "").trim(),
      images: Array.isArray(body.images)
        ? body.images.map(String).filter(Boolean).slice(0, 30)
        : [],
      createdAt: new Date().toISOString(),
    };
    if (!post.title && !post.content && post.images.length === 0) {
      return jsonError("Add a title, post text, or image");
    }
    const updated = await saveEventContent(id, {
      ...current,
      posts: [post, ...current.posts],
    });
    return jsonOk(updated, 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to add event post", 500);
  }
}
