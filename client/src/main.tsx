import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { getLocale } from "./lib/i18n";
import { SHEETS_ENDPOINT } from "./lib/siteConfig";
import { projectsKey } from "./lib/projects";

const queryClient = new QueryClient();

// Pages are prerendered to static HTML at build time (scripts/prerender.mjs).
// Reuse that HTML (hydrate) when the visitor sees the default Spanish version;
// otherwise render normally. Build-time data is marked stale so it refreshes.
const container = document.getElementById("root")!;
const prerendered = (window as unknown as { __INICIA_PRERENDER__?: { projects: unknown[]; content: unknown } }).__INICIA_PRERENDER__;
const app = (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

// Form deep links (?tipo=…&plan=…) render a different first screen than the prerendered page,
// so those are rendered fresh instead of hydrated (avoids a React hydration mismatch).
const changesFirstRender = ["tipo", "proyecto", "modo", "plan", "zona"].some(key => new URLSearchParams(window.location.search).has(key));

if (prerendered && container.hasChildNodes() && getLocale() === "es" && !changesFirstRender) {
  queryClient.setQueryData(projectsKey("es"), prerendered.projects, { updatedAt: 1 });
  if (prerendered.content) queryClient.setQueryData(["site-content", SHEETS_ENDPOINT], prerendered.content, { updatedAt: 1 });
  hydrateRoot(container, app);
} else {
  container.textContent = "";
  createRoot(container).render(app);
}
