import fs from "fs/promises";
import path from "path";

const fileName = "sqlite";
const fileExt = "db";
const srcDir = "/renderws/carltonData/cj2024/code/monorepo/meetup-scraper";
const dstDir = "/renderws/carltonData/cj2024/backups/meetup-scraper/";
const s = path.join(srcDir, `${fileName}.${fileExt}`);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}${mm}_${dd}${months[today.getMonth()]}`;
};

const getDFileName = async () => {
  const date = getDate();
  let d = path.join(dstDir, `${fileName}_${date}.${fileExt}`);
  let exists;
  try {
    exists = await fs.stat(d);
  } catch {
    return d;
  }

  let i = 1;
  while (exists) {
    d = path.join(dstDir, `${fileName}_${date}_x${i}.${fileExt}`);
    try {
      exists = await fs.stat(d);
      i++;
    } catch {
      break;
    }
  }
  return d;
};
const main = async () => {
  console.log("back up started");
  const d = await getDFileName();
  console.log({ s, d });
  await fs.copyFile(s, d);
};

main()
  .then(() => console.log("back up finished"))
  .catch((e) => console.error({ e }));
