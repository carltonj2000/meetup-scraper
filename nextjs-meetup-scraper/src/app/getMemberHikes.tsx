"use client";
import { Button } from "@/components/ui/button";
import { getPath, postPath } from "./util";
import { useState } from "react";

export default function GetMembersHikes() {
  const [members, membersSet] = useState([]);
  const gp = async () => {
    const j = await getPath("db/members");
    const ms = j.members;
    membersSet(ms);
    let stopAt = 1;
    for (let i = 2; i < ms.length; i++) {
      const member = ms[i];
      if (stopAt <= 0) break;
      const hikesRes = await postPath("hikes", member);
      const hikes = hikesRes.hikes;
      await postPath("db/hikes", { member, hikes });
      stopAt--;
    }
  };
  return (
    <>
      <Button onClick={() => gp()}>Get Member Hikes</Button>
      {members && members.length > 0 && (
        <div>
          <p>Saw {members.length} member</p>
        </div>
      )}
    </>
  );
}
