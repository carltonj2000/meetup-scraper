import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users, usersOld1 } from "../../db/schema";
import { db as dbNew } from "./index";

const dbFile = process.env.DB_OLD;
const dbErr = " Server starting without a DB connection!";
if (!dbFile) {
  console.error("DB_OLD env not set." + dbErr);
  process.exit(-1);
}
const sqlite = new Database(dbFile);
const db = drizzle(sqlite);
if (!db) {
  console.error("DB connection failed." + dbErr);
  process.exit(-1);
}

export const restore = async (c: any) => {
  console.log("restoring");
  const usersOld = await db.select().from(usersOld1);
  usersOld.forEach(async (userOld) => {
    await dbNew.insert(users).values({ ...userOld });
  });
  return c.json({ message: "hikes restored from backup" });
};
