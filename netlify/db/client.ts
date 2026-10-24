import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: ReturnType<typeof postgres> | undefined;

export function getNetlifyDb() {
  const connectionString = process.env.NETLIFY_DB_URL;
  if (!connectionString) {
    throw new Error("Netlify Database is not configured. Set up the database only in the separate Netlify site.");
  }
  client ??= postgres(connectionString, { prepare: false, max: 1 });
  return drizzle(client, { schema });
}
