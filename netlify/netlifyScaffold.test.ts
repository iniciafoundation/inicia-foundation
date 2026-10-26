import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import health from "./functions/health";
import legalGone from "./functions/legal-gone";

describe("isolated Netlify migration scaffold", () => {
  it("keeps the static Vite build and functions paths explicit", () => {
    const config = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
    expect(config).toContain('command = "pnpm exec vite build && node scripts/prerender.mjs"');
    expect(config).toContain('publish = "dist/public"');
    expect(config).toContain('functions = "netlify/functions"');
    expect(config).toContain('VITE_DEPLOY_TARGET = "netlify"');
  });

  it("has an honest non-sensitive health response", async () => {
    const response = await health();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "migration-scaffold", configured: false });
  });

  it("returns an explicit non-publication response for retired legal pages", async () => {
    const response = await legalGone();
    expect(response.status).toBe(410);
    await expect(response.text()).resolves.toMatch(/Documento no publicado/);
  });
});
