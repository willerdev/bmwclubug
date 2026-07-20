import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getSpecialItems, saveSpecialItems } from "@/lib/special-content";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const items = await getSpecialItems();
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return jsonError("Not found", 404);

    const current = items[index];
    const mediaUrl = String(body.mediaUrl ?? body.url ?? current.mediaUrl);
    const mime = String(body.mime ?? "");
    const mediaType: "image" | "video" =
      body.mediaType === "video" || mime.startsWith("video/")
        ? "video"
        : body.mediaType === "image"
          ? "image"
          : current.mediaType;

    items[index] = {
      ...current,
      title: String(body.title ?? current.title),
      description: String(body.description ?? current.description),
      mediaUrl,
      mediaType,
    };
    return jsonOk(await saveSpecialItems(items));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update special item", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const items = await getSpecialItems();
    return jsonOk(await saveSpecialItems(items.filter((item) => item.id !== id)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete special item", 500);
  }
}
