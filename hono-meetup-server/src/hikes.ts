import { browser, page } from "./index";
import { JSDOM } from "jsdom";
import "dotenv/config";
import { scroll } from "./scroll";

export const hikes = async (c: any) => {
  console.log("get member hikes from web");
  const ah = "Attendance history";
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  let urlHns;
  let name;
  try {
    const body = await c.req.json();
    urlHns = body.urlHns;
    name = body.name;
  } catch (e) {
    urlHns = process.env.HIKE_URL;
    name = "Use Default/Test URL";
  }
  await page.goto(urlHns);
  console.log({ name, urlHns });
  await scroll(c);
  page.setDefaultTimeout(10000);
  try {
    await page.waitForSelector(`h3 ::-p-text(${ah})`, { timeout: 3000 });
  } catch (e) {
    return c.json({ message: "member hikes", hikes: [] });
  }
  let moreHikes = true;
  while (moreHikes) {
    try {
      await scroll(c);
      const moreHbtn = await page.waitForSelector(
        "button ::-p-text(Show more events)",
        { timeout: 2000 }
      );
      moreHbtn.click();
      console.log("moreHbtn.click();");
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
    const name = hikeNdate[0].textContent;
    const date = hikeNdate[1].textContent;
    const goNoGoA = children2[2].textContent?.split("\n");
    const goNoGo = goNoGoA[goNoGoA?.length - 1];
    hikes.push({ name, date, goNoGo });
  }

  // await updateMemberLink(id, urlHns);
  return c.json({ message: "member hikes", hikes });
};
