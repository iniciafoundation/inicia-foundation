import { Facebook, Instagram, Linkedin } from "lucide-react";

const socialProfiles = [
  { label: "Facebook", href: "https://www.facebook.com/iniciafoundation/", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/inicia_found", Icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/iniciafoundation", Icon: Linkedin },
];

export function SocialLinks({ light = false }: { light?: boolean }) {
  return <div className="flex items-center gap-3" aria-label="Redes sociales oficiales de INICIA Foundation">
    {socialProfiles.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className={`grid h-10 w-10 place-items-center rounded-full border transition ${light ? "border-white/35 text-white hover:border-[#F4A833] hover:text-[#F4A833]" : "border-[#0B2545]/20 text-[#0B2545] hover:border-[#F4A833] hover:bg-[#F4A833]"}`}><Icon className="h-4 w-4" /></a>)}
  </div>;
}
