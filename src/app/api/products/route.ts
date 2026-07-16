import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapProduct } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return jsonOk(rows.map((r) => mapProduct(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load products", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin("add");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      INSERT INTO products (name, image_url, category, description, price)
      VALUES (
        ${String(body.name ?? "")},
        ${String(body.image ?? body.image_url ?? "")},
        ${String(body.category ?? "Apparel")},
        ${String(body.description ?? "")},
        ${Number(body.price ?? 0)}
      )
      RETURNING *
    `;
    return jsonOk(mapProduct(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create product", 500);
  }
}
