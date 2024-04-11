import type { Config } from "drizzle-kit";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env.local") });

const dbFile = process.env.DB;
if (!dbFile) {
  console.error("DB env not set.");
  process.exit(-1);
}

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: dbFile,
  },
} satisfies Config;
