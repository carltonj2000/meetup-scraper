"use server";
import path from "path";
import { members, getUserHikes, hikesSave } from "../db";

const postPath = async (p: any, b: any) => {
  const res = await fetch(`http://localhost:3333/${p}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(b),
  });
  const json = await res.json();
  return json;
};

export const getMembersHikes = async () => {
  console.log("getMembersHikes");
  const { logFile } = getLogFile();

  const ms = await members();
  // let stopAt = 1;
  for (let i = 0; i < ms.length; i++) {
    const user = ms[i];
    const hikesOld = await getUserHikes(user.id);
    // if (stopAt-- <= 0) break;
    const hikesRes = await postPath("hikes", { ...user, hikesOld, i, logFile });
    if (hikesRes.error) return { error: hikesRes.error };
    const hikes = hikesRes.hikes;
    if (hikes || hikesOld.length === hikes.length) continue;
    hikesSave({ user, hikes });
  }
  console.log("getMembersHikes end");
};

const getLogFile = () => {
  let logDir = process.env.LOG_DIR;
  if (!logDir) {
    logDir = "~/";
    console.log("Did not find LOG_DIR env Using:" + logDir);
  }
  const d = new Date();
  const date =
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, "0") +
    "_" +
    String(d.getDate()).padStart(2, "0") +
    "-" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    String(d.getSeconds()).padStart(2, "0");
  const logFile = path.join(logDir, `getMembersHikes_${date}.log`);
  return { logFile };
};
