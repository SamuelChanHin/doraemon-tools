import { NextResponse } from "next/server";
import { cache } from "./cache";

export function ok(data: unknown) {
  return NextResponse.json({ statusCode: 200, data });
}

export function created(data: unknown) {
  return NextResponse.json({ statusCode: 201, data }, { status: 201 });
}

export function errorResponse(err: Record<string, string>, status = 500) {
  const message = err?.message || "Server error";
  return NextResponse.json({ statusCode: status, message }, { status });
}

export async function invalidateKeys(keys: string[]) {
  for (const k of keys) {
    try {
      await cache.del(k);
    } catch (e) {
      // ignore
    }
  }
}
