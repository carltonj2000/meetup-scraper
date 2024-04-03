import type { Config } from "drizzle-kit";
import "dotenv/config";

const dbFile = process.env.DB;
const dbErr = " Server starting without a DB connection!";
if (!dbFile) {
  console.error("DB env not set." + dbErr);
  process.exit(-1);
}

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: dbFile,
  },
} satisfies Config;
