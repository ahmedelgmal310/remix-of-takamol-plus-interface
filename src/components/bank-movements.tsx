import { useMemo, useState } from "react";
import {
  ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, ChevronDown, ChevronLeft, ChevronRight, Database, Download, Eye,
  FileText, Landmark, LineChart, Pencil, PieChart, Plus, Printer, RotateCcw, Search, ListChecks,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Tx = { id: number; date: string; ref: string; bank: string; kind: string; desc: string; amount: number; after: number; party: string; status: string };
const banks = ["البنك الأهلي", "مصرف الراجحي", "بنك الرياض", "بنك البلاد"];
const accounts: Record<string, string> = { "البنك الأهلي": "****7315", "مصرف الراجحي": "****4821", "بنك الرياض": "****9042", "بنك البلاد": "****2210" };
const kinds = ["إيداع", "سحب", "حوالة"];
const statuses = ["مكتملة", "معلقة", "ملغاة"];
const base: Tx[] = [
  { id: 458, date: "2025-09-28", ref: "TRX-000458", bank: "البنك الأهلي", kind: "إيداع", desc: "إيرادات مبيعات", amount: 250000, after: 520450, party: "شركة النور", status: "مكتملة" },
  { id: 457, date: "2025-09-27", ref: "TRX-000457", bank: "مصرف الراجحي", kind: "سحب", desc: "دفع موردين", amount: 75000, after: 412300, party: "مؤسسة التوريد", status: "مكتملة" },
  { id: 456, date: "2025-09-26", ref: "TRX-000456", bank: "بنك الرياض", kind: "حوالة", desc: "تحويل داخلي", amount: 50000, after: 210600, party: "بنك الرياض", status: "مكتملة" },
  { id: 455, date: "2025-09-25", ref: "TRX-000455", bank: "بنك البلاد", kind: "إيداع", desc: "دفعة من عميل", amount: 180000, after: 102350, party: "شركة المستقبل", status: "مكتملة" },
  { id: 454, date: "2025-09-24", ref: "TRX-000454", bank: "البنك الأهلي", kind: "سحب", desc: "مصاريف تشغيلية", amount: 32500, after: 270600, party: "مكتب الخدمات", status: "مكتملة" },
];
const descs = ["تحصيل فاتورة", "سداد مورد", "تحويل بين الحسابات", "رواتب الموظفين", "رسوم بنكية", "دفعة مقدمة", "إيجار المقر", "اشتراكات"];
const partiesX = ["شركة النور", "مؤسسة التوريد", "شركة المستقبل", "مكتب الخدمات", "الموظفين", "شركة الأمل"];
const seed: Tx[] = [...base, ...Array.from({ length: 281 }, (_, i) => {
  const id = 453 - i; const day = 23 - (i % 23);
  return { id, date: `2025-09-${String(day).padStart(2, "0")}`, ref: `TRX-${String(id).padStart(6, "0")}`, bank: banks[i % 4]!, kind: kinds[i % 3]!, desc: descs[i % descs.length]!, amount: 1500 + ((i * 7919) % 60) * 1250, after: 90000 + ((i * 3571) % 400) * 1000, party: partiesX[i % partiesX.length]!, status: i % 11 === 5 ? "معلقة" : "مكتملة" };
})];
const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر"];
const dep = [130, 130, 215, 195, 250, 220, 205, 280, 335];
const wd = [60, 40, 120, 105, 135, 135, 135, 140, 225];
const dist: [string, number, string][] = [["البنك الأهلي", 38, "var(--success)"], ["مصرف الراجحي", 27, "var(--primary)"], ["بنك الرياض", 18, "var(--finance-purple)"], ["بنك البلاد", 10, "var(--warning)"], ["بنوك أخرى", 7, "var(--muted-foreground)"]];
const balances: [string, string, string][] = [["البنك الأهلي", "520,450", "bg-success"], ["مصرف الراجحي", "412,300", "bg-primary"], ["بنك الرياض", "210,600", "bg-finance-purple"], ["بنك البلاد", "102,350", "bg-destructive"]];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const kindCls: Record<string, string> = { "إيداع": "bg-success/15 text-success", "سحب": "bg-destructive/10 text-destructive", "حوالة": "bg-primary-soft text-primary" };
const stCls: Record<string, string> = { "مكتملة": "bg-success/15 text-success", "معلقة": "bg-warning/15 text-warning", "ملغاة": "bg-muted text-muted-foreground" };
const init = { from: "2025-09-01", to: "2025-09-30", bank: "الكل", kind: "الكل", account: "الكل" };
type Form = { id?: number; date: string; bank: string; kind: string; desc: string; amount: number; party: string; status: string };

function Donut() {
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return <svg viewBox="0 0 140 140" className="size-40 -rotate-90">{dist.map(([n, p, c]) => { const d = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="20" strokeDasharray={`${d} ${C - d}`} strokeDashoffset={-acc} />; acc += d; return el; })}</svg>;
}

export function BankMovements() {
  const [rows, setRows] = useState(seed);
  const [draft, setDraft] = useState(init); const [f, setF] = useState(init);
  const [page, setPage] = useState(1); const [per, setPer] = useState(10);
  const [form, setForm] = useState<Form | null>(null); const [view, setView] = useState<Tx | null>(null);

  const filtered = useMemo(() => rows.filter((r) => r.date >= f.from && r.date <= f.to && (f.bank === "الكل" || r.bank === f.bank) && (f.kind === "الكل" || r.kind === f.kind) && (f.account === "الكل" || accounts[r.bank] === f.account)), [rows, f]);
  const pages = Math.max(1, Math.ceil(filtered.length / per)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const start = Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);

  const exportCsv = () => {
    const csv = [["التاريخ", "رقم المرجع", "البنك", "نوع العملية", "البيان", "المبلغ", "الرصيد بعد العملية", "الجهة", "الحالة"], ...filtered.map((r) => [dmy(r.date), r.ref, r.bank, r.kind, r.desc, r.kind === "إيداع" ? r.amount : -r.amount, r.after, r.party, r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = "كشف-حركة-البنوك.csv"; a.click();
    toast.success(`تم تصدير ${filtered.length} عملية`);
  };
  const save = () => {
    if (!form) return;
    if (!form.desc.trim() || !form.party.trim() || form.amount <= 0) { toast.error("أكمل البيان والجهة والمبلغ"); return; }
    if (form.id) {
      const id = form.id;
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, date: form.date, bank: form.bank, kind: form.kind, desc: form.desc, amount: form.amount, party: form.party, status: form.status } : r)));
      toast.success("تم تعديل العملية");
    } else {
      const id = Math.max(...rows.map((r) => r.id)) + 1;
      const last = rows.find((r) => r.bank === form.bank)?.after ?? 0;
      const after = last + (form.kind === "إيداع" ? form.amount : -form.amount);
      setRows((rs) => [{ id, ref: `TRX-${String(id).padStart(6, "0")}`, after, date: form.date, bank: form.bank, kind: form.kind, desc: form.desc, amount: form.amount, party: form.party, status: form.status }, ...rs].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id));
      toast.success(`تمت إضافة العملية TRX-${String(id).padStart(6, "0")}`);
    }
    setForm(null); setPage(1);
  };

  const stats = [
    { t: "عدد العمليات", v: fmt(rows.length), u: "", d: "10%", icon: Landmark, cls: "bg-warning/15 text-warning" },
    { t: "الحوالات البنكية", v: "320,600", u: "ريال", d: "15%", icon: ArrowLeftRight, cls: "bg-finance-violet text-finance-purple" },
    { t: "إجمالي السحوبات", v: "1,434,750", u: "ريال", d: "6%", icon: ArrowUpFromLine, cls: "bg-destructive/10 text-destructive" },
    { t: "إجمالي الإيداعات", v: "2,680,450", u: "ريال", d: "8%", icon: ArrowDownToLine, cls: "bg-success/15 text-success" },
    { t: "الرصيد الإجمالي", v: "1,245,700", u: "ريال", d: "12%", icon: Database, cls: "bg-primary-soft text-primary" },
  ];
  const Sel = ({ label, k, opts }: { label: string; k: "bank" | "kind" | "account"; opts: string[] }) => (
    <label className="text-xs text-muted-foreground">{label}<select className={field} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}><option>الكل</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  );
  const pt = (arr: number[]) => arr.map((v, i) => `${50 + i * 45},${150 - v * 0.33}`).join(" ");

  return (
    <AppShell>
      <style>{`@media print { aside, header, .no-print { display:none !important } }`}</style>
      <main className="space-y-4 p-4 md:p-6">
        <div className="no-print flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><Landmark className="text-primary" size={26} />حركة البنوك</h1>
            <p className="mt-1 text-sm text-muted-foreground">متابعة جميع معاملات البنوك والإيداعات والسحوبات والرصيد الحالي</p>
          </div>
          <Button className="gap-1.5" onClick={() => setForm({ date: "2025-09-30", bank: banks[0]!, kind: "إيداع", desc: "", amount: 0, party: "", status: "مكتملة" })}><Plus size={16} />عملية بنكية جديدة</Button>
        </div>

        <div className="no-print grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-2 text-2xl font-extrabold">{s.v} {s.u && <span className="text-sm">{s.u}</span>}</p></div><span className={`grid size-11 place-items-center rounded-xl ${s.cls}`}><s.icon size={21} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر الماضي</span><b className="text-success">↑ {s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="no-print grid items-end gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-7">
          <label className="text-xs text-muted-foreground">من تاريخ<input type="date" className={field} value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></label>
          <label className="text-xs text-muted-foreground">إلى تاريخ<input type="date" className={field} value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></label>
          <Sel label="البنك" k="bank" opts={banks} /><Sel label="نوع العملية" k="kind" opts={kinds} /><Sel label="رقم الحساب" k="account" opts={Object.values(accounts)} />
          <Button className="h-10 gap-1.5" onClick={() => { setF(draft); setPage(1); }}><Search size={16} />بحث</Button>
          <Button variant="outline" className="h-10 gap-1.5" onClick={() => { setDraft(init); setF(init); setPage(1); }}><RotateCcw size={16} />إعادة تعيين</Button>
        </div>

        <div className="no-print grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1.2fr_1fr]">
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-extrabold"><LineChart size={18} className="text-primary" />حركة البنوك خلال الفترة</h2>
              <div className="flex gap-3 text-xs"><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-success" />الإيداعات</span><span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-primary" />السحوبات</span></div></div>
            <svg viewBox="0 0 420 180" className="w-full">
              {[0, 100, 200, 300, 400].map((v) => <g key={v}><line x1="46" x2="418" y1={150 - v * 0.33} y2={150 - v * 0.33} stroke="var(--border)" /><text x="0" y={153 - v * 0.33} fontSize="8" fill="var(--muted-foreground)">{fmt(v * 1000)}</text></g>)}
              <polygon points={`50,150 ${pt(dep)} 410,150`} fill="var(--success)" opacity="0.12" />
              <polygon points={`50,150 ${pt(wd)} 410,150`} fill="var(--primary)" opacity="0.1" />
              <polyline points={pt(dep)} fill="none" stroke="var(--success)" strokeWidth="2" /><polyline points={pt(wd)} fill="none" stroke="var(--primary)" strokeWidth="2" />
              {dep.map((v, i) => <circle key={`d${i}`} cx={50 + i * 45} cy={150 - v * 0.33} r="3" fill="var(--success)" />)}
              {wd.map((v, i) => <circle key={`w${i}`} cx={50 + i * 45} cy={150 - v * 0.33} r="3" fill="var(--primary)" />)}
              {months.map((m, i) => <text key={m} x={50 + i * 45} y="170" fontSize="8.5" textAnchor="middle" fill="var(--muted-foreground)">{m}</text>)}
            </svg>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><PieChart size={18} className="text-primary" />توزيع العمليات حسب البنك</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="relative"><Donut /><div className="absolute inset-0 grid place-content-center text-center"><b className="text-2xl">286</b><span className="text-xs text-muted-foreground">عملية</span></div></div>
              <ul className="min-w-36 flex-1 space-y-2 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />أرصدة البنوك الحالية</h2>
            {balances.map(([n, v, c]) => <div key={n} className="flex items-center justify-between border-b border-border py-3 last:border-0"><span className="flex items-center gap-2 text-sm"><span className={`grid size-8 place-items-center rounded-lg text-primary-foreground ${c}`}><Landmark size={16} /></span>{n}</span><b>{v} <span className="text-xs font-normal">ريال</span></b></div>)}
          </section>
        </div>

        <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-extrabold"><ListChecks size={18} className="text-primary" />كشف حركة البنوك</h2>
            <div className="no-print flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}><Printer size={15} />طباعة</Button>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="gap-1.5"><Download size={15} />تصدير<ChevronDown size={13} /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start"><DropdownMenuItem onClick={exportCsv}>Excel</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-primary-soft text-xs"><tr>{["#", "التاريخ", "رقم المرجع", "البنك", "نوع العملية", "البيان", "المبلغ (ريال)", "الرصيد بعد العملية", "الجهة / المستفيد", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-2.5">{(cur - 1) * per + i + 1}</td><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5" dir="ltr">{r.ref}</td><td className="p-2.5">{r.bank}</td>
                    <td className="p-2.5"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${kindCls[r.kind] ?? ""}`}>{r.kind}</span></td>
                    <td className="p-2.5">{r.desc}</td>
                    <td className={`p-2.5 font-bold ${r.kind === "إيداع" ? "text-success" : "text-destructive"}`} dir="ltr">{r.kind === "إيداع" ? "" : "-"}{fmt(r.amount)}</td>
                    <td className="p-2.5">{fmt(r.after)}</td><td className="p-2.5">{r.party}</td>
                    <td className="p-2.5"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${stCls[r.status] ?? ""}`}>{r.status}</span></td>
                    <td className="p-2.5"><div className="flex gap-1">
                      <button aria-label="عرض" onClick={() => setView(r)} className="grid size-8 place-items-center rounded-md border border-border text-primary hover:bg-muted"><Eye size={15} /></button>
                      <button aria-label="تعديل" onClick={() => setForm({ id: r.id, date: r.date, bank: r.bank, kind: r.kind, desc: r.desc, amount: r.amount, party: r.party, status: r.status })} className="grid size-8 place-items-center rounded-md border border-border text-primary hover:bg-muted"><Pencil size={15} /></button>
                    </div></td>
                  </tr>
                ))}
                {!shown.length && <tr><td colSpan={11} className="p-6 text-center text-muted-foreground">لا توجد عمليات مطابقة</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="no-print mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">عرض
              <select value={per} onChange={(e) => { setPer(+e.target.value); setPage(1); }} className="h-9 rounded-lg border border-border bg-card px-2">{[10, 25, 50].map((n) => <option key={n}>{n}</option>)}</select>
              من {fmt(filtered.length)} عملية</div>
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
          <DialogHeader><DialogTitle>{form?.id ? "تعديل عملية بنكية" : "عملية بنكية جديدة"}</DialogTitle></DialogHeader>
          {form && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">البنك<select className={field} value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })}>{banks.map((b) => <option key={b}>{b}</option>)}</select></label>
              <label className="text-sm font-bold">نوع العملية<select className={field} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{kinds.map((k) => <option key={k}>{k}</option>)}</select></label>
              <label className="text-sm font-bold sm:col-span-2">البيان<input className={field} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
              <label className="text-sm font-bold">المبلغ (ريال)<input type="number" min={0} className={field} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value || 0 })} /></label>
              <label className="text-sm font-bold">الجهة / المستفيد<input className={field} value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} /></label>
              <label className="text-sm font-bold">التاريخ<input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label className="text-sm font-bold">الحالة<select className={field} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((k) => <option key={k}>{k}</option>)}</select></label>
              <div className="flex gap-2 sm:col-span-2"><Button className="flex-1" onClick={save}>حفظ</Button><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>إلغاء</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>تفاصيل العملية {view?.ref}</DialogTitle></DialogHeader>
          {view && <dl className="divide-y divide-border text-sm">{([["التاريخ", dmy(view.date)], ["البنك", view.bank], ["رقم الحساب", accounts[view.bank] ?? "—"], ["نوع العملية", view.kind], ["البيان", view.desc], ["المبلغ", `${fmt(view.amount)} ريال`], ["الرصيد بعد العملية", `${fmt(view.after)} ريال`], ["الجهة / المستفيد", view.party], ["الحالة", view.status]] as const).map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
