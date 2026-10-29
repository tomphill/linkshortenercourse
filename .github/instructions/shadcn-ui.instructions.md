---
description: "Use when: building or editing any UI, pages, layouts, forms, or React components in this app. Enforces shadcn/ui components only, no custom components."
applyTo: "{app,components}/**/*.tsx"
---

# UI: shadcn/ui only

- Build ALL UI from shadcn/ui components in `@/components/ui`. Do NOT create custom components unless absolutely necessary.
- Before writing any markup, load the `shadcn` skill (`.agents/skills/shadcn/SKILL.md`) and follow its rules for composition, forms, styling, and icons.
- Need a component that isn't installed? Add it with `npx shadcn@latest add <name>` (search first with `npx shadcn@latest search`). Never hand-write a replacement for a shadcn component.
- Check usage with `npx shadcn@latest docs <component>` rather than relying on memory; this project uses the Base UI style (`base-nova`), so use `render`, not `asChild`, for custom triggers.
- Compose shadcn primitives in the page/route file (e.g. Tabs + Card + form controls) instead of extracting wrapper components.
- A new non-shadcn component is allowed only when no shadcn component or composition can do the job; keep it minimal and state why in your response.
- Use built-in variants and semantic colors (`bg-primary`, `text-muted-foreground`); never raw colors like `bg-blue-500`.
- Icons come from `lucide-react`.
- Do not edit files in `components/ui` by hand except for deliberate theming; prefer CLI updates.
