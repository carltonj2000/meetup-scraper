import {
  text,
  pgTable,
  integer,
  unique,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

export const usersT = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  hnsId: text("hns_id"),
  name: text("name").notNull(),
  url: text("url"),
  urlHns: text("url_hns"),
  hikes: integer("hikes").default(0),
  updated: timestamp("updated"),
});

export type NewUserT = typeof usersT.$inferInsert;
export type UserT = typeof usersT.$inferSelect;

export const usersHikesT = pgTable(
  "users_hikes",
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

export type NewUserHikeT = typeof usersHikesT.$inferInsert;
export type UserHikeT = typeof usersHikesT.$inferSelect;

export const hikesT = pgTable(
  "hikes",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    baseHikeId: serial("base_hike_id").references(() => baseHikesT.id),
    date: text("date"),
  },
  (t) => ({ unq: unique("hike_per_date").on(t.name, t.date) })
);

export type NewHikeT = typeof hikesT.$inferInsert;
export type HikeT = typeof hikesT.$inferSelect;

export const baseHikesT = pgTable("base_hikes", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  level: integer("level").references(() => baseHikesLevelsT.id),
});

export type NewBaseHikeT = typeof baseHikesT.$inferInsert;
export type BaseHikeT = typeof baseHikesT.$inferSelect;

export const baseHikesLevelsT = pgTable("base_hikes_levels", {
  id: integer("level").primaryKey().notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export type NewBaseHikeLevelT = typeof baseHikesLevelsT.$inferInsert;
export type BaseHikeLevelT = typeof baseHikesLevelsT.$inferSelect;
