import { NextRequest } from "next/server";
import { hashPassword, requireAdminSession, type AdminPermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

const PERMS: AdminPermission[] = ["view", "add", "update", "all", "blogger"];
type Ctx = { params: Promise<{ id: string }> };

function mapUser(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    permission: row.permission as AdminPermission,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { session, error } = await requireAdminSession("all");
  if (error) return error;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const permission = (PERMS.includes(body.permission) ? body.permission : "view") as AdminPermission;
    const isActive = body.isActive !== false;
    const password = body.password ? String(body.password) : "";

    if (!name || !email) return jsonError("Name and email are required");

    const sql = getSql();
    const rows = password
      ? await sql`
          UPDATE admin_users SET
            name = ${name},
            email = ${email},
            permission = ${permission},
            is_active = ${isActive},
            password_hash = ${hashPassword(password)},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, name, email, permission, is_active, created_at, updated_at
        `
      : await sql`
          UPDATE admin_users SET
            name = ${name},
            email = ${email},
            permission = ${permission},
            is_active = ${isActive},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, name, email, permission, is_active, created_at, updated_at
        `;
    if (!rows[0]) return jsonError("Not found", 404);
    const user = mapUser(rows[0] as Record<string, unknown>);
    await logActivity(session, "update", "admin_users", id, { email, permission, isActive });
    return jsonOk(user);
  } catch (err) {
    console.error(err);
    return jsonError("Failed to update user", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { session, error } = await requireAdminSession("all");
  if (error) return error;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM admin_users WHERE id = ${id}`;
    await logActivity(session, "delete", "admin_users", id);
    return jsonOk({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonError("Failed to delete user", 500);
  }
}
