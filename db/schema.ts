import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const linksTable = pgTable(
  "links",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // Clerk user ID; auth is handled entirely by Clerk, so there is no users table
    userId: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 64 }).notNull().unique(),
    originalUrl: text().notNull(),
    isActive: boolean().notNull().default(true),
    expiresAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("links_user_id_idx").on(table.userId)],
);

export const linkClicksTable = pgTable(
  "link_clicks",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    linkId: integer()
      .notNull()
      .references(() => linksTable.id, { onDelete: "cascade" }),
    clickedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    referrer: text(),
    userAgent: text(),
    country: varchar({ length: 2 }),
  },
  (table) => [index("link_clicks_link_id_idx").on(table.linkId)],
);

export type Link = typeof linksTable.$inferSelect;
export type NewLink = typeof linksTable.$inferInsert;
export type LinkClick = typeof linkClicksTable.$inferSelect;
export type NewLinkClick = typeof linkClicksTable.$inferInsert;
