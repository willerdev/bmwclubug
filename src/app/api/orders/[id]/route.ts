import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("update");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const status = String(body.status ?? "pending");
    if (!["pending", "confirmed", "delivered", "cancelled"].includes(status)) {
      return jsonError("Invalid status");
    }
    const sql = getSql();
    const rows = await sql`
      UPDATE orders SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows[0]) return jsonError("Not found", 404);
    return jsonOk({ id, status });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to update order", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const unauthorized = await requireAdmin("all");
  if (unauthorized) return unauthorized;
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    await sql`DELETE FROM orders WHERE id = ${id}`;
    return jsonOk({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to delete order", 500);
  }
}
