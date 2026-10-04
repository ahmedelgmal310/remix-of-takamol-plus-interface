import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Database, Eye, FileSpreadsheet, FileText,
  HandCoins, MoreHorizontal, Pencil, Plus, Trash2, WalletMinimal,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { budgetsSeed, budgetBars, budgetShares, type Budget, type BudgetStatus } from "@/data/mockData";

const fmt = (n: number) => n.toLocaleString("en-US");
const statusCls: Record<BudgetStatus, string> = {
  "سارية": "bg-success-soft text-success",
  "قيد المراجعة": "bg-primary-soft text-primary",
  "متوقفة": "bg-destructive/10 text-destructive",
};
const shareColors = ["var(--primary)", "var(--success)", "var(--buy-gold)", "var(--finance-purple)", "var(--destructive)", "var(--finance-purple)"];
const shareOpacity = [1, 1, 1, 1, 0.75, 0.45];

function Sel({ value, onChange, options, icon }: { value: string; onChange: (v: string) => void; options: string[]; icon?: React.ReactNode }) {
  return (
    <label className="relative flex h-11 min-w-40 items-center gap-2 rounded-lg border border-border bg-card ps-4">
      {icon}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-full w-full appearance-none bg-transparent pe-9 text-sm font-semibold outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute end-3" />
    </label>
  );
}

type Form = { name: string; dept: string; project: string; approved: string; spent: string; status: BudgetStatus };
const emptyForm: Form = { name: "", dept: "", project: "", approved: "", spent: "", status: "قيد المراجعة" };
const sum = (rs: Budget[], k: keyof Pick<Budget, "approved" | "spent" | "remaining" | "surplus">) => rs.reduce((s, r) => s + r[k], 0);

export function Budgets() {
  const [rows, setRows] = useState<Budget[]>(budgetsSeed);
  const [quarter, setQuarter] = useState("الربع الحالي");
  const [project, setProject] = useState("جميع المشاريع");
  const [dept, setDept] = useState("جميع الأقسام");
  const [year, setYear] = useState("2026");
  const [tab, setTab] = useState("list");
  const [selId, setSelId] = useState(1);
  const [dlg, setDlg] = useState<null | { mode: "add" } | { mode: "edit"; id: number }>(null);
  const [form, setForm] = useState<Form>(emptyForm);

  const filtered = useMemo(() => rows.filter((r) => (dept === "جميع الأقسام" || r.dept === dept) && (project === "جميع المشاريع" || r.project === project)), [rows, dept, project]);
  const isFiltered = dept !== "جميع الأقسام" || project !== "جميع المشاريع";
  // Unfiltered: reference totals adjusted by local edits. Filtered: totals of matching rows.
  const tot = (k: "approved" | "spent" | "remaining" | "surplus", base: number) => isFiltered ? sum(filtered, k) : base + sum(rows, k) - sum(budgetsSeed, k);
  const T = { approved: tot("approved", 5000000), spent: tot("spent", 1800000), remaining: tot("remaining", 3200000), surplus: tot("surplus", 1450000) };
  const pct = T.approved ? Math.round((T.spent / T.approved) * 100) : 0;
  const sel = rows.find((r) => r.id === selId) ?? rows[0];

  const cards = [
    { t: "إجمالي الميزانيات", v: T.approved, icon: FileText, wrap: "bg-finance-violet/50 border-finance-purple/15", ic: "bg-finance-violet text-finance-purple", tc: "text-buy-navy" },
    { t: "إجمالي المنصرف", v: T.spent, icon: HandCoins, wrap: "bg-warning-soft/50 border-warning/15", ic: "bg-warning-soft text-finance-orange", tc: "text-finance-orange" },
    { t: "إجمالي المتبقي", v: T.remaining, icon: Database, wrap: "bg-primary-soft/40 border-primary/15", ic: "bg-primary-soft text-primary", tc: "text-buy-navy" },
    { t: "إجمالي الفائض", v: T.surplus, icon: WalletMinimal, wrap: "bg-success-soft/40 border-success/15", ic: "bg-success-soft text-success", tc: "text-buy-navy" },
  ];

  const openAdd = () => { setForm(emptyForm); setDlg({ mode: "add" }); };
  const openEdit = (r: Budget) => { setForm({ name: r.name, dept: r.dept, project: r.project, approved: String(r.approved), spent: String(r.spent), status: r.status }); setDlg({ mode: "edit", id: r.id }); };
  const save = () => {
    const approved = Number(form.approved), spent = Number(form.spent || 0);
    if (!form.name || !approved) { toast.error("أدخل اسم الميزانية والمبلغ المعتمد"); return; }
    const remaining = Math.max(0, approved - spent);
    const data = { name: form.name, dept: form.dept || "أخرى", project: form.project || "—", approved, spent, remaining, surplus: Math.round(remaining * 0.2), status: form.status };
    if (dlg?.mode === "edit") setRows((p) => p.map((r) => (r.id === dlg.id ? { ...r, ...data } : r)));
    else setRows((p) => [...p, { ...data, id: Math.max(0, ...p.map((r) => r.id)) + 1 }]);
    toast.success("تم الحفظ (بيانات تجريبية)");
    setDlg(null);
  };
  const exportCsv = () => {
    const head = ["اسم الميزانية", "القسم", "المشروع", "المعتمدة", "المنصرف", "المتبقي", "الفائض", "الحالة"];
    const csv = "\uFEFF" + [head, ...filtered.map((r) => [r.name, r.dept, r.project, r.approved, r.spent, r.remaining, r.surplus, r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "budgets.csv"; a.click();
  };

  const card = "rounded-xl border border-border bg-card shadow-sm";
  const tabs: [string, string][] = [["list", "قائمة الميزانيات"], ["details", "تفاصيل الميزانية"], ["projects", "المشاريع المرتبطة"], ["contracts", "العقود المرتبطة"], ["log", "سجل الحركات"]];
  const depts = ["جميع الأقسام", ...new Set(rows.map((r) => r.dept))];
  const projects = ["جميع المشاريع", ...new Set(rows.map((r) => r.project))];

  return (
    <AppShell>
      <main dir="rtl" className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-buy-navy">الميزانيات</h1>
            <nav className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">الرئيسية</Link><span>/</span><span>الميزانيات</span>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Sel value={quarter} onChange={setQuarter} options={["الربع الحالي", "الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"]} />
            <Sel value={project} onChange={setProject} options={projects} />
            <Sel value={dept} onChange={setDept} options={depts} />
            <Sel value={year} onChange={setYear} options={["2026", "2025"]} icon={<CalendarDays size={16} />} />
            <Button onClick={openAdd} className="h-11 gap-2 rounded-lg bg-buy-navy px-10 text-base font-extrabold text-buy-gold hover:bg-buy-navy/90"><Plus size={20} />إضافة ميزانية</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <div key={c.t} className={`flex items-center justify-between rounded-xl border p-5 shadow-sm ${c.wrap}`}>
              <div>
                <p className="text-base font-bold">{c.t}</p>
                <p className={`mt-2 text-3xl font-extrabold leading-none ${c.tc}`}>{fmt(c.v)}</p>
                <p className={`mt-2 text-sm ${c.tc === "text-finance-orange" ? c.tc : ""}`}>ريال</p>
              </div>
              <span className={`grid size-[72px] shrink-0 place-items-center rounded-full ${c.ic}`}><c.icon size={32} /></span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.35fr_1.5fr]">
          <section className={`${card} p-4`}>
            <h2 className="text-lg font-extrabold text-buy-navy">نسبة الصرف العام</h2>
            <div className="relative mx-auto h-36 w-60" dir="ltr">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[{ v: pct }, { v: 100 - pct }]} dataKey="v" startAngle={180} endAngle={0} cy="90%" innerRadius={78} outerRadius={96} stroke="none" cornerRadius={4}>
                    <Cell fill="var(--success)" /><Cell fill="var(--border)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-x-0 bottom-3 text-center">
                <p className="text-3xl font-extrabold text-buy-navy">{pct}%</p>
                <p className="text-sm">من إجمالي الميزانية</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-x-reverse divide-border rounded-lg bg-muted/40 py-3 text-center">
              <div><p className="text-[15px] font-extrabold text-finance-orange">{fmt(T.spent)}</p><p className="text-sm text-finance-orange">منصرف</p></div>
              <div><p className="text-[15px] font-extrabold text-buy-navy">{fmt(T.remaining)}</p><p className="text-sm text-buy-navy">متبقي</p></div>
              <div><p className="text-[15px] font-extrabold text-success">{fmt(T.surplus)}</p><p className="text-sm text-success">فائض</p></div>
            </div>
          </section>

          <section className={`${card} min-w-0 p-4`}>
            <h2 className="text-lg font-extrabold text-buy-navy">المصروفات مقارنة بالميزانية</h2>
            <div className="mt-3 flex justify-center gap-8 text-sm">
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-primary/50" />المتبقي</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-success" />المنصرف</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-buy-navy" />المعتمد</span>
            </div>
            <div className="h-52" dir="ltr">
              <ResponsiveContainer>
                <BarChart data={budgetBars} barGap={3} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 1000000]} ticks={[0, 200000, 400000, 600000, 800000, 1000000]} tickFormatter={(v) => v >= 1e6 ? "1M" : v ? `${v / 1000}K` : "0"} width={40} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="approved" name="المعتمد" fill="var(--buy-navy)" barSize={16} />
                  <Bar dataKey="spent" name="المنصرف" fill="var(--success)" barSize={16} />
                  <Bar dataKey="remaining" name="المتبقي" fill="var(--primary)" fillOpacity={0.5} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className={`${card} min-w-0 p-4`}>
            <h2 className="text-lg font-extrabold text-buy-navy">توزيع الميزانيات حسب الأقسام</h2>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 2xl:flex-nowrap xl:flex-nowrap">
              <ul className="min-w-36 flex-1 space-y-2.5 text-sm">
                {budgetShares.map((s, i) => (
                  <li key={s.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><i className="size-3 rounded-full" style={{ background: shareColors[i], opacity: shareOpacity[i] }} />{s.name}</span>
                    <b className="font-semibold">{s.value}%</b>
                  </li>
                ))}
              </ul>
              <div className="relative size-44 shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={budgetShares} dataKey="value" innerRadius={52} outerRadius={84} startAngle={90} endAngle={-270} stroke="var(--card)" strokeWidth={2}>
                      {budgetShares.map((_, i) => <Cell key={i} fill={shareColors[i]} fillOpacity={shareOpacity[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                  <div><p className="text-xl font-extrabold text-buy-navy">{fmt(T.approved)}</p><p className="text-sm">ريال</p></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={`${card} min-w-0 p-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 overflow-x-auto rounded-lg bg-muted/50">
              {tabs.map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)} className={`flex-1 whitespace-nowrap px-5 py-2.5 text-sm ${tab === k ? "rounded-t-lg border-b-2 border-buy-gold bg-card font-extrabold text-buy-navy" : "text-foreground/80"}`}>{l}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCsv} className="h-10 gap-2 px-6 font-bold text-buy-navy"><FileSpreadsheet size={18} className="text-success" />تصدير</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" aria-label="المزيد" className="h-10 w-12"><MoreHorizontal size={18} /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => window.print()}>طباعة</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRows(budgetsSeed)}>استعادة البيانات الأصلية</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {tab === "list" && (
            <>
              <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[1000px] whitespace-nowrap text-[13px]">
                  <thead className="bg-primary-soft/40 font-bold text-buy-navy">
                    <tr>{["م", "اسم الميزانية", "القسم", "المشروع", "الميزانية المعتمدة", "المنصرف", "المتبقي", "الفائض", "نسبة الصرف", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-2 text-center">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => {
                      const p = Math.round((r.spent / r.approved) * 100);
                      return (
                        <tr key={r.id} className={`border-t border-border text-center ${r.id === sel?.id ? "bg-primary-soft/20" : ""}`}>
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">{r.name}</td>
                          <td className="p-2">{r.dept}</td>
                          <td className="p-2">{r.project}</td>
                          <td className="p-2 font-semibold">{fmt(r.approved)}</td>
                          <td className="p-2">{fmt(r.spent)}</td>
                          <td className="p-2">{fmt(r.remaining)}</td>
                          <td className={`p-2 font-semibold ${r.surplus < 0 ? "text-destructive" : "text-success"}`}>{r.surplus < 0 ? `(${fmt(-r.surplus)})` : fmt(r.surplus)}</td>
                          <td className="p-2"><span className="flex items-center justify-center gap-2">
                            <span className="h-2.5 w-16 overflow-hidden rounded-full bg-muted"><span className={`block h-full rounded-full ${p >= 40 ? "bg-finance-orange" : "bg-success"}`} style={{ width: `${Math.min(100, p * 1.4)}%` }} /></span>
                            <span className="w-9">{p}%</span></span></td>
                          <td className="p-2"><span className={`inline-block min-w-20 rounded-md px-2 py-1 text-xs font-bold ${statusCls[r.status]}`}>{r.status}</span></td>
                          <td className="p-2"><span className="flex items-center justify-center gap-3 text-buy-navy">
                            <button aria-label="عرض" onClick={() => { setSelId(r.id); setTab("details"); }}><Eye size={18} /></button>
                            <button aria-label="تعديل" onClick={() => openEdit(r)}><Pencil size={17} /></button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><button aria-label="المزيد" className="rounded-md border border-border px-2 py-0.5"><MoreHorizontal size={16} /></button></DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem className="text-destructive" onClick={() => { setRows((p2) => p2.filter((x) => x.id !== r.id)); toast("تم الحذف"); }}><Trash2 size={14} />حذف</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </span></td>
                        </tr>
                      );
                    })}
                    {!filtered.length && <tr><td colSpan={11} className="p-8 text-center text-muted-foreground">لا توجد ميزانيات مطابقة</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  {[ChevronsRight, ChevronRight].map((I, k) => <button key={k} disabled className="grid size-8 place-items-center rounded-md border border-border bg-card opacity-60"><I size={14} /></button>)}
                  <span className="grid size-8 place-items-center rounded-md bg-buy-navy font-bold text-primary-foreground">1</span>
                  {[ChevronLeft, ChevronsLeft].map((I, k) => <button key={k} disabled className="grid size-8 place-items-center rounded-md border border-border bg-card opacity-60"><I size={14} /></button>)}
                </div>
                <span className="flex items-center gap-2">إظهار <b className="rounded-md border border-border bg-primary-soft/40 px-2 py-1">10</b> {filtered.length} من {filtered.length} نتيجة</span>
              </div>
            </>
          )}

          {tab === "details" && sel && (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[["اسم الميزانية", sel.name], ["القسم", sel.dept], ["المشروع", sel.project], ["الحالة", sel.status], ["المعتمدة", `${fmt(sel.approved)} ريال`], ["المنصرف", `${fmt(sel.spent)} ريال`], ["المتبقي", `${fmt(sel.remaining)} ريال`], ["الفائض", `${fmt(sel.surplus)} ريال`]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 font-bold">{v}</p></div>
              ))}
            </div>
          )}
          {tab === "projects" && (
            <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">{rows.map((r) => <li key={r.id} className="flex justify-between rounded-lg border border-border p-3"><span>{r.project}</span><span className="text-muted-foreground">{r.dept}</span></li>)}</ul>
          )}
          {tab === "contracts" && (
            <ul className="mt-4 space-y-2 text-sm">{[["عقد توريد أجهزة طبية", "650,000"], ["عقد صيانة المباني", "220,000"], ["عقد خدمات تقنية", "180,000"]].map(([n, v]) => <li key={n} className="flex justify-between rounded-lg border border-border p-3"><span>{n}</span><b>{v} ريال</b></li>)}</ul>
          )}
          {tab === "log" && (
            <ul className="mt-4 space-y-2 text-sm">{[["2026/10/04", "صرف دفعة لمشروع المستشفى الرئيسي", "120,000"], ["2026/10/02", "اعتماد ميزانية تقنية المعلومات", "400,000"], ["2026/09/28", "تحويل بين بنود الميزانية", "50,000"]].map(([d, n, v]) => <li key={n} className="flex justify-between gap-3 rounded-lg border border-border p-3"><span className="text-muted-foreground">{d}</span><span className="flex-1">{n}</span><b>{v} ريال</b></li>)}</ul>
          )}
        </section>

        <Dialog open={!!dlg} onOpenChange={(o) => !o && setDlg(null)}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>{dlg?.mode === "edit" ? "تعديل الميزانية" : "إضافة ميزانية"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {([["name", "اسم الميزانية"], ["dept", "القسم"], ["project", "المشروع"], ["approved", "الميزانية المعتمدة"], ["spent", "المنصرف"]] as const).map(([k, l]) => (
                <label key={k} className="grid gap-1">{l}<input type={k === "approved" || k === "spent" ? "number" : "text"} className="h-10 rounded-md border border-border bg-card px-2" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>
              ))}
              <label className="grid gap-1">الحالة<select className="h-10 rounded-md border border-border bg-card px-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as BudgetStatus })}><option>سارية</option><option>قيد المراجعة</option><option>متوقفة</option></select></label>
            </div>
            <Button onClick={save} className="bg-buy-navy text-buy-gold hover:bg-buy-navy/90">حفظ</Button>
          </DialogContent>
        </Dialog>
      </main>
    </AppShell>
  );
}
