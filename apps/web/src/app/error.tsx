"use client";

import Link from "next/link";

/**
 * Unexpected-error boundary (client component by Next.js convention, so no
 * metadata export or server-side locale here — error pages aren't indexed
 * or crawled, and both languages are shown inline instead).
 */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Error</p>
      <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">केही गडबड भयो।</p>
      <p className="mt-4 max-w-md text-muted-foreground">
        Please try again, or head back to the homepage. If it keeps happening, contact us
        directly.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
