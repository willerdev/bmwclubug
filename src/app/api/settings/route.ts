import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`SELECT key, value FROM site_settings`;
    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[String(row.key)] = row.value;
    }
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load settings", 500);
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const body = await req.json();
    const sql = getSql();
    for (const [key, value] of Object.entries(body)) {
      await sql`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}::jsonb, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to save settings", 500);
  }
}
