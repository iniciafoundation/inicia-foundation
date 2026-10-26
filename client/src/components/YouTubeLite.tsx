import { useState } from "react";
import { Play } from "lucide-react";

/** Privacy-friendly YouTube embed: shows a thumbnail and loads the player (youtube-nocookie) only on click. */
export function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-xl ring-1 ring-[#D6B25E]/30">
    {play ? <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      : <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0" aria-label={title}><img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" /><span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D6B25E] text-[#0B1E3A] shadow-2xl transition group-hover:scale-105"><Play className="ml-1 h-8 w-8" /></span></button>}
  </div>;
}
