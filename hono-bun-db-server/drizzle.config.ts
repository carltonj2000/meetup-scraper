import type { Config } from "drizzle-kit";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env.local") });

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("POSTGRES_URL env not set.");
  process.exit(-1);
}

export default {
  schema: "./src/schema.ts",
  out: "./drizzle/pg",
  driver: "pg",
  dbCredentials: { connectionString },
} satisfies Config;
