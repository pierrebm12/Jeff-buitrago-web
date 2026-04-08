import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const showsTable = pgTable("shows", {
  id: serial("id").primaryKey(),
  place: text("place").notNull(),
  day: text("day").notNull(),
  time: text("time"),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertShowSchema = createInsertSchema(showsTable).omit({ id: true, createdAt: true });
export type InsertShow = z.infer<typeof insertShowSchema>;
export type Show = typeof showsTable.$inferSelect;
