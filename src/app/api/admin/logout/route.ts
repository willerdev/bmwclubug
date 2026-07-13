import { clearAdminSession, getAdminSession } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity";
import { jsonOk } from "@/lib/api-helpers";

export async function POST() {
  const session = await getAdminSession();
  await logActivity(session, "logout", "auth");
  await clearAdminSession();
  return jsonOk({ ok: true });
}
