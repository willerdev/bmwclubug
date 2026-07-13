import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk, mapPartner } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM partners ORDER BY name ASC`;
    return jsonOk(rows.map((r) => mapPartner(r as Record<string, unknown>)));
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load partners", 500);
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      INSERT INTO partners (name, logo_url, category)
      VALUES (
        ${String(body.name ?? "")},
        ${String(body.logo ?? body.logo_url ?? "")},
        ${String(body.category ?? "")}
      )
      RETURNING *
    `;
    return jsonOk(mapPartner(rows[0] as Record<string, unknown>), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to create partner", 500);
  }
}
