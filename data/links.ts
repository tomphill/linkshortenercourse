import { and, eq, gt, isNull, or } from "drizzle-orm";

import { db } from "@/db";
import { linksTable } from "@/db/schema";

export async function getRedirectTargetBySlug(
  slug: string,
): Promise<string | null> {
  const [link] = await db
    .select({ originalUrl: linksTable.originalUrl })
    .from(linksTable)
    .where(
      and(
        eq(linksTable.slug, slug),
        eq(linksTable.isActive, true),
        or(isNull(linksTable.expiresAt), gt(linksTable.expiresAt, new Date())),
      ),
    )
    .limit(1);

  return link?.originalUrl ?? null;
}
