import { useEffect, useRef } from "react";
import { Eraser } from "lucide-react";

const WIDTH = 600;
const HEIGHT = 200;

/**
 * Hand-written signature with finger, pen or mouse. Calls onChange with a PNG data URL
 * once the signature has enough strokes, or with "" when it is cleared.
 */
export function SignaturePad({ label, hint, clearLabel, error, onChange }: { label: string; hint: string; clearLabel: string; error?: string; onChange: (png: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const points = useRef(0);
  const last = useRef<{ x: number; y: number } | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0B1E3A";
  }, []);

  const position = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * HEIGHT };
  };
  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    last.current = position(event);
  };
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = event.currentTarget.getContext("2d");
    const next = position(event);
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
    points.current += 1;
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas && points.current >= 15) onChange(canvas.toDataURL("image/png"));
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, WIDTH, HEIGHT);
    points.current = 0;
    onChange("");
  };

  return <div data-error={error ? "true" : undefined} className="scroll-mt-32">
    <div className="flex items-end justify-between gap-3"><p className="text-sm font-semibold text-[#EEE7D7]">{label}<span className="text-[#D6B25E]"> *</span></p><button type="button" onClick={clear} className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[#D6B25E] hover:bg-[#D6B25E]/10"><Eraser className="h-4 w-4" />{clearLabel}</button></div>
    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label={label} role="img"
      onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onPointerLeave={end}
      className={`mt-2 block aspect-[3/1] w-full cursor-crosshair touch-none rounded-xl bg-white ${error ? "ring-2 ring-red-400" : "ring-1 ring-[#D6B25E]/40"}`} />
    <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
    {error && <span role="alert" className="mt-1 block text-xs font-semibold text-red-300">{error}</span>}
  </div>;
}
