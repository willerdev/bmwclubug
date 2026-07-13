import { getSql } from "@/lib/db";
import { jsonError } from "@/lib/api-helpers";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const sql = getSql();
    const rows = await sql`SELECT mime, data FROM media WHERE id = ${id}`;
    if (!rows[0]) return jsonError("Not found", 404);
    const row = rows[0] as { mime: string; data: Buffer | Uint8Array | string };
    let bytes: Buffer;
    if (Buffer.isBuffer(row.data)) {
      bytes = row.data;
    } else if (typeof row.data === "string") {
      // Neon may return hex for bytea
      const hex = row.data.startsWith("\\x") ? row.data.slice(2) : row.data;
      bytes = Buffer.from(hex, "hex");
    } else {
      bytes = Buffer.from(row.data);
    }
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": row.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    return jsonError("Failed to load media", 500);
  }
}
