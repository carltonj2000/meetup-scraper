import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  urlHns: text("url_hns"),
  hikes: integer("hikes").default(0),
  updated: integer("updated", { mode: "timestamp" }),
});

export type NewUserT = typeof users.$inferInsert;
export type UserT = typeof users.$inferSelect;

export const userHikes = sqliteTable("user_hikes", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  url: text("url").notNull(),
});

export type NewUserHikeT = typeof userHikes.$inferInsert;
export type UserHikeT = typeof userHikes.$inferSelect;
