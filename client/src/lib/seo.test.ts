import { describe, expect, it } from "vitest";
import { getSiteMetadata } from "./seo";

describe("public SEO metadata", () => {
  it("uses the institutional public brand on the home page", () => {
    const metadata = getSiteMetadata("/");
    expect(metadata.title).toBe("INICIA Foundation | ONG en Asturias: inclusión y voluntariado");
    expect(metadata.description).toContain("acompaña a familias");
    expect(metadata.robots).toBe("index,follow");
  });

  it("keeps participation wording on participation routes rather than as the site-wide brand", () => {
    expect(getSiteMetadata("/solicitud/socio").title).toContain("Socios y voluntariado");
    expect(getSiteMetadata("/proyectos").title).toContain("Proyectos sociales en Asturias");
  });

  it("prevents search indexing of private administration", () => {
    expect(getSiteMetadata("/admin").robots).toContain("noindex");
  });
});
