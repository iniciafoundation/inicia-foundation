// Build-time prerendering entry (scripts/prerender.mjs).
// Renders each public page to static HTML so visitors and Google see the full
// content immediately, before any JavaScript runs.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { prerenderToNodeStream } from "react-dom/static";
import { Router } from "wouter";
import App from "./App";
import { SHEETS_ENDPOINT } from "./lib/siteConfig";
import { projectsKey as staticProjectsKey } from "./lib/projects";

export type PrerenderedProjects = unknown[];

/** Query key the pages use for the public project catalogue (Spanish). */
export function projectsQueryKey() {
  return staticProjectsKey("es");
}

export type PrerenderData = { projects: PrerenderedProjects; content?: unknown };

export async function render(url: string, data: PrerenderData): Promise<string> {
  const [path, search = ""] = url.split("?");
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  queryClient.setQueryData(projectsQueryKey(), data.projects);
  if (data.content) queryClient.setQueryData(["site-content", SHEETS_ENDPOINT], data.content);

  const { prelude } = await prerenderToNodeStream(
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={path} ssrSearch={search}>
          <App />
        </Router>
      </QueryClientProvider>
    ,
  );

  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

export { getSiteMetadata } from "./lib/seo";
export { SHEETS_ENDPOINT };
