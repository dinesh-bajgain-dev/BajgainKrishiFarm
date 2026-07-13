import { API_URL } from "@/lib/constants";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildUrl(path: string, params?: Record<string, string | undefined>): string {
  const url = new URL(path.replace(/^\//, ""), `${API_URL}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

/** For Server Components: unauthenticated reads against public endpoints.
 * Always fetched fresh (no-store) so admin edits appear on the site instantly;
 * pages are dynamically rendered anyway because of the locale cookie. */
export async function apiFetch<T>(
  path: string,
  options?: { params?: Record<string, string | undefined> }
): Promise<T> {
  const res = await fetch(buildUrl(path, options?.params), { cache: "no-store" });
  if (!res.ok) {
    throw new ApiError(res.status, `Request to ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** For Server Components where a missing resource (e.g. FarmInfo not seeded) should not crash the page. */
export async function apiFetchOrNull<T>(
  path: string,
  options?: { params?: Record<string, string | undefined> }
): Promise<T | null> {
  try {
    return await apiFetch<T>(path, options);
  } catch {
    return null;
  }
}

/** For Client Components: cookie-authenticated admin requests. */
export async function adminApiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** For public POSTs from Client Components (e.g. the inquiry form) — no cookie needed. */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, payload.detail ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

/** Shown whenever content has no photo yet, or a saved photo URL fails to load. */
export const FALLBACK_IMAGE_URL = "/placeholder-fallback.svg";

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return FALLBACK_IMAGE_URL;
  if (url.startsWith("http") || url.startsWith("/placeholders/")) return url;
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  return url;
}
