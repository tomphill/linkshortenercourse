---
description: "Use when: creating, updating, or deleting data; data mutations; writing Server Actions ('use server'); handling form submissions or button-triggered writes; calling mutations from Client Components; writing mutation helpers in /data. Enforces Server Actions only for mutations, strictly typed arguments, and /data helpers for database access."
applyTo: "{app,components,data}/**"
---

# Data mutations: Server Actions + /data helpers only

- Perform ALL data mutations (insert/update/delete) ONLY via Server Actions (`"use server"`). Never mutate via Route Handlers, client-side fetch, or from Server Components during render.
- Server Actions are invoked from Client Components (`"use client"`), which call the action directly with typed arguments.
- Server Action parameters MUST be strictly typed (explicit TS types/interfaces, e.g. `{ url: string; slug: string }`). NEVER type an action's argument as `FormData`, `any`, or `unknown`-without-validation. Client Components collect form values and pass a typed object.
- Validate ALL Server Action arguments with Zod at the start of every action, before any `/data` call, using `schema.parse()`/`safeParse()`. Define the schema in Zod and derive the TS type with `z.infer<typeof schema>`. Client Components may reuse the same schema for form validation, but the server-side check is mandatory.
- Server Actions must NOT import `db` from `@/db`, import from `drizzle-orm`, or write raw SQL. They only call helper functions in the `/data` directory (e.g. `data/links.ts`).
- `/data` helpers wrap the Drizzle queries for mutations, take explicit typed parameters, and return typed results. Only `/data` files may touch Drizzle or SQL.
- In every Server Action: call `await auth.protect()` (see the Clerk auth instructions), get `userId` from `auth()`, and pass it to the `/data` helper. Never accept `userId` as an action argument.
- Keep Server Actions in dedicated files (e.g. `actions.ts` colocated with the route that uses them) marked with `"use server"` at the top.
