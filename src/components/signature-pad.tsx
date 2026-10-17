import { useRef } from "react";
import { Trash2 } from "lucide-react";

// لوح توقيع بسيط بالرسم على canvas — يُبلِّغ الأب بوجود توقيع أو مسحه
export function SignaturePad({ label, sub, onChange }: { label: string; sub?: string | undefined; onChange?: (signed: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ref.current!; const r = c.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * c.width, ((e.clientY - r.top) / r.height) * c.height] as const;
  };
  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = ref.current?.getContext("2d"); if (!ctx) return;
    drawing.current = true; ref.current!.setPointerCapture(e.pointerId);
    const [x, y] = point(e); ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = getComputedStyle(ref.current!).color;
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return; const ctx = ref.current!.getContext("2d")!; const [x, y] = point(e); ctx.lineTo(x, y); ctx.stroke();
  };
  const end = () => { if (drawing.current) { drawing.current = false; onChange?.(true); } };
  const clear = () => { const c = ref.current; c?.getContext("2d")?.clearRect(0, 0, c.width, c.height); onChange?.(false); };
  return (
    <div className="rounded-xl border bg-card p-3 text-center">
      <p className="text-xs font-extrabold">{label}</p>
      {sub && <p className="text-[10px] text-primary">{sub}</p>}
      <canvas ref={ref} width={400} height={140} aria-label={label} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} className="mt-2 h-[72px] w-full touch-none rounded-lg border bg-background text-primary" />
      <button type="button" onClick={clear} className="mx-auto mt-2 flex items-center gap-1 rounded-md border px-4 py-1 text-xs hover:bg-muted"><Trash2 className="size-3.5" />مسح</button>
    </div>
  );
}
