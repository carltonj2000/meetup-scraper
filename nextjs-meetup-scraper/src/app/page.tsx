"use client";
import GetMembersLink from "./getMemberLinks";
import { Button } from "@/components/ui/button";
import { getMembersHikes } from "./getMemberHikes";
import { getPath } from "./util";
import {
  deleteHikes,
  deleteUsersHikes,
  json2db,
  members,
  restore,
  seedBaseHikes,
  seedBaseHikesLevels,
  updateUsersHikes,
} from "../db/index";
import { restartNodemon } from "./actions";
import { toast } from "@/components/ui/use-toast";

function Home() {
  return (
    <main className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <Button onClick={async () => await getPath("openBrowser")}>
            Open Meetup
          </Button>
          <Button onClick={async () => await getPath("login")}>Login</Button>
          <Button
            onClick={async () => {
              const result = await getMembersHikes();
              if (result?.error) {
                toast({
                  title: "Error",
                  description: result.error,
                  variant: "destructive",
                });
              }
            }}
          >
            Get Member Hikes
          </Button>
          <Button
            onClick={async () => {
              await getPath("openBrowser");
              await getPath("login");
              await getMembersHikes();
            }}
            variant="outline"
          >
            To Here
          </Button>
          <Button onClick={async () => await getPath("member/11614620")}>
            Select Member
          </Button>
          <GetMembersLink />
          <Button onClick={async () => await members()}>Get Member</Button>
          <Button onClick={async () => await getPath("scroll")}>
            Scroll To End
          </Button>
          {/* <Browser action="haslv" description="Select Group" /> */}
          <Button onClick={async () => await getPath("closeBrowser")}>
            Close Browser
          </Button>
        </div>
        <div className="flex flex-col gap-2 min-h-fit justify-end">
          <Button
            variant="destructive"
            onClick={async () => await updateUsersHikes()}
          >
            Update Users Hikes
          </Button>
          <Button
            variant="destructive"
            onClick={async () => await seedBaseHikes()}
          >
            Seed Base Hikes
          </Button>
          <Button
            variant="destructive"
            onClick={async () => await seedBaseHikesLevels()}
          >
            Seed Base Hike Levels
          </Button>
          <Button variant="destructive" onClick={async () => await json2db()}>
            Member JSON To DB
          </Button>
          <Button variant="destructive" onClick={async () => await restore()}>
            Restore Old To New Empty DB
          </Button>
          <Button variant="destructive" type="submit" onClick={deleteHikes}>
            Delete Base Hikes
          </Button>
          <Button
            variant="destructive"
            type="submit"
            onClick={deleteUsersHikes}
          >
            Delete Users Hikes
          </Button>
          <Button
            variant="destructive"
            type="submit"
            onClick={async () => await restartNodemon()}
          >
            Restart NodeMon
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Home;
