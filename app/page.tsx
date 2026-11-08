import { Suspense } from "react";
import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import {
  ArrowRightIcon,
  BarChart3Icon,
  LayoutDashboardIcon,
  Link2Icon,
  MousePointerClickIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: ZapIcon,
    title: "Instant short links",
    description:
      "Paste a long URL and get a clean, shareable short link in seconds.",
  },
  {
    icon: BarChart3Icon,
    title: "Know what works",
    description:
      "See how often your links are opened so you can focus on what performs.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "One simple dashboard",
    description:
      "Create, review, edit, and delete all of your links from a single place.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private by default",
    description:
      "Your links belong to your account. Only you can see and manage them.",
  },
];

const steps = [
  {
    icon: Link2Icon,
    title: "1. Paste your URL",
    description: "Drop in any long link you want to share.",
  },
  {
    icon: MousePointerClickIcon,
    title: "2. Get a short link",
    description: "Pick a custom slug or let us generate one for you.",
  },
  {
    icon: BarChart3Icon,
    title: "3. Share and track",
    description: "Send it anywhere and watch the clicks roll in.",
  },
];

export default function Home() {
  const cta = (
    <Suspense fallback={<div className="h-9" />}>
      <Show when="signed-out">
        <SignUpButton>
          <Button size="lg">
            Get started for free
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button size="lg" nativeButton={false} render={<Link href="/dashboard" />}>
          Go to dashboard
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </Show>
    </Suspense>
  );

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
        <Badge variant="secondary">
          <Link2Icon data-icon="inline-start" />
          Link shortener
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Short links, big impact.
        </h1>
        <p className="max-w-xl text-lg text-balance text-muted-foreground">
          Turn long, messy URLs into short links that are easy to share, easy to
          remember, and easy to track.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {cta}
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href="#features" />}
          >
            See how it works
          </Button>
        </div>
      </section>

      <Separator />

      <section
        id="features"
        className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-20"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to manage links
          </h2>
          <p className="max-w-xl text-muted-foreground">
            A focused toolset that keeps sharing simple.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Up and running in three steps
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <step.icon className="text-primary" />
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 pb-24">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to shorten your first link?
            </h2>
            <p className="max-w-md text-primary-foreground/80">
              Create a free account and start sharing cleaner links today.
            </p>
            <Suspense fallback={<div className="h-9" />}>
              <Show when="signed-out">
                <SignUpButton>
                  <Button size="lg" variant="secondary">
                    Create your account
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Button
                  size="lg"
                  variant="secondary"
                  nativeButton={false}
                  render={<Link href="/dashboard" />}
                >
                  Go to dashboard
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </Show>
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
