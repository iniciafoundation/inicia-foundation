import { describe, expect, it } from "vitest";
import { cardLinkFor, donationReference, isOlaCode, newOlaCode, olaLink, shareUrl } from "./participation";

describe("donations to a project", () => {
  it("puts the project in the bank reference, within 35 characters", () => {
    expect(donationReference()).toBe("Donativo");
    expect(donationReference("Reutiliza y Forma")).toBe("Donativo Reutiliza y Forma");
    expect(donationReference("Laboratorio de Innovación Social: Modelos Disruptivos").length).toBeLessThanOrEqual(35);
  });

  it("tags Stripe payment links with the project and leaves other links alone", () => {
    expect(cardLinkFor("https://buy.stripe.com/abc123", "reutiliza-y-forma")).toBe("https://buy.stripe.com/abc123?client_reference_id=reutiliza-y-forma");
    expect(cardLinkFor("https://www.paypal.com/donate/?id=1", "reutiliza-y-forma")).toBe("https://www.paypal.com/donate/?id=1");
    expect(cardLinkFor("https://buy.stripe.com/abc123", undefined)).toBe("https://buy.stripe.com/abc123");
    expect(cardLinkFor("", "x")).toBe("");
  });
});

describe("Tu ola", () => {
  it("creates valid 8-character codes and links", () => {
    const code = newOlaCode();
    expect(isOlaCode(code)).toBe(true);
    expect(olaLink(code)).toBe(`https://iniciafoundation.org/?ref=${code}`);
    expect(isOlaCode("ABC")).toBe(false);
    expect(isOlaCode("abc12345")).toBe(true);
  });
});

describe("share links", () => {
  it("encodes the URL and text without third-party widgets", () => {
    expect(shareUrl("whatsapp", "https://iniciafoundation.org/", "Hola")).toBe("https://wa.me/?text=Hola%20https%3A%2F%2Finiciafoundation.org%2F");
    expect(shareUrl("facebook", "https://iniciafoundation.org/x", "t")).toBe("https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Finiciafoundation.org%2Fx");
  });
});
