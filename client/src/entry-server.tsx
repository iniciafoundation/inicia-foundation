// Build-time prerendering entry (scripts/prerender.mjs).
// Renders each public page to static HTML so visitors and Google see the full
// content immediately, before any JavaScript runs.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { prerenderToNodeStream } from "react-dom/static";
import superjson from "superjson";
import { Router } from "wouter";
import App from "./App";
import { SHEETS_ENDPOINT } from "./lib/siteConfig";
import { trpc } from "./lib/trpc";

export type PrerenderedProjects = unknown[];

/** Query key the pages use for the public project catalogue (Spanish). */
export function projectsQueryKey() {
  return getQueryKey(trpc.crm.public.projects, { locale: "es" }, "query");
}

export type PrerenderData = { projects: PrerenderedProjects; content?: unknown };

export async function render(url: string, data: PrerenderData): Promise<string> {
  const [path, search = ""] = url.split("?");
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  queryClient.setQueryData(projectsQueryKey(), data.projects);
  if (data.content) queryClient.setQueryData(["site-content", SHEETS_ENDPOINT], data.content);
  // Never reached during prerendering (effects do not run), but the provider needs a client.
  const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "http://localhost/api/trpc", transformer: superjson })] });

  const { prelude } = await prerenderToNodeStream(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={path} ssrSearch={search}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>,
  );

  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

export { getSiteMetadata } from "./lib/seo";
export { SHEETS_ENDPOINT };
