import { browser, page } from "./index";
import { JSDOM } from "jsdom";
import "dotenv/config";

export const hikes = async (c: any) => {
  console.log("member hikes");
  const ah = "Attendance history";
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  let urlHns;
  try {
    const body = await c.req.json();
    urlHns = body.urlHns;
  } catch (e) {
    urlHns = process.env.HIKE_URL;
  }
  await new Promise((r) => setTimeout(r, 3000));
  await page.goto(urlHns);
  page.setDefaultTimeout(10000);
  try {
    await page.waitForSelector(`h3 ::-p-text(${ah})`);
  } catch (e) {
    return c.json({ message: "member hikes", hikes: [] });
  }
  let moreHikes = true;
  while (moreHikes) {
    try {
      const moreHbtn = await page.waitForSelector(
        "button ::-p-text(Show more events)",
        { timeout: 2000 }
      );
      moreHbtn.click();
      moreHbtn.dispose();
    } catch (e) {
      moreHikes = false;
    }
  }

  const h3p = await page.$$eval("h3", (h3s: any) => {
    const ah = "Attendance history";
    for (const h3 of h3s) {
      if (h3 && h3.innerText && h3.innerText.includes(ah)) {
        return `<div id="parent"> ${h3.parentNode.innerHTML} </div>`;
      }
    }
  });
  const { document } = new JSDOM(h3p).window;
  const parent = document.getElementById("parent")!;
  if (!parent) return c.json({ error: `"${ah}" not found!` });
  const start = 3;
  let idx = 0;
  const children = [...parent.children];
  const hikes: any = [];
  for (let i = 0; i < children.length; i++) {
    if (idx++ < start) continue;
    const child = children[i];
    const children2 = [...child.children];
    const hikeNdate = [...children2[1].children];
    const hike = hikeNdate[0].textContent;
    const date = hikeNdate[1].textContent;
    const goNoGoA = children2[2].textContent?.split("\n");
    const goNoGo = goNoGoA[goNoGoA?.length - 1];
    console.log({ hike, date, goNoGo, i, len: children.length });
    hikes.push({ hike, date, goNoGo });
  }

  // await updateMemberLink(id, urlHns);
  return c.json({ message: "member hikes", hikes });
};
