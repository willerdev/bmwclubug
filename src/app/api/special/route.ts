import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { getSpecialItems, normalizeSpecialItems, saveSpecialItems } from "@/lib/special-content";

export async function GET() {
  try {
    return jsonOk(await getSpecialItems());
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load special content", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const mediaUrl = String(body.mediaUrl ?? body.url ?? "");
    if (!mediaUrl) return jsonError("Media is required");

    const mime = String(body.mime ?? "");
    const mediaType: "image" | "video" =
      body.mediaType === "video" || mime.startsWith("video/")
        ? "video"
        : "image";

    const items = await getSpecialItems();
    items.unshift({
      id: crypto.randomUUID(),
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      mediaUrl,
      mediaType,
      createdAt: new Date().toISOString(),
    });
    return jsonOk(await saveSpecialItems(items), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to add special item", 500);
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const items = normalizeSpecialItems(body.items ?? body);
    return jsonOk(await saveSpecialItems(items));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to save special content", 500);
  }
}
