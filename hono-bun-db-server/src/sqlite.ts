"use server";
import * as path from "node:path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env.local") });
import { Database } from "bun:sqlite";
const dbErr = " Server starting without a sqlite DB connection!";

const dbUrl = process.env.SQLITE_DB;
if (!dbUrl) {
  console.error("SQLITE_DB env not set." + dbErr);
  process.exit(-1);
}

const db = new Database(dbUrl, { readonly: true });

if (!db) {
  console.error("DB connection failed." + dbErr);
  process.exit(-1);
}

export const getUsers = async () => {
  return await db.query("select * from users").all();
};

export const getUsersCount = async () => {
  const countObj: any = await db.query("select count(1) from users").get();
  return countObj["count(1)"];
};

export const getUsersHikes = async () => {
  return await db.query("select * from users_hikes").all();
};

export const getUsersHikesCount = async () => {
  const countObj: any = await db
    .query("select count(1) from users_hikes")
    .get();
  return countObj["count(1)"];
};

export const getHikes = async () => {
  return await db.query("select * from hikes").all();
};

export const getHikesCount = async () => {
  const countObj: any = await db.query("select count(1) from hikes").get();
  return countObj["count(1)"];
};

export const getBaseHikes = async () => {
  return await db.query("select * from base_hikes").all();
};

export const getBaseHikesCount = async () => {
  const countObj: any = await db.query("select count(1) from base_hikes").get();
  return countObj["count(1)"];
};

export const getBaseHikesLevels = async () => {
  return await db.query("select * from base_hikes_levels").all();
};

export const getBaseHikesLevelsCount = async () => {
  const countObj: any = await db
    .query("select count(1) from base_hikes_levels")
    .get();
  return countObj["count(1)"];
};
