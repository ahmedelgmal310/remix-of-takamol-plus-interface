import { Link } from "@tanstack/react-router";

// شريحة عميل: المبلغ وحده هو الإدخال، والنسبة تُحسب
export type CustomerSale = { name: string; amount: number };
export type RecentInvoice = { id: string; date: string; customer: string; amount: number; status: string };

const colors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--buy-violet)", "var(--buy-navy)"];
const money = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const card = "min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm";
const badge: Record<string, string> = { "مدفوعة": "bg-success/15 text-success", "قيد المراجعة": "bg-primary-soft text-primary", "معلقة": "bg-warning/15 text-warning" };

// يجمع العملاء حسب الاسم، ويضمّ السادس فما فوق في «أخرى»، ويحسب النسب من مجموع الكسور
export function customerSlices(sales: CustomerSale[]) {
  const map = new Map<string, number>();
  for (const s of sales) if (s.amount > 0) map.set(s.name, (map.get(s.name) ?? 0) + s.amount);
  const sorted = [...map].map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  const top = sorted.length > 5 ? sorted.slice(0, 4) : sorted;
  const rest = sorted.length > 5 ? sorted.slice(4).reduce((t, s) => t + s.amount, 0) : 0;
  const slices = rest ? [...top, { name: "أخرى", amount: rest }] : top;
  const total = slices.reduce((t, s) => t + s.amount, 0);
  return { total, slices: slices.map((s) => ({ ...s, percent: total ? (s.amount / total) * 100 : 0 })) };
}

export function SalesByCustomer({ sales }: { sales: CustomerSale[] }) {
  const { total, slices } = customerSlices(sales);
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return (
    <section className={card}>
      <h2 className="mb-3 font-extrabold">توزيع المبيعات حسب العميل</h2>
      {!slices.length ? <p className="py-10 text-center text-sm text-muted-foreground">لا توجد مبيعات لعرض توزيعها</p> : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="min-w-[180px] flex-1 space-y-3 text-sm">{slices.map((s, i) => <li key={s.name} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 shrink-0 rounded-full" style={{ background: colors[i] }} />{s.name}</span><b>{Math.round(s.percent)}%</b></li>)}</ul>
          <div className="relative mx-auto">
            {/* مركز الحلقة مجموع الكسور نفسها (مبالغ) */}
            <svg viewBox="0 0 140 140" className="size-36 -rotate-90">{slices.map((s, i) => { const L = (s.amount / total) * C; const el = <circle key={s.name} cx="70" cy="70" r={R} fill="none" stroke={colors[i]} strokeWidth="20" strokeDasharray={`${L} ${C - L}`} strokeDashoffset={-acc} />; acc += L; return el; })}</svg>
            <div className="absolute inset-0 grid place-content-center text-center"><b className="text-base">{money(total)}</b><span className="text-[10px] text-muted-foreground">ر.س</span></div>
          </div>
        </div>
      )}
    </section>
  );
}

export function RecentInvoices({ invoices }: { invoices: RecentInvoice[] }) {
  return (
    <section className={card}>
      <div className="mb-3 flex items-center justify-between"><h2 className="font-extrabold">أحدث الفواتير</h2><Link to="/sales/invoice" className="text-xs font-bold text-primary">عرض الكل</Link></div>
      {!invoices.length ? <p className="py-10 text-center text-sm text-muted-foreground">لا توجد فواتير بعد</p> : (
        <ul className="divide-y divide-border text-xs">{invoices.slice(0, 5).map((r) => (
          <li key={r.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2">
            <span className={`rounded-md px-2 py-1 font-bold ${badge[r.status] ?? "bg-muted"}`}>{r.status}</span>
            <span className="min-w-0"><span className="text-muted-foreground">{r.date}</span> · <span className="truncate">{r.customer}</span> · <b>{money(r.amount)} ر.س</b></span>
            <span className="text-left"><Link to="/sales/invoice" search={{ id: r.id }} className="block font-bold text-primary" dir="ltr">{r.id}</Link><span className={`mt-0.5 inline-block rounded px-1 text-[9px] ${badge[r.status] ?? ""}`}>{r.status}</span></span>
          </li>
        ))}</ul>
      )}
    </section>
  );
}
