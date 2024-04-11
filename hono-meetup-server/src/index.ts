import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { hikes } from "./hikes";
import { closeBrowser, login, openBrowser } from "./openCloseLogin";
import { haslv, members } from "./haslvMembers";
import { member } from "./member";
import { scroll } from "./scroll";

const app = new Hono();
app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

export let browser: any = null;
export let page: any = null;
export const setBrowser = (newBrowser: any) => (browser = newBrowser);
export const setPage = (newPage: any) => (page = newPage);

process.once("SIGHUP", () => browser && browser.close());

app.get("/openBrowser", async (c) => await openBrowser(c));
app.get("/closeBrowser", async (c) => await closeBrowser(c));
app.get("/login", async (c) => await login(c));
app.get("/haslv", async (c) => await haslv(c));
app.get("/members", async (c) => await members(c));
app.get("/member/:id", async (c) => await member(c));
app.post("/hikes", async (c) => await hikes(c));
app.get("/scroll", async (c) => await scroll(c));

const port = 3333;
console.log(`Server is running on port ${port}`);
serve({ fetch: app.fetch, port });
