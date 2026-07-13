import { NextRequest } from "next/server";
import {
  clearAdminSession,
  getAdminSession,
  setAdminSession,
  verifyAdminPassword,
  verifyPasswordHash,
  type AdminSession,
} from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!password) return jsonError("Password is required", 400);

  // Master password (no email) or email left blank
  if (!email && verifyAdminPassword(password)) {
    const session: AdminSession = {
      type: "master",
      id: null,
      email: "master@admin",
      name: "Master Admin",
      permission: "all",
    };
    await setAdminSession(session);
    await logActivity(session, "login", "auth", null, { method: "master_password" });
    return jsonOk({ ok: true, user: session });
  }

  // Optional: master password with any email still works if password matches master
  if (verifyAdminPassword(password) && !email) {
    // already handled
  }

  if (!email) return jsonError("Email and password are required for staff login", 400);

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, name, email, password_hash, permission, is_active
      FROM admin_users
      WHERE lower(email) = ${email}
      LIMIT 1
    `;
    const user = rows[0] as
      | {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          permission: AdminSession["permission"];
          is_active: boolean;
        }
      | undefined;

    if (!user || !user.is_active || !verifyPasswordHash(password, user.password_hash)) {
      // Fallback: allow master password even if email was typed
      if (verifyAdminPassword(password)) {
        const session: AdminSession = {
          type: "master",
          id: null,
          email: "master@admin",
          name: "Master Admin",
          permission: "all",
        };
        await setAdminSession(session);
        await logActivity(session, "login", "auth", null, { method: "master_password" });
        return jsonOk({ ok: true, user: session });
      }
      return jsonError("Invalid email or password", 401);
    }

    const session: AdminSession = {
      type: "user",
      id: String(user.id),
      email: user.email,
      name: user.name,
      permission: user.permission,
    };
    await setAdminSession(session);
    await logActivity(session, "login", "auth", String(user.id), { method: "staff" });
    return jsonOk({ ok: true, user: session });
  } catch (error) {
    console.error(error);
    return jsonError("Login failed", 500);
  }
}

export async function DELETE() {
  const session = await getAdminSession();
  await logActivity(session, "logout", "auth");
  await clearAdminSession();
  return jsonOk({ ok: true });
}

export async function GET() {
  const session = await getAdminSession();
  return jsonOk({
    authenticated: Boolean(session),
    user: session
      ? {
          type: session.type,
          id: session.id,
          email: session.email,
          name: session.name,
          permission: session.permission,
        }
      : null,
  });
}
