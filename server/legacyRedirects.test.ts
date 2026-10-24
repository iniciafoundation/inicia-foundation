import { describe, expect, it } from "vitest";
import { getLegacyRedirectTarget, isLegacyUnavailableArchivePath, isLegacyUnavailableLegalPath } from "./legacyRedirects";

describe("legacy public-route redirects", () => {
  it("redirects the changed legacy organisational section to its equivalent portal anchor", () => {
    expect(getLegacyRedirectTarget("/quienes-somos/")).toBe("/#quienes-somos");
  });

  it("normalizes trailing slashes only where the equivalent portal path exists", () => {
    expect(getLegacyRedirectTarget("/proyectos/")).toBe("/proyectos");
    expect(getLegacyRedirectTarget("/contacto/")).toBe("/contacto");
    expect(getLegacyRedirectTarget("/ideologia/")).toBe("/ideologia");
    expect(getLegacyRedirectTarget("/galeria/")).toBe("/galeria");
    expect(getLegacyRedirectTarget("/colaborar/")).toBe("/colaborar");
    expect(getLegacyRedirectTarget("/proyectos/conecta-asturias/")).toBe("/proyectos/conecta-asturias");
    expect(getLegacyRedirectTarget("/proyectos/nucleo/")).toBe("/proyectos/nucleo");
    expect(getLegacyRedirectTarget("/proyectos/rural-futures/")).toBe("/proyectos/rural-futures");
  });

  it("redirects the changed CoopAstur legacy slug to its approved portal slug", () => {
    expect(getLegacyRedirectTarget("/proyectos/coopastur/")).toBe("/proyectos/coopastur-agrosocial");
  });

  it("redirects historical project presentations to their approved modern project routes", () => {
    expect(getLegacyRedirectTarget("/presentation/conecta.html")).toBe("/proyectos/conecta-asturias");
    expect(getLegacyRedirectTarget("/presentation/coopastur.html")).toBe("/proyectos/coopastur-agrosocial");
    expect(getLegacyRedirectTarget("/presentation/nucleo.html")).toBe("/proyectos/reutiliza-y-forma");
  });

  it("does not redirect current canonical paths or unrelated paths", () => {
    expect(getLegacyRedirectTarget("/proyectos")).toBeUndefined();
    expect(getLegacyRedirectTarget("/admin")).toBeUndefined();
    expect(getLegacyRedirectTarget("/")).toBeUndefined();
  });

  it("recognizes only the old unavailable legal pages for a transparent 410 response", () => {
    expect(isLegacyUnavailableLegalPath("/legal/aviso-legal.html")).toBe(true);
    expect(isLegacyUnavailableLegalPath("/legal/privacidad.html")).toBe(true);
    expect(isLegacyUnavailableLegalPath("/legal/cookies.html")).toBe(true);
    expect(isLegacyUnavailableLegalPath("/identidad")).toBe(false);
  });

  it("recognizes non-equivalent legacy archive pages for a transparent 410 response", () => {
    expect(isLegacyUnavailableArchivePath("/index_congreso.html")).toBe(true);
    expect(isLegacyUnavailableArchivePath("/presentation/index.html")).toBe(true);
    expect(isLegacyUnavailableArchivePath("/presentation/index%20copia.html")).toBe(true);
    expect(isLegacyUnavailableArchivePath("/proyectos")).toBe(false);
  });
});
