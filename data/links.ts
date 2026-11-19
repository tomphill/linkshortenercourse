import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "@/db";
import { linksTable, type Link } from "@/db/schema";

export type LinkInput = {
  slug: string;
  originalUrl: string;
  isActive: boolean;
};

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(desc(linksTable.createdAt));
}

export async function createLink(
  userId: string,
  input: LinkInput,
): Promise<Link> {
  const [link] = await db
    .insert(linksTable)
    .values({ userId, ...input })
    .returning();
  return link;
}

export async function updateLink(
  userId: string,
  id: number,
  input: LinkInput,
): Promise<Link | null> {
  const [link] = await db
    .update(linksTable)
    .set(input)
    .where(and(eq(linksTable.id, id), eq(linksTable.userId, userId)))
    .returning();
  return link ?? null;
}

export async function deleteLink(userId: string, id: number): Promise<boolean> {
  const deleted = await db
    .delete(linksTable)
    .where(and(eq(linksTable.id, id), eq(linksTable.userId, userId)))
    .returning({ id: linksTable.id });
  return deleted.length > 0;
}

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

export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  while (current && typeof current === "object") {
    if ((current as { code?: unknown }).code === "23505") return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
}
