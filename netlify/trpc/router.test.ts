import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getUser: vi.fn() }));
vi.mock("@netlify/identity", () => ({ getUser: mocks.getUser, logout: vi.fn() }));
vi.mock("../db/client", () => ({ getNetlifyDb: vi.fn() }));
vi.mock("../lib/storage", () => ({ getPrivateEvidence: vi.fn(), putPrivateEvidence: vi.fn() }));

import { netlifyAppRouter } from "./router";

const context = () => ({ request: new Request("https://preview.example/api/trpc"), ip: "127.0.0.1" });

describe("Netlify independent CRM router", () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    delete process.env.NETLIFY_APPLICATION_INTAKE_ENABLED;
  });

  it("maps a Netlify Identity admin user into the existing CRM role shape", async () => {
    mocks.getUser.mockResolvedValue({ id: "identity-owner", email: "owner@example.org", userMetadata: { fullName: "Owner" }, roles: ["admin"] });
    const caller = netlifyAppRouter.createCaller(context());
    await expect(caller.auth.me()).resolves.toMatchObject({ id: "identity-owner", role: "admin", email: "owner@example.org" });
  });

  it("keeps legal, medical, and case-specific prompts outside the assistant scope", async () => {
    const caller = netlifyAppRouter.createCaller(context());
    const reply = await caller.assistant.chat({ message: "Necesito asesoramiento jurídico para mi caso" });
    expect(reply.answer).toMatch(/no sustituye asesoramiento jurídico/i);
  });

  it("rejects public application intake while the independent legal configuration is closed", async () => {
    const caller = netlifyAppRouter.createCaller(context());
    await expect(caller.crm.public.submitApplication({ applicationType: "socio", fullName: "Persona de prueba", email: "person@example.org", privacyDocumentId: "doc_privacy", agreementDocumentId: "doc_agreement", signatureName: "Persona de prueba", signatureDataUrl: "data:image/png;base64,AA==" })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });
});
