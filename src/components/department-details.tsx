import { useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Briefcase, ChevronDown, ChevronLeft, Clock, Eye, FileBarChart, FileText, Home, Network, PieChart, PlusCircle, Settings, SquarePen, Trash2, User, UserPlus, Users, Wallet, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import manager from "@/assets/dept-manager.jpg";

type Pos = { name: string; count: number; salary: number };
type Upd = { t: string; by: string; at: string; icon: "edit" | "user" | "tree" };
type Dept = { name: string; code: string; manager: string; companyTotal: number; positions: Pos[]; employees: [string, string][]; subs: string[]; budget: number; updates: Upd[] };

const DEPTS: Dept[] = [
  { name: "الإدارة المالية", code: "FIN-01", manager: "أ. علي الشهري", companyTotal: 800000,
    positions: [{ name: "مدير الإدارة", count: 1, salary: 30000 }, { name: "محاسب", count: 2, salary: 12000 }, { name: "أخصائي ميزانية", count: 1, salary: 15000 }, { name: "أخصائي مشتريات", count: 2, salary: 10000 }, { name: "أمين خزينة", count: 2, salary: 15500 }],
    employees: [["علي الشهري", "مدير الإدارة"], ["أحمد السبيعي", "محاسب"], ["سارة أحمد", "محاسب"], ["نورة القحطاني", "أخصائي ميزانية"], ["فهد العتيبي", "أخصائي مشتريات"], ["ريم الغامدي", "أخصائي مشتريات"], ["خالد الحربي", "أمين خزينة"], ["منى الدوسري", "أمين خزينة"]],
    subs: ["قسم المحاسبة", "قسم الميزانية", "قسم المشتريات", "قسم الخزينة"], budget: 1600000,
    updates: [{ t: "تم تعديل راتب منصب محاسب", by: "مدير النظام", at: "2025/09/20 10:30", icon: "edit" }, { t: "تم إضافة موظف جديد (سارة أحمد)", by: "أ. علي الشهري", at: "2025/09/18 14:22", icon: "user" }, { t: "تم تحديث هيكل الإدارة المالية", by: "مدير النظام", at: "2025/09/10 09:15", icon: "tree" }] },
  { name: "إدارة الموارد البشرية", code: "HR-01", manager: "أ. سعد العنزي", companyTotal: 800000,
    positions: [{ name: "مدير الإدارة", count: 1, salary: 28000 }, { name: "أخصائي موارد بشرية", count: 3, salary: 11000 }, { name: "أخصائي رواتب", count: 1, salary: 12000 }],
    employees: [["سعد العنزي", "مدير الإدارة"], ["سارة العتيبي", "أخصائي موارد بشرية"], ["هند القرني", "أخصائي موارد بشرية"], ["ماجد المالكي", "أخصائي موارد بشرية"], ["لمى الشمري", "أخصائي رواتب"]],
    subs: ["قسم التوظيف", "قسم شؤون الموظفين", "قسم الرواتب"], budget: 1100000,
    updates: [{ t: "تم إضافة منصب أخصائي رواتب", by: "مدير النظام", at: "2025/09/15 11:00", icon: "edit" }] },
  { name: "إدارة تقنية المعلومات", code: "IT-01", manager: "م. فيصل الدوسري", companyTotal: 800000,
    positions: [{ name: "مدير الإدارة", count: 1, salary: 32000 }, { name: "مطور برمجيات", count: 3, salary: 16000 }, { name: "أخصائي نظم", count: 2, salary: 13000 }],
    employees: [["فيصل الدوسري", "مدير الإدارة"], ["بدر المالكي", "مطور برمجيات"], ["جود القرني", "مطور برمجيات"], ["تركي السالم", "مطور برمجيات"], ["أحمد محمد السبيعي", "أخصائي نظم"], ["مها العمري", "أخصائي نظم"]],
    subs: ["قسم التطوير", "قسم البنية التحتية", "قسم الدعم الفني"], budget: 1700000,
    updates: [{ t: "تم تحديث هيكل إدارة تقنية المعلومات", by: "مدير النظام", at: "2025/09/12 13:40", icon: "tree" }] },
];
const COLORS = ["--primary", "--success", "--warning", "--violet-strong", "--destructive", "--mc-wait", "--mc-review"];
const card = "rounded-xl border border-border bg-card shadow-sm";
const input = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const fmt = (n: number) => n.toLocaleString("en-US");
const now = () => { const d = new Date(); const p = (n: number) => String(n).padStart(2, "0"); return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const TABS: [string, ReactNode][] = [["المناصب والرواتب", <Briefcase key="a" size={18} />], ["الموظفون", <User key="b" size={18} />], ["الهيكل الفرعي", <Network key="c" size={18} />], ["الميزانية", <BarChart3 key="d" size={18} />], ["التقارير", <FileText key="e" size={18} />]];

export function DepartmentDetails() {
  const router = useRouter();
  const [depts, setDepts] = useState(DEPTS);
  const [di, setDi] = useState(0);
  const [tab, setTab] = useState(0);
  const [pos, setPos] = useState<{ i: number; p: Pos; view?: boolean } | null>(null);
  const [addEmp, setAddEmp] = useState(false), [editDept, setEditDept] = useState(false);
  const [notes, setNotes] = useState(""), [msg, setMsg] = useState("");
  const d = depts[di]!;
  const total = d.positions.reduce((s, p) => s + p.count * p.salary, 0);
  const count = d.positions.reduce((s, p) => s + p.count, 0);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const update = (fn: (x: Dept) => Dept, log: string, icon: Upd["icon"] = "edit") => { setDepts(p => p.map((x, i) => i === di ? { ...fn(x), updates: [{ t: log, by: "مدير النظام", at: now(), icon }, ...x.updates] } : x)); flash(log); };

  let acc = 0;
  const donut = d.positions.map((p, i) => { const a = acc; acc += total ? p.count * p.salary / total * 100 : 0; return `var(${COLORS[i % COLORS.length]}) ${a}% ${acc}%`; }).join(",");
  const stats: [string, string, string, ReactNode, string][] = [
    ["إجمالي الرواتب الشهرية", fmt(total), "ريال", <Wallet key="1" size={34} />, "--success"],
    ["عدد الموظفين", String(count), "موظف", <Users key="2" size={34} />, "--primary"],
    ["عدد المناصب", String(d.positions.length), "منصب", <Network key="3" size={34} />, "--warning"],
    ["نسبة الرواتب من إجمالي الشركة", `${Math.round(total / d.companyTotal * 100)}%`, "", <PieChart key="4" size={34} />, "--violet-strong"],
  ];

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1400px] space-y-4">
    <nav className="flex flex-wrap items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />الهيكل التنظيمي<ChevronLeft size={12} />{d.name}<ChevronLeft size={12} /><span>التفاصيل</span></nav>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><Settings className="text-primary" />تفاصيل {d.name}</h1><p className="mt-1 text-sm">عرض المناصب والموظفين والرواتب الخاصة بالإدارة</p></div>
      <div className="flex flex-wrap gap-2">
        <div className="relative"><select value={di} onChange={e => { setDi(+e.target.value); setTab(0); }} className="h-11 appearance-none rounded-md border border-border bg-card pl-8 pr-3 text-sm font-bold">{depts.map((x, i) => <option key={x.code} value={i}>{x.name}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-2.5 top-3.5" /></div>
        <button onClick={() => setAddEmp(true)} className="flex h-11 items-center gap-2 rounded-md bg-primary px-5 font-bold text-primary-foreground"><UserPlus size={18} />إضافة موظف</button>
        <button onClick={() => setPos({ i: -1, p: { name: "", count: 1, salary: 10000 } })} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-4 font-bold"><PlusCircle size={18} className="text-primary" />إضافة منصب</button>
        <button onClick={() => setEditDept(true)} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-4 font-bold"><SquarePen size={18} />تعديل البيانات</button>
        <button onClick={() => router.history.back()} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-4 font-bold"><ArrowRight size={18} />رجوع</button>
      </div>
    </div>
    {msg && <p className="rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <section className={`${card} grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))]`}>
      {stats.map(([t, v, u, icon, c]) => <div key={t} className="flex items-center justify-between gap-2 rounded-lg p-4" style={{ background: `color-mix(in oklch, var(${c}) 9%, transparent)` }}><div className="min-w-0"><b className="block text-sm">{t}</b><b className="mt-1 block text-2xl" style={{ color: c === "--violet-strong" ? `var(${c})` : undefined }}>{v}</b>{u && <span className="text-xs">{u}</span>}</div><span className="shrink-0" style={{ color: `var(${c})` }}>{icon}</span></div>)}
      <div className="flex items-center justify-between gap-3 rounded-lg bg-primary-soft/60 p-4 sm:col-span-2 xl:order-first xl:col-span-1"><div><b className="flex items-center gap-2 text-lg text-brand-deep"><Settings size={22} className="text-primary" />{d.name}</b><span className="text-xs">كود الإدارة: {d.code}</span><span className="mt-3 block text-sm">مدير الإدارة</span><b className="text-lg">{d.manager}</b></div><img src={manager} alt={d.manager} width={816} height={816} loading="lazy" className="size-16 shrink-0 rounded-full object-cover" /></div>
    </section>

    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{TABS.map(([t, i], k) => <button key={t} onClick={() => setTab(k)} className={`flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-bold ${tab === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>{i}{t}</button>)}</div>

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-4">
        <section className={`${card} p-4`}>
          {tab === 0 && <><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Briefcase className="text-primary" size={20} />المناصب والرواتب</h2>
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-center text-sm [&_td]:p-2.5 [&_th]:p-2.5">
              <thead><tr className="bg-primary-soft/60"><th>#</th><th className="text-right">اسم المنصب</th><th>العدد</th><th>الراتب الأساسي (ريال)</th><th>إجمالي الرواتب (ريال)</th><th>الإجراءات</th></tr></thead>
              <tbody>{d.positions.map((p, i) => <tr key={p.name + i} className="border-b border-border"><td>{i + 1}</td><td className="text-right font-semibold">{p.name}</td><td>{p.count}</td><td>{fmt(p.salary)}</td><td>{fmt(p.count * p.salary)}</td>
                <td><div className="flex justify-center gap-2"><button onClick={() => setPos({ i, p, view: true })} className="rounded border border-border p-1 text-primary" aria-label="عرض"><Eye size={16} /></button><button onClick={() => setPos({ i, p: { ...p } })} className="rounded border border-border p-1 text-primary" aria-label="تعديل"><SquarePen size={16} /></button><button onClick={() => { if (window.confirm(`حذف منصب «${p.name}»؟`)) update(x => ({ ...x, positions: x.positions.filter((_, j) => j !== i) }), `تم حذف منصب ${p.name}`); }} className="rounded border border-border p-1 text-destructive" aria-label="حذف"><Trash2 size={16} /></button></div></td></tr>)}
                <tr className="bg-success-soft font-extrabold text-success"><td colSpan={2} className="text-right text-base">الإجمالي</td><td>{count}</td><td>{fmt(d.positions.reduce((s, p) => s + p.salary, 0))}</td><td>{fmt(total)}</td><td /></tr></tbody></table></div></>}
          {tab === 1 && <><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><User className="text-primary" size={20} />الموظفون ({d.employees.length})</h2>
            <div className="grid gap-2 sm:grid-cols-2">{d.employees.map(([n, j]) => <div key={n} className="flex items-center gap-3 rounded-lg border border-border p-3"><span className="grid size-10 place-items-center rounded-full bg-primary-soft font-bold text-primary">{n[0]}</span><div><b className="block text-sm">{n}</b><span className="text-xs text-muted-foreground">{j}</span></div></div>)}</div></>}
          {tab === 2 && <><h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><Network className="text-primary" size={20} />الهيكل الفرعي</h2>
            <div className="text-center"><span className="inline-block rounded-lg bg-primary px-5 py-2 font-bold text-primary-foreground">{d.name}<small className="block font-normal">{d.manager}</small></span><div className="mx-auto h-6 w-0.5 bg-border" />
              <div className="grid grid-cols-2 gap-3 border-t-2 border-border pt-4 sm:grid-cols-4">{d.subs.map(s => <span key={s} className="rounded-lg border border-border bg-primary-soft/40 p-3 text-sm font-bold">{s}</span>)}</div></div></>}
          {tab === 3 && <><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><BarChart3 className="text-primary" size={20} />الميزانية السنوية</h2>
            <div className="grid gap-3 sm:grid-cols-3">{[["المخصص", d.budget, "--primary"], ["المصروف (رواتب)", total * 12, "--warning"], ["المتبقي", d.budget - total * 12, d.budget - total * 12 < 0 ? "--destructive" : "--success"]].map(([t, v, c]) => <div key={t as string} className="rounded-lg p-4" style={{ background: `color-mix(in oklch, var(${c}) 10%, transparent)` }}><span className="text-sm">{t}</span><b className="block text-xl" style={{ color: `var(${c})` }}>{fmt(v as number)} ريال</b></div>)}</div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-warning" style={{ width: `${Math.min(100, total * 12 / d.budget * 100)}%` }} /></div><p className="mt-1 text-xs text-muted-foreground">نسبة الصرف {Math.round(total * 12 / d.budget * 100)}%</p></>}
          {tab === 4 && <><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><FileText className="text-primary" size={20} />التقارير</h2>
            <div className="space-y-2">{["تقرير الرواتب الشهري", "تقرير المناصب الشاغرة", "تقرير توزيع الموظفين", "تقرير الميزانية السنوي"].map(r => <button key={r} onClick={() => flash(`جاري تجهيز «${r}» لـ${d.name}...`)} className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-sm font-bold hover:bg-muted"><span className="flex items-center gap-2"><FileBarChart size={18} className="text-primary" />{r}</span><ChevronLeft size={16} /></button>)}</div></>}
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section className={`${card} p-4`}><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Clock className="text-primary" size={20} />أحدث التحديثات</h2>
            <ul className="divide-y divide-border">{d.updates.slice(0, 4).map((u, i) => <li key={i} className="flex items-start gap-3 py-2.5"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">{u.icon === "edit" ? <SquarePen size={17} /> : u.icon === "user" ? <UserPlus size={17} /> : <Network size={17} />}</span><b className="flex-1 text-sm">{u.t}</b><span className="text-left text-xs text-muted-foreground">{u.at}<br />بواسطة: {u.by}</span></li>)}</ul></section>
          <section className={`${card} p-4`}><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><FileText className="text-primary" size={20} />ملاحظات</h2>
            <textarea value={notes} maxLength={500} onChange={e => setNotes(e.target.value)} placeholder="لا توجد ملاحظات حالياً." className="min-h-24 w-full rounded-md border border-border p-3 text-sm outline-none focus:border-primary" /><span className="text-xs text-muted-foreground">{notes.length}/500</span>
            <button onClick={() => flash(notes.trim() ? "تم حفظ الملاحظات." : "لا توجد ملاحظات للحفظ.")} className="mt-2 block h-10 w-24 rounded-md bg-primary font-bold text-primary-foreground">حفظ</button></section>
        </div>
      </div>

      <section className={`${card} p-4`}><h2 className="mb-4 flex items-center gap-2 border-b border-border pb-3 text-lg font-extrabold"><BarChart3 className="text-primary" size={20} />توزيع الرواتب في الإدارة</h2>
        <div className="mx-auto grid size-44 place-items-center rounded-full" style={{ background: total ? `conic-gradient(${donut})` : "var(--muted)" }}><div className="grid size-28 place-items-center rounded-full bg-card text-center"><div><b className="block text-xl">{fmt(total)}</b><span className="text-sm">ريال</span></div></div></div>
        <ul className="mt-5 space-y-2.5 text-sm">{d.positions.map((p, i) => <li key={p.name + i} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ background: `var(${COLORS[i % COLORS.length]})` }} />{p.name}</span><b>{total ? Math.round(p.count * p.salary / total * 100) : 0}%</b></li>)}</ul></section>
    </div>

    {pos && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setPos(null)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); if (pos.view) return setPos(null); const { i, p } = pos; update(x => ({ ...x, positions: i < 0 ? [...x.positions, p] : x.positions.map((q, j) => j === i ? p : q) }), i < 0 ? `تم إضافة منصب ${p.name}` : `تم تعديل منصب ${p.name}`); setPos(null); }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">{pos.view ? `تفاصيل منصب ${pos.p.name}` : pos.i < 0 ? "إضافة منصب" : "تعديل المنصب"}</h3><button type="button" onClick={() => setPos(null)}><X /></button></div>
      {pos.view ? <dl className="space-y-2">{[["الإدارة", d.name], ["العدد", pos.p.count], ["الراتب الأساسي", `${fmt(pos.p.salary)} ريال`], ["إجمالي الرواتب", `${fmt(pos.p.count * pos.p.salary)} ريال`], ["الموظفون", d.employees.filter(e => e[1] === pos.p.name).map(e => e[0]).join("، ") || "—"]].map(([k, v]) => <div key={k as string} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-left font-bold">{v}</dd></div>)}</dl> : <>
        <label className="block font-bold">اسم المنصب<input required value={pos.p.name} onChange={e => setPos({ ...pos, p: { ...pos.p, name: e.target.value } })} className={`${input} mt-1 font-normal`} /></label>
        <label className="block font-bold">العدد<input required type="number" min={1} value={pos.p.count} onChange={e => setPos({ ...pos, p: { ...pos.p, count: +e.target.value } })} className={`${input} mt-1 font-normal`} /></label>
        <label className="block font-bold">الراتب الأساسي (ريال)<input required type="number" min={1} value={pos.p.salary} onChange={e => setPos({ ...pos, p: { ...pos.p, salary: +e.target.value } })} className={`${input} mt-1 font-normal`} /></label></>}
      <button className="h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">{pos.view ? "إغلاق" : "حفظ"}</button>
    </form></div>}

    {addEmp && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setAddEmp(false)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const n = String(f.get("name")).trim(), j = String(f.get("pos")); update(x => ({ ...x, employees: [...x.employees, [n, j]], positions: x.positions.map(p => p.name === j ? { ...p, count: p.count + 1 } : p) }), `تم إضافة موظف جديد (${n})`, "user"); setAddEmp(false); }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">إضافة موظف</h3><button type="button" onClick={() => setAddEmp(false)}><X /></button></div>
      <input required name="name" maxLength={80} placeholder="اسم الموظف" className={input} />
      <select name="pos" className={input}>{d.positions.map(p => <option key={p.name}>{p.name}</option>)}</select>
      <button className="h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">إضافة</button>
    </form></div>}

    {editDept && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setEditDept(false)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); update(x => ({ ...x, name: String(f.get("name")), code: String(f.get("code")), manager: String(f.get("manager")) }), "تم تحديث بيانات الإدارة", "tree"); setEditDept(false); }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">تعديل بيانات الإدارة</h3><button type="button" onClick={() => setEditDept(false)}><X /></button></div>
      {([["name", "اسم الإدارة", d.name], ["code", "كود الإدارة", d.code], ["manager", "مدير الإدارة", d.manager]] as const).map(([k, l, v]) => <label key={k} className="block font-bold">{l}<input required name={k} defaultValue={v} className={`${input} mt-1 font-normal`} /></label>)}
      <button className="h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">حفظ</button>
    </form></div>}
  </div></main></AppShell>;
}
