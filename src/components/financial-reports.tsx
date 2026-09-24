import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3, ChevronDown, ChevronLeft, ChevronRight, Coins, Download, FileBarChart, FileText, Filter, LineChart,
  PieChart, Receipt, Wallet, Zap, ClipboardList, WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type R = { id: number; date: string; desc: string; kind: string; branch: string; dept: string; amount: number; status: string };
const branches = ["الرياض", "جدة", "الدمام"];
const depts = ["المبيعات", "المالية", "الموارد البشرية", "التشغيل"];
const reportTypes = ["التقرير المالي العام", "تقرير الإيرادات", "تقرير المصروفات"];
const base: R[] = [
  { id: 1, date: "2025-09-28", desc: "إيراد من عميل", kind: "إيراد", branch: "الرياض", dept: "المبيعات", amount: 50000, status: "مكتمل" },
  { id: 2, date: "2025-09-27", desc: "مشتريات مواد تشغيلية", kind: "مصروف", branch: "جدة", dept: "التشغيل", amount: 28750, status: "مكتمل" },
  { id: 3, date: "2025-09-25", desc: "رواتب وأجور", kind: "مصروف", branch: "الرياض", dept: "الموارد البشرية", amount: 75000, status: "مكتمل" },
  { id: 4, date: "2025-09-22", desc: "إيجار مقر الشركة", kind: "مصروف", branch: "الرياض", dept: "المالية", amount: 42500, status: "مكتمل" },
  { id: 5, date: "2025-09-20", desc: "إيراد من عميل", kind: "إيراد", branch: "الدمام", dept: "المبيعات", amount: 30000, status: "مكتمل" },
];
const descs: [string, string][] = [["تحصيل فاتورة مبيعات", "إيراد"], ["سداد مورد", "مصروف"], ["إيرادات خدمات", "إيراد"], ["فواتير كهرباء ومياه", "مصروف"], ["اشتراكات البرامج", "مصروف"], ["دفعة مقدمة من عميل", "إيراد"]];
const seed: R[] = [...base, ...Array.from({ length: 43 }, (_, i) => {
  const [d, k] = descs[i % descs.length]!; return { id: 6 + i, date: `2025-09-${String(19 - (i % 19)).padStart(2, "0")}`, desc: d, kind: k, branch: branches[i % 3]!, dept: depts[i % 4]!, amount: 3000 + ((i * 5171) % 40) * 1250, status: i % 10 === 6 ? "معلق" : "مكتمل" };
})];
const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر"];
const rev = [235, 245, 260, 260, 270, 295, 310, 330, 410];
const exp = [170, 185, 190, 190, 195, 215, 235, 245, 300];
const tIn = [50, 75, 70, 70, 105, 110, 120, 135, 160];
const tOut = [25, 35, 35, 40, 70, 75, 85, 100, 120];
const dist: [string, number, string][] = [["الرواتب والأجور", 38, "var(--primary)"], ["المشتريات", 22, "var(--success)"], ["الإيجارات", 12, "var(--warning)"], ["المصاريف التشغيلية", 10, "var(--finance-orange)"], ["التكاليف المتكررة", 8, "var(--destructive)"], ["أخرى", 10, "var(--finance-purple)"]];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const PER = 5;
const init = { from: "2025-09-01", to: "2025-09-30", branch: "الكل", dept: "الكل", type: reportTypes[0]! };

function Donut() {
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return <svg viewBox="0 0 140 140" className="size-40 -rotate-90">{dist.map(([n, p, c]) => { const d = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="18" strokeDasharray={`${d} ${C - d}`} strokeDashoffset={-acc} />; acc += d; return el; })}</svg>;
}

export function FinancialReports() {
  const [draft, setDraft] = useState(init); const [f, setF] = useState(init);
  const [page, setPage] = useState(1);
  const tableRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => seed.filter((r) => r.date >= f.from && r.date <= f.to && (f.branch === "الكل" || r.branch === f.branch) && (f.dept === "الكل" || r.dept === f.dept) && (f.type === reportTypes[0] || (f.type === "تقرير الإيرادات" ? r.kind === "إيراد" : r.kind === "مصروف"))), [f]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const start = Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);

  const exportCsv = (name = "التقرير-المالي", rows = filtered) => {
    const csv = [["التاريخ", "البيان", "نوع الحركة", "الفرع", "القسم", "المبلغ", "الحالة"], ...rows.map((r) => [dmy(r.date), r.desc, r.kind, r.branch, r.dept, r.kind === "مصروف" ? -r.amount : r.amount, r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = `${name}.csv`; a.click();
    toast.success("تم تنزيل التقرير");
  };

  const stats = [
    { t: "إجمالي الأصول", v: "1,245,700", d: "4%", icon: FileText, cls: "bg-warning/15 text-warning" },
    { t: "الرصيد النقدي", v: "458,230", d: "6%", icon: WalletCards, cls: "bg-finance-violet text-finance-purple" },
    { t: "صافي الربح", v: "117,330", d: "15%", icon: Receipt, cls: "bg-primary-soft text-primary" },
    { t: "إجمالي المصروفات", v: "251,420", d: "8%", icon: Wallet, cls: "bg-destructive/10 text-destructive" },
    { t: "إجمالي الإيرادات", v: "368,750", d: "12%", icon: Coins, cls: "bg-success/15 text-success" },
  ];
  const row = "flex w-full items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-muted/40";
  const line = (arr: number[]) => arr.map((v, i) => `${34 + i * 26},${130 - v * 0.6}`).join(" ");
  const Sel = ({ label, k, opts, all = true }: { label: string; k: "branch" | "dept" | "type"; opts: string[]; all?: boolean }) => (
    <label className="text-xs text-muted-foreground">{label}<select className={field} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}>{all && <option>الكل</option>}{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  );

  return (
    <AppShell>
      <style>{`@media print { aside, header, .no-print { display:none !important } }`}</style>
      <main className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><FileBarChart className="text-primary" size={26} />التقارير المالية</h1>
            <p className="mt-1 text-sm text-muted-foreground">متابعة الأداء المالي والتقارير التفصيلية للمؤسسة</p>
          </div>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="no-print gap-1.5"><Download size={16} />تصدير التقرير<ChevronDown size={14} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="start"><DropdownMenuItem onClick={() => exportCsv()}>Excel</DropdownMenuItem><DropdownMenuItem onClick={() => window.print()}>طباعة</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        </div>

        <div className="no-print grid items-end gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          <label className="text-xs text-muted-foreground">من<input type="date" className={field} value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></label>
          <label className="text-xs text-muted-foreground">إلى<input type="date" className={field} value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></label>
          <Sel label="الفرع" k="branch" opts={branches} /><Sel label="القسم" k="dept" opts={depts} /><Sel label="نوع التقرير" k="type" opts={reportTypes} all={false} />
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
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />الإيرادات والمصروفات</h2>
              <div className="flex gap-3 text-xs"><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-success" />الإيرادات</span><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-primary" />المصروفات</span></div></div>
            <svg viewBox="0 0 420 200" className="w-full">
              {[0, 100, 200, 300, 400, 500].map((v) => <g key={v}><line x1="52" x2="418" y1={175 - v * 0.32} y2={175 - v * 0.32} stroke="var(--border)" /><text x="0" y={178 - v * 0.32} fontSize="9" fill="var(--muted-foreground)">{fmt(v * 1000)}</text></g>)}
              {months.map((m, i) => { const x = 62 + i * 40; return <g key={m}><rect x={x} y={175 - rev[i]! * 0.32} width="13" height={rev[i]! * 0.32} rx="2" fill="var(--success)" /><rect x={x + 15} y={175 - exp[i]! * 0.32} width="13" height={exp[i]! * 0.32} rx="2" fill="var(--primary)" /><text x={x + 14} y="192" fontSize="9" textAnchor="middle" fill="var(--muted-foreground)">{m}</text></g>; })}
            </svg>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><PieChart size={18} className="text-primary" />توزيع المصروفات</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="relative"><Donut /><div className="absolute inset-0 grid place-content-center text-center"><b className="text-lg">251,420</b><span className="text-xs text-muted-foreground">ريال</span></div></div>
              <ul className="min-w-40 flex-1 space-y-2 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><ClipboardList size={18} className="text-primary" />ملخص مالي</h2>
            {[["إجمالي الإيرادات", "368,750"], ["إجمالي المصروفات", "251,420"], ["صافي الربح", "117,330"]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-border py-3 text-sm"><span>{k}</span><b>{v} ريال</b></div>)}
            <div className="mt-3 flex justify-between rounded-lg bg-success/15 p-3 text-sm font-bold text-success"><span>نسبة الربح</span><span>↑ 31.8%</span></div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr_1fr]">
          <section ref={tableRef} className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />التقارير المالية التفصيلية</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-primary-soft text-xs"><tr>{["التاريخ", "البيان", "نوع الحركة", "المبلغ", "الحالة"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                <tbody>{shown.map((r) => (
                  <tr key={r.id} className="border-t border-border"><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5">{r.desc}</td><td className="p-2.5">{r.kind}</td>
                    <td className={`p-2.5 font-bold ${r.kind === "مصروف" ? "text-destructive" : "text-success"}`}>{r.kind === "مصروف" ? "- " : ""}{fmt(r.amount)} ريال</td>
                    <td className="p-2.5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r.status === "مكتمل" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{r.status}</span></td></tr>
                ))}{!shown.length && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">لا توجد بيانات مطابقة</td></tr>}</tbody>
              </table>
            </div>
            <div className="no-print mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">إجمالي السجلات: {filtered.length}</span>
              <div className="flex gap-1.5">
                <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                {nums.map((n) => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-md border ${cur === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
                <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
              </div>
            </div>
          </section>
          <section className="no-print min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><Zap size={18} className="text-primary" />تقارير سريعة</h2>
            <div className="space-y-2">
              <button className={row} onClick={() => exportCsv("تقرير-الإيرادات-والمصروفات", seed)}><span className="flex items-center gap-2"><BarChart3 size={17} className="text-primary" />تقرير الإيرادات والمصروفات</span><ChevronLeft size={15} /></button>
              <Link to="/finance" className={row}><span className="flex items-center gap-2"><PieChart size={17} className="text-primary" />تقرير الربحية</span><ChevronLeft size={15} /></Link>
              <Link to="/finance/cash-flow" className={row}><span className="flex items-center gap-2"><WalletCards size={17} className="text-primary" />تقرير التدفقات النقدية</span><ChevronLeft size={15} /></Link>
              <button className={row} onClick={() => tableRef.current?.scrollIntoView({ behavior: "smooth" })}><span className="flex items-center gap-2"><ClipboardList size={17} className="text-primary" />تقرير تفصيلي بالمشاريع</span><ChevronLeft size={15} /></button>
              <Link to="/sales" className={row}><span className="flex items-center gap-2"><FileText size={17} className="text-primary" />تقرير الفواتير المستحقة</span><ChevronLeft size={15} /></Link>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-extrabold"><LineChart size={18} className="text-primary" />التدفقات النقدية</h2>
            <svg viewBox="0 0 250 150" className="w-full">
              {[0, 50, 100, 150, 200].map((v) => <g key={v}><line x1="30" x2="248" y1={130 - v * 0.6} y2={130 - v * 0.6} stroke="var(--border)" /><text x="0" y={133 - v * 0.6} fontSize="7" fill="var(--muted-foreground)">{v ? `${v}K` : 0}</text></g>)}
              <polygon points={`34,130 ${line(tIn)} 242,130`} fill="var(--success)" opacity="0.12" />
              <polyline points={line(tIn)} fill="none" stroke="var(--success)" strokeWidth="2" /><polyline points={line(tOut)} fill="none" stroke="var(--primary)" strokeWidth="2" />
              {months.map((m, i) => <text key={m} x={34 + i * 26} y="145" fontSize="6.5" textAnchor="middle" fill="var(--muted-foreground)">{m}</text>)}
            </svg>
            <div className="flex justify-center gap-4 text-xs"><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-success" />التدفقات الداخلة</span><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-primary" />التدفقات الخارجة</span></div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
