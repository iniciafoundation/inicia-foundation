import { COOKIE_NAME, UNAUTHED_ERR_MSG } from "@shared/const";
import { useQueryClient } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { type ReactNode, useEffect, useState } from "react";
import superjson from "superjson";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (error.message === UNAUTHED_ERR_MSG) startLogin();
};

/** tRPC is only needed by the private admin and login pages, so it lives in their lazy chunk and public pages stay light. */
export function TrpcRoot({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribeQueries = queryClient.getQueryCache().subscribe(event => {
      if (event.type === "updated" && event.action.type === "error") {
        redirectToLoginIfUnauthorized(event.query.state.error);
        console.error("[API Query Error]", event.query.state.error);
      }
    });
    const unsubscribeMutations = queryClient.getMutationCache().subscribe(event => {
      if (event.type === "updated" && event.action.type === "error") {
        redirectToLoginIfUnauthorized(event.mutation.state.error);
        console.error("[API Mutation Error]", event.mutation.state.error);
      }
    });
    return () => { unsubscribeQueries(); unsubscribeMutations(); };
  }, [queryClient]);

  const [trpcClient] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        transformer: superjson,
        headers() {
          // Preview auto-login fallback: when the browser blocks iframe cookies, the runtime mirrors
          // the session into sessionStorage so we can forward it as a Bearer token.
          try {
            const raw = sessionStorage.getItem("manus-cookie");
            if (raw) {
              const prefix = `${COOKIE_NAME}=`;
              const pair = raw.split(";").find(s => s.trim().startsWith(prefix));
              const token = pair?.trim().slice(prefix.length);
              if (token) return { Authorization: `Bearer ${token}` };
            }
          } catch {
            // sessionStorage unavailable
          }
          return {};
        },
        fetch(input, init) {
          return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
        },
      }),
    ],
  }));

  return <trpc.Provider client={trpcClient} queryClient={queryClient}>{children}</trpc.Provider>;
}
