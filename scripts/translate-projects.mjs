import mysql from "mysql2/promise";

const baseUrl = process.env.OPENAI_API_BASE;
const apiKey = process.env.OPENAI_API_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!baseUrl || !apiKey || !databaseUrl) throw new Error("Translation environment is not configured.");

const responseSchema = {
  type: "json_schema",
  json_schema: {
    name: "project_translations",
    strict: true,
    schema: {
      type: "object",
      properties: {
        en: { type: "object", properties: { title: { type: "string" }, category: { type: "string" }, shortDescription: { type: "string" }, bodyHtml: { type: "string" } }, required: ["title", "category", "shortDescription", "bodyHtml"], additionalProperties: false },
        ru: { type: "object", properties: { title: { type: "string" }, category: { type: "string" }, shortDescription: { type: "string" }, bodyHtml: { type: "string" } }, required: ["title", "category", "shortDescription", "bodyHtml"], additionalProperties: false },
        uk: { type: "object", properties: { title: { type: "string" }, category: { type: "string" }, shortDescription: { type: "string" }, bodyHtml: { type: "string" } }, required: ["title", "category", "shortDescription", "bodyHtml"], additionalProperties: false },
      },
      required: ["en", "ru", "uk"],
      additionalProperties: false,
    },
  },
};

async function translate(project) {
  const prompt = `Translate this Spanish project record into English, Russian, and Ukrainian. Return JSON only using the supplied schema. Preserve HTML tags and links in bodyHtml. Do not add facts, remove qualifications, change stated numbers, turn concepts into implemented commitments, or change any public-authority, legal, medical, privacy, availability, or status limitation. Keep organizational names, INICIA, SEPEPA, SROI, LEADER, WhatsApp and proper names appropriately recognizable.\n\n${JSON.stringify(project)}`;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(75000),
        body: JSON.stringify({ model: "gpt-5-mini", messages: [{ role: "system", content: "You are a precise professional translator. Translate only; never embellish or make claims." }, { role: "user", content: prompt }], response_format: responseSchema, max_completion_tokens: 3000 }),
      });
      if (!response.ok) throw new Error(`Translation request failed: ${response.status} ${await response.text()}`);
      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("Translation response was empty.");
      return JSON.parse(content);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/3 failed for ${project.id}: ${error.message}`);
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 3000));
    }
  }
  throw lastError;
}

const connection = await mysql.createConnection(databaseUrl);
const [projects] = await connection.query("SELECT p.id, p.title, p.category, p.shortDescription, p.bodyHtml FROM projects p WHERE p.visibility = 'published' AND NOT EXISTS (SELECT 1 FROM projectTranslations t WHERE t.projectId = p.id AND t.locale = 'uk') ORDER BY p.id");
let completed = 0;
for (const project of projects) {
  const translations = await translate(project);
  for (const locale of ["en", "ru", "uk"]) {
    const value = translations[locale];
    await connection.execute(
      "INSERT INTO projectTranslations (id, projectId, locale, title, category, shortDescription, bodyHtml) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), shortDescription=VALUES(shortDescription), bodyHtml=VALUES(bodyHtml)",
      [`${project.id}_${locale}`, project.id, locale, value.title, value.category, value.shortDescription, value.bodyHtml],
    );
  }
  completed += 1;
  console.log(`Translated ${completed}/${projects.length}: ${project.id}`);
}
await connection.end();
console.log("Project translations completed.");
