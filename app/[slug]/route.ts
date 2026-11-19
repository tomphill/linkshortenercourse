import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getRedirectTargetBySlug } from "@/data/links";

const paramsSchema = z.object({ slug: z.string().min(1).max(64) });

// Public on purpose: short links must redirect for anonymous visitors, so there is no auth.protect().
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const parsed = paramsSchema.safeParse(await params);
  if (!parsed.success) notFound();

  const targetUrl = await getRedirectTargetBySlug(parsed.data.slug);
  if (!targetUrl) notFound();

  // 307 keeps the redirect temporary so browsers never cache a stale or deactivated target
  return NextResponse.redirect(targetUrl, 307);
}
