import { login, logout, verifyRequestOrigin } from "@netlify/identity";

export default async (request: Request) => {
  const path = new URL(request.url).pathname;
  if (path.endsWith("/login") && request.method === "POST") {
    verifyRequestOrigin(request);
    const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
    if (!body?.email || !body.password) return Response.json({ error: "email_and_password_required" }, { status: 400 });
    await login(body.email, body.password);
    return Response.json({ success: true });
  }
  if (path.endsWith("/logout") && request.method === "POST") {
    verifyRequestOrigin(request);
    await logout();
    return Response.json({ success: true });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/auth/*" };
