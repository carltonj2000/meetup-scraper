import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import type { FC } from "hono/jsx";
import { Style } from "hono/css";

import * as styles from "./styles";
import { app as sqliteRoutes, SqliteLinks } from "./sqlite-routes";
import { app as vercelPgRoutes, VercelPgLinks } from "./vercel-pg-routes";

const app = new Hono();
app.use(logger());
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

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <Style />
      </head>
      <body>
        <h1>DB Migration Server</h1>
        <div class={styles.sideBySideCss}>
          <div class={styles.navCss}>
            <SqliteLinks baseRoute="/sqlite" />
            <VercelPgLinks baseRoute="/vercelPg" />
          </div>
          <div>{props.children}</div>
        </div>
      </body>
    </html>
  );
};

export const ShowJson: FC = (props) => {
  return (
    <Layout>
      <h2 style={{ marginTop: "2px" }}>{props.title}</h2>
      <code>
        <pre>{JSON.stringify(props.json, null, 2)}</pre>
      </code>
    </Layout>
  );
};

app.get("/", (c) => {
  return c.html(
    <Layout>
      <h2 style={{ marginTop: "2px" }}>Nothing Selected</h2>
    </Layout>
  );
});

app.route("/sqlite", sqliteRoutes);
app.route("/vercelPg", vercelPgRoutes);

export default { port: 4444, fetch: app.fetch };
