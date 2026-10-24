import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../db", () => ({ getDb: vi.fn() }));
vi.mock("../storage", () => ({ storageGetSignedUrl: vi.fn(), storagePut: vi.fn() }));
vi.mock("../_core/notification", () => ({ notifyOwner: vi.fn() }));

import { getDb } from "../db";
import { storageGetSignedUrl } from "../storage";
import { crmRouter } from "./crm";

const adminContext = {
  user: { id: 42, openId: "admin-test", name: "Admin", email: "admin@iniciafoundation.org", loginMethod: "test", role: "admin" as const, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { headers: {}, socket: { remoteAddress: "203.0.113.10" } },
  res: {},
};

const publicContext = { user: null, req: { headers: {}, socket: { remoteAddress: "203.0.113.99" } }, res: {} };
const chain = (value: unknown) => ({ from: () => ({ where: () => ({ limit: async () => value }) }) });

describe("CRM procedures", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not activate a document version unless it is a draft", async () => {
    const update = vi.fn();
    vi.mocked(getDb).mockResolvedValue({ select: vi.fn(() => chain([{ id: "doc_live", status: "active" }])), update } as never);
    const caller = crmRouter.createCaller(adminContext as never);
    await expect(caller.admin.activateDocumentVersion({ id: "doc_live" })).rejects.toThrow("Solo las versiones borrador");
    expect(update).not.toHaveBeenCalled();
  });

  it("returns signed evidence only through the administrator procedure", async () => {
    vi.mocked(getDb).mockResolvedValue({ select: vi.fn(() => chain([{ id: "app_1", signedSnapshotStorageKey: "applications/app_1/record.html", signatureStorageKey: "applications/app_1/signature.png", retentionStatus: "pending_legal_review", retentionPolicyReference: null }])) } as never);
    vi.mocked(storageGetSignedUrl).mockResolvedValueOnce("https://signed.example/record").mockResolvedValueOnce("https://signed.example/signature");
    const caller = crmRouter.createCaller(adminContext as never);
    const result = await caller.admin.getApplicationRecord({ id: "app_1" });
    expect(result).toEqual({ signedRecordUrl: "https://signed.example/record", signatureUrl: "https://signed.example/signature", retentionStatus: "pending_legal_review", retentionPolicyReference: null });
  });

  it("records a status-management action in the application audit trail", async () => {
    const values = vi.fn();
    const db = { update: vi.fn(() => ({ set: () => ({ where: async () => undefined }) })), insert: vi.fn(() => ({ values })), };
    vi.mocked(getDb).mockResolvedValue(db as never);
    const caller = crmRouter.createCaller(adminContext as never);
    await expect(caller.admin.updateApplicationStatus({ id: "app_1", status: "under_review", internalNotes: "Documentación pendiente" })).resolves.toEqual({ success: true });
    expect(values).toHaveBeenCalledWith(expect.objectContaining({ applicationId: "app_1", eventType: "status_changed" }));
  });

  it("rejects a public submission when active accepted documents cannot be found", async () => {
    vi.mocked(getDb).mockResolvedValue({ select: vi.fn(() => chain([])) } as never);
    const caller = crmRouter.createCaller(publicContext as never);
    await expect(caller.public.submitApplication({ applicationType: "socio", fullName: "Ana López", email: "ana@example.org", privacyDocumentId: "doc_privacy", agreementDocumentId: "doc_agreement", signatureName: "Ana López", signatureDataUrl: "data:image/png;base64,iVBORw0KGgo=" })).rejects.toThrow("Los documentos seleccionados ya no están vigentes");
  });

  it("returns a locale-specific project record and public status for the requested language", async () => {
    const select = vi.fn()
      .mockReturnValueOnce({ from: () => ({ where: () => ({ orderBy: async () => [{ id: "project_1", title: "Proyecto español", category: "Categoría", shortDescription: "Resumen", bodyHtml: "<p>ES</p>", status: "development" }] }) }) })
      .mockReturnValueOnce({ from: () => ({ where: async () => [{ projectId: "project_1", locale: "ru", title: "Русский проект", category: "Категория", shortDescription: "Краткое описание", bodyHtml: "<p>RU</p>" }] }) });
    vi.mocked(getDb).mockResolvedValue({ select } as never);
    const caller = crmRouter.createCaller(publicContext as never);
    await expect(caller.public.projects({ locale: "ru" })).resolves.toEqual([expect.objectContaining({ title: "Русский проект", category: "Категория", shortDescription: "Краткое описание", bodyHtml: "<p>RU</p>", status: "В разработке" })]);
  });
});
