"use server";
import * as path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env.local") });
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import {
  NewBaseHikeLevelT,
  NewBaseHikeT,
  NewHikeT,
  NewUserHikeT,
  NewUserT,
  baseHikesLevelsT,
  baseHikesT,
  hikesT,
  usersHikesT,
  usersT,
} from "./schema";
import { count, eq } from "drizzle-orm";

const dbErr = " Server starting without a DB connection!";

const dbUrl = process.env.POSTGRES_URL;

if (!dbUrl) {
  console.error("POSTGRES_URL env not set." + dbErr);
  process.exit(-1);
}

export const db = drizzle(sql);

if (!db) {
  console.error("DB connection failed." + dbErr);
  process.exit(-1);
}

export const getUsers = async () => await db.select().from(usersT);

export const getUsersCount = async () =>
  (await db.select({ count: count() }).from(usersT))[0]["count"];

export const putUsers = async (users: NewUserT[]) => {
  return await db.insert(usersT).values(users);
};

export const deleteUsers = async () => await db.delete(usersT);

export const getUsersHikes = async () => await db.select().from(usersHikesT);

export const getUsersHikesCount = async () =>
  (await db.select({ count: count() }).from(usersHikesT))[0]["count"];

export const putUsersHikes = async (usersHikes: NewUserHikeT[]) => {
  return await db.insert(usersHikesT).values(usersHikes);
};

export const deleteUsersHikes = async () => await db.delete(usersHikesT);

export const getHikes = async () => await db.select().from(hikesT);

export const getHikesCount = async () =>
  (await db.select({ count: count() }).from(hikesT))[0]["count"];

export const putHikes = async (hikes: NewHikeT[]) => {
  return await db.insert(hikesT).values(hikes);
};

export const deleteHikes = async () => await db.delete(hikesT);

export const getBaseHikes = async () => await db.select().from(baseHikesT);

export const getBaseHikesCount = async () =>
  (await db.select({ count: count() }).from(baseHikesT))[0]["count"];

export const putBaseHikes = async (hikes: NewBaseHikeT[]) => {
  return await db.insert(baseHikesT).values(hikes);
};

export const deleteBaseHikes = async () => {
  await db.delete(baseHikesT);
};

export const getBaseHikesLevels = async () =>
  await db.select().from(baseHikesLevelsT);

export const getBaseHikesLevelsCount = async () =>
  (await db.select({ count: count() }).from(baseHikesLevelsT))[0]["count"];

export const putBaseHikesLevels = async (level: NewBaseHikeLevelT[]) => {
  await db.insert(baseHikesLevelsT).values(level);
};

export const deleteBaseHikesLevels = async () => {
  await db.delete(baseHikesLevelsT);
};
