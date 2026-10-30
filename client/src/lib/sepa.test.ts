import { describe, expect, it } from "vitest";
import { formatIban, isValidIban, membershipCharge } from "./sepa";

describe("isValidIban", () => {
  it("accepts valid IBANs with or without spaces", () => {
    expect(isValidIban("ES50 3007 0100 1421 5938 1827")).toBe(true);
    expect(isValidIban("es9121000418450200051332")).toBe(true);
    expect(isValidIban("DE89 3704 0044 0532 0130 00")).toBe(true);
  });
  it("rejects wrong check digits, lengths and countries", () => {
    expect(isValidIban("ES51 3007 0100 1421 5938 1827")).toBe(false);
    expect(isValidIban("ES50 3007 0100 1421 5938 182")).toBe(false);
    expect(isValidIban("US12 3456 7890 1234")).toBe(false);
    expect(isValidIban("")).toBe(false);
  });
  it("formats in blocks of four", () => {
    expect(formatIban("es9121000418450200051332")).toBe("ES91 2100 0418 4502 0005 1332");
  });
});

describe("membershipCharge", () => {
  it("uses fixed amounts for full and reduced members", () => {
    expect(membershipCharge({ plan: "pleno" })).toEqual({ amount: 30, period: "mensual" });
    expect(membershipCharge({ plan: "reducida" })).toEqual({ amount: 10, period: "mensual" });
  });
  it("uses the chosen fee and frequency for supporters and companies", () => {
    expect(membershipCharge({ plan: "colaborador", cuota: "25", periodicidad: "trimestral" })).toEqual({ amount: 25, period: "trimestral" });
    expect(membershipCharge({ plan: "colaborador", cuota: "otra", cuota_otra: "7", periodicidad: "mensual" })).toEqual({ amount: 7, period: "mensual" });
    expect(membershipCharge({ plan: "empresa", cuota: "otra", cuota_otra: "40" })).toBeUndefined();
    expect(membershipCharge({ plan: "empresa", cuota: "100" })).toEqual({ amount: 100, period: "mensual" });
  });
});
