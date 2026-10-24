import { describe, expect, it } from "vitest";
import { boundaryResponse, INICIA_ASSISTANT_SYSTEM_PROMPT, normalizeAssistantQuestion } from "./assistant";

describe("INICIA public assistant boundaries", () => {
  it("normalizes a visitor question without retaining excess whitespace", () => {
    expect(normalizeAssistantQuestion("  ¿Cómo   contacto   con INICIA?  ")).toBe("¿Cómo contacto con INICIA?");
  });

  it("contains explicit restrictions on sensitive data and professional advice", () => {
    expect(INICIA_ASSISTANT_SYSTEM_PROMPT).toContain("Never request or process sensitive personal data");
    expect(INICIA_ASSISTANT_SYSTEM_PROMPT).toContain("Do not give legal, medical, tax, immigration, financial, emergency, or case-specific advice");
    expect(INICIA_ASSISTANT_SYSTEM_PROMPT).toContain("do not invent street addresses");
  });

  it("returns a safe deterministic referral for a migration-law question", () => {
    expect(boundaryResponse("¿Qué debo hacer en mi caso de extranjería?")).toContain("No puedo ofrecer asesoramiento jurídico");
  });
});
