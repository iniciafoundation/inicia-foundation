import { AtSign, Cloud, Facebook, Instagram, Linkedin, MessageCircle, Music2, Send, Twitter, Youtube } from "lucide-react";
import { useSettings } from "@/lib/content";

const ICONS: Record<string, typeof Facebook> = {
  social_facebook: Facebook, social_instagram: Instagram, social_linkedin: Linkedin, social_youtube: Youtube,
  social_tiktok: Music2, social_x: Twitter, social_telegram: Send, social_whatsapp_canal: MessageCircle,
  social_threads: AtSign, social_bluesky: Cloud,
};

/** Official profiles. Networks without a link (siteConfig or sheet "Ajustes") are not shown. */
export function SocialLinks({ light = false }: { light?: boolean }) {
  const { social } = useSettings();
  return <div className="flex flex-wrap items-center gap-3" aria-label="Redes sociales oficiales de INICIA Foundation">
    {social.map(({ key, label, href }) => { const Icon = ICONS[key] ?? AtSign; return <a key={key} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className={`grid h-10 w-10 place-items-center rounded-full border transition ${light ? "border-white/35 text-white hover:border-[#D6B25E] hover:text-[#D6B25E]" : "border-[#D6B25E]/20 text-[#EEE7D7] hover:border-[#D6B25E] hover:bg-[#D6B25E]"}`}><Icon className="h-4 w-4" /></a>; })}
  </div>;
}
