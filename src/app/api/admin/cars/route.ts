import { requireAdminSession } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";
import { MAX_CAR_IMAGES } from "@/lib/media-limits";

export async function GET() {
  const { error } = await requireAdminSession("view");
  if (error) return error;
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM slide_cars ORDER BY sort_order ASC, created_at DESC`;
    const cars = [];
    for (const row of rows) {
      const id = String((row as { id: string }).id);
      const images = await sql`
        SELECT image_url FROM slide_car_images
        WHERE car_id = ${id}
        ORDER BY sort_order ASC, created_at ASC
        LIMIT ${MAX_CAR_IMAGES}
      `;
      cars.push({
        id,
        name: String((row as { name: string }).name ?? ""),
        generation: String((row as { generation: string }).generation ?? ""),
        year: String((row as { year: string }).year ?? ""),
        engine: String((row as { engine: string }).engine ?? ""),
        horsepower: Number((row as { horsepower: number }).horsepower ?? 0),
        owner: String((row as { owner: string }).owner ?? ""),
        description: String((row as { description: string }).description ?? ""),
        sortOrder: Number((row as { sort_order: number }).sort_order ?? 0),
        isPublished: Boolean((row as { is_published: boolean }).is_published),
        images: images.map((r) => String(r.image_url)),
        image: images[0] ? String(images[0].image_url) : "",
      });
    }
    return jsonOk(cars);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load cars", 500);
  }
}
