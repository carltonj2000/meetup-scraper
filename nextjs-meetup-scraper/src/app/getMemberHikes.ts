"use client";
import { getPath, postPath } from "./util";

export default async function getMembersHikes() {
  const j = await getPath("db/members");
  const ms = j.members;
  let stopAt = 1;
  for (let i = 2; i < ms.length; i++) {
    const user = ms[i];
    if (stopAt-- <= 0) break;
    const hikesRes = await postPath("hikes", user);
    const hikes = hikesRes.hikes;
    if (user.hikes === hikes.length) continue;
    await postPath("db/hikes", { user, hikes });
  }
}
