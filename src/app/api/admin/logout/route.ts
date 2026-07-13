import { clearAdminSession, requireAdmin } from "@/lib/admin-auth";
import { jsonOk } from "@/lib/api-helpers";

export async function POST() {
  const unauthorized = await requireAdmin();
  if (unauthorized) {
    await clearAdminSession();
    return jsonOk({ ok: true });
  }
  await clearAdminSession();
  return jsonOk({ ok: true });
}
