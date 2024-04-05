import { Hono } from "hono";
import { CSVToArray } from "./util";
import "dotenv/config";
import fs from "fs/promises";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../db/schema";
import { eq, sql } from "drizzle-orm";

const dbFile = process.env.DB;
const dbErr = " Server starting without a DB connection!";
if (!dbFile) {
  console.error("DB env not set." + dbErr);
  process.exit(-1);
}
const sqlite = new Database(dbFile);
const db = drizzle(sqlite);
if (!db) {
  console.error("DB connection failed." + dbErr);
  process.exit(-1);
}

const dbRoute = new Hono();
dbRoute.get("/json2db", async (c: any) => {
  const csvFile = process.env.CSV_FILE;
  if (!csvFile) {
    return c.json({ message: "Did not find CSV_FILE environment variable." });
  }
  const membersStr = (await fs.readFile(csvFile)).toString();
  const membersNh = CSVToArray(membersStr, ",");
  const members = membersNh.slice(1);
  const membersIns = members.map((m) => ({ name: m[0], id: m[3], url: m[18] }));
  await db.insert(users).values(membersIns);
  const membersFew = members.filter((m) => m.includes("Carlton Joseph"));
  return c.json({ message: "json2db", cj: membersFew, membersIns });
});

dbRoute.get("/members", async (c: any) => {
  const members = await db.select().from(users);
  return c.json({ members });
});

dbRoute.post("/hikes", async (c: any) => {
  const data = await c.req.json();
  console.log({ data });
  return c.json({ message: "hikes saved" });
});

export const updateMemberLink = async (id: string, urlHns: string) => {
  await db.update(users).set({ urlHns }).where(eq(users.id, id)).run();
};

export const updateMemberHikes = async (id: string, hikes: number) => {
  const updated = sql`(CURRENT_TIMESTAMP)`;
  await db.update(users).set({ hikes, updated }).where(eq(users.id, id)).run();
};

export default dbRoute;
