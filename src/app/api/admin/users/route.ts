import { NextRequest } from "next/server";
import { hashPassword, requireAdminSession, type AdminPermission } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

const PERMS: AdminPermission[] = ["view", "add", "update", "all", "blogger"];

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

export async function GET() {
  const { session, error } = await requireAdminSession("all");
  if (error) return error;
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, name, email, permission, is_active, created_at, updated_at
      FROM admin_users
      ORDER BY created_at DESC
    `;
    return jsonOk(rows.map((r) => mapUser(r as Record<string, unknown>)));
  } catch (err) {
    console.error(err);
    return jsonError("Failed to load users", 500);
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdminSession("all");
  if (error) return error;
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const permission = (PERMS.includes(body.permission) ? body.permission : "view") as AdminPermission;
    if (!name || !email || !password) return jsonError("Name, email, and password are required");
    if (password.length < 6) return jsonError("Password must be at least 6 characters");

    const sql = getSql();
    const rows = await sql`
      INSERT INTO admin_users (name, email, password_hash, permission)
      VALUES (${name}, ${email}, ${hashPassword(password)}, ${permission})
      RETURNING id, name, email, permission, is_active, created_at, updated_at
    `;
    const user = mapUser(rows[0] as Record<string, unknown>);
    await logActivity(session, "create", "admin_users", user.id, { email, permission });
    return jsonOk(user, 201);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error && err.message.includes("unique") ? "Email already exists" : "Failed to create user";
    return jsonError(message, 500);
  }
}
