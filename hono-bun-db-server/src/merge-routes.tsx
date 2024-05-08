import { Hono } from "hono";
import type { FC } from "hono/jsx";

import * as sqlite from "./sqlite";
import * as vercelPg from "./vercel-pg";
import { ShowJson } from "./index";
import {
  NewBaseHikeLevelT,
  NewBaseHikeT,
  NewHikeT,
  NewUserHikeT,
  NewUserT,
  baseHikesLevelsT,
} from "./schema";

export const app = new Hono();

export const MergeLinks: FC = ({ baseRoute }) => {
  return (
    <>
      <h3 style={{ marginTop: "2px" }}>Merge DB</h3>
      <a href={`${baseRoute}/baseHikesLevels`}>baseHikesLevels</a>
      <a href={`${baseRoute}/baseHikesLevelsVercelPgClr`}>
        baseHikeLevelsVercelPgClr
      </a>

      <a href={`${baseRoute}/baseHikes`}>baseHikes</a>
      <a href={`${baseRoute}/baseHikesVercelPgClr`}>
        baseHikeLevelsVercelPgClr
      </a>

      <a href={`${baseRoute}/hikes`}>hikes</a>
      <a href={`${baseRoute}/hikesVercelPgClr`}>hikesVercelPgClr</a>

      <a href={`${baseRoute}/users`}>users</a>
      <a href={`${baseRoute}/usersVercelPgClr`}>usersVercelPgClr</a>

      <a href={`${baseRoute}/usersHikes`}>usersHikes</a>
      <a href={`${baseRoute}/usersHikesVercelPgClr`}>usersHikesVercelPgClr</a>
    </>
  );
};

app.get("/baseHikesLevels", async (c) => {
  const countPg = await vercelPg.getBaseHikesLevelsCount();
  const countSq = await sqlite.getBaseHikesLevelsCount();
  if (countPg === countSq)
    return c.html(
      <ShowJson
        title="merge getBaseHikesLevels"
        json={{ message: "nothing added table same length", countPg, countSq }}
      />
    );
  const bhlSq = (await sqlite.getBaseHikesLevels()) as NewBaseHikeLevelT[];
  const bhlPgResult = await vercelPg.putBaseHikesLevels(bhlSq);
  return c.html(
    <ShowJson
      title="merge getBaseHikesLevels"
      json={{ countPg, countSq, bhlPgResult }}
    />
  );
});

app.get("/baseHikesLevelsVercelPgClr", async (c) => {
  const clrResult = await vercelPg.deleteBaseHikesLevels();
  return c.html(
    <ShowJson title="merge deleteBaseHikesLevels" json={{ clrResult }} />
  );
});

app.get("/baseHikes", async (c) => {
  const hikesPg = await vercelPg.getBaseHikesCount();
  const hikesSq = await sqlite.getBaseHikesCount();
  if (hikesPg === hikesSq)
    return c.html(
      <ShowJson
        title="merge getBaseHikes"
        json={{ message: "nothing added table same length", hikesPg, hikesSq }}
      />
    );
  const bhSq = (await sqlite.getBaseHikes()) as NewBaseHikeT[];
  const bhPgResult = await vercelPg.putBaseHikes(bhSq);
  return c.html(
    <ShowJson
      title="merge getBaseHikes"
      json={{ hikesPg, hikesSq, bhPgResult }}
    />
  );
});

app.get("/baseHikesVercelPgClr", async (c) => {
  const clrResult = await vercelPg.deleteBaseHikes();
  return c.html(
    <ShowJson title="merge deleteBaseHikes" json={{ clrResult }} />
  );
});

app.get("/hikes", async (c) => {
  const hikesPg = await vercelPg.getHikesCount();
  const hikesSq = await sqlite.getHikesCount();
  if (hikesPg === hikesSq)
    return c.html(
      <ShowJson
        title="merge getHikes"
        json={{ message: "nothing added table same length", hikesPg, hikesSq }}
      />
    );
  const hSq = await sqlite.getHikes();
  const h = hSq.map((h: any) => ({
    id: h.id,
    name: h.name,
    date: h.date,
  })) satisfies NewHikeT[];
  const hPgResult = await vercelPg.putHikes(h);
  return c.html(
    <ShowJson
      title="merge getBaseHikes"
      json={{ hikesPg, hikesSq, hPgResult }}
    />
  );
});

app.get("/hikesVercelPgClr", async (c) => {
  const clrResult = await vercelPg.deleteHikes();
  return c.html(<ShowJson title="merge deleteHikes" json={{ clrResult }} />);
});

app.get("/users", async (c) => {
  const usersPg = await vercelPg.getUsersCount();
  const usersSq = await sqlite.getUsersCount();
  if (usersPg === usersSq)
    return c.html(
      <ShowJson
        title="merge getUsers"
        json={{ message: "nothing added table same length", usersPg, usersSq }}
      />
    );
  const uSq = (await sqlite.getUsers()) as NewUserT[];
  const uPgResult = await vercelPg.putUsers(uSq);
  return c.html(
    <ShowJson
      title="merge getBaseHikes"
      json={{ usersPg, usersSq, uPgResult }}
    />
  );
});

app.get("/usersVercelPgClr", async (c) => {
  const clrResult = await vercelPg.deleteUsers();
  return c.html(<ShowJson title="merge deleteUsers" json={{ clrResult }} />);
});

app.get("/usersHikes", async (c) => {
  const usersHikesPg = await vercelPg.getUsersHikesCount();
  const usersHikesSq = await sqlite.getUsersHikesCount();
  if (usersHikesPg === usersHikesSq)
    return c.html(
      <ShowJson
        title="merge getUsersHikes"
        json={{
          message: "nothing added table same length",
          usersHikesPg,
          usersHikesSq,
        }}
      />
    );
  const uhSq = (await sqlite.getUsersHikes()) as NewUserHikeT[];
  const uh = uhSq.map((h: any) => ({
    userId: h.user_id,
    hikeId: h.hike_id,
    attended: h.attended,
  })) satisfies NewUserHikeT[];
  const uhPgResult = await vercelPg.putUsersHikes(uh);
  return c.html(
    <ShowJson
      title="merge getBaseHikes"
      json={{ usersHikesPg, usersHikesSq, uhPgResult }}
    />
  );
});

app.get("/usersHikesVercelPgClr", async (c) => {
  const clrResult = await vercelPg.deleteUsersHikes();
  return c.html(
    <ShowJson title="merge deleteUsersHikes" json={{ clrResult }} />
  );
});
