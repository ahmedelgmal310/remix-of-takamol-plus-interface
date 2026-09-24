import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight, BarChart3, ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Filter, Landmark, ListChecks,
  PieChart, PlusCircle, Receipt, TrendingDown, TrendingUp, Wallet, Zap, Coins, LineChart,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Mv = { id: number; date: string; kind: string; desc: string; party: string; amount: number; status: string };
const kinds = ["إيراد", "مصروف", "تحويل"];
const parties = ["شركة النور", "الموردين", "الموظفين", "العملاء", "الملاك", "البنك"];
const statuses = ["مكتمل", "معلق", "ملغي"];
const base: Mv[] = [
  { id: 1, date: "2025-09-28", kind: "إيراد", desc: "مبيعات خدمات", party: "شركة النور", amount: 50000, status: "مكتمل" },
  { id: 2, date: "2025-09-27", kind: "مصروف", desc: "مشتريات مواد تشغيلية", party: "الموردين", amount: 28750, status: "مكتمل" },
  { id: 3, date: "2025-09-23", kind: "تحويل", desc: "رواتب وأجور", party: "الموظفين", amount: 75000, status: "مكتمل" },
  { id: 4, date: "2025-09-22", kind: "إيراد", desc: "إيجار من الشركة", party: "العملاء", amount: 42500, status: "مكتمل" },
  { id: 5, date: "2025-09-20", kind: "مصروف", desc: "إيجار مقر الشركة", party: "الملاك", amount: 30000, status: "مكتمل" },
];
const extraDesc = ["تحصيل فاتورة مبيعات", "سداد فاتورة مورد", "تحويل بين الحسابات", "رسوم بنكية", "خدمات استشارية", "صيانة المعدات", "اشتراكات البرامج", "دفعة مقدمة من عميل"];
const seed: Mv[] = [...base, ...Array.from({ length: 43 }, (_, i) => {
  const k = kinds[i % 3]!; return { id: 6 + i, date: `2025-09-${String(19 - (i % 19)).padStart(2, "0")}`, kind: k, desc: extraDesc[i % extraDesc.length]!, party: parties[(i + 1) % parties.length]!, amount: 2500 + ((i * 3719) % 40) * 1000, status: i % 9 === 4 ? "معلق" : "مكتمل" };
})];
const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر"];
const rev = [240, 250, 265, 265, 275, 300, 315, 330, 410];
const exp = [175, 190, 200, 200, 205, 225, 240, 255, 305];
const trendR = [50, 75, 70, 70, 105, 115, 125, 135, 160];
const trendE = [25, 40, 40, 40, 70, 80, 90, 100, 120];
const dist: [string, number, string][] = [["الإيرادات", 38, "var(--primary)"], ["المصروفات", 22, "var(--success)"], ["التحويلات", 12, "var(--warning)"], ["الدفعات الداخلة", 10, "var(--finance-orange)"], ["المدفوعات الخارجة", 8, "var(--destructive)"], ["أخرى", 10, "var(--finance-purple)"]];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const PER = 5;
const init = { from: "2025-09-01", to: "2025-09-30", party: "الكل", kind: "الكل", status: "الكل" };

function Donut() {
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return <svg viewBox="0 0 140 140" className="size-40 -rotate-90">{dist.map(([n, p, c]) => { const d = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="18" strokeDasharray={`${d} ${C - d}`} strokeDashoffset={-acc} />; acc += d; return el; })}</svg>;
}

export function MoneyFlow() {
  const [rows, setRows] = useState(seed);
  const [draft, setDraft] = useState(init); const [f, setF] = useState(init);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<Omit<Mv, "id"> | null>(null);
  const tableRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => rows.filter((r) => r.date >= f.from && r.date <= f.to && (f.party === "الكل" || r.party === f.party) && (f.kind === "الكل" || r.kind === f.kind) && (f.status === "الكل" || r.status === f.status)), [rows, f]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const pageNums = Array.from({ length: Math.min(5, pages) }, (_, i) => Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4)) + i);

  const exportCsv = () => {
    const csv = [["التاريخ", "النوع", "البيان", "الجهة", "المبلغ", "الحالة"], ...filtered.map((r) => [dmy(r.date), r.kind, r.desc, r.party, r.amount, r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = "حركة-الأموال.csv"; a.click();
    toast.success(`تم تصدير ${filtered.length} حركة`);
  };
  const save = () => {
    if (!form) return;
    if (!form.desc.trim() || form.amount <= 0) { toast.error("اكتب البيان والمبلغ"); return; }
    setRows((rs) => [{ ...form, id: Date.now() }, ...rs].sort((a, b) => b.date.localeCompare(a.date)));
    setForm(null); setPage(1); toast.success("تمت إضافة الحركة المالية");
  };

  const stats = [
    { t: "الإجمالي", v: "1,245,700", d: "4%", icon: FileText, cls: "bg-warning/15 text-warning" },
    { t: "التحويلات", v: "117,330", d: "6%", icon: ArrowLeftRight, cls: "bg-finance-violet text-finance-purple" },
    { t: "الإيرادات", v: "458,230", d: "15%", icon: Receipt, cls: "bg-primary-soft text-primary" },
    { t: "المصروفات", v: "251,420", d: "8%", icon: Wallet, cls: "bg-destructive/10 text-destructive" },
    { t: "الرصيد الحالي", v: "368,750", d: "12%", icon: Coins, cls: "bg-success/15 text-success" },
  ];
  const quick: [string, typeof PlusCircle, () => void][] = [
    ["إضافة حركة مالية جديدة", PlusCircle, () => setForm({ date: "2025-09-30", kind: "إيراد", desc: "", party: "العملاء", amount: 0, status: "مكتمل" })],
    ["سجل الحركات المالية", ListChecks, () => tableRef.current?.scrollIntoView({ behavior: "smooth" })],
    ["تقرير حركة الأموال", BarChart3, exportCsv],
  ];
  const Sel = ({ label, k, opts }: { label: string; k: "party" | "kind" | "status"; opts: string[] }) => (
    <label className="text-xs text-muted-foreground">{label}<select className={field} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}><option>الكل</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  );
  const line = (arr: number[]) => arr.map((v, i) => `${30 + i * 26},${130 - v * 0.6}`).join(" ");

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><Wallet className="text-primary" size={26} />حركة الأموال</h1>
            <p className="mt-1 text-sm text-muted-foreground">متابعة حركة الإيرادات والمصروفات وجميع العمليات المالية</p>
          </div>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="gap-1.5"><Download size={16} />تصدير التقرير<ChevronDown size={14} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="start"><DropdownMenuItem onClick={exportCsv}>Excel</DropdownMenuItem><DropdownMenuItem onClick={() => window.print()}>طباعة</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        </div>

        <div className="grid items-end gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          <label className="text-xs text-muted-foreground">من<input type="date" className={field} value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></label>
          <label className="text-xs text-muted-foreground">إلى<input type="date" className={field} value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></label>
          <Sel label="الجهة" k="party" opts={parties} /><Sel label="نوع الحركة" k="kind" opts={kinds} /><Sel label="الحالة" k="status" opts={statuses} />
          <Button className="h-10 gap-1.5" onClick={() => { setF(draft); setPage(1); toast.success("تم تطبيق الفلاتر"); }}><Filter size={16} />تطبيق</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-2 text-2xl font-extrabold">{s.v} <span className="text-sm">ريال</span></p></div><span className={`grid size-11 place-items-center rounded-xl ${s.cls}`}><s.icon size={21} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر الماضي</span><b className="text-success">↑ {s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1.1fr_0.9fr]">
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />حركة الأموال خلال الفترة</h2>
              <div className="flex gap-3 text-xs"><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-success" />الإيرادات</span><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-primary" />المصروفات</span></div></div>
            <svg viewBox="0 0 420 200" className="w-full">
              {[0, 100, 200, 300, 400, 500].map((v) => <g key={v}><line x1="52" x2="418" y1={175 - v * 0.32} y2={175 - v * 0.32} stroke="var(--border)" /><text x="0" y={178 - v * 0.32} fontSize="9" fill="var(--muted-foreground)">{fmt(v * 1000)}</text></g>)}
              {months.map((mo, i) => { const x = 62 + i * 40; return <g key={mo}><rect x={x} y={175 - rev[i]! * 0.32} width="13" height={rev[i]! * 0.32} rx="2" fill="var(--success)" /><rect x={x + 15} y={175 - exp[i]! * 0.32} width="13" height={exp[i]! * 0.32} rx="2" fill="var(--primary)" /><text x={x + 14} y="192" fontSize="9" textAnchor="middle" fill="var(--muted-foreground)">{mo}</text></g>; })}
            </svg>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><PieChart size={18} className="text-primary" />توزيع حركة الأموال</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="relative"><Donut /><div className="absolute inset-0 grid place-content-center text-center"><b className="text-lg">1,245,700</b><span className="text-xs text-muted-foreground">ريال</span></div></div>
              <ul className="min-w-40 flex-1 space-y-2 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><Wallet size={18} className="text-primary" />ملخص الحسابات</h2>
            {[["حسابات البنوك", "368,750"], ["الصندوق النقدي", "251,420"], ["حسابات العملاء", "117,330"]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-border py-3 text-sm"><span>{k}</span><b>{v} ريال</b></div>)}
            <div className="mt-3 flex justify-between rounded-lg bg-success/15 p-3 text-sm font-bold text-success"><span>الفرق في الرصيد</span><span>↑ 31.8%</span></div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr_1fr]">
          <section ref={tableRef} className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />آخر حركة أموال</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-primary-soft text-xs"><tr>{["التاريخ", "النوع", "البيان", "الجهة", "المبلغ", "الحالة"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                <tbody>{shown.map((r) => (
                  <tr key={r.id} className="border-t border-border"><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5">{r.kind}</td><td className="p-2.5">{r.desc}</td><td className="p-2.5">{r.party}</td><td className="p-2.5 font-bold">{fmt(r.amount)} ريال</td>
                    <td className="p-2.5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r.status === "مكتمل" ? "bg-success/15 text-success" : r.status === "معلق" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"}`}>{r.status}</span></td></tr>
                ))}{!shown.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">لا توجد حركات مطابقة</td></tr>}</tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">إجمالي السجلات {filtered.length}</span>
              <div className="flex gap-1.5">
                <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                {pageNums.map((n) => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-md border ${cur === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
                <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
              </div>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><Zap size={18} className="text-primary" />إجراء سريع</h2>
            <div className="space-y-2">
              {quick.map(([t, I, fn]) => <button key={t} onClick={fn} className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-muted/40"><span className="flex items-center gap-2"><I size={17} className="text-primary" />{t}</span><ChevronLeft size={15} /></button>)}
              <Link to="/finance/banks" className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-muted/40"><span className="flex items-center gap-2"><Landmark size={17} className="text-primary" />تقرير البنك اليومي</span><ChevronLeft size={15} /></Link>
              <Link to="/finance" className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-muted/40"><span className="flex items-center gap-2"><Wallet size={17} className="text-primary" />تقرير التدفق النقدي</span><ChevronLeft size={15} /></Link>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-extrabold"><LineChart size={18} className="text-primary" />اتجاهات التدفق النقدي</h2>
            <svg viewBox="0 0 250 150" className="w-full">
              {[0, 50, 100, 150, 200].map((v) => <g key={v}><line x1="28" x2="248" y1={130 - v * 0.6} y2={130 - v * 0.6} stroke="var(--border)" /><text x="0" y={133 - v * 0.6} fontSize="7" fill="var(--muted-foreground)">{v ? `${v}K` : 0}</text></g>)}
              <polygon points={`30,130 ${line(trendR)} 238,130`} fill="var(--success)" opacity="0.12" />
              <polyline points={line(trendR)} fill="none" stroke="var(--success)" strokeWidth="2" /><polyline points={line(trendE)} fill="none" stroke="var(--primary)" strokeWidth="2" />
              {months.map((mo, i) => <text key={mo} x={30 + i * 26} y="145" fontSize="6.5" textAnchor="middle" fill="var(--muted-foreground)">{mo}</text>)}
            </svg>
            <div className="flex justify-center gap-4 text-xs"><span className="flex items-center gap-1"><TrendingUp size={13} className="text-success" />الإيرادات</span><span className="flex items-center gap-1"><TrendingDown size={13} className="text-primary" />المصروفات</span></div>
          </section>
        </div>
      </main>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>إضافة حركة مالية جديدة</DialogTitle></DialogHeader>
          {form && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">التاريخ<input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label className="text-sm font-bold">النوع<select className={field} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{kinds.map((k) => <option key={k}>{k}</option>)}</select></label>
              <label className="text-sm font-bold sm:col-span-2">البيان<input className={field} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
              <label className="text-sm font-bold">الجهة<select className={field} value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })}>{parties.map((k) => <option key={k}>{k}</option>)}</select></label>
              <label className="text-sm font-bold">المبلغ (ريال)<input type="number" min={0} className={field} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value || 0 })} /></label>
              <label className="text-sm font-bold">الحالة<select className={field} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((k) => <option key={k}>{k}</option>)}</select></label>
              <div className="flex gap-2 sm:col-span-2"><Button className="flex-1" onClick={save}>حفظ</Button><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>إلغاء</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
