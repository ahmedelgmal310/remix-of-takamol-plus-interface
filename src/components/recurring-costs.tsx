import { useMemo, useState } from "react";
import {
  AlarmClock, BarChart3, Building2, CalendarClock, CalendarDays, ChevronLeft, ChevronRight, Download, Droplet, Eye,
  FileStack, Megaphone, MonitorCog, MoreHorizontal, Pencil, Plus, Search, TrendingUp, Users, Wallet, Wifi, Wrench, Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Cost = { id: number; name: string; vendor: string; type: string; dept: string; amount: number; due: string; freq: string; status: string };

const types = ["إيجار", "اتصالات", "مرافق", "رواتب", "صيانة", "برامج", "تسويق"];
const depts = ["الإدارة العامة", "تقنية المعلومات", "الموارد البشرية", "التسويق", "الشؤون المالية"];
const freqs = ["شهري", "ربع سنوي", "سنوي"];
const statuses = ["نشط", "قيد المراجعة", "موقوف", "مدفوعة"];
const icons: Record<string, typeof Wifi> = { "إيجار": Building2, "اتصالات": Wifi, "مرافق": Zap, "رواتب": Users, "صيانة": Wrench, "برامج": MonitorCog, "تسويق": Megaphone };
const pill: Record<string, string> = { "نشط": "bg-success/15 text-success", "قيد المراجعة": "bg-warning/15 text-warning", "موقوف": "bg-muted text-muted-foreground", "مدفوعة": "bg-primary-soft text-primary" };

const seed: Cost[] = [
  { id: 1, name: "إيجار المبنى", vendor: "شركة العقارية", type: "إيجار", dept: "الإدارة العامة", amount: 50000, due: "2025-09-01", freq: "شهري", status: "نشط" },
  { id: 2, name: "اشتراك الإنترنت", vendor: "موبايلي", type: "اتصالات", dept: "تقنية المعلومات", amount: 1200, due: "2025-09-05", freq: "شهري", status: "نشط" },
  { id: 3, name: "خدمات الكهرباء", vendor: "شركة الكهرباء", type: "مرافق", dept: "الإدارة العامة", amount: 3750, due: "2025-09-10", freq: "شهري", status: "نشط" },
  { id: 4, name: "المياه", vendor: "شركة المياه", type: "مرافق", dept: "الإدارة العامة", amount: 2100, due: "2025-09-12", freq: "شهري", status: "نشط" },
  { id: 5, name: "رواتب الموظفين", vendor: "البنك الأهلي", type: "رواتب", dept: "الموارد البشرية", amount: 120000, due: "2025-09-15", freq: "شهري", status: "نشط" },
  { id: 6, name: "صيانة الأجهزة", vendor: "مؤسسة التقنية", type: "صيانة", dept: "تقنية المعلومات", amount: 8500, due: "2025-09-20", freq: "شهري", status: "قيد المراجعة" },
  { id: 7, name: "اشتراك البرامج", vendor: "Microsoft", type: "برامج", dept: "تقنية المعلومات", amount: 6800, due: "2025-09-25", freq: "شهري", status: "نشط" },
  { id: 8, name: "مصاريف التسويق", vendor: "شركة التسويق", type: "تسويق", dept: "التسويق", amount: 9750, due: "2025-09-28", freq: "شهري", status: "نشط" },
];
const dist: [string, number, string][] = [
  ["إيجار", 40, "var(--primary)"], ["خدمات ومرافق", 20, "var(--finance-purple)"], ["رواتب", 15, "var(--warning)"],
  ["اتصالات", 10, "var(--finance-orange)"], ["صيانة", 10, "var(--success)"], ["أخرى", 5, "var(--muted-foreground)"],
];
const stats = [
  { t: "المستحقة هذا الشهر", v: "5", d: 25, icon: AlarmClock, cls: "bg-destructive/10 text-destructive", up: "text-destructive" },
  { t: "المبالغ الشهرية", v: "23,896", u: "ر.س", d: 6, icon: CalendarDays, cls: "bg-primary-soft text-primary", up: "text-success" },
  { t: "عدد التكاليف المتكررة", v: "12", d: 10, icon: FileStack, cls: "bg-finance-violet text-finance-purple", up: "text-success" },
  { t: "إجمالي المبالغ السنوية", v: "286,750", u: "ر.س", d: 8, icon: Wallet, cls: "bg-success/15 text-success", up: "text-success" },
];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.split("-").reverse().join("/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const PER = 8;
const empty: Omit<Cost, "id"> = { name: "", vendor: "", type: "إيجار", dept: depts[0]!, amount: 0, due: "2025-09-30", freq: "شهري", status: "نشط" };

function Donut() {
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  return (
    <svg viewBox="0 0 140 140" className="size-36 -rotate-90">
      {dist.map(([n, p, c]) => { const d = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="20" strokeDasharray={`${d} ${C - d}`} strokeDashoffset={-acc} />; acc += d; return el; })}
    </svg>
  );
}

export function RecurringCosts() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState(""); const [type, setType] = useState("الكل"); const [dept, setDept] = useState("الكل");
  const [from, setFrom] = useState("2025-09-01"); const [to, setTo] = useState("2025-09-30"); const [status, setStatus] = useState("الكل");
  const [page, setPage] = useState(1); const [sel, setSel] = useState<number[]>([]);
  const [form, setForm] = useState<(Omit<Cost, "id"> & { id?: number }) | null>(null);
  const [view, setView] = useState<Cost | null>(null); const [del, setDel] = useState<Cost | null>(null);

  const filtered = useMemo(() => rows.filter((r) =>
    (!q || r.name.includes(q) || r.vendor.toLowerCase().includes(q.toLowerCase())) && (type === "الكل" || r.type === type) &&
    (dept === "الكل" || r.dept === dept) && (status === "الكل" || r.status === status) && (!from || r.due >= from) && (!to || r.due <= to)), [rows, q, type, dept, status, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const allSel = shown.length > 0 && shown.every((r) => sel.includes(r.id));

  const exportCsv = () => {
    const list = sel.length ? rows.filter((r) => sel.includes(r.id)) : filtered;
    const csv = [["الاسم", "الجهة", "النوع", "القسم", "المبلغ الشهري", "تاريخ الاستحقاق", "التكرار", "الحالة"], ...list.map((r) => [r.name, r.vendor, r.type, r.dept, r.amount, dmy(r.due), r.freq, r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = "التكاليف-المتكررة.csv"; a.click();
    toast.success(`تم تصدير ${list.length} سجل`);
  };
  const save = () => {
    if (!form) return;
    if (!form.name.trim() || !form.vendor.trim() || form.amount <= 0) { toast.error("أكمل الاسم والجهة والمبلغ"); return; }
    if (form.id) setRows((rs) => rs.map((r) => (r.id === form.id ? { ...(form as Cost) } : r)));
    else setRows((rs) => [{ ...form, id: Date.now() }, ...rs]);
    toast.success(form.id ? "تم تعديل التكلفة" : "تمت إضافة التكلفة المتكررة"); setForm(null);
  };
  const patch = (id: number, p: Partial<Cost>, msg: string) => { setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r))); toast.success(msg); };
  const Sel = ({ v, on, opts, all }: { v: string; on: (x: string) => void; opts: string[]; all: string }) => (
    <select value={v} onChange={(e) => { on(e.target.value); setPage(1); }} className={field}><option value="الكل">{all}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
  );

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><CalendarClock className="text-primary" size={26} />التكاليف المتكررة</h1>
            <p className="mt-1 text-sm text-muted-foreground">إدارة التكاليف المتكررة ومتابعة مواعيد استحقاقها</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1.5" onClick={exportCsv}><Download size={16} />تصدير التقرير</Button>
            <Button className="gap-1.5" onClick={() => setForm({ ...empty })}><Plus size={16} />إضافة تكلفة متكررة</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-3 text-3xl font-extrabold">{s.v} {s.u && <span className="text-lg">{s.u}</span>}</p></div>
                <span className={`grid size-11 place-items-center rounded-xl ${s.cls}`}><s.icon size={21} /></span></div>
              <div className="mt-3 flex items-center justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر الماضي</span><b className={s.up}>↑ {s.d}%</b></div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-1"><Search size={15} className="absolute right-3 top-3 text-muted-foreground" /><input className={`${field} pr-9`} placeholder="ابحث باسم التكلفة أو الجهة..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
          <Sel v={type} on={setType} opts={types} all="جميع أنواع التكاليف" />
          <Sel v={dept} on={setDept} opts={depts} all="جميع الأقسام" />
          <label className="text-xs text-muted-foreground">من تاريخ<input type="date" className={`${field} h-9`} value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} /></label>
          <label className="text-xs text-muted-foreground">إلى تاريخ<input type="date" className={`${field} h-9`} value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} /></label>
          <Sel v={status} on={setStatus} opts={statuses} all="الكل" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2.3fr_1fr]">
          <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold"><FileStack size={18} className="text-primary" />قائمة التكاليف المتكررة</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground"><tr>
                  <th className="p-3"><input type="checkbox" aria-label="تحديد الكل" checked={allSel} onChange={() => setSel(allSel ? sel.filter((i) => !shown.some((r) => r.id === i)) : [...new Set([...sel, ...shown.map((r) => r.id)])])} /></th>
                  {["الاسم", "الجهة / المورد", "نوع التكلفة", "المبلغ الشهري", "تاريخ الاستحقاق", "تكرار الصرف", "الحالة", "إجراءات"].map((h) => <th key={h} className="p-3 text-right font-bold">{h}</th>)}
                </tr></thead>
                <tbody>
                  {shown.map((r) => { const I = r.name === "المياه" ? Droplet : icons[r.type] ?? Wallet; return (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-3 text-center"><input type="checkbox" aria-label={`تحديد ${r.name}`} checked={sel.includes(r.id)} onChange={() => setSel((s) => s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id])} /></td>
                      <td className="p-3"><span className="flex items-center gap-2 font-bold"><I size={16} className="text-primary" />{r.name}</span></td>
                      <td className="p-3">{r.vendor}</td><td className="p-3">{r.type}</td>
                      <td className="p-3 font-bold">{fmt(r.amount)} <span className="text-xs font-normal">ر.س</span></td>
                      <td className="p-3">{dmy(r.due)}</td><td className="p-3">{r.freq}</td>
                      <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pill[r.status]}`}>{r.status}</span></td>
                      <td className="p-3"><div className="flex items-center gap-1">
                        <button aria-label="تعديل" onClick={() => setForm({ ...r })} className="grid size-8 place-items-center rounded-md text-primary hover:bg-muted"><Pencil size={15} /></button>
                        <button aria-label="عرض" onClick={() => setView(r)} className="grid size-8 place-items-center rounded-md text-primary hover:bg-muted"><Eye size={15} /></button>
                        <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="خيارات" className="grid size-8 place-items-center rounded-md border border-border"><MoreHorizontal size={15} /></button></DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => patch(r.id, { status: r.status === "موقوف" ? "نشط" : "موقوف" }, r.status === "موقوف" ? "تم تفعيل التكلفة" : "تم إيقاف التكلفة")}>{r.status === "موقوف" ? "تفعيل" : "إيقاف"}</DropdownMenuItem>
                            <DropdownMenuItem disabled={r.status === "مدفوعة"} onClick={() => patch(r.id, { status: "مدفوعة" }, "تم تسجيل التكلفة كمدفوعة")}>تسجيل كمدفوعة</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDel(r)}>حذف</DropdownMenuItem>
                          </DropdownMenuContent></DropdownMenu>
                      </div></td>
                    </tr>
                  ); })}
                  {!shown.length && <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">لا توجد نتائج مطابقة</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">إجمالي عدد السجلات: {filtered.length}</span>
              <div className="flex gap-1.5">
                <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                {Array.from({ length: pages }, (_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`size-8 rounded-md border ${cur === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{i + 1}</button>)}
                <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
              </div>
            </div>
          </section>

          <div className="min-w-0 space-y-4">
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />توزيع التكاليف المتكررة حسب النوع</h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="relative"><Donut /><div className="absolute inset-0 grid place-content-center text-center"><b className="text-lg">23,896</b><span className="text-xs text-muted-foreground">ر.س شهريًا</span></div></div>
                <ul className="min-w-36 flex-1 space-y-2 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
              </div>
            </section>
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 font-extrabold"><CalendarDays size={18} className="text-primary" />المبالغ المستحقة هذا الشهر</h2>
              <p className="mt-2 text-3xl font-extrabold">5 <span className="text-sm font-normal text-muted-foreground">تكاليف مستحقة</span></p>
              <ul className="mt-3 divide-y divide-border text-sm">
                {[["متأخرة", 2, "bg-destructive"], ["قريبة الاستحقاق", 2, "bg-warning"], ["مستحقة اليوم", 1, "bg-success"]].map(([n, v, c]) => <li key={n as string} className="flex justify-between py-2"><span className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${c}`} />{n}</span><b>{v}</b></li>)}
              </ul>
            </section>
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="flex items-center gap-2 font-extrabold"><TrendingUp size={18} className="text-primary" />ملخص سنوي</h2>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div><p className="text-2xl font-extrabold">286,750 <span className="text-sm">ر.س</span></p><p className="text-sm text-muted-foreground">إجمالي المبالغ السنوية</p><p className="mt-1 text-xs"><b className="text-success">↑ 8%</b> <span className="text-muted-foreground">مقارنة بالعام الماضي</span></p></div>
                <svg viewBox="0 0 90 40" className="h-12 w-24"><polyline points="2,34 25,24 45,28 70,14 88,4" fill="none" stroke="var(--primary)" strokeWidth="2.5" /></svg>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader><DialogTitle>{form?.id ? "تعديل تكلفة متكررة" : "إضافة تكلفة متكررة"}</DialogTitle></DialogHeader>
          {form && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">الاسم<input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label className="text-sm font-bold">الجهة / المورد<input className={field} value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} /></label>
              <label className="text-sm font-bold">النوع<select className={field} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{types.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="text-sm font-bold">القسم<select className={field} value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>{depts.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="text-sm font-bold">المبلغ الشهري (ر.س)<input type="number" min={0} className={field} value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value || 0 })} /></label>
              <label className="text-sm font-bold">تاريخ الاستحقاق<input type="date" className={field} value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></label>
              <label className="text-sm font-bold">التكرار<select className={field} value={form.freq} onChange={(e) => setForm({ ...form, freq: e.target.value })}>{freqs.map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="text-sm font-bold">الحالة<select className={field} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((t) => <option key={t}>{t}</option>)}</select></label>
              <div className="flex gap-2 sm:col-span-2"><Button className="flex-1" onClick={save}>حفظ</Button><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>إلغاء</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && <dl className="divide-y divide-border text-sm">{([["الجهة / المورد", view.vendor], ["نوع التكلفة", view.type], ["القسم", view.dept], ["المبلغ الشهري", `${fmt(view.amount)} ر.س`], ["المبلغ السنوي التقديري", `${fmt(view.amount * (view.freq === "شهري" ? 12 : view.freq === "ربع سنوي" ? 4 : 1))} ر.س`], ["تاريخ الاستحقاق", dmy(view.due)], ["تكرار الصرف", view.freq], ["الحالة", view.status]] as const).map(([k, v]) => <div key={k} className="flex justify-between py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader><DialogTitle>حذف «{del?.name}»؟</DialogTitle></DialogHeader>
          <div className="flex gap-2"><Button variant="destructive" className="flex-1" onClick={() => { setRows((rs) => rs.filter((r) => r.id !== del!.id)); setSel((s) => s.filter((x) => x !== del!.id)); setDel(null); toast.success("تم الحذف"); }}>حذف</Button><Button variant="outline" className="flex-1" onClick={() => setDel(null)}>إلغاء</Button></div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
