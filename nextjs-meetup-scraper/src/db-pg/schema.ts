import { text, sqliteTable, integer, unique } from "drizzle-orm/sqlite-core";

export const usersT = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  hnsId: text("hns_id"),
  name: text("name").notNull(),
  url: text("url"),
  urlHns: text("url_hns"),
  hikes: integer("hikes").default(0),
  updated: integer("updated", { mode: "timestamp" }),
});

export type NewUserT = typeof usersT.$inferInsert;
export type UserT = typeof usersT.$inferSelect;

export const userHikesT = sqliteTable(
  "user_hikes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersT.id),
    hikeId: integer("hike_id")
      .notNull()
      .references(() => hikesT.id),
    attended: text("attended"),
  },
  (t) => ({ unq: unique("hike_per_user").on(t.userId, t.hikeId) })
);

export type NewUserHikeT = typeof userHikesT.$inferInsert;
export type UserHikeT = typeof userHikesT.$inferSelect;

export const hikesT = sqliteTable(
  "hikes",
  {
    id: integer("id", { mode: "number" })
      .primaryKey({ autoIncrement: true })
      .notNull(),
    name: text("name").notNull(),
    baseHikeId: text("base_hike_id").references(() => baseHikesT.id),
    date: text("date"),
  },
  (t) => ({ unq: unique("hike_per_date").on(t.name, t.date) })
);

export type NewHikeT = typeof hikesT.$inferInsert;
export type HikeT = typeof hikesT.$inferSelect;

export const baseHikesT = sqliteTable("base_hikes", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .notNull(),
  name: text("name").notNull(),
  level: integer("level").references(() => baseHikesLevelT.id),
});

export type NewBaseHikeT = typeof baseHikesT.$inferInsert;
export type BaseHikeT = typeof baseHikesT.$inferSelect;

export const baseHikesLevelT = sqliteTable("base_level_hikes", {
  id: integer("level", { mode: "number" }).primaryKey().notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export type NewBaseHikeLevelT = typeof baseHikesLevelT.$inferInsert;
export type BaseHikeLevelT = typeof baseHikesLevelT.$inferSelect;

export const usersOld1 = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  url: text("url"),
  urlHns: text("url_hns"),
  hikes: integer("hikes").default(0),
  updated: integer("updated", { mode: "timestamp" }),
});
