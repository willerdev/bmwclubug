import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "bmw_admin_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AdminPermission = "view" | "add" | "update" | "all";

export type AdminSession = {
  type: "master" | "user";
  id: string | null;
  email: string;
  name: string;
  permission: AdminPermission;
};

const PERM_RANK: Record<AdminPermission, number> = {
  view: 1,
  add: 2,
  update: 3,
  all: 4,
};

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function encodePayload(session: AdminSession) {
  const raw = JSON.stringify({
    t: session.type === "master" ? "m" : "u",
    id: session.id,
    e: session.email,
    n: session.name,
    p: session.permission,
  });
  return Buffer.from(raw).toString("base64url");
}

function decodePayload(payload: string): AdminSession | null {
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      t?: string;
      id?: string | null;
      e?: string;
      n?: string;
      p?: string;
    };
    const permission = (["view", "add", "update", "all"].includes(String(data.p))
      ? data.p
      : "view") as AdminPermission;
    if (data.t === "m") {
      return {
        type: "master",
        id: null,
        email: "master@admin",
        name: "Master Admin",
        permission: "all",
      };
    }
    return {
      type: "user",
      id: data.id ? String(data.id) : null,
      email: String(data.e ?? ""),
      name: String(data.n ?? ""),
      permission,
    };
  } catch {
    return null;
  }
}

export function hasPermission(current: AdminPermission, required: AdminPermission) {
  return PERM_RANK[current] >= PERM_RANK[required];
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== test.length) return false;
  return timingSafeEqual(expected, test);
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminSession(session: AdminSession) {
  const issuedAt = Date.now().toString();
  const payload = encodePayload(session);
  const token = `${issuedAt}.${payload}.${sign(`${issuedAt}.${payload}`)}`;
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export function parseAdminSessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const parts = token.split(".");
  try {
    if (parts.length === 2) {
      const [issuedAt, signature] = parts;
      if (!issuedAt || !signature) return null;
      const expected = sign(issuedAt);
      const a = Buffer.from(signature);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
      const age = Date.now() - Number(issuedAt);
      if (!Number.isFinite(age) || age < 0 || age >= MAX_AGE_SECONDS * 1000) return null;
      return {
        type: "master",
        id: null,
        email: "master@admin",
        name: "Master Admin",
        permission: "all",
      };
    }
    if (parts.length === 3) {
      const [issuedAt, payload, signature] = parts;
      if (!issuedAt || !payload || !signature) return null;
      const expected = sign(`${issuedAt}.${payload}`);
      const a = Buffer.from(signature);
      const b = Buffer.from(expected);
      if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
      const age = Date.now() - Number(issuedAt);
      if (!Number.isFinite(age) || age < 0 || age >= MAX_AGE_SECONDS * 1000) return null;
      return decodePayload(payload);
    }
  } catch {
    return null;
  }
  return null;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const jar = await cookies();
    return parseAdminSessionToken(jar.get(COOKIE_NAME)?.value);
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdmin(min: AdminPermission = "view") {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPermission(session.permission, min)) {
    return Response.json({ error: "Forbidden: insufficient permission" }, { status: 403 });
  }
  return null;
}

export async function requireAdminSession(min: AdminPermission = "view") {
  const session = await getAdminSession();
  if (!session) {
    return { session: null as AdminSession | null, error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!hasPermission(session.permission, min)) {
    return {
      session: null as AdminSession | null,
      error: Response.json({ error: "Forbidden: insufficient permission" }, { status: 403 }),
    };
  }
  return { session, error: null as Response | null };
}
