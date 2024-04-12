"use server";
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
  const ms = await members();
  let stopAt = 10;
  for (let i = 0; i < ms.length; i++) {
    const user = ms[i];
    const hikesOld = await getUserHikes(user.id);
    if (stopAt-- <= 0) break;
    const hikesRes = await postPath("hikes", { ...user, hikesOld });
    const hikes = hikesRes.hikes;
    if (hikesOld.length === hikes.length) continue;
    hikesSave({ user, hikes });
  }
};
