import { BookOpen, HeartHandshake, Landmark, Network, Sparkles, Sprout } from "lucide-react";
import { publicAssets } from "@/lib/publicAssets";

type ProjectVisualProps = { category: string; status: string; slug?: string; large?: boolean };

const projectAssets: Record<string, string> = {
  nucleo: publicAssets.nucleoIllustration,
  "coopastur-agrosocial": publicAssets.coopAsturIllustration,
  "rural futures": publicAssets.ruralFuturesIllustration,
  neara: "/assets/photos/earth-960.webp",
};

const pickVisual = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes("rural") || value.includes("ambiental") || value.includes("patrimonio")) return { Icon: Sprout, tone: "from-[#244d44] via-[#42766b] to-[#b8c891]" };
  if (value.includes("digital") || value.includes("inteligencia") || value.includes("innovación")) return { Icon: Network, tone: "from-[#173d63] via-[#286a91] to-[#8ec2cc]" };
  if (value.includes("educación") || value.includes("formación")) return { Icon: BookOpen, tone: "from-[#72523e] via-[#ad7b45] to-[#edcf91]" };
  if (value.includes("transparencia") || value.includes("derechos")) return { Icon: Landmark, tone: "from-[#3f315d] via-[#70539a] to-[#c7a4d9]" };
  if (value.includes("social") || value.includes("famil") || value.includes("comunidad")) return { Icon: HeartHandshake, tone: "from-[#7a433c] via-[#b66755] to-[#e6b08a]" };
  return { Icon: Sparkles, tone: "from-[#0B1E3A] via-[#315d80] to-[#94b9cf]" };
};

export function ProjectVisual({ category, status, slug = "", large = false }: ProjectVisualProps) {
  const { Icon, tone } = pickVisual(category);
  const asset = projectAssets[slug];
  return <div aria-hidden="true" className={`relative overflow-hidden bg-gradient-to-br ${tone} ${large ? "min-h-64 rounded-3xl" : "min-h-40 rounded-t-3xl"}`}>{asset && <img src={asset} alt="" className="absolute inset-0 h-full w-full object-cover" />}<div className={`absolute inset-0 ${asset ? "bg-[#0B1E3A]/35" : ""}`} /><div className="absolute -right-12 -top-14 h-48 w-48 rounded-full border border-white/25" /><div className="absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-white/10" /><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(115deg,transparent_0%,transparent_44%,rgba(255,255,255,.7)_45%,transparent_46%),linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:100%_100%,24px_24px,24px_24px]" /><div className={`relative flex h-full flex-col justify-between p-6 ${large ? "min-h-64" : "min-h-40"}`}><span className="w-fit rounded-full border border-white/40 bg-[#0B1E3A]/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-white">{status}</span><div className="flex items-end justify-between"><span className="font-serif text-xl text-white/90">INICIA</span><div className="rounded-2xl bg-white/15 p-3 text-white backdrop-blur-sm"><Icon className={large ? "h-12 w-12" : "h-8 w-8"} strokeWidth={1.4} /></div></div></div></div>;
}
