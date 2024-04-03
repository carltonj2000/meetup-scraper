"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { getPath } from "./util";
import { useState } from "react";

export default function GetMembersLink() {
  const [members, membersSet] = useState([]);
  const gp = async () => {
    const j = await getPath("db/members");
    const ms = j.members;
    console.log({ ms });
    membersSet(ms);
    let stopAt = 200;
    for (let i = 0; i < ms.length; i++) {
      const m = ms[i];
      if (stopAt < 0) break;
      if (m.urlHns) continue;
      const mr = await getPath(`member/${m.id}`);
      stopAt--;
      console.log({ mr });
    }
  };
  return (
    <>
      <Button onClick={() => gp()}>Get Member Links</Button>
      <div>
        <p>Saw {members.length} member</p>
      </div>
    </>
  );
}
