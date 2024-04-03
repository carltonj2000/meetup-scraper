# Meetup Scraper

```bash
npm init -y
npm i -D concurrently
```

## Add Back

```javascript
await page.waitForSelector("h3 ::-p-text(Group bio)");

const eventsCount = await getEventsCount(c);
let { eventsDisplayedCount, eventsDisplayed } = await getEventsDisplayed(c);

while (eventsDisplayedCount < eventsCount) {
  await scroll(c);
  const moreEventsBtn = await page.waitForSelector(
    "button ::-p-text(Show more events)"
  );
  await moreEventsBtn.click();
  await moreEventsBtn.dispose();
  const edp = await getEventsDisplayed(c);
  eventsDisplayedCount = edp.eventsDisplayedCount;
  eventsDisplayed = edp.eventsDisplayed;
```
