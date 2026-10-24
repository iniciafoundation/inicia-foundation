import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { netlifyAppRouter } from "../trpc/router";

export default async (request: Request) => fetchRequestHandler({
  endpoint: "/api/trpc",
  req: request,
  router: netlifyAppRouter,
  createContext: () => ({ request, ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unavailable" }),
});

export const config = { path: "/api/trpc/*" };
