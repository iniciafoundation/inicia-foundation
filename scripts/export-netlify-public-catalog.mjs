import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is unavailable; no export was performed.");

const connection = await mysql.createConnection(databaseUrl);
try {
  const [projects] = await connection.execute(
    `SELECT id, slug, title, category, shortDescription, bodyHtml, heroImageUrl, status, visibility
       FROM projects
      WHERE visibility = 'published'
      ORDER BY slug ASC`,
  );
  const [translations] = await connection.execute(
    `SELECT id, projectId, locale, title, category, shortDescription, bodyHtml
       FROM projectTranslations
      ORDER BY projectId ASC, locale ASC`,
  );
  const output = {
    exportedAt: new Date().toISOString(),
    source: "current INICIA public catalog only",
    projects,
    translations,
  };
  const destination = path.resolve("netlify/database/seed/public-catalog.json");
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Exported ${projects.length} public projects and ${translations.length} translations to ${destination}`);
} finally {
  await connection.end();
}
