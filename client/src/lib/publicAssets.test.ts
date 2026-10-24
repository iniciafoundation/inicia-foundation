import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { publicAssets } from "./publicAssets";

describe("public Netlify assets", () => {
  it("uses site-local paths instead of Manus-managed storage", () => {
    for (const assetPath of Object.values(publicAssets)) {
      expect(assetPath).toMatch(/^\/assets\/inicia\//);
      expect(assetPath).not.toContain("manus-storage");
    }
  });

  it("includes every approved visual asset in the Netlify public build input", () => {
    for (const assetPath of Object.values(publicAssets)) {
      expect(existsSync(resolve(process.cwd(), "client/public", `.${assetPath}`))).toBe(true);
    }
  });
});
