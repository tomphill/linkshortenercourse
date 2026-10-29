---
description: "Use when: writing or editing authentication, authorization, sign-in/sign-up, sessions, user identity, protected routes, middleware/proxy, Server Actions, API routes, or any Clerk-related code. Enforces Clerk as the only auth mechanism."
applyTo: "{app,components,lib,db}/**,proxy.ts"
---

# Auth: Clerk only

- ALL authentication and authorization in this app goes through Clerk. Never implement auth any other way (no NextAuth/Auth.js, custom JWT/cookies, session tables, password hashing, hand-rolled login forms, or other providers).
- Before generating ANY Clerk-related code, load the `clerk-nextjs-patterns` skill (`.agents/skills/clerk-nextjs-patterns/SKILL.md`) and follow its patterns (and its `templates/`) for proxy, Server Actions, route protection, and caching.
- The Clerk session middleware lives in `proxy.ts` (not `middleware.ts`) and stays a bare `clerkMiddleware()`. Do not add `createRouteMatcher` (deprecated).
- Protect each resource where it runs: call `await auth.protect()` in every page, Route Handler, and Server Action.
- Use Clerk components (`<SignIn>`, `<SignUp>`, `<UserButton>`) and `<Show when="signed-in" | "signed-out">` for conditional rendering; not `<SignedIn>`/`<SignedOut>`.
- Wrap Server Components that call `auth()`/`currentUser()` or render `<Show>` in `<Suspense>`.
- Get the current user server-side with `auth()`/`currentUser()`; never trust a user ID from the client, request body, or query params.
- Link data to users via the Clerk `userId` string; do not create a users/credentials table for authentication.
- Never hardcode or log Clerk keys; read them from environment variables.
