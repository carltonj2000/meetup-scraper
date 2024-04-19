"use server";
import { members, getUserHikes, hikesSave, getUserById } from "../db";

const postPath = async (p: any, b: any) => {
  try {
    const res = await fetch(`http://localhost:3333/${p}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(b),
    });
    const reader = res.body?.getReader();
    let done, value, j;
    while (reader && !done) {
      ({ value, done } = await reader.read());
      if (done) break;
      const data = new TextDecoder().decode(value);
      j = await JSON.parse(data);
    }
    return j;
  } catch (e) {
    console.error({ e });
    return null;
  }
};

export const getMembersHikes = async () => {
  const ms = await members();
  const startAt = 381;
  let stopAt = 100;
  for (let i = startAt; i < ms.length; i++) {
    const user = ms[i];
    const hikesOld = await getUserHikes(user.id);
    if (stopAt-- <= 0) break;
    const hikesRes = await postPath("hikes", { ...user, hikesOld, i });
    if (hikesRes && hikesRes.error) return { error: hikesRes.error };
    const hikes = hikesRes.hikes;
    if (!hikes || hikesOld.length === hikes.length) continue;
    hikesSave({ user, hikes });
  }
};
