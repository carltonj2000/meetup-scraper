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

export const getUsersHikes = async () => {
  return await db.query("select * from users_hikes").all();
};

export const getHikes = async () => {
  return await db.query("select * from hikes").all();
};

export const getBaseHikes = async () => {
  return await db.query("select * from base_hikes").all();
};

export const getBaseHikeLevels = async () => {
  return await db.query("select * from base_hikes_levels").all();
};
