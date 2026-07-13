# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence — without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Framework

- **Unit / integration:** [Vitest](https://vitest.dev/) v4 + [Testing Library](https://testing-library.com/react) (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`), jsdom environment.
- Config: `apps/web/vitest.config.ts`, setup file `apps/web/vitest.setup.ts`.

## Running tests

```bash
npm run test --workspace=apps/web   # from repo root
# or
cd apps/web && npm test
```

CI runs the same command on every push/PR via `.github/workflows/test.yml`.

## Test layers

- **Unit tests** — pure functions and business logic (e.g. `src/lib/i18n.ts` bilingual formatting). Colocated as `*.test.ts` / `*.test.tsx` next to the source file.
- **Integration tests** — components rendered with Testing Library, exercising real user interaction (fill forms, click buttons), not implementation details.
- **Smoke tests** — not yet set up; add via `/qa` when routes need automated coverage.
- **E2E tests** — not yet set up. Playwright is the recommended choice if/when needed; `/qa` can bootstrap it on request.

## Conventions

- File naming: `<name>.test.ts` or `<name>.test.tsx`, colocated with the source file.
- Assertions: `expect(...).toBe(...)` / `toEqual` for values; `@testing-library/jest-dom` matchers (`toBeInTheDocument`, etc.) for DOM.
- No snapshot tests — assert on real behavior and rendered text, not implementation shape.
- Mock external dependencies (DB, fetch, Next.js `cookies()`/`headers()`) — never hit real services in unit tests.
