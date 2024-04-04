"use client";
import { Button } from "@/components/ui/button";
import { getPath, postPath } from "./util";
import { useState } from "react";

export default function GetMembersHikes() {
  const [members, membersSet] = useState([]);
  const gp = async () => {
    const j = await getPath("db/members");
    const ms = j.members;
    console.log({ ms });
    membersSet(ms);
    let stopAt = 1;
    for (let i = 2; i < ms.length; i++) {
      const m = ms[i];
      if (stopAt <= 0) break;
      const mh = await postPath("hikes", m);
      stopAt--;
      console.log({ mh });
    }
  };
  return (
    <>
      <Button onClick={() => gp()} variant="outline">
        Get Member Hikes
      </Button>
      {members && members.length > 0 && (
        <div>
          <p>Saw {members.length} member</p>
        </div>
      )}
    </>
  );
}
