"use client";
import { getPath, postPath } from "./util";

export default async function getMembersHikes() {
  const j = await getPath("db/members");
  const ms = j.members;
  let stopAt = 10;
  for (let i = 0; i < ms.length; i++) {
    const user = ms[i];
    if (stopAt-- <= 0) break;
    const hikesRes = await postPath("hikes", user);
    const hikes = hikesRes.hikes;
    await postPath("db/hikes", { user, hikes });
  }
}
