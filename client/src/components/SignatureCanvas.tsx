import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export function SignatureCanvas({ onChange }: { onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineWidth = 2.2;
    context.lineCap = "round";
    context.strokeStyle = "#0F274A";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) };
  };
  const save = () => onChange(canvasRef.current?.toDataURL("image/png") || "");
  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return <div className="space-y-3"><canvas ref={canvasRef} width={760} height={210} className="h-44 w-full touch-none rounded-xl border border-slate-300 bg-white" onPointerDown={event => { drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); const p = point(event); const ctx = event.currentTarget.getContext("2d")!; ctx.beginPath(); ctx.moveTo(p.x, p.y); }} onPointerMove={event => { if (!drawing.current) return; const p = point(event); const ctx = event.currentTarget.getContext("2d")!; ctx.lineTo(p.x, p.y); ctx.stroke(); save(); }} onPointerUp={() => { drawing.current = false; save(); }} aria-label="Área para firma manuscrita" /><div className="flex justify-between gap-3"><p className="text-xs text-slate-500">Firma dibujada por la persona solicitante. Revise los documentos antes de enviar.</p><Button type="button" variant="ghost" onClick={clear}>Limpiar</Button></div></div>;
}
