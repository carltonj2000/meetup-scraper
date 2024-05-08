import { Hono } from "hono";
import type { FC } from "hono/jsx";
import * as sqlite from "./sqlite";

import { ShowJson } from "./index";

export const app = new Hono();

export const SqliteLinks: FC = ({ baseRoute }) => {
  return (
    <>
      <h3 style={{ marginTop: "2px" }}>SQLite</h3>
      <a href={`${baseRoute}/getUsers`}>getUsers</a>
      <a href={`${baseRoute}/getUsersHikes`}>getUsersHikes</a>
      <a href={`${baseRoute}/getHikes`}>getHikes</a>
      <a href={`${baseRoute}/getBaseHikes`}>getBaseHikes</a>
      <a href={`${baseRoute}/getBaseHikeLevels`}>getBaseHikeLevels</a>
    </>
  );
};

app.get("/getUsers", async (c) => {
  const users = await sqlite.getUsers();
  return c.html(<ShowJson title="sqlite getUsers" json={users} />);
});

app.get("/getUsersHikes", async (c) => {
  const usersHikes = await sqlite.getUsersHikes();
  return c.html(<ShowJson title="sqlite getUsersHikes" json={usersHikes} />);
});

app.get("/getHikes", async (c) => {
  const hikes = await sqlite.getHikes();
  return c.html(<ShowJson title="sqlite getHikes" json={hikes} />);
});

app.get("/getBaseHikes", async (c) => {
  const baseHikes = await sqlite.getBaseHikes();
  return c.html(<ShowJson title="sqlite getBaseHikes" json={baseHikes} />);
});

app.get("/getBaseHikeLevels", async (c) => {
  const baseHikes = await sqlite.getBaseHikeLevels();
  return c.html(<ShowJson title="sqlite getBaseHikeLevels" json={baseHikes} />);
});
