"use server";
import * as path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env.local") });
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import {
  NewBaseHikeT,
  baseHikesLevelsT,
  baseHikesT,
  hikesT,
  usersHikesT,
  usersT,
} from "./schema";
import { eq } from "drizzle-orm";

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
export const getUsersHikes = async () => await db.select().from(usersHikesT);
export const getHikes = async () => await db.select().from(hikesT);
export const getBaseHikes = async () => await db.select().from(baseHikesT);
export const getBaseHikesLevels = async () =>
  await db.select().from(baseHikesLevelsT);

export const putBaseHikes = async (hikes: NewBaseHikeT[]) => {
  return await db.insert(baseHikesT).values(hikes);
};

export const putBaseHikesLevels = async (hikes: NewBaseHikeT) => {
  await db.insert(baseHikesT).values(hikes);
};
