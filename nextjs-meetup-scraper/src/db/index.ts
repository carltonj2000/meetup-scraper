"use server";
import { CSVToArray } from "./csv2array";
import fs from "fs/promises";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import {
  hikesT,
  userHikesT,
  usersT,
  usersOld1,
  baseHikesT,
  baseHikesLevelT,
} from "./schema";
import { eq, sql, and, desc } from "drizzle-orm";
import {
  hikes as blHikes,
  levels as blLevels,
  colorsLevel as blColors,
} from "./seedBaseHikes";

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

const dbFileOld = process.env.DB_OLD;
const dbErrOld = " Server starting without a DBOld connection!";
if (!dbFileOld) {
  console.error("DB_OLD env not set." + dbErrOld);
  process.exit(-1);
}
const sqliteOld = new Database(dbFileOld);
const dbOld = drizzle(sqliteOld);
if (!dbOld) {
  console.error("DBOld connection failed." + dbErrOld);
  process.exit(-1);
}

export const json2db = async () => {
  const csvFile = process.env.CSV_FILE;
  if (!csvFile) {
    return { message: "Did not find CSV_FILE environment variable." };
  }
  const membersStr = (await fs.readFile(csvFile)).toString();
  const membersNh = CSVToArray(membersStr, ",");
  const members = membersNh.slice(1);
  const membersIns = members.map((m: string[]) => ({
    name: m[0],
    id: m[3],
    url: m[18],
  }));
  await db.insert(usersT).values(membersIns);
  const membersFew = members.filter((m: any) =>
    m[0].includes("Carlton Joseph")
  );
  return { message: "json2db", cj: membersFew, membersIns };
};

export const getUserById = async (id: string) =>
  (await db.select().from(usersT).where(eq(usersT.id, id)))[0];
export const members = async () => await db.select().from(usersT);
export const membersByHikes = async () =>
  await db.select().from(usersT).orderBy(desc(usersT.hikes));

export const membersByHikesAttended = async () => {
  const users = await db.select().from(usersT);
  const hikesAttended = await Promise.all(
    users.map(async (user) => {
      const hikes = await db
        .select()
        .from(userHikesT)
        .where(eq(userHikesT.userId, user.id));
      const attended = hikes.reduce(
        (prev, hike) => (hike.attended === "Went" ? prev + 1 : prev),
        0
      );
      return { ...user, attended };
    })
  );
  const hikesAttendedSorted = hikesAttended.sort((a, b) =>
    a.attended > b.attended ? -1 : 1
  );
  return hikesAttendedSorted;
};
export const hikes = async () =>
  (await db.select().from(hikesT)).sort((a, b) => a.name.localeCompare(b.name));
export const getHikesById = async (id: number) =>
  (await db.select().from(hikesT).where(eq(hikesT.id, id)))[0];
export const getUserHikes = async (id: string) =>
  await db.select().from(userHikesT).where(eq(userHikesT.userId, id));
export const getBaseHikesByLevel = async (level: number) =>
  (await db.select().from(baseHikesT).where(eq(baseHikesT.level, level))).sort(
    (a, b) => a.name.localeCompare(b.name)
  );

export const hikesSave = async (data: any) => {
  const { user, hikes } = data;
  const userDb = await db.select().from(usersT).where(eq(usersT.id, user.id));
  if (hikes.length !== userDb[0].hikes) {
    const hgt =
      hikes.length > (userDb[0].hikes || 0) ? hikes.length : userDb[0].hikes;
    const h = await db
      .update(usersT)
      .set({ hikes: hgt })
      .where(eq(usersT.id, user.id))
      .returning({ hikes: usersT.hikes });
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
    const userHikesDb = await db
      .select()
      .from(userHikesT)
      .where(
        and(eq(userHikesT.userId, user.id), eq(userHikesT.hikeId, hikeDb[0].id))
      );
    if (userHikesDb.length !== 0) continue;
    const userHike = {
      userId: user.id,
      hikeId: hikeDb[0].id,
      attended: hike.goNoGo,
    };
    await db.insert(userHikesT).values(userHike);
  }
};

export const updateMemberLink = async (id: string, urlHns: string) =>
  db.update(usersT).set({ urlHns }).where(eq(usersT.id, id)).run();

export const updateMemberHikes = async (id: string, hikes: number) =>
  db
    .update(usersT)
    .set({ hikes, updated: sql`(CURRENT_TIMESTAMP)` })
    .where(eq(usersT.id, id))
    .run();

export const restore = async () => {
  const usersOld = await dbOld.select().from(usersOld1);
  usersOld.forEach(async (userOld) => {
    await db.insert(usersOld1).values({ ...userOld });
  });
  return { message: "hikes restored from backup" };
};

export const deleteUsersHikes = async () => await db.delete(userHikesT);
export const deleteHikes = async () => await db.delete(hikesT);
export const deleteBaseHikes = async () => await db.delete(baseHikesT);
export const deleteBaseHikesLevels = async () =>
  await db.delete(baseHikesLevelT);

export const seedBaseHikesLevels = async () => {
  for (let i = 0; i < blLevels.length; i++) {
    const baseHikeLevel = await db
      .select()
      .from(baseHikesLevelT)
      .where(eq(baseHikesLevelT.id, i));
    if (baseHikeLevel.length) continue;
    await db
      .insert(baseHikesLevelT)
      .values({ id: i, name: blLevels[i], color: blColors[i] });
  }
};

export const seedBaseHikes = async () => {
  for (let i = 0; i < blHikes.length; i++) {
    const levelHikes = blHikes[i];
    for (let j = 0; j < levelHikes.length; j++) {
      const hike = levelHikes[j];
      const hikeDb = await db
        .select()
        .from(baseHikesT)
        .where(eq(baseHikesT.name, hike[0]));
      if (hikeDb.length) continue;
      await db.insert(baseHikesT).values({ name: hike[0], level: i });
    }
  }
};

export const getBaseHikes = async () => await db.select().from(baseHikesT);

export const updateUsersHikes = async () => {
  const users = await db.select().from(usersT);
  Promise.all(
    users.map(async (user) => {
      const hikes = await db
        .select()
        .from(userHikesT)
        .where(eq(userHikesT.userId, user.id));
      db.update(usersT)
        .set({ hikes: hikes.length })
        .where(eq(usersT.id, user.id))
        .run();
    })
  );
};
