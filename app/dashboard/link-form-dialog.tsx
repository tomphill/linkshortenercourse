"use client";

import { useState, useTransition } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";
import type { Link } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createLinkAction, updateLinkAction } from "./actions";
import { createLinkSchema, updateLinkSchema } from "./schemas";

export function LinkFormDialog({ link }: { link?: Link }) {
  const isEdit = link !== undefined;
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState(link?.originalUrl ?? "");
  const [slug, setSlug] = useState(link?.slug ?? "");
  const [isActive, setIsActive] = useState(link?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setOriginalUrl(link?.originalUrl ?? "");
      setSlug(link?.slug ?? "");
      setIsActive(link?.isActive ?? true);
      setError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = { originalUrl, slug, isActive };
    const parsed = isEdit
      ? updateLinkSchema.safeParse({ ...values, id: link.id })
      : createLinkSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = isEdit
        ? await updateLinkAction({ ...values, id: link.id })
        : await createLinkAction(values);
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon" aria-label="Edit link" />
          ) : (
            <Button />
          )
        }
      >
        {isEdit ? (
          <PencilIcon />
        ) : (
          <>
            <PlusIcon data-icon="inline-start" />
            New link
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit link" : "Create link"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the destination, slug, or status of this link."
                : "Paste a long URL and optionally pick a custom slug."}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="originalUrl">Destination URL</FieldLabel>
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/a/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                aria-invalid={error ? true : undefined}
                disabled={isPending}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug</FieldLabel>
              <Input
                id="slug"
                placeholder={isEdit ? undefined : "my-link"}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isPending}
                required={isEdit}
              />
              <FieldDescription>
                {isEdit
                  ? "Letters, numbers, hyphens, and underscores."
                  : "Leave blank to generate one automatically."}
              </FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isPending}
              />
              <FieldLabel htmlFor="isActive">Active</FieldLabel>
            </Field>
            {error && <FieldError>{error}</FieldError>}
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
