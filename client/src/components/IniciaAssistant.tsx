import { Bot, X } from "lucide-react";
import { useState } from "react";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { trpc } from "@/lib/trpc";

const welcome: Message = {
  role: "assistant",
  content: "Hola. Soy el asistente informativo de INICIA Foundation. Puedo orientarte sobre proyectos, contactos, ciudades de atención, misión, colaboración y los límites de los servicios. No compartas datos personales o sensibles por este chat.",
};

export function IniciaAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const ask = trpc.assistant.ask.useMutation({
    onSuccess: ({ answer }) => setMessages(current => [...current, { role: "assistant", content: answer }]),
    onError: () => setMessages(current => [...current, { role: "assistant", content: "Ahora no puedo responder. Puedes usar el formulario de contacto o escribir por WhatsApp al +34 624 865 051." }]),
  });

  const send = (question: string) => {
    setMessages(current => [...current, { role: "user", content: question }]);
    ask.mutate({ question });
  };

  return <div className="fixed bottom-5 right-5 z-50">
    {open && <section className="mb-3 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-[#0B2545]/15 bg-white shadow-2xl" aria-label="Asistente informativo de INICIA">
      <div className="flex items-center justify-between bg-[#0B2545] px-4 py-3 text-white"><div className="flex items-center gap-2"><Bot className="h-5 w-5 text-[#F4A833]" /><div><p className="text-sm font-bold">Asistente INICIA</p><p className="text-[11px] text-slate-300">Información general · sin datos sensibles</p></div></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="rounded p-1 hover:bg-white/10"><X className="h-5 w-5" /></button></div>
      <AIChatBox messages={messages} onSendMessage={send} isLoading={ask.isPending} height="430px" placeholder="Escribe tu pregunta…" suggestedPrompts={["¿Cómo puedo contactar con INICIA?", "¿En qué ciudades hay atención?", "¿Dónde están los proyectos?", "¿Qué información hay sobre la misión?"]} className="rounded-none border-0 shadow-none" />
    </section>}
    <button type="button" onClick={() => setOpen(value => !value)} aria-label={open ? "Cerrar asistente" : "Abrir asistente INICIA"} className="flex items-center gap-2 rounded-full bg-[#0B2545] px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-[#173f6a] active:scale-[.97]"><Bot className="h-5 w-5 text-[#F4A833]" />{open ? "Cerrar" : "Pregúntanos"}</button>
  </div>;
}
