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
  hikeId: text("hike_id")
    .notNull()
    .references(() => hikes.id),
  attended: text("attended"),
});

export type NewUserHikeT = typeof userHikes.$inferInsert;
export type UserHikeT = typeof userHikes.$inferSelect;

export const hikes = sqliteTable("hikes", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  baseHikeId: text("base_hike_id").references(() => baseHikes.id),
  date: integer("date", { mode: "timestamp" }),
});

export type NewHikeT = typeof hikes.$inferInsert;
export type HikeT = typeof hikes.$inferSelect;

export const baseHikes = sqliteTable("base_hikes", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export type NewBaseHikeT = typeof baseHikes.$inferInsert;
export type BaseHikeT = typeof baseHikes.$inferSelect;
