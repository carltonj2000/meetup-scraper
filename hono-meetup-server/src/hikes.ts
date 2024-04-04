import { browser, page } from "./index";

export const hikes = async (c: any) => {
  console.log("member hikes");
  if (!browser || !page) return c.json({ error: "browser or page not open" });
  const body = await c.req.json();
  await page.goto(body.urlHns);
  page.setDefaultTimeout(5000);
  try {
    await page.waitForSelector("h3 ::-p-text(Attendance history)");
  } catch (e) {
    return c.json({ message: "member hikes", body, hikes: [], totalHikes: 0 });
  }
  let moreHikes = true;
  while (moreHikes) {
    try {
      const moreHbtn = await page.waitForSelector(
        "button ::-p-text(Show more events)",
        {
          timeout: 3000,
        }
      );
      moreHbtn.click();
      moreHbtn.dispose();
    } catch (e) {
      moreHikes = false;
    }
  }
  return c.json({ message: "member hikes", body });
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
