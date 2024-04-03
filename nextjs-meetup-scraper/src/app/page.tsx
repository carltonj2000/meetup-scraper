"use client";
import Browser from "./browser";
import GetMembersLink from "./getMemberLinks";

function Home() {
  return (
    <main className="max-w-xl mx-auto bg-gray-50 py-4 flex flex-col gap-3 items-center justify-center">
      <Browser action="openBrowser" description="Open Meetup" />
      <Browser action="login" description="Login" />
      {/* <Browser action="haslv" description="Select Group" /> */}
      <Browser action="member/11614620" description="Select Member" />
      <Browser action="toHere" description="To Here" variant="outline" />
      <GetMembersLink />
      <Browser action="db/members" description="Show Members" showJson={true} />
      <Browser action="scroll" description="Scroll To End" />
      <Browser action="closeBrowser" description="Close Browser" />
    </main>
  );
}

export default Home;
