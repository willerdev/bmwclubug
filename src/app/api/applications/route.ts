import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const status = req.nextUrl.searchParams.get("status");
    const sql = getSql();
    const rows = status
      ? await sql`SELECT * FROM applications WHERE status = ${status} ORDER BY created_at DESC`
      : await sql`SELECT * FROM applications ORDER BY created_at DESC`;
    return jsonOk(rows);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load applications", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sql = getSql();
    const rows = await sql`
      INSERT INTO applications (payload, status)
      VALUES (${JSON.stringify(body)}::jsonb, 'pending')
      RETURNING *
    `;
    return jsonOk(rows[0], 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to submit application", 500);
  }
}
