import { browser, page } from "./index";
import { JSDOM } from "jsdom";
import "dotenv/config";
import { scroll } from "./scroll";
import fs from "fs/promises";
import path from "path";

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

const getLogger = (logFile: string) => {
  return async (msg: string) => {
    console.log(msg);
    if (logFile) {
      const fh = await fs.open(logFile, "a");
      fs.writeFile(fh, msg + "\n");
      await fh.close();
    }
  };
};

export const hikes = async (c: any) => {
  console.log("hikes");
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  let urlHns, name, hikesOld, memberIdx, logFile;
  try {
    const body = await c.req.json();
    urlHns = body.urlHns;
    name = body.name;
    hikesOld = body.hikesOld;
    memberIdx = body.i;
    logFile = body.logFile;
  } catch (e) {
    urlHns = process.env.HIKE_URL;
    name = "Use Default/Test URL";
    hikesOld = 0;
    memberIdx = 0;
    logFile = path.join("~/", "getMembersHikes.log");
  }
  console.log({ logFile });
  const logger = await getLogger(null);
  await logger("get member hikes from web");
  const ah = "Attendance history";
  await logger(JSON.stringify({ urlHns, memberIdx }));
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
  let going = "0";
  let notGoing = "0";
  for (let i = 0; i < spanInDiv.length; i++) {
    const sid = spanInDiv[i];
    const sidTc = sid.textContent;
    const sidCdTc = sid.closest("div")?.textContent;
    if (sidCdTc?.includes("“going”")) going = sid.textContent || "0";
    if (sidCdTc?.includes("“not going”")) notGoing = sid.textContent || "0";
  }

  await logger(JSON.stringify({ going, notGoing, hikesOld }));

  if (hikesOld === going + notGoing)
    return c.json({ message: "member hikes", hikes: [] });
  let moreHikes = true;
  let count = 0;
  while (moreHikes) {
    try {
      await scroll(c);
      const moreHbtn = await page.waitForSelector(
        "button ::-p-text(Show more events)",
        { timeout: 2000 }
      );
      moreHbtn.click();
      logger(`moreHbtn.click(); ${count}\r`);
      moreHbtn.dispose();
    } catch (e) {
      moreHikes = false;
    }
    count++;
  }

  h3p = await findTextInElem("h3", ah);
  document = new JSDOM(h3p).window.document;
  const parent = document.getElementById("parent")!;
  if (!parent) return c.json({ error: `"${ah}" not found!` });
  const start = 3;
  let idx = 0;
  const children = [...parent.children];

  const hikesNew: any = [];
  for (let i = 0; i < children.length; i++) {
    if (idx++ < start) continue;
    const child = children[i];
    const children2 = [...child.children];
    const hikeNdate = [...children2[1].children];
    const name = hikeNdate[0].textContent;
    const date = hikeNdate[1].textContent;
    const goNoGoA = children2[2].textContent?.split("\n");
    const goNoGo = goNoGoA[goNoGoA?.length - 1];
    hikesNew.push({ name, date, goNoGo });
  }

  // await updateMemberLink(id, urlHns);
  return c.json({ message: "member hikes", hikes: hikesNew });
};
