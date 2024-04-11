import { browser, page } from "./index";
import { JSDOM } from "jsdom";
import "dotenv/config";
import { scroll } from "./scroll";
import { getMemberHikes } from "./db";

const findTextInElem = async (elem: string, text: string) => {
  const elems = await page.$$eval(
    elem,
    (es: any, text: string) => {
      for (const e of es) {
        if (e && e.innerText && e.innerText.includes(text)) {
          return `<div id="parent">${e.parentNode.innerHTML}</div>`;
        }
      }
    },
    text
  );
  return elems;
};

export const hikes = async (c: any) => {
  console.log("get member hikes from web");
  const ah = "Attendance history";
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  let urlHns;
  let name;
  let id;
  try {
    const body = await c.req.json();
    urlHns = body.urlHns;
    name = body.name;
    id = body.id;
  } catch (e) {
    urlHns = process.env.HIKE_URL;
    name = "Use Default/Test URL";
    id = "178438672";
  }
  await page.goto(urlHns);
  await scroll(c);
  page.setDefaultTimeout(10000);
  try {
    await page.waitForSelector(`h3 ::-p-text(${ah})`, { timeout: 3000 });
  } catch (e) {
    return c.json({ message: "member hikes", hikes: [] });
  }

  let h3p = await findTextInElem("h3", ah);
  let { document } = new JSDOM(h3p).window;

  const spanInDiv = document.querySelectorAll("div > span");
  let going;
  let notGoing;
  for (let i = 0; i < spanInDiv.length; i++) {
    const sid = spanInDiv[i];
    const sidTc = sid.textContent;
    const sidCdTc = sid.closest("div")?.textContent;
    console.log({ sidTc, sidCdTc, inc: sidCdTc?.includes("not going") });
    if (sidCdTc?.includes("“going”")) going = sid.textContent;
    if (sidCdTc?.includes("“not going”")) notGoing = sid.textContent;
  }

  const hikeCount = await getMemberHikes("178438672");
  console.log({ going, notGoing, hikeCount, id });

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

  h3p = await findTextInElem("h3", ah);
  document = new JSDOM(h3p).window.document;
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
