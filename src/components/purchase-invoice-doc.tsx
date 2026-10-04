import { Building2, FileText, Printer, Store } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { purchaseInvoiceDoc as inv } from "@/data/mockData";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Logo({ size = "lg" }: { size?: "lg" | "sm" }) {
  const box = size === "lg" ? "h-24 w-24 text-6xl rounded-2xl" : "h-12 w-12 text-3xl rounded-xl";
  return (
    <div className={`${box} grid place-items-center bg-gradient-to-br from-buy-navy to-foreground font-black text-buy-gold shadow-lg ring-2 ring-buy-gold/60`}>t</div>
  );
}

function FakeQr() {
  const cells: [number, number][] = [];
  let s = 7;
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      s = (s * 9301 + 49297) % 233280;
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (!finder && s / 233280 > 0.5) cells.push([x, y]);
    }
  const F = ({ x, y }: { x: number; y: number }) => (
    <g><rect x={x} y={y} width="7" height="7" className="fill-foreground" /><rect x={x + 1} y={y + 1} width="5" height="5" className="fill-background" /><rect x={x + 2} y={y + 2} width="3" height="3" className="fill-foreground" /></g>
  );
  return (
    <svg viewBox="-1 -1 23 23" className="h-20 w-20 bg-background p-1">
      <rect x="-1" y="-1" width="23" height="23" className="fill-background" />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" className="fill-foreground" />)}
      <F x={0} y={0} /><F x={14} y={0} /><F x={0} y={14} />
    </svg>
  );
}

const sigPaths = [
  "M5 50 C30 20 60 10 50 35 C40 55 20 50 45 40 L120 20",
  "M10 55 L60 25 C70 15 40 60 55 45 C70 35 90 30 140 22",
  "M5 45 C20 10 40 60 55 30 C60 20 70 50 85 30 L130 25",
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 text-sm sm:text-base">
      <span className="shrink-0 text-foreground">{label}</span>
      <span className="text-foreground">:</span>
      <span className="flex-1 text-center font-medium text-foreground">{value}</span>
    </div>
  );
}

function PartyCard({ title, icon: Icon, rows }: { title: string; icon: typeof Store; rows: [string, string][] }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-background p-4">
      <div className="flex-1">
        <h3 className="mb-2 text-lg font-extrabold text-foreground">{title}</h3>
        {rows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
      </div>
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-muted text-buy-navy">
        <Icon className="h-10 w-10" strokeWidth={1.5} />
      </div>
    </div>
  );
}

export function PurchaseInvoiceDoc() {
  const subtotal = inv.items.reduce((s, i) => s + i.qty * i.price, 0);
  const vat = (subtotal - inv.discount) * 0.15;
  const total = subtotal - inv.discount + vat;

  return (
    <AppShell>
      <div dir="rtl" className="mx-auto max-w-[1024px] space-y-3 print:max-w-none">
        <div className="flex justify-end print:hidden">
          <Button onClick={() => window.print()} className="gap-2 bg-buy-navy text-background hover:bg-buy-navy/90">
            <Printer className="h-4 w-4" /> طباعة
          </Button>
        </div>

        <article className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
          {/* header */}
          <header className="relative h-44 sm:h-48">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1024 190" preserveAspectRatio="none">
              <path d="M0 0 H560 C470 60 500 170 380 190 H0 Z" className="fill-buy-navy" />
              <path d="M560 0 C470 60 500 170 380 190 L360 190 C480 165 455 55 540 0 Z" className="fill-buy-gold" />
            </svg>
            <div className="relative flex h-full items-center justify-between px-5 sm:px-10">
              <div className="flex items-center gap-4">
                <div className="hidden h-16 w-14 place-items-center rounded-lg border-2 border-buy-gold text-buy-gold sm:grid"><FileText className="h-9 w-9" /></div>
                <div className="text-background">
                  <h1 className="text-2xl font-black tracking-wide sm:text-4xl">فـاتورة شـــراء</h1>
                  <p className="mt-2 text-xs tracking-[0.3em] text-buy-gold sm:text-base" dir="ltr">PURCHASE INVOICE</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5" dir="ltr">
                <Logo />
                <div dir="rtl" className="hidden md:block">
                  <p className="text-5xl font-black text-foreground">تكاملة بلس</p>
                  <p className="mt-2 text-sm text-foreground">إدارة الموارد البشرية والمالية وخدمة العملاء</p>
                </div>
              </div>
            </div>
          </header>

          <div className="relative space-y-4 p-4 sm:p-8">
            <span aria-hidden className="pointer-events-none absolute left-1/3 top-56 select-none text-[22rem] font-black leading-none text-buy-gold/5">t</span>

            <div className="relative grid gap-4 md:grid-cols-2">
              <div className="h-fit rounded-xl border border-border bg-muted/40 px-5 py-2">
                {inv.meta.map(([l, v], i) => (
                  <div key={l} className={`flex items-center justify-between py-2.5 text-base ${i < inv.meta.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-foreground">{l} :</span>
                    <span className="w-1/2 text-center font-semibold text-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <PartyCard title="بيانات المورد" icon={Store} rows={inv.supplier} />
                <PartyCard title="بيانات المشتري" icon={Building2} rows={inv.buyer} />
              </div>
            </div>

            <div className="relative overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[720px] text-center text-base">
                <thead className="bg-buy-navy text-background">
                  <tr>
                    {["م", "الصنف/الخدمة", "المواصفات", "الكمية", "سعر الوحدة\n(ريال)", "الإجمالي\n(ريال)"].map((h) => (
                      <th key={h} className="whitespace-pre-line border-l border-background/20 px-3 py-3 font-semibold last:border-l-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inv.items.map((it, i) => (
                    <tr key={i} className="border-t border-border bg-background/80">
                      <td className="border-l border-border py-3">{i + 1}</td>
                      <td className="border-l border-border px-6 text-right">{it.name}</td>
                      <td className="border-l border-border">{it.spec}</td>
                      <td className="border-l border-border">{it.qty}</td>
                      <td className="border-l border-border">{fmt(it.price)}</td>
                      <td>{fmt(it.qty * it.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="relative grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
                <div className="px-5 py-1">
                  {[["المجموع الفرعي", subtotal], ["الخصم", inv.discount], ["مبلغ الضريبة المضافة  (15%)", vat]].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between border-b border-border py-2.5 text-base last:border-0">
                      <span>{l}</span><span className="w-1/3 text-center">{fmt(v as number)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-gradient-to-l from-buy-gold/80 to-buy-gold/50 px-5 py-4">
                  <span className="text-xl font-extrabold">إجمالي الفاتورة (ريال)</span>
                  <span className="text-3xl font-black">{fmt(total)}</span>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <h3 className="mb-4 text-xl font-extrabold">ملاحظات:</h3>
                <ul className="list-disc space-y-4 pr-5 text-base">
                  {inv.notes.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-3">
              {inv.signers.map((s, i) => (
                <div key={s.role} className="overflow-hidden rounded-xl border border-border bg-background text-center">
                  <div className="bg-muted/60 py-2 font-bold">{s.role}</div>
                  <p className="mt-3 text-lg font-extrabold">{s.name}</p>
                  <p className="text-sm">{s.title}</p>
                  <svg viewBox="0 0 150 70" className="mx-auto h-16 w-36 stroke-buy-navy" fill="none" strokeWidth="2.5" strokeLinecap="round">
                    <path d={sigPaths[i]} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* footer */}
          <footer className="relative h-36">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1024 150" preserveAspectRatio="none">
              <path d="M0 40 C300 0 600 60 1024 0 V150 H0 Z" className="fill-buy-gold" />
              <path d="M0 52 C300 12 600 72 1024 12 V150 H0 Z" className="fill-buy-navy" />
            </svg>
            <div className="relative flex h-full items-end justify-between px-5 pb-5 sm:px-10">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <div className="text-background">
                  <p className="text-2xl font-black sm:text-3xl">تكاملة بلس</p>
                  <p className="text-[10px] sm:text-xs">إدارة الموارد البشرية والمالية وخدمة العملاء</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-background">
                <div className="text-left text-sm sm:text-base">
                  <p>تحقق من الفاتورة</p>
                  <p dir="ltr">{inv.number}</p>
                </div>
                <FakeQr />
              </div>
            </div>
          </footer>
        </article>
      </div>
    </AppShell>
  );
}
