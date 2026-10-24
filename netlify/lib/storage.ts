import { getStore } from "@netlify/blobs";

const store = () => getStore("inicia-private-evidence");

export async function putPrivateEvidence(key: string, value: ArrayBuffer | Blob | string, contentType: string) {
  await store().set(key, value, { metadata: { contentType } });
  return key;
}

export async function getPrivateEvidence(key: string) {
  return store().getWithMetadata(key, { type: "blob" });
}
