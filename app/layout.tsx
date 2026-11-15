import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener",
  description:
    "Turn long, messy URLs into short links that are easy to share and track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              variables: {
                colorBackground: "var(--card)",
                colorForeground: "var(--card-foreground)",
                colorPrimary: "var(--primary)",
                colorPrimaryForeground: "var(--primary-foreground)",
                colorInput: "var(--background)",
                colorInputForeground: "var(--foreground)",
                colorMuted: "var(--muted)",
                colorMutedForeground: "var(--muted-foreground)",
                colorNeutral: "var(--foreground)",
                colorBorder: "var(--border)",
                colorRing: "var(--ring)",
              },
            }}
          >
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <ThemeToggle />
              <Suspense fallback={<div className="h-10 sm:h-12 w-40" />}>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="ghost">Sign in</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Sign up</Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </Suspense>
            </header>
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
