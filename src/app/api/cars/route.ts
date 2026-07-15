import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { MAX_CAR_IMAGES } from "@/lib/media-limits";

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
    images: images.slice(0, MAX_CAR_IMAGES),
    image: images[0] || "",
  };
}

async function loadImages(carId: string) {
  const sql = getSql();
  const rows = await sql`
    SELECT image_url FROM slide_car_images
    WHERE car_id = ${carId}
    ORDER BY sort_order ASC, created_at ASC
    LIMIT ${MAX_CAR_IMAGES}
  `;
  return rows.map((r) => String(r.image_url));
}

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM slide_cars
      WHERE is_published = TRUE
      ORDER BY sort_order ASC, created_at DESC
    `;
    const cars = [];
    for (const row of rows) {
      const id = String((row as { id: string }).id);
      cars.push(mapCar(row as Record<string, unknown>, await loadImages(id)));
    }
    return jsonOk(cars);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load cars", 500);
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdminSession("add");
  if (error) return error;
  try {
    const body = await req.json();
    const images = Array.isArray(body.images)
      ? body.images.map(String).filter(Boolean).slice(0, MAX_CAR_IMAGES)
      : body.image
        ? [String(body.image)]
        : [];
    if (!String(body.name ?? "").trim()) return jsonError("Car name is required");
    if (images.length === 0) return jsonError("At least one image is required");

    const sql = getSql();
    const rows = await sql`
      INSERT INTO slide_cars (
        name, generation, year, engine, horsepower, owner, description, sort_order, is_published
      ) VALUES (
        ${String(body.name ?? "")},
        ${String(body.generation ?? "")},
        ${String(body.year ?? "")},
        ${String(body.engine ?? "")},
        ${Number(body.horsepower ?? 0)},
        ${String(body.owner ?? "")},
        ${String(body.description ?? "")},
        ${Number(body.sortOrder ?? body.sort_order ?? 0)},
        ${body.isPublished !== false}
      )
      RETURNING *
    `;
    const carId = String((rows[0] as { id: string }).id);
    for (let i = 0; i < images.length; i++) {
      await sql`
        INSERT INTO slide_car_images (car_id, image_url, sort_order)
        VALUES (${carId}, ${images[i]}, ${i})
      `;
    }
    await logActivity(session, "create", "slide_cars", carId, { name: body.name, images: images.length });
    return jsonOk(mapCar(rows[0] as Record<string, unknown>, images), 201);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to create car", 500);
  }
}
