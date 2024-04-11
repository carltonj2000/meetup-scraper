import { Hono } from "hono";
import { CSVToArray } from "../util";
import "dotenv/config";
import fs from "fs/promises";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { hikesT, userHikesT, usersT } from "../../db/schema";
import { eq, sql, and } from "drizzle-orm";
import { restore } from "./restore";

const dbFile = process.env.DB;
const dbErr = " Server starting without a DB connection!";
if (!dbFile) {
  console.error("DB env not set." + dbErr);
  process.exit(-1);
}
const sqlite = new Database(dbFile);
export const db = drizzle(sqlite);
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
  await db.insert(usersT).values(membersIns);
  const membersFew = members.filter((m: any) =>
    m[0].includes("Carlton Joseph")
  );
  return c.json({ message: "json2db", cj: membersFew, membersIns });
});

dbRoute.get("/members", async (c: any) => {
  const members = await db.select().from(usersT);
  return c.json({ members });
});

dbRoute.post("/hikes", async (c: any) => {
  console.log("save members hikes to db");
  const data = await c.req.json();
  const { user, hikes } = data;
  const userDb = await db.select().from(usersT).where(eq(usersT.id, user.id));
  if (user.hikes !== userDb[0].hikes) {
    await db
      .update(usersT)
      .set({ hikes: hikes.length })
      .where(eq(usersT.id, user.id));
  }
  for (let i = 0; i < hikes.length; i++) {
    const hike = hikes[i];
    let hikeDb = await db
      .select()
      .from(hikesT)
      .where(and(eq(hikesT.name, hike.name), eq(hikesT.date, hike.date)));
    if (hikeDb.length === 0) {
      hikeDb = await db
        .insert(hikesT)
        .values({ name: hike.name, date: hike.date })
        .returning();
    }
    const userHike = {
      userId: user.id,
      hikeId: hikeDb[0].id,
      attended: hike.goNoGo,
    };
    await db.insert(userHikesT).values(userHike);
  }
  return c.json({ message: "hikes saved" });
});

dbRoute.get("/restore", async (c: any) => {
  await restore(c);
  return c.json({ message: "hikes saved" });
});

export const updateMemberLink = async (id: string, urlHns: string) => {
  await db.update(usersT).set({ urlHns }).where(eq(usersT.id, id)).run();
};

export const updateMemberHikes = async (id: string, hikes: number) => {
  const updated = sql`(CURRENT_TIMESTAMP)`;
  await db
    .update(usersT)
    .set({ hikes, updated })
    .where(eq(usersT.id, id))
    .run();
};

export const getMemberHikes = async (id: string) => {
  return await db.select().from(userHikesT).where(eq(userHikesT.userId, id));
};

export default dbRoute;
