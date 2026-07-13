import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

function mapCar(row: Record<string, unknown>, images: string[] = []) {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    generation: String(row.generation ?? ""),
    year: String(row.year ?? ""),
    engine: String(row.engine ?? ""),
    horsepower: Number(row.horsepower ?? 0),
    owner: String(row.owner ?? ""),
    description: String(row.description ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
    isPublished: Boolean(row.is_published),
    images: images.slice(0, 10),
    image: images[0] || "",
  };
}

async function loadImages(carId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT image_url FROM slide_car_images
    WHERE car_id = ${carId}
    ORDER BY sort_order ASC, created_at ASC
    LIMIT 10
  `;
  return rows.map((r) => String(r.image_url));
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    const rows = await sql`SELECT * FROM slide_cars WHERE id = ${id}`;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk(mapCar(rows[0] as Record<string, unknown>, await loadImages(id)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load car", 500);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { session, error } = await requireAdminSession("update");
  if (error) return error;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const images = Array.isArray(body.images)
      ? body.images.map(String).filter(Boolean).slice(0, 10)
      : body.image
        ? [String(body.image)]
        : [];
    if (!String(body.name ?? "").trim()) return jsonError("Car name is required");
    if (images.length === 0) return jsonError("At least one image is required");

    const sql = getSql();
    const rows = await sql`
      UPDATE slide_cars SET
        name = ${String(body.name ?? "")},
        generation = ${String(body.generation ?? "")},
        year = ${String(body.year ?? "")},
        engine = ${String(body.engine ?? "")},
        horsepower = ${Number(body.horsepower ?? 0)},
        owner = ${String(body.owner ?? "")},
        description = ${String(body.description ?? "")},
        sort_order = ${Number(body.sortOrder ?? body.sort_order ?? 0)},
        is_published = ${body.isPublished !== false},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);

    await sql`DELETE FROM slide_car_images WHERE car_id = ${id}`;
    for (let i = 0; i < images.length; i++) {
      await sql`
        INSERT INTO slide_car_images (car_id, image_url, sort_order)
        VALUES (${id}, ${images[i]}, ${i})
      `;
    }

    await logActivity(session, "update", "slide_cars", id, { name: body.name, images: images.length });
    return jsonOk(mapCar(rows[0] as Record<string, unknown>, images));
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update car", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, error } = await requireAdminSession("all");
  if (error) return error;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM slide_cars WHERE id = ${id}`;
    await logActivity(session, "delete", "slide_cars", id);
    return jsonOk({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to delete car", 500);
  }
}
