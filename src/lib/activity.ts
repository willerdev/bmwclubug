import { getSql } from "@/lib/db";
import type { AdminSession } from "@/lib/admin-auth";

export async function logActivity(
  session: AdminSession | null | undefined,
  action: string,
  entity = "",
  entityId: string | null = null,
  details: Record<string, unknown> = {}
) {
  if (!session) return;
  try {
    const sql = getSql();
    await sql`
      INSERT INTO admin_activity (user_id, user_email, user_name, action, entity, entity_id, details)
      VALUES (
        ${session.id},
        ${session.email},
        ${session.name},
        ${action},
        ${entity},
        ${entityId},
        ${JSON.stringify(details)}::jsonb
      )
    `;
  } catch (error) {
    console.error("Failed to log admin activity", error);
  }
}
