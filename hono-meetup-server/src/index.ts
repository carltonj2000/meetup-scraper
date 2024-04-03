import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import puppeteer from "puppeteer";
import "dotenv/config";
import dbRoutes, { updateMemberLink } from "./db";
import { JSDOM } from "jsdom";

const url = process.env.URL;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
if (!email || !password || !url) {
  console.error(
    "Server will not start. Environment website, email or password not set"
  );
  process.exit(-1);
}

const app = new Hono();
app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);
app.route("/db", dbRoutes);

let browser: any = null;
let page: any = null;

process.once("SIGHUP", function () {
  if (browser) browser.close();
});

const openBrowser = async (c: any) => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("https://meetup.com/");
  await page.setViewport({ width: 1080, height: 1024 });
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(10000);
  return c.json({ message: "browser open" });
};
app.get("/openBrowser", async (c) => openBrowser(c));

const closeBrowser = async (c: any) => {
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  await browser.close();
  return c.json({ message: "browser closed" });
};
app.get("/closeBrowser", async (c) => closeBrowser(c));

const login = async (c: any) => {
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  const loginLinkElem = await page.waitForSelector("#login-link");
  await loginLinkElem?.click();
  await loginLinkElem?.dispose();
  const emailElem = await page.waitForSelector("#email");
  await emailElem?.type(email);
  await emailElem?.dispose();
  const passwordElem = await page.waitForSelector("#current-password");
  await passwordElem?.type(password);
  await passwordElem?.dispose();
  const loginBtnElem = await page.waitForSelector("button ::-p-text(Log in)");
  const [response] = await Promise.all([
    page.waitForNavigation(),
    loginBtnElem?.click(),
  ]);
  await loginBtnElem?.dispose();
  await page.waitForSelector("h2 ::-p-text(Events from your groups)");
  return c.json({ message: "logged in" });
};

app.get("/login", async (c) => login(c));

const haslv = async (c: any) => {
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  const haslvBtnElem = await page.waitForSelector(
    "p ::-p-text(Hike and Scramble Las Vegas)"
  );
  if (!haslvBtnElem) return c.json({ error: "haslv link not found" });
  const pageTarget = page.target();
  await haslvBtnElem.click();
  const newTarget = await browser.waitForTarget(
    (target: any) => target.opener() === pageTarget
  );
  if (!newTarget) return c.json({ error: "haslv new page not created" });
  page = await newTarget.page();
  await page.setViewport({ width: 1080, height: 1024 });
  await haslvBtnElem.dispose();
  return c.json({ message: "haslv" });
};
app.get("/haslv", async (c) => haslv(c));

const members = async (c: any) => {
  console.log("members");
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  const membersBtnElem = await page.waitForSelector("#member-count-link");
  if (!membersBtnElem) return c.json({ error: "member link not found" });
  await membersBtnElem.click();
  await membersBtnElem.dispose();
  return c.json({ message: "members" });
};
app.get("/members", async (c) => members(c));

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

const member = async (c: any, idIn?: string = "11614620") => {
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
app.get("/member/:id", async (c) => {
  return member(c);
});

const scroll = async (c: any) => {
  const maxScrolls = 20;
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0;
      var distance = 1000;
      var scrolls = 0;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrolls++;

        if (
          totalHeight >= scrollHeight - window.innerHeight ||
          scrolls >= maxScrolls
        ) {
          clearInterval(timer);
          resolve(0);
        }
      }, 500);
    });
  }, maxScrolls);
};
app.get("/scroll", async (c) => scroll(c));

const toHere = async (c: any) => {
  await openBrowser(c);
  await login(c);
  // await haslv(c);
  await member(c);
  // await scroll(c);
  return c.json({ message: "logged in" });
};
app.get("/toHere", async (c) => toHere(c));

const port = 3333;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
