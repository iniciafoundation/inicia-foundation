import { describe, expect, it } from "vitest";
import { findAnswers } from "./HelpAssistant";

const answers = [
  { q: "Quiero donar", a: "IBAN", keys: "donar donacion transferencia bizum" },
  { q: "¿Dónde estáis?", a: "Gijón", keys: "donde direccion gijon aviles oviedo" },
  { q: "Хочу стать волонтёром", a: "форма", keys: "волонтер помогать" },
];

describe("findAnswers", () => {
  it("matches accents and word forms", () => {
    expect(findAnswers("¿Cómo puedo hacer una donación?", answers)[0].q).toBe("Quiero donar");
    expect(findAnswers("dirección en Avilés", answers)[0].q).toBe("¿Dónde estáis?");
  });
  it("works in Cyrillic", () => {
    expect(findAnswers("как стать волонтером", answers)[0].q).toBe("Хочу стать волонтёром");
  });
  it("returns nothing for empty or unrelated queries", () => {
    expect(findAnswers("", answers)).toEqual([]);
    expect(findAnswers("xyzzy", answers)).toEqual([]);
  });
});
