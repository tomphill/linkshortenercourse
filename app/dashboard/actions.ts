"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import {
  createLink,
  deleteLink,
  isUniqueViolation,
  updateLink,
} from "@/data/links";
import {
  createLinkSchema,
  deleteLinkSchema,
  updateLinkSchema,
  type ActionResult,
  type CreateLinkInput,
  type DeleteLinkInput,
  type UpdateLinkInput,
} from "./schemas";

const SLUG_TAKEN = "That slug is already in use. Try another one.";
const GENERATE_ATTEMPTS = 5;

function generateSlug(): string {
  return randomBytes(5).toString("base64url");
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth.protect();
  return userId;
}

export async function createLinkAction(
  input: CreateLinkInput,
): Promise<ActionResult> {
  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const userId = await requireUserId();
  const { originalUrl, isActive, slug } = parsed.data;

  const attempts = slug ? 1 : GENERATE_ATTEMPTS;
  for (let i = 0; i < attempts; i++) {
    try {
      await createLink(userId, {
        originalUrl,
        isActive,
        slug: slug || generateSlug(),
      });
      revalidatePath("/dashboard");
      return { success: true };
    } catch (error) {
      if (!isUniqueViolation(error)) {
        return { success: false, error: "Could not create the link." };
      }
    }
  }
  return { success: false, error: slug ? SLUG_TAKEN : "Could not generate a slug. Try again." };
}

export async function updateLinkAction(
  input: UpdateLinkInput,
): Promise<ActionResult> {
  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const userId = await requireUserId();
  const { id, ...values } = parsed.data;

  try {
    const link = await updateLink(userId, id, values);
    if (!link) return { success: false, error: "Link not found." };
  } catch (error) {
    return {
      success: false,
      error: isUniqueViolation(error)
        ? SLUG_TAKEN
        : "Could not update the link.",
    };
  }
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteLinkAction(
  input: DeleteLinkInput,
): Promise<ActionResult> {
  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid link." };
  }
  const userId = await requireUserId();

  try {
    const deleted = await deleteLink(userId, parsed.data.id);
    if (!deleted) return { success: false, error: "Link not found." };
  } catch {
    return { success: false, error: "Could not delete the link." };
  }
  revalidatePath("/dashboard");
  return { success: true };
}
