import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .max(64, "Slug must be 64 characters or fewer")
  .regex(
    /^[a-zA-Z0-9_-]*$/,
    "Slug can only contain letters, numbers, hyphens, and underscores",
  );

export const linkFormSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .max(2048, "URL is too long")
    .refine((value) => {
      try {
        const { protocol } = new URL(value);
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    }, "Enter a valid http(s) URL"),
  // Empty slug means "generate one for me"
  slug: slugSchema,
  isActive: z.boolean(),
});

export const createLinkSchema = linkFormSchema;

export const updateLinkSchema = linkFormSchema.extend({
  id: z.number().int().positive(),
  slug: slugSchema.min(1, "Slug is required"),
});

export const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export type ActionResult = { success: true } | { success: false; error: string };
