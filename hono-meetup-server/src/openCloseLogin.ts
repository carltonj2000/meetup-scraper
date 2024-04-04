import puppeteer from "puppeteer";
import "dotenv/config";
import { setBrowser, setPage, browser, page } from "./index";

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const url = process.env.URL;
if (!email || !password || !url) {
  console.error(
    "Server will not start. Environment website, email or password not set"
  );
  process.exit(-1);
}

export const openBrowser = async (c: any) => {
  const browser = await puppeteer.launch({ headless: false });
  setBrowser(browser);
  const page = await browser.newPage();
  setPage(page);
  await page.goto(url);
  await page.setViewport({ width: 1080, height: 1024 });
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(10000);
  return c.json({ message: "browser open" });
};

export const closeBrowser = async (c: any) => {
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  await browser.close();
  return c.json({ message: "browser closed" });
};

export const login = async (c: any) => {
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
  await Promise.all([page.waitForNavigation(), loginBtnElem?.click()]);
  await loginBtnElem?.dispose();
  await page.waitForSelector("h2 ::-p-text(Events from your groups)");
  return c.json({ message: "logged in" });
};
