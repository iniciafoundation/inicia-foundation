import { getUser } from "@netlify/identity";
import { getPrivateEvidence } from "../lib/storage";

export default async (request: Request) => {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!(user.roles || []).includes("admin")) return new Response("Forbidden", { status: 403 });
  const prefix = "/api/evidence/";
  const key = decodeURIComponent(new URL(request.url).pathname.slice(prefix.length));
  if (!key.startsWith("applications/")) return new Response("Not found", { status: 404 });
  const result = await getPrivateEvidence(key);
  if (!result) return new Response("Not found", { status: 404 });
  return new Response(result.data, { headers: { "Content-Type": String(result.metadata?.contentType || "application/octet-stream"), "Cache-Control": "private, no-store" } });
};

export const config = { path: "/api/evidence/*" };
