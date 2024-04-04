import { browser, page } from "./index";
import { updateMemberLink } from "./db";
import { JSDOM } from "jsdom";

const getEventsCount = async (c: any) => {
  const r: string = await page.$$eval("div", (divs: any) => {
    for (const d of divs) {
      if (
        d &&
        d.innerText &&
        d.innerText.includes("events attended") &&
        d.innerText.length < "12345 events attended".length
      ) {
        return d.innerText;
      }
    }
  });
  if (!r) return c.json({ error: "events attended not found" });
  const eventCount = Number(r.split(" ")[0]);
  console.log({ r, eventCount });
  return eventCount;
};

const getEventsDisplayed = async (c: any) => {
  const events = await page.$$eval("h3", (h3s: any) => {
    for (const h of h3s) {
      if (h && h.innerText && h.innerText.includes("Attendance history")) {
        return `<div id="parent"> ${h.parentNode.innerHTML} </div>`;
      }
    }
  });
  if (!events) return c.json({ error: "Attendance history not found" });

  const { document } = new JSDOM(events).window;
  const parent = document.getElementById("parent");
  if (!parent) return c.json({ error: "No parent found" });
  let len = 0;
  for (const c of parent.children) {
    len++;
  }
  console.log({ children: len });
  return { eventsDisplayedCount: len, eventsDisplayed: parent };
};

export const member = async (c: any, idIn?: string = "11614620") => {
  console.log("member");
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  const id = c.req.param("id") || idIn;
  const memberUrl = `https://www.meetup.com/Hike-and-Scramble-Las-Vegas/members/${id}/`;
  await page.goto(memberUrl);
  page.setDefaultTimeout(10000);
  let moreGroups = true;
  while (moreGroups) {
    try {
      await page.waitForSelector("a ::-p-text(Hike and Scramble Las Vegas)", {
        timeout: 3000,
      });
      moreGroups = false;
    } catch (e) {
      const moreGbtn = await page.waitForSelector(
        "button ::-p-text(Show more groups)"
      );
      moreGbtn.click();
      moreGbtn.dispose();
    }
  }
  const haslv = await page.$$eval("a", (anchs: any) => {
    for (const anch of anchs) {
      if (
        anch &&
        anch.innerText &&
        anch.innerText.includes("Hike and Scramble Las Vegas")
      ) {
        return `<div id="parent"> ${anch.parentNode.innerHTML} </div>`;
      }
    }
  });
  const { document } = new JSDOM(haslv).window;
  const parent = document.getElementById("parent")!;
  if (!parent) return c.json({ error: "No membership details parent found." });
  let urlHns = null;
  for (const a of parent.children) {
    if (a && a.text && a.text === "Membership details") {
      urlHns = a.href;
      break;
    }
  }
  await updateMemberLink(id, urlHns);
  if (!url) return c.json({ error: "No membership details url found." });

  return c.json({ message: "member", id });
};
