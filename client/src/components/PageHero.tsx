import type { ReactNode } from "react";
import { SpiralMark } from "./SpiralMark";

/** Hero used by the participation pages: same look as the rest of the site (dark, gold, photo). */
export function PageHero({ photo, alt, eyebrow, title, accent, intro, children }: { photo: string; alt: string; eyebrow: string; title: string; accent?: string; intro: string; children?: ReactNode }) {
  const src = (w: number) => `/assets/photos/${photo}-${w}.webp`;
  return <section className="relative isolate overflow-hidden bg-[#08101E] px-5 pb-24 pt-16 text-white md:pt-24">
    <img src={src(1920)} srcSet={`${src(480)} 480w, ${src(720)} 720w, ${src(960)} 960w, ${src(1920)} 1920w`} sizes="100vw" alt={alt} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#060A12] via-[#060A12]/85 to-[#060A12]/30" />
    <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#060A12] to-transparent" />
    <SpiralMark className="pointer-events-none absolute -right-20 -top-6 -z-10 hidden h-[400px] w-[400px] opacity-40 md:block" />
    <div className="relative mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#D6B25E]">{eyebrow}</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.04] md:text-6xl">{title}{accent && <> <span className="italic text-[#F0D893]">{accent}</span></>}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{intro}</p>{children}</div>
  </section>;
}
