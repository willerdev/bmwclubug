import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-helpers";

function mapOrder(row: Record<string, unknown>, items: Record<string, unknown>[] = []) {
  return {
    id: String(row.id),
    customerName: String(row.customer_name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    address: String(row.address ?? ""),
    notes: String(row.notes ?? ""),
    paymentMethod: String(row.payment_method ?? "cod"),
    status: String(row.status ?? "pending"),
    total: Number(row.total ?? 0),
    createdAt: row.created_at,
    items: items.map((item) => ({
      id: String(item.id),
      productId: item.product_id ? String(item.product_id) : null,
      productName: String(item.product_name ?? ""),
      quantity: Number(item.quantity ?? 1),
      unitPrice: Number(item.unit_price ?? 0),
    })),
  };
}

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin("view");
  if (unauthorized) return unauthorized;
  try {
    const status = req.nextUrl.searchParams.get("status");
    const sql = getSql();
    const rows = status
      ? await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`
      : await sql`SELECT * FROM orders ORDER BY created_at DESC`;

    const orders = [];
    for (const row of rows) {
      const id = String((row as { id: string }).id);
      const items = await sql`SELECT * FROM order_items WHERE order_id = ${id}`;
      orders.push(mapOrder(row as Record<string, unknown>, items as Record<string, unknown>[]));
    }
    return jsonOk(orders);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load orders", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerName = String(body.customerName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customerName) return jsonError("Full name is required");
    if (!email) return jsonError("Email is required");
    if (!phone) return jsonError("Phone is required");
    if (!address) return jsonError("Delivery address is required");
    if (items.length === 0) return jsonError("Cart is empty");

    const normalized = items.map((item: Record<string, unknown>) => ({
      productId: item.productId ? String(item.productId) : null,
      productName: String(item.productName ?? ""),
      quantity: Math.max(1, Number(item.quantity ?? 1) || 1),
      unitPrice: Math.max(0, Number(item.unitPrice ?? 0) || 0),
    }));

    const total = normalized.reduce(
      (sum: number, i: { unitPrice: number; quantity: number }) => sum + i.unitPrice * i.quantity,
      0
    );
    const sql = getSql();

    const rows = await sql`
      INSERT INTO orders (
        customer_name, email, phone, address, notes, payment_method, status, total
      ) VALUES (
        ${customerName},
        ${email},
        ${phone},
        ${address},
        ${notes},
        'cod',
        'pending',
        ${total}
      )
      RETURNING *
    `;
    const orderId = String((rows[0] as { id: string }).id);

    for (const item of normalized) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
        VALUES (
          ${orderId},
          ${item.productId},
          ${item.productName},
          ${item.quantity},
          ${item.unitPrice}
        )
      `;
    }

    return jsonOk(mapOrder(rows[0] as Record<string, unknown>, normalized.map((i: { productId: string | null; productName: string; quantity: number; unitPrice: number }, idx: number) => ({
      id: `item-${idx}`,
      product_id: i.productId,
      product_name: i.productName,
      quantity: i.quantity,
      unit_price: i.unitPrice,
    }))), 201);
  } catch (error) {
    console.error(error);
    return jsonError("Failed to place order", 500);
  }
}
