import { hikes } from "./hikes";
import { login, openBrowser } from "./openCloseLogin";

export const toHere = async (c: any) => {
  await openBrowser(c);
  await login(c);
  await hikes(c);
  // await haslv(c);
  // await member(c);
  // await scroll(c);
  return c.json({ message: "logged in" });
};
