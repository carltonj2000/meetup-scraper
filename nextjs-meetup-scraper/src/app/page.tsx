"use client";
import GetMembersLink from "./getMemberLinks";
import { Button } from "@/components/ui/button";
import gmHs from "./getMemberHikes";
import { getPath } from "./util";

function Home() {
  return (
    <main className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <Button onClick={async () => await getPath("openBrowser")}>
        Open Meetup
      </Button>
      <Button onClick={async () => await getPath("login")}>Login</Button>
      <Button onClick={async () => await gmHs()}>Get Member Hikes</Button>
      <Button
        onClick={async () => {
          await getPath("openBrowser");
          await getPath("login");
          await gmHs();
        }}
        variant="outline"
      >
        To Here
      </Button>
      <Button onClick={async () => await getPath("member/11614620")}>
        Select Member
      </Button>
      <GetMembersLink />
      <Button onClick={async () => await getPath("db/members")}>
        Get Member
      </Button>
      <Button onClick={async () => await getPath("scroll")}>
        Scroll To End
      </Button>
      {/* <Browser action="haslv" description="Select Group" /> */}
      <Button onClick={async () => await getPath("closeBrowser")}>
        Close Browser
      </Button>
    </main>
  );
}

export default Home;
