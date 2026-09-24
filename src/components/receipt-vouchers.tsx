import { useMemo, useState } from "react";
import {
  BarChart3, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock, Download, Eye, FilePlus2, FileText,
  MoreHorizontal, Plus, Printer, Search, Wallet, XCircle, AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type V = { id: number; no: string; date: string; customer: string; amount: number; method: string; status: string; notes: string };
const methods = ["تحويل بنكي", "نقدي", "بطاقة بنكية", "أخرى"];
const statuses = ["محصلة", "قيد المراجعة", "ملغي"];
const customers = ["شركة الحلول التقنية", "محمد علي الزهراني", "مؤسسة الإبداع", "أحمد خالد العتيبي", "شركة الريادة", "سارة أحمد", "مؤسسة الأفق"];
const base: V[] = [
  [123, "2025-09-21", 0, 250000, 0, "محصلة"], [122, "2025-09-20", 1, 75000, 0, "محصلة"], [121, "2025-09-18", 2, 180000, 1, "محصلة"],
  [120, "2025-09-16", 3, 42500, 2, "قيد المراجعة"], [119, "2025-09-14", 4, 120000, 3, "محصلة"], [118, "2025-09-12", 5, 65750, 0, "ملغي"], [117, "2025-09-10", 6, 90000, 1, "محصلة"],
].map(([n, d, c, a, m, s]) => ({ id: n as number, no: `RC-2025-${String(n).padStart(5, "0")}`, date: d as string, customer: customers[c as number]!, amount: a as number, method: methods[m as number]!, status: s as string, notes: "" }));
const seed: V[] = [...base, ...Array.from({ length: 41 }, (_, i) => {
  const n = 116 - i; return { id: n, no: `RC-2025-${String(n).padStart(5, "0")}`, date: `2025-09-${String(9 - (i % 9)).padStart(2, "0")}`, customer: customers[i % customers.length]!, amount: 2500 + ((i * 6121) % 30) * 1500, method: methods[i % 4]!, status: i % 8 === 3 ? "قيد المراجعة" : "محصلة", notes: "" };
})];
const summary: [string, number, number, number, number][] = [["تحويل بنكي", 20, 268750, 248750, 20000], ["نقدي", 14, 182500, 172500, 10000], ["بطاقة بنكية", 9, 125000, 118000, 7000], ["الأخرى", 5, 48500, 42500, 6000]];
const dist: [string, number, string][] = [["تحويل بنكي", 45, "var(--primary)"], ["نقدي", 30, "var(--success)"], ["بطاقة بنكية", 15, "var(--warning)"], ["الأخرى", 10, "var(--finance-purple)"]];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const stCls: Record<string, [string, typeof CheckCircle2]> = { "محصلة": ["bg-success/15 text-success", CheckCircle2], "قيد المراجعة": ["bg-warning/15 text-warning", AlertCircle], "ملغي": ["bg-destructive/10 text-destructive", XCircle] };
const PER = 7;
type Form = { date: string; customer: string; amount: number; method: string; notes: string };

function Donut() {
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return <svg viewBox="0 0 140 140" className="size-40 -rotate-90">{dist.map(([n, p, c]) => { const d = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="18" strokeDasharray={`${d} ${C - d}`} strokeDashoffset={-acc} />; acc += d; return el; })}</svg>;
}

function printVoucher(v: V) {
  const w = window.open("", "_blank", "width=720,height=640"); if (!w) return;
  w.document.write(`<html dir="rtl"><head><title>${v.no}</title><style>body{font-family:Cairo,Tahoma,sans-serif;padding:40px}h1{text-align:center}table{width:100%;border-collapse:collapse;margin-top:24px}td{border:1px solid #ccc;padding:10px}td:first-child{background:#f3f6fb;width:35%;font-weight:bold}.sig{display:flex;justify-content:space-between;margin-top:60px}</style></head><body><h1>سند قبض</h1><p style="text-align:center">تكامل بلس</p><table><tr><td>رقم السند</td><td>${v.no}</td></tr><tr><td>التاريخ</td><td>${dmy(v.date)}</td></tr><tr><td>استلمنا من</td><td>${v.customer}</td></tr><tr><td>مبلغ وقدره</td><td>${fmt(v.amount)} ر.س</td></tr><tr><td>طريقة الدفع</td><td>${v.method}</td></tr><tr><td>الحالة</td><td>${v.status}</td></tr>${v.notes ? `<tr><td>ملاحظات</td><td>${v.notes}</td></tr>` : ""}</table><div class="sig"><span>المستلم: ............</span><span>المحاسب: ............</span></div><script>print()</script></body></html>`);
  w.document.close();
}

export function ReceiptVouchers() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState(""); const [status, setStatus] = useState("الكل"); const [method, setMethod] = useState("الكل"); const [cust, setCust] = useState("الكل");
  const [from, setFrom] = useState("2025-09-01"); const [to, setTo] = useState("2025-09-30");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<Form | null>(null); const [view, setView] = useState<V | null>(null);

  const filtered = useMemo(() => rows.filter((r) => (!q || r.no.toLowerCase().includes(q.toLowerCase()) || r.customer.includes(q)) && (status === "الكل" || r.status === status) && (method === "الكل" || r.method === method) && (cust === "الكل" || r.customer === cust) && r.date >= from && r.date <= to), [rows, q, status, method, cust, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const start = Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  const reset = () => setPage(1);

  const exportCsv = () => {
    const csv = [["رقم السند", "التاريخ", "العميل", "المبلغ", "طريقة الدفع", "الحالة"], ...filtered.map((r) => [r.no, dmy(r.date), r.customer, r.amount, r.method, r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = "سندات-القبض.csv"; a.click();
    toast.success(`تم تصدير ${filtered.length} سند`);
  };
  const save = () => {
    if (!form) return;
    if (!form.customer.trim() || form.amount <= 0) { toast.error("اكتب العميل والمبلغ"); return; }
    const id = Math.max(...rows.map((r) => r.id)) + 1; const no = `RC-2025-${String(id).padStart(5, "0")}`;
    setRows((rs) => [{ id, no, status: "محصلة", ...form }, ...rs].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id));
    setForm(null); reset(); toast.success(`تم إنشاء سند القبض ${no}`);
  };
  const setSt = (id: number, s: string) => { setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r))); toast.success(`تم تغيير الحالة إلى «${s}»`); };

  const stats = [
    { t: "سندات اليوم", v: "6", sub: "مقارنة بالأمس", d: "↑ 20%", dc: "text-success", icon: CalendarDays, cls: "bg-warning/15 text-warning" },
    { t: "المبالغ المعلقة", v: "125,800", u: "ر.س", sub: "مقارنة بالشهر الماضي", d: "↓ 5%", dc: "text-destructive", icon: Clock, cls: "bg-primary-soft text-primary" },
    { t: "إجمالي عدد السندات", v: fmt(rows.length), sub: "مقارنة بالشهر الماضي", d: "↑ 8%", dc: "text-success", icon: FileText, cls: "bg-finance-violet text-finance-purple" },
    { t: "إجمالي المبالغ المحصلة", v: "624,750", u: "ر.س", sub: "مقارنة بالشهر الماضي", d: "↑ 12%", dc: "text-success", icon: Wallet, cls: "bg-success/15 text-success" },
  ];
  const maxBar = 300000;

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><FilePlus2 className="text-primary" size={28} />سندات القبض</h1>
            <p className="mt-1 text-sm text-muted-foreground">إدارة ومتابعة سندات القبض وتقاريرها</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1.5" onClick={exportCsv}><Download size={16} />تصدير التقرير</Button>
            <Button className="gap-1.5" onClick={() => setForm({ date: "2025-09-30", customer: "", amount: 0, method: methods[0]!, notes: "" })}><Plus size={16} />سند قبض جديد</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-2 text-3xl font-extrabold">{s.v} {s.u && <span className="text-lg">{s.u}</span>}</p></div><span className={`grid size-11 place-items-center rounded-xl ${s.cls}`}><s.icon size={21} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">{s.sub}</span><b className={s.dc}>{s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="grid items-end gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative"><Search size={15} className="absolute right-3 top-3 text-muted-foreground" /><input className={`${field} pr-9`} placeholder="ابحث برقم السند أو اسم العميل..." value={q} onChange={(e) => { setQ(e.target.value); reset(); }} /></div>
          <label className="text-xs text-muted-foreground">الحالة<select className={field} value={status} onChange={(e) => { setStatus(e.target.value); reset(); }}><option>الكل</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-xs text-muted-foreground">طريقة الدفع<select className={field} value={method} onChange={(e) => { setMethod(e.target.value); reset(); }}><option>الكل</option>{methods.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-xs text-muted-foreground">العميل<select className={field} value={cust} onChange={(e) => { setCust(e.target.value); reset(); }}><option>الكل</option>{customers.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="text-xs text-muted-foreground">من تاريخ<input type="date" className={field} value={from} onChange={(e) => { setFrom(e.target.value); reset(); }} /></label>
          <label className="text-xs text-muted-foreground">إلى تاريخ<input type="date" className={field} value={to} onChange={(e) => { setTo(e.target.value); reset(); }} /></label>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2.4fr_1fr]">
          <div className="min-w-0 space-y-4">
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />سندات القبض</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-sm">
                  <thead className="bg-muted/60 text-xs text-muted-foreground"><tr>{["#", "رقم السند", "تاريخ السند", "العميل", "المبلغ", "طريقة الدفع", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                  <tbody>
                    {shown.map((r, i) => { const [c, I] = stCls[r.status] ?? ["", CheckCircle2]; return (
                      <tr key={r.id} className="border-t border-border">
                        <td className="p-2.5">{(cur - 1) * PER + i + 1}</td><td className="p-2.5 text-primary" dir="ltr">{r.no}</td><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5 font-bold">{r.customer}</td>
                        <td className="p-2.5 font-bold">{fmt(r.amount)} <span className="text-xs font-normal">ر.س</span></td><td className="p-2.5">{r.method}</td>
                        <td className="p-2.5"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${c}`}><I size={12} />{r.status}</span></td>
                        <td className="p-2.5"><div className="flex items-center gap-1">
                          <button aria-label="طباعة" onClick={() => printVoucher(r)} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted"><Printer size={15} /></button>
                          <button aria-label="عرض" onClick={() => setView(r)} className="grid size-8 place-items-center rounded-md text-primary hover:bg-muted"><Eye size={15} /></button>
                          <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="خيارات" className="grid size-8 place-items-center rounded-md border border-border"><MoreHorizontal size={15} /></button></DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem disabled={r.status === "محصلة"} onClick={() => setSt(r.id, "محصلة")}>اعتماد كمحصلة</DropdownMenuItem>
                              <DropdownMenuItem disabled={r.status === "قيد المراجعة"} onClick={() => setSt(r.id, "قيد المراجعة")}>تحويل للمراجعة</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" disabled={r.status === "ملغي"} onClick={() => { if (confirm(`إلغاء السند ${r.no}؟`)) setSt(r.id, "ملغي"); }}>إلغاء السند</DropdownMenuItem>
                            </DropdownMenuContent></DropdownMenu>
                        </div></td>
                      </tr>); })}
                    {!shown.length && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">لا توجد سندات مطابقة</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">إجمالي السندات: {filtered.length}</span>
                <div className="flex gap-1.5">
                  <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                  {nums.map((n) => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-md border ${cur === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
                  <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />ملخص التقرير</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-muted/60 text-xs text-muted-foreground"><tr>{["طريقة الدفع", "عدد السندات", "إجمالي المبالغ", "المبالغ المحصلة", "المبالغ المعلقة"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                  <tbody>
                    {summary.map(([m, n, t, c, p]) => <tr key={m} className="border-t border-border"><td className="p-2.5">{m}</td><td className="p-2.5">{n}</td><td className="p-2.5">{fmt(t)} ر.س</td><td className="p-2.5">{fmt(c)} ر.س</td><td className="p-2.5">{fmt(p)} ر.س</td></tr>)}
                    <tr className="bg-primary-soft font-extrabold"><td className="p-2.5">الإجمالي</td><td className="p-2.5">48</td><td className="p-2.5">624,750 ر.س</td><td className="p-2.5">581,750 ر.س</td><td className="p-2.5">43,000 ر.س</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="min-w-0 self-start rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />تقرير سندات القبض</h2>
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={exportCsv}><BarChart3 size={14} />عرض التقرير</Button>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">من {dmy(from)} إلى {dmy(to)}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="relative"><Donut /><div className="absolute inset-0 grid place-content-center text-center"><b className="text-xl">624,750</b><span className="text-xs text-muted-foreground">ر.س</span></div></div>
              <ul className="min-w-32 flex-1 space-y-2 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
            </div>
            <h3 className="mt-5 border-t border-border pt-4 text-sm font-extrabold">إجمالي المبالغ المحصلة حسب طريقة الدفع</h3>
            <svg viewBox="0 0 260 170" className="mt-2 w-full">
              {[0, 100, 200, 300].map((v) => <g key={v}><line x1="46" x2="258" y1={140 - v * 0.4} y2={140 - v * 0.4} stroke="var(--border)" /><text x="0" y={143 - v * 0.4} fontSize="8" fill="var(--muted-foreground)">{fmt(v * 1000)}</text></g>)}
              {summary.map(([m, , , c], i) => { const h = (c / maxBar) * 120; const x = 60 + i * 50; return <g key={m}><rect x={x} y={140 - h} width="26" height={h} rx="3" fill="var(--primary)" /><text x={x + 13} y="156" fontSize="8" textAnchor="middle" fill="var(--muted-foreground)">{m}</text></g>; })}
            </svg>
          </section>
        </div>
      </main>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>سند قبض جديد</DialogTitle></DialogHeader>
          {form && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold sm:col-span-2">العميل<input list="rv-customers" className={field} value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /><datalist id="rv-customers">{customers.map((c) => <option key={c} value={c} />)}</datalist></label>
              <label className="text-sm font-bold">المبلغ (ر.س)<input type="number" min={0} className={field} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value || 0 })} /></label>
              <label className="text-sm font-bold">التاريخ<input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label className="text-sm font-bold sm:col-span-2">طريقة الدفع<select className={field} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>{methods.map((m) => <option key={m}>{m}</option>)}</select></label>
              <label className="text-sm font-bold sm:col-span-2">ملاحظات<textarea className={`${field} h-20 py-2`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
              <div className="flex gap-2 sm:col-span-2"><Button className="flex-1" onClick={save}>حفظ السند</Button><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>إلغاء</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>سند القبض {view?.no}</DialogTitle></DialogHeader>
          {view && <>
            <dl className="divide-y divide-border text-sm">{([["التاريخ", dmy(view.date)], ["العميل", view.customer], ["المبلغ", `${fmt(view.amount)} ر.س`], ["طريقة الدفع", view.method], ["الحالة", view.status], ["ملاحظات", view.notes || "—"]] as const).map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>
            <Button className="gap-1.5" onClick={() => printVoucher(view)}><Printer size={16} />طباعة السند</Button>
          </>}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
