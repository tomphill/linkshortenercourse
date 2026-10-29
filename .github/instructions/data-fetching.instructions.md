---
description: "Use when: fetching, reading, or querying data; writing Server Components, pages, layouts, or route handlers that need database data; creating or editing helper functions in /data; using Drizzle ORM or SQL. Enforces server-component-only data fetching via /data helper functions."
applyTo: "{app,components,data}/**"
---

# Data fetching: Server Components + /data helpers only

- Fetch data ONLY in Server Components. Never fetch in Client Components (`"use client"`), `useEffect`, SWR/React Query, Route Handlers used as a data source, or any other client-side mechanism.
- All database access goes through helper functions in the `/data` directory (repo root, e.g. `data/links.ts`). Each helper wraps one or more Drizzle queries and returns plain data.
- Server Components call the `/data` helpers. They must NOT import `db` from `@/db`, import from `drizzle-orm`, or write raw SQL. Only files in `/data` may do so.
- Client Components receive data as props from a Server Component; they never call `/data` helpers.
- Use Zod to validate all untrusted input used in data fetching (e.g. `params`, `searchParams`) before passing it to a `/data` helper. Derive TS types from schemas with `z.infer`.
- Helpers take explicit, typed parameters and return typed results. Keep them free of UI/React concerns.
- For user-owned data, helpers take the Clerk `userId` as a parameter and filter by it. The calling Server Component gets `userId` from `auth()` (see the Clerk auth instructions); never accept it from the client.
