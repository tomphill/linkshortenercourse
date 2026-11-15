"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Client-only wrapper: next-themes needs a client boundary and no shadcn component provides it.
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
