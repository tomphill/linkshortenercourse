import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Link2Icon } from "lucide-react";
import { getLinksByUserId } from "@/data/links";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteLinkDialog } from "./delete-link-dialog";
import { LinkFormDialog } from "./link-form-dialog";

export const metadata: Metadata = { title: "Dashboard | Link Shortener" };

async function LinksCard() {
  const { userId } = await auth.protect();
  const links = await getLinksByUserId(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your links</CardTitle>
        <CardDescription>
          {links.length === 0
            ? "You haven't created any links yet."
            : `${links.length} ${links.length === 1 ? "link" : "links"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Link2Icon />
            <p>Create your first short link to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short link</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">/{link.slug}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:underline"
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={link.isActive ? "secondary" : "outline"}>
                      {link.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {link.createdAt.toLocaleDateString("en-US", {
                      dateStyle: "medium",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <LinkFormDialog link={link} />
                    <DeleteLinkDialog id={link.id} slug={link.slug} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Create, edit, and delete your short links.
          </p>
        </div>
        <LinkFormDialog />
      </div>
      <Suspense
        fallback={<p className="text-muted-foreground">Loading links...</p>}
      >
        <LinksCard />
      </Suspense>
    </main>
  );
}
