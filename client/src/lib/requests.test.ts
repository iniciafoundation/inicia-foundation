import { describe, expect, it } from "vitest";
import { flatten, isRequestType, makeReference } from "./requests";

describe("requests", () => {
  it("flattens arrays and booleans and drops empty values", () => {
    expect(flatten({ areas: ["idiomas", "eventos"], urgente: true, mayor_18: false, vacio: "", nada: undefined, personas: 3 }))
      .toEqual({ areas: "idiomas, eventos", urgente: "sí", mayor_18: "no", personas: "3" });
  });
  it("creates readable references", () => {
    expect(makeReference(new Date(2026, 9, 25))).toMatch(/^INI-261025-[A-Z0-9]{1,4}$/);
  });
  it("validates request types", () => {
    expect(isRequestType("voluntariado")).toBe(true);
    expect(isRequestType("spam")).toBe(false);
  });
});
