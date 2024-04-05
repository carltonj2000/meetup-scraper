"use server";
import fs from "fs/promises";
import path from "path";

export const restartNodemon = async () => {
  console.log("restart nodemon");
  const file = path.join(process.env.PWD!, "../hono-meetup-server/src/util.ts");
  const date = new Date();
  fs.utimes(file, date, date);
};
