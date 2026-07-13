import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const sql = getSql();
    const [events] = await sql`SELECT COUNT(*)::int AS count FROM events`;
    const [partners] = await sql`SELECT COUNT(*)::int AS count FROM partners`;
    const [garages] = await sql`SELECT COUNT(*)::int AS count FROM garages`;
    const [products] = await sql`SELECT COUNT(*)::int AS count FROM products`;
    const [members] = await sql`SELECT COUNT(*)::int AS count FROM members`;
    const [applications] = await sql`SELECT COUNT(*)::int AS count FROM applications WHERE status = 'pending'`;
    const [gallery] = await sql`SELECT COUNT(*)::int AS count FROM gallery_items`;
    return jsonOk({
      events: events.count,
      partners: partners.count,
      garages: garages.count,
      products: products.count,
      members: members.count,
      pendingApplications: applications.count,
      gallery: gallery.count,
    });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load stats", 500);
  }
}
