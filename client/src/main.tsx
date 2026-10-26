import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { getQueryKey } from "@trpc/react-query";
import { createRoot, hydrateRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
// Fonts are served from our own site (no requests to Google Fonts): faster and GDPR-friendly.
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "./index.css";
import { getLocale } from "./lib/i18n";
import { SHEETS_ENDPOINT } from "./lib/siteConfig";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  startLogin();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        // Preview auto-login fallback: when the browser blocks iframe cookies
        // (Safari ITP / private browsing / WebView), the runtime mirrors the
        // session into sessionStorage so we can forward it as a Bearer token.
        // The regular OAuth cookie flow keeps working and takes priority server-side.
        try {
          const raw = sessionStorage.getItem("manus-cookie");
          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw.split(";").find(s => s.trim().startsWith(prefix));
            const token = pair?.trim().slice(prefix.length);
            if (token) {
              return { Authorization: `Bearer ${token}` };
            }
          }
        } catch {
          // sessionStorage unavailable
        }
        return {};
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

// Pages are prerendered to static HTML at build time (scripts/prerender.mjs).
// Reuse that HTML (hydrate) when the visitor sees the default Spanish version;
// otherwise render normally. Build-time data is marked stale so it refreshes.
const container = document.getElementById("root")!;
const prerendered = (window as unknown as { __INICIA_PRERENDER__?: { projects: unknown[]; content: unknown } }).__INICIA_PRERENDER__;
const app = (
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);

// Form deep links (?tipo=…&plan=…) render a different first screen than the prerendered page,
// so those are rendered fresh instead of hydrated (avoids a React hydration mismatch).
const changesFirstRender = ["tipo", "proyecto", "modo", "plan", "zona"].some(key => new URLSearchParams(window.location.search).has(key));

if (prerendered && container.hasChildNodes() && getLocale() === "es" && !changesFirstRender) {
  queryClient.setQueryData(getQueryKey(trpc.crm.public.projects, { locale: "es" }, "query"), prerendered.projects, { updatedAt: 1 });
  if (prerendered.content) queryClient.setQueryData(["site-content", SHEETS_ENDPOINT], prerendered.content, { updatedAt: 1 });
  hydrateRoot(container, app);
} else {
  container.textContent = "";
  createRoot(container).render(app);
}
