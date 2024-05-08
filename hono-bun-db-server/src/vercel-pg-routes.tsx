import { Hono } from "hono";
import type { FC } from "hono/jsx";
import * as vercelPg from "./vercel-pg";

import { ShowJson } from "./index";

export const app = new Hono();

export const VercelPgLinks: FC = ({ baseRoute }) => {
  return (
    <>
      <h3 style={{ marginTop: "2px" }}>Vercel PG</h3>
      <a href={`${baseRoute}/getUsers`}>getUsers</a>
      <a href={`${baseRoute}/getUsersHikes`}>getUsersHikes</a>
      <a href={`${baseRoute}/getHikes`}>getHikes</a>
      <a href={`${baseRoute}/getBaseHikes`}>getBaseHikes</a>
      <a href={`${baseRoute}/getBaseHikeLevels`}>getBaseHikeLevels</a>
    </>
  );
};

app.get("/getUsers", async (c) => {
  const users = await vercelPg.getUsers();
  return c.html(<ShowJson title="vercelPg getUsers" json={users} />);
});

app.get("/getUsersHikes", async (c) => {
  const usersHikes = await vercelPg.getUsersHikes();
  return c.html(<ShowJson title="vercelPg getUsersHikes" json={usersHikes} />);
});

app.get("/getHikes", async (c) => {
  const hikes = await vercelPg.getHikes();
  return c.html(<ShowJson title="vercelPg getHikes" json={hikes} />);
});

app.get("/getBaseHikes", async (c) => {
  const baseHikes = await vercelPg.getBaseHikes();
  return c.html(<ShowJson title="vercelPg getBaseHikes" json={baseHikes} />);
});

app.get("/getBaseHikeLevels", async (c) => {
  const baseHikes = await vercelPg.getBaseHikesLevels();
  return c.html(
    <ShowJson title="vercelPg getBaseHikeLevels" json={baseHikes} />
  );
});
