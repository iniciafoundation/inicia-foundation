import { describe, expect, it } from "vitest";
import { canOpenApplicationIntake } from "./applicationIntake";

describe("public application intake gate", () => {
  it("keeps the intake closed while legal documents are loading", () => {
    expect(canOpenApplicationIntake(true, true, true)).toBe(false);
  });

  it("keeps the intake closed when either required legal document is absent", () => {
    expect(canOpenApplicationIntake(false, false, true)).toBe(false);
    expect(canOpenApplicationIntake(false, true, false)).toBe(false);
  });

  it("opens the intake only when both required legal documents are active", () => {
    expect(canOpenApplicationIntake(false, true, true)).toBe(true);
  });
});
