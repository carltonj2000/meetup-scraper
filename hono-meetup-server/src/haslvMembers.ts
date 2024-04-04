import { browser, page, setPage } from "./index";

export const haslv = async (c: any) => {
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
  const newPage = await newTarget.page();
  setPage(newPage);
  await newPage.setViewport({ width: 1080, height: 1024 });
  await haslvBtnElem.dispose();
  return c.json({ message: "haslv" });
};

export const members = async (c: any) => {
  console.log("members");
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  const membersBtnElem = await page.waitForSelector("#member-count-link");
  if (!membersBtnElem) return c.json({ error: "member link not found" });
  await membersBtnElem.click();
  await membersBtnElem.dispose();
  return c.json({ message: "members" });
};
