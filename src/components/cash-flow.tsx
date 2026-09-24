import { useMemo, useState } from "react";
import {
  ArrowDownToLine, ArrowUpFromLine, BarChart3, ChevronDown, ChevronLeft, ChevronRight, Database, Download, Eye, FileText,
  ListChecks, Pencil, PieChart, Plus, Printer, RotateCcw, Search, Calculator,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Row = { id: number; date: string; ref: string; desc: string; kind: "داخل" | "خارج"; party: string; account: string; amount: number; after: number };
const accounts = ["البنك الأهلي", "مصرف الراجحي", "بنك الرياض"];
const parties = ["شركة النور", "مؤسسة التوريد", "مشروع العيادات", "الموارد البشرية", "مكتب الخدمات", "شركة المستقبل"];
const base: Row[] = [
  { id: 1, date: "2025-09-30", ref: "RCV-000125", desc: "تحصيل من عميل", kind: "داخل", party: "شركة النور", account: "البنك الأهلي", amount: 250000, after: 3450000 },
  { id: 2, date: "2025-09-29", ref: "PAY-000348", desc: "سداد مورد", kind: "خارج", party: "مؤسسة التوريد", account: "مصرف الراجحي", amount: 180000, after: 3200000 },
  { id: 3, date: "2025-09-28", ref: "RCV-000124", desc: "إيرادات خدمات", kind: "داخل", party: "مشروع العيادات", account: "البنك الأهلي", amount: 420000, after: 3380000 },
  { id: 4, date: "2025-09-27", ref: "PAY-000347", desc: "مصروف رواتب", kind: "خارج", party: "الموارد البشرية", account: "مصرف الراجحي", amount: 360000, after: 2960000 },
  { id: 5, date: "2025-09-26", ref: "PAY-000346", desc: "مصاريف تشغيلية", kind: "خارج", party: "مكتب الخدمات", account: "البنك الأهلي", amount: 95600, after: 3320000 },
];
const inDesc = ["تحصيل فاتورة مبيعات", "إيرادات خدمات", "دفعة مقدمة من عميل", "إيرادات أخرى"];
const outDesc = ["سداد مورد", "إيجار المقر", "مصاريف تشغيلية", "اشتراكات البرامج", "صيانة"];
const seed: Row[] = [...base, ...Array.from({ length: 53 }, (_, i) => {
  const out = i % 2 === 0; const day = 25 - (i % 25);
  return { id: 6 + i, date: `2025-09-${String(day).padStart(2, "0")}`, ref: out ? `PAY-${String(345 - Math.floor(i / 2)).padStart(6, "0")}` : `RCV-${String(123 - Math.floor(i / 2)).padStart(6, "0")}`, desc: out ? outDesc[i % outDesc.length]! : inDesc[i % inDesc.length]!, kind: out ? "خارج" as const : "داخل" as const, party: parties[i % parties.length]!, account: accounts[i % 3]!, amount: 5000 + ((i * 7919) % 50) * 2500, after: 1300000 + ((i * 4513) % 200) * 10000 };
})];
const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر"];
const inflow = [2.4, 3.0, 3.2, 3.4, 2.8, 4.1, 3.5, 3.4, 3.6];
const outflow = [0.8, 2.1, 2.0, 1.7, 1.7, 2.0, 1.7, 2.2, 2.1];
const cum = [0.8, 1.2, 1.9, 2.8, 2.9, 3.3, 3.8, 4.1, 5.0];
const dist: [string, number, string][] = [["إيرادات المبيعات", 45, "var(--success)"], ["إيرادات الخدمات", 25, "var(--primary)"], ["متحصلات العملاء", 15, "var(--finance-purple)"], ["إيرادات أخرى", 10, "var(--warning)"], ["قروض / تمويل", 5, "var(--muted-foreground)"]];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const init = { from: "2025-09-01", to: "2025-09-30", kind: "الكل", account: "الكل", party: "الكل" };
type Form = { id?: number; date: string; kind: "داخل" | "خارج"; desc: string; party: string; account: string; amount: number };

function Donut() {
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return <svg viewBox="0 0 140 140" className="size-40 -rotate-90">{dist.map(([n, p, c]) => { const d = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="18" strokeDasharray={`${d} ${C - d}`} strokeDashoffset={-acc} />; acc += d; return el; })}</svg>;
}

export function CashFlow() {
  const [rows, setRows] = useState(seed);
  const [draft, setDraft] = useState(init); const [f, setF] = useState(init);
  const [page, setPage] = useState(1); const [per, setPer] = useState(10);
  const [form, setForm] = useState<Form | null>(null); const [view, setView] = useState<Row | null>(null);

  const filtered = useMemo(() => rows.filter((r) => r.date >= f.from && r.date <= f.to && (f.kind === "الكل" || r.kind === f.kind) && (f.account === "الكل" || r.account === f.account) && (f.party === "الكل" || r.party === f.party)), [rows, f]);
  const pages = Math.max(1, Math.ceil(filtered.length / per)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const start = Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);

  const exportCsv = () => {
    const csv = [["التاريخ", "رقم المرجع", "البيان", "النوع", "المشروع / الجهة", "الحساب البنكي", "مبلغ الداخل", "مبلغ الخارج", "الرصيد بعد العملية"], ...filtered.map((r) => [dmy(r.date), r.ref, r.desc, r.kind, r.party, r.account, r.kind === "داخل" ? r.amount : "", r.kind === "خارج" ? r.amount : "", r.after])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = "التدفقات-النقدية.csv"; a.click();
    toast.success(`تم تصدير ${filtered.length} عملية`);
  };
  const save = () => {
    if (!form) return;
    if (!form.desc.trim() || form.amount <= 0) { toast.error("اكتب البيان والمبلغ"); return; }
    if (form.id) {
      const id = form.id;
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, date: form.date, kind: form.kind, desc: form.desc, party: form.party, account: form.account, amount: form.amount } : r)));
      toast.success("تم تعديل الحركة");
    } else {
      const prefix = form.kind === "داخل" ? "RCV" : "PAY";
      const next = Math.max(0, ...rows.filter((r) => r.ref.startsWith(prefix)).map((r) => Number(r.ref.slice(4)))) + 1;
      const ref = `${prefix}-${String(next).padStart(6, "0")}`;
      const after = (rows[0]?.after ?? 0) + (form.kind === "داخل" ? form.amount : -form.amount);
      setRows((rs) => [{ id: Date.now(), ref, after, date: form.date, kind: form.kind, desc: form.desc, party: form.party, account: form.account, amount: form.amount }, ...rs].sort((a, b) => b.date.localeCompare(a.date)));
      toast.success(`تم تسجيل الحركة ${ref}`);
    }
    setForm(null); setPage(1);
  };

  const stats = [
    { t: "صافي التدفق النقدي", v: "2,159,850", d: "18%", icon: Calculator, cls: "bg-primary-soft text-primary" },
    { t: "إجمالي التدفقات الخارجة", v: "3,120,600", d: "6%", icon: ArrowUpFromLine, cls: "bg-destructive/10 text-destructive", red: true },
    { t: "إجمالي التدفقات الداخلة", v: "5,280,450", d: "12%", icon: ArrowDownToLine, cls: "bg-success/15 text-success" },
    { t: "الرصيد النقدي الحالي", v: "3,450,000", d: "8%", icon: Database, cls: "bg-success/15 text-success" },
  ];
  const Sel = ({ label, k, opts }: { label: string; k: "kind" | "account" | "party"; opts: string[] }) => (
    <label className="text-xs text-muted-foreground">{label}<select className={field} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}><option>الكل</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  );
  const y = (v: number) => 125 - v * 17;

  return (
    <AppShell>
      <style>{`@media print { aside, header, .no-print { display:none !important } }`}</style>
      <main className="space-y-4 p-4 md:p-6">
        <div className="no-print flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><BarChart3 className="text-primary" size={26} />التدفقات النقدية</h1>
            <p className="mt-1 text-sm text-muted-foreground">مراقبة حركة النقد الداخل والخارج وتوقعات التدفق المستقبلي</p>
          </div>
          <Button className="gap-1.5" onClick={() => setForm({ date: "2025-09-30", kind: "داخل", desc: "", party: parties[0]!, account: accounts[0]!, amount: 0 })}><Plus size={16} />تسجيل حركة نقدية جديدة</Button>
        </div>

        <div className="no-print grid items-end gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-7">
          <label className="text-xs text-muted-foreground">الفترة من<input type="date" className={field} value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></label>
          <label className="text-xs text-muted-foreground">إلى<input type="date" className={field} value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></label>
          <Sel label="نوع التدفق" k="kind" opts={["داخل", "خارج"]} /><Sel label="الحساب البنكي" k="account" opts={accounts} /><Sel label="المشروع / الجهة" k="party" opts={parties} />
          <Button className="h-10 gap-1.5" onClick={() => { setF(draft); setPage(1); }}><Search size={16} />بحث</Button>
          <Button variant="outline" className="h-10 gap-1.5" onClick={() => { setDraft(init); setF(init); setPage(1); }}><RotateCcw size={16} />إعادة التعيين</Button>
        </div>

        <div className="no-print grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-2 text-2xl font-extrabold">{s.v} <span className="text-sm">ريال</span></p></div><span className={`grid size-12 place-items-center rounded-xl ${s.cls}`}><s.icon size={22} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر الماضي</span><b className={s.red ? "text-destructive" : "text-success"}>↑ {s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="no-print grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1.1fr_1fr]">
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />التدفقات النقدية خلال الفترة</h2>
              <div className="flex flex-wrap gap-3 text-xs"><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-success" />التدفقات الداخلة</span><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-destructive" />التدفقات الخارجة</span><span className="flex items-center gap-1"><span className="h-0.5 w-4 bg-primary" />الرصيد التراكمي</span></div></div>
            <svg viewBox="0 0 440 180" className="w-full">
              {[-2, 0, 2, 4, 6].map((v) => <g key={v}><line x1="58" x2="438" y1={y(v)} y2={y(v)} stroke="var(--border)" /><text x="0" y={y(v) + 3} fontSize="8" fill="var(--muted-foreground)">{fmt(v * 1000000)}</text></g>)}
              {months.map((m, i) => { const x = 68 + i * 41; return <g key={m}><rect x={x} y={y(inflow[i]!)} width="13" height={inflow[i]! * 17} rx="1.5" fill="var(--success)" /><rect x={x + 15} y={y(outflow[i]!)} width="13" height={outflow[i]! * 17} rx="1.5" fill="var(--destructive)" /><text x={x + 14} y="172" fontSize="8.5" textAnchor="middle" fill="var(--muted-foreground)">{m}</text></g>; })}
              <polyline points={cum.map((v, i) => `${82 + i * 41},${y(v)}`).join(" ")} fill="none" stroke="var(--primary)" strokeWidth="2" />
              {cum.map((v, i) => <circle key={i} cx={82 + i * 41} cy={y(v)} r="3" fill="var(--primary)" />)}
            </svg>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><PieChart size={18} className="text-primary" />توزيع التدفقات النقدية</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="relative"><Donut /><div className="absolute inset-0 grid place-content-center text-center"><b className="text-lg">5,280,450</b><span className="text-xs text-muted-foreground">ريال</span><span className="text-[10px] text-muted-foreground">تدفقات داخلة</span></div></div>
              <ul className="min-w-36 flex-1 space-y-2 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />ملخص الفترة</h2>
            {[["رصيد بداية الفترة", "1,290,150"], ["إجمالي التدفقات الداخلة", "5,280,450"], ["إجمالي التدفقات الخارجة", "3,120,600"]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-border py-2.5 text-sm"><span>{k}</span><b>{v} ريال</b></div>)}
            <div className="my-2 flex justify-between rounded-lg bg-success/15 p-3 text-sm font-bold text-success"><span>صافي التدفق النقدي</span><span>2,159,850 ريال</span></div>
            <div className="flex justify-between py-2 text-sm"><span>رصيد نهاية الفترة</span><b>3,450,000 ريال</b></div>
          </section>
        </div>

        <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-extrabold"><ListChecks size={18} className="text-primary" />تفاصيل التدفقات النقدية</h2>
            <div className="no-print flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}><Printer size={15} />طباعة</Button>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Download size={15} />تصدير<ChevronDown size={13} /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start"><DropdownMenuItem onClick={exportCsv}>Excel</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-primary-soft text-xs"><tr>{["#", "التاريخ", "رقم المرجع", "البيان", "النوع", "المشروع / الجهة", "حساب البنك", "مبلغ الداخل (ريال)", "مبلغ الخارج (ريال)", "الرصيد بعد العملية", "الإجراء"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-2.5">{(cur - 1) * per + i + 1}</td><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5" dir="ltr">{r.ref}</td><td className="p-2.5">{r.desc}</td>
                    <td className="p-2.5"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${r.kind === "داخل" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>{r.kind}</span></td>
                    <td className="p-2.5">{r.party}</td><td className="p-2.5">{r.account}</td>
                    <td className="p-2.5 font-bold text-success">{r.kind === "داخل" ? fmt(r.amount) : <span className="text-destructive">-</span>}</td>
                    <td className="p-2.5 font-bold text-destructive">{r.kind === "خارج" ? fmt(r.amount) : "-"}</td>
                    <td className="p-2.5">{fmt(r.after)}</td>
                    <td className="p-2.5"><div className="flex gap-1">
                      <button aria-label="عرض" onClick={() => setView(r)} className="grid size-8 place-items-center rounded-md border border-border text-primary hover:bg-muted"><Eye size={15} /></button>
                      <button aria-label="تعديل" onClick={() => setForm({ id: r.id, date: r.date, kind: r.kind, desc: r.desc, party: r.party, account: r.account, amount: r.amount })} className="grid size-8 place-items-center rounded-md border border-border text-primary hover:bg-muted"><Pencil size={15} /></button>
                    </div></td>
                  </tr>
                ))}
                {!shown.length && <tr><td colSpan={11} className="p-6 text-center text-muted-foreground">لا توجد حركات مطابقة</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="no-print mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">عرض
              <select value={per} onChange={(e) => { setPer(+e.target.value); setPage(1); }} className="h-9 rounded-lg border border-border bg-card px-2">{[10, 25, 50].map((n) => <option key={n}>{n}</option>)}</select>
              من {filtered.length} عملية</div>
            <div className="flex items-center gap-1.5">
              <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
              {nums.map((n) => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-md border ${cur === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
              {nums[nums.length - 1]! < pages && <span className="px-1">…</span>}
              <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
            </div>
          </div>
        </section>
      </main>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>{form?.id ? "تعديل حركة نقدية" : "تسجيل حركة نقدية جديدة"}</DialogTitle></DialogHeader>
          {form && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">التاريخ<input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label className="text-sm font-bold">النوع<select className={field} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as "داخل" | "خارج" })}><option>داخل</option><option>خارج</option></select></label>
              <label className="text-sm font-bold sm:col-span-2">البيان<input className={field} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
              <label className="text-sm font-bold">المشروع / الجهة<select className={field} value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })}>{parties.map((p) => <option key={p}>{p}</option>)}</select></label>
              <label className="text-sm font-bold">الحساب البنكي<select className={field} value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })}>{accounts.map((p) => <option key={p}>{p}</option>)}</select></label>
              <label className="text-sm font-bold sm:col-span-2">المبلغ (ريال)<input type="number" min={0} className={field} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value || 0 })} /></label>
              <div className="flex gap-2 sm:col-span-2"><Button className="flex-1" onClick={save}>حفظ</Button><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>إلغاء</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>تفاصيل الحركة {view?.ref}</DialogTitle></DialogHeader>
          {view && <dl className="divide-y divide-border text-sm">{([["التاريخ", dmy(view.date)], ["البيان", view.desc], ["النوع", view.kind], ["المشروع / الجهة", view.party], ["الحساب البنكي", view.account], ["المبلغ", `${fmt(view.amount)} ريال`], ["الرصيد بعد العملية", `${fmt(view.after)} ريال`]] as const).map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
