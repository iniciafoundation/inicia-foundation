import { useQuery } from "@tanstack/react-query";
import { contentLocale, type Locale } from "./i18n";

/** Public project as shown on the site (generated at build time from the catalog file). */
export type PublicProject = { id: string; slug: string; title: string; category: string; shortDescription: string; bodyHtml: string; heroImageUrl: string | null; status: string; visibility?: string };

export const projectsKey = (locale: "es" | "en" | "ru" | "uk") => ["projects", locale] as const;

/** Projects come from a small static file (/data/projects-xx.json) — no API call, no tRPC on public pages. */
export function useProjects(locale: Locale) {
  const lang = contentLocale(locale);
  return useQuery<PublicProject[]>({
    queryKey: projectsKey(lang),
    queryFn: async () => {
      const response = await fetch(`/data/projects-${lang}.json`);
      if (!response.ok) throw new Error(`projects ${response.status}`);
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}
