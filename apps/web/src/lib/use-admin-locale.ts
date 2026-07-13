"use client";

import { useSyncExternalStore } from "react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Client-side locale store for the admin panel, backed by the same `locale`
 * cookie the public site reads server-side. Admin pages are "use client"
 * throughout, so instead of a server-read cookie + router.refresh(), this
 * broadcasts changes to every subscribed component instantly (no page reload).
 */

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  return match?.[1] === "ne" ? "ne" : "en";
}

type Listener = () => void;
let listeners: Listener[] = [];

function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Locale {
  return readCookieLocale();
}

function getServerSnapshot(): Locale {
  return "en";
}

export function setAdminLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  listeners.forEach((listener) => listener());
}

export function useAdminLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
