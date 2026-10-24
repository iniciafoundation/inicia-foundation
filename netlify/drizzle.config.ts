import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./netlify/db/schema.ts",
  out: "./netlify/database/migrations",
});
