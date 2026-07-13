import { NextRequest } from "next/server";
import { requireAdmin, setAdminSession, verifyAdminPassword, clearAdminSession } from "@/lib/admin-auth";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password ?? "");
  if (!verifyAdminPassword(password)) {
    return jsonError("Invalid password", 401);
  }
  await setAdminSession();
  return jsonOk({ ok: true });
}

export async function DELETE() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  await clearAdminSession();
  return jsonOk({ ok: true });
}

export async function GET() {
  const { isAdminAuthenticated } = await import("@/lib/admin-auth");
  const ok = await isAdminAuthenticated();
  return jsonOk({ authenticated: ok });
}
