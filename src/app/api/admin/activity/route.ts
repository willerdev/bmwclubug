import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { error } = await requireAdminSession("view");
  if (error) return error;
  try {
    const sql = getSql();
    const userId = req.nextUrl.searchParams.get("userId");
    const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 100), 300);
    const rows = userId
      ? await sql`
          SELECT id, user_id, user_email, user_name, action, entity, entity_id, details, created_at
          FROM admin_activity
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
          LIMIT ${limit}
        `
      : await sql`
          SELECT id, user_id, user_email, user_name, action, entity, entity_id, details, created_at
          FROM admin_activity
          ORDER BY created_at DESC
          LIMIT ${limit}
        `;
    return jsonOk(
      rows.map((r) => ({
        id: String(r.id),
        userId: r.user_id ? String(r.user_id) : null,
        userEmail: String(r.user_email ?? ""),
        userName: String(r.user_name ?? ""),
        action: String(r.action ?? ""),
        entity: String(r.entity ?? ""),
        entityId: r.entity_id ? String(r.entity_id) : null,
        details: r.details ?? {},
        createdAt: r.created_at,
      }))
    );
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load activity", 500);
  }
}
