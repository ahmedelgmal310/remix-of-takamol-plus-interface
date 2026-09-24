import { useState, type ReactNode } from "react";
import { BarChart3, Calculator, ChevronDown, Clock, Coins, Download, Eye, FileText, Info, PieChart, Plus, Printer, Save, Settings, SquarePlus, UserRound, Users, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Row = { no: string; date: string; amount: number; months: number; paid: number; status: "done" | "paying" | "late" };
const initialRows: Row[] = [
  { no: "SAL-2023-001", date: "2023/03/15", amount: 10000, months: 12, paid: 10000, status: "done" },
  { no: "SAL-2024-007", date: "2024/09/10", amount: 15000, months: 12, paid: 8000, status: "paying" },
  { no: "SAL-2025-012", date: "2025/02/05", amount: 20000, months: 24, paid: 4000, status: "late" },
];
const st = { done: ["مكتملة", "bg-success-soft text-success"], paying: ["قيد السداد", "bg-primary-soft text-primary"], late: ["متأخرة", "bg-destructive/10 text-destructive"] } as const;
const f = (n: number) => n.toLocaleString("en-US");

function Panel({ icon, title, children, className = "" }: { icon: ReactNode; title: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`panel min-w-0 p-4 ${className}`}><h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-brand-deep"><span className="text-primary [&_svg]:size-5">{icon}</span>{title}</h2>{children}</section>;
}
function Ring({ pct, color }: { pct: number; color: string }) {
  return <div className="grid size-16 shrink-0 place-items-center rounded-full" style={{ background: `radial-gradient(circle, var(--card) 60%, transparent 62%), conic-gradient(${color} 0 ${pct}%, var(--muted) ${pct}% 100%)` }}><b className="text-sm">{pct}%</b></div>;
}

function Stats() {
  const cards = [
    { t: "عدد السلف النشطة", v: "42", u: "سلفة حالية", icon: <FileText />, bg: "bg-finance-violet", ic: "bg-finance-violet-border text-brand-deep" },
    { t: "إجمالي المتبقي", v: "230,000", u: "ريال", icon: <Clock />, bg: "bg-destructive/5", ic: "bg-destructive/15 text-destructive", ring: <Ring pct={31} color="var(--destructive)" /> },
    { t: "إجمالي المسدد", v: "520,000", u: "ريال", icon: <Coins />, bg: "bg-card", ic: "bg-primary-soft text-primary", ring: <Ring pct={69} color="var(--primary)" /> },
    { t: "إجمالي السلف المصروفة", v: "750,000", u: "ريال", icon: <WalletCards />, bg: "bg-card", ic: "bg-success-soft text-success" },
    { t: "عدد الموظفين", v: "86", u: "موظف", icon: <Users />, bg: "bg-card", ic: "bg-primary-soft text-primary" },
  ];
  return <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{cards.map(c => <div key={c.t} className={`panel flex items-center gap-3 p-4 ${c.bg}`}><div className="flex-1"><p className="text-xs font-bold">{c.t}</p><b className="mt-1 block text-2xl text-brand-deep">{c.v}</b><span className="text-xs">{c.u}</span></div>{c.ring}<span className={`grid size-12 place-items-center rounded-lg [&_svg]:size-6 ${c.ic}`}>{c.icon}</span></div>)}</div>;
}

function Summary() {
  const rows: [string, string, string][] = [["الراتب الأساسي", "8,000", ""], ["البدلات", "1,500", ""], ["إجمالي الراتب", "9,500", "font-extrabold"], ["الحد المسموح للسلفة (50%)", "4,750", "bg-success-soft text-success"], ["إجمالي السلف الحالية", "15,000", "bg-destructive/10 text-destructive"], ["المتبقي من الحد المسموح", "", "bg-warning-soft text-warning"]];
  return <Panel icon={<BarChart3 />} title="ملخص استحقاق الموظف"><div className="grid gap-1 text-xs">{rows.map(([k, v, c]) => <div key={k} className={`flex justify-between rounded-md px-3 py-2.5 ${c || "border-b border-border"}`}><span>{k}</span><b>{v} ريال</b></div>)}</div></Panel>;
}
function Distribution() {
  return <Panel icon={<PieChart />} title="توزيع السلف حسب الحالة"><div className="flex items-center justify-between gap-3"><div className="grid gap-4 text-xs">{[["مكتملة", "18", "bg-success"], ["قيد السداد", "20", "bg-primary"], ["متأخرة", "4", "bg-destructive"]].map(([l, n, c]) => <p key={l} className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${c}`} />{l}<b className="text-muted-foreground">{n}</b></p>)}</div><div className="grid size-32 place-items-center rounded-full" style={{ background: "radial-gradient(circle, var(--card) 55%, transparent 57%), conic-gradient(var(--success) 0 43%, var(--primary) 43% 90%, var(--destructive) 90% 100%)" }}><div className="text-center"><b className="block text-2xl text-brand-deep">42</b><span className="text-xs font-bold">سلفة</span></div></div></div></Panel>;
}
function Extra() {
  const r = [["متوسط مبلغ السلفة", "17,857 ريال", ""], ["متوسط مدة السداد", "14 شهر", ""], ["أعلى سلفة مصروفة", "50,000 ريال", ""], ["إجمالي مبالغ متأخرة", "85,000 ريال", "text-destructive"]];
  return <Panel icon={<BarChart3 />} title="إحصائيات إضافية"><div className="grid gap-3 text-xs">{r.map(([k, v, c]) => <p key={k} className="flex justify-between"><span>{k}</span><b className={c}>{v}</b></p>)}</div></Panel>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-1.5 text-xs font-bold"><span>{label}</span>{children}</label>; }
const box = "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 text-xs";

function NewAdvance({ onSave }: { onSave: (r: Row) => void }) {
  const salary = 9500; const [method, setMethod] = useState("50");
  const [amount, setAmount] = useState(""); const [months, setMonths] = useState("02"); const [reason, setReason] = useState("");
  const max = salary * Number(method) / 100;
  const info = [["الرقم الوظيفي", "EMP-00125"], ["القسم", "تقنية المعلومات"], ["الوظيفة", "أخصائي نظم"], ["تاريخ التعيين", "2020/01/15"], ["سنوات الخبرة", "5 سنة"], ["الراتب الأساسي", "8,000 ريال"], ["بدلات", "1,500 ريال"], ["إجمالي الراتب", "9,500 ريال"]];
  const save = () => { const a = Number(amount); if (!a) return; onSave({ no: `SAL-2025-${String(Math.floor(Math.random() * 900) + 100)}`, date: new Date().toISOString().slice(0, 10).replaceAll("-", "/"), amount: a, months: Number(months) || 1, paid: 0, status: "paying" }); setAmount(""); setReason(""); };
  return <Panel icon={<SquarePlus />} title="إضافة سلفة جديدة"><div className="grid gap-4 lg:grid-cols-2">
    <div className="grid content-start gap-3">
      <Field label="نوع السلفة"><div className={box}><span>سلفة شخصية</span><ChevronDown size={14} /></div></Field>
      <Field label="مبلغ السلفة المطلوب *"><div className={box}><input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))} className="w-full bg-transparent outline-none" /><span className="text-muted-foreground">ريال</span></div></Field>
      <Field label="طريقة الاحتساب"><select value={method} onChange={e => setMethod(e.target.value)} className={box}><option value="50">نسبة من الراتب الأساسي</option><option value="75">بناءً على سنوات الخبرة</option><option value="100">بناءً على مكافأة نهاية الخدمة</option></select></Field>
      <div className="grid grid-cols-2 gap-3"><Field label="مدة السداد (بالشهور) *"><div className={box}><input value={months} onChange={e => setMonths(e.target.value)} className="w-full bg-transparent outline-none" /><span className="text-muted-foreground">ريال</span></div></Field><div className="rounded-md border border-border bg-search p-2 text-center"><p className="text-[10px]">الحد الأقصى المسموح</p><b className="block text-lg text-brand-deep">{f(max)} ريال</b><p className="text-[9px] text-muted-foreground">({method}% من إجمالي الراتب)</p></div></div>
      <Field label="سبب السلفة *"><textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="أدخل سبب السلفة ..." className="h-20 resize-none rounded-md border border-input bg-background p-2 text-xs" /></Field>
      <div className="grid grid-cols-2 gap-3"><button onClick={save} className="flex h-10 items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-primary-foreground"><Save size={16} />حفظ السلفة</button><button onClick={() => { setAmount(""); setReason(""); }} className="h-10 rounded-md border border-border text-sm font-bold">إلغاء</button></div>
    </div>
    <div className="rounded-md border border-border p-3"><h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-brand-deep"><UserRound size={18} />بيانات الموظف</h3><div className={box}><span className="text-muted-foreground">اختر الموظف</span><ChevronDown size={14} /></div><div className="mt-3 grid gap-3 rounded-md bg-search p-3 text-xs">{info.map(([k, v]) => <p key={k} className="grid grid-cols-[1fr_auto_1fr] gap-2"><span>{k}</span><span>:</span><b className="text-left">{v}</b></p>)}</div></div>
  </div></Panel>;
}

function History({ rows }: { rows: Row[] }) {
  return <Panel icon={<FileText />} title="سجل سلف الموظف"><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-[11px]"><thead className="bg-search"><tr>{["#", "رقم السلفة", "تاريخ الصرف", "المبلغ", "عدد الأقساط", "المسدد", "المتبقي", "الحالة", "إجراءات"].map(h => <th key={h} className="p-1.5 text-center">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => { const rem = r.amount - r.paid; return <tr key={r.no} className="border-b border-border text-center"><td className="p-2">{i + 1}</td><td className="p-2">{r.no}</td><td className="p-2">{r.date}</td><td className="p-2">{f(r.amount)}</td><td className="p-2">{r.months}</td><td className="p-2">{f(r.paid)}</td><td className={`p-2 ${rem && r.status !== "done" ? "text-destructive" : ""}`}>{f(rem)}</td><td className="p-2"><span className={`rounded px-3 py-1 ${st[r.status][1]}`}>{st[r.status][0]}</span></td><td className="p-2"><Eye size={16} className="mx-auto text-primary" /></td></tr>; })}</tbody></table></div></Panel>;
}

function Rules() {
  const methods = ["نسبة من الراتب الأساسي", "بناءً على سنوات الخبرة", "بناءً على مكافأة نهاية الخدمة", "مبلغ ثابت حسب الفئة الوظيفية"]; const [m, setM] = useState(0);
  return <Panel icon={<Settings />} title="قواعد احتساب السلفة"><div className="rounded-md border border-border p-3"><h3 className="mb-3 text-sm font-extrabold">طريقة الاحتساب</h3><div className="grid gap-2.5">{methods.map((x, i) => <button key={x} onClick={() => setM(i)} className="flex items-center gap-2 text-xs"><span className={`grid size-4 place-items-center rounded-full border-2 ${m === i ? "border-primary" : "border-muted-foreground/40"}`}>{m === i && <span className="size-2 rounded-full bg-primary" />}</span>{x}</button>)}</div><p className="mt-3 flex items-center gap-2 rounded-md border border-primary/30 bg-primary-soft p-2 text-[11px]"><Info size={15} className="text-primary" />يمكن دمج أكثر من معيار حسب سياسة الشركة</p></div>
    <h3 className="mt-4 mb-2 text-sm font-extrabold">نسب السلفة من الراتب الأساسي</h3><table className="w-full text-xs"><thead className="bg-search"><tr><th className="p-2 text-right">الفئة الوظيفية</th><th className="p-2">النسبة المسموح بها</th></tr></thead><tbody>{[["الإدارة العليا", "100%"], ["المدراء", "75%"], ["الموظفون", "50%"], ["الموظفون الجدد (أقل من سنة)", "25%"]].map(([a, b]) => <tr key={a} className="border-b border-border"><td className="p-2">{a}</td><td className="p-2 text-center">{b}</td></tr>)}</tbody></table></Panel>;
}
function EndOfService() {
  const [years, setYears] = useState(5); const basic = 8000; const reward = basic * years * 1.5;
  return <Panel icon={<Calculator />} title={<>احتساب مكافأة نهاية الخدمة <span className="text-[10px] font-normal">(للاطلاع فقط)</span></>}><div className="grid gap-2 text-xs"><div className="grid grid-cols-[1fr_130px] items-center gap-2"><span>الراتب الأساسي</span><div className={box}><b>8,000</b><span>ريال</span></div></div><div className="grid grid-cols-[1fr_130px] items-center gap-2"><span>عدد سنوات الخدمة</span><div className={box}><input type="number" min={1} value={years} onChange={e => setYears(Number(e.target.value) || 0)} className="w-12 bg-transparent font-bold outline-none" /><span>سنة</span></div></div><div className="flex items-center justify-between rounded-md bg-success-soft p-4 text-success"><span className="font-bold">مكافأة نهاية الخدمة التقديرية</span><b className="shrink-0 text-xl">{f(reward)} ريال</b></div><p className="text-[10px] text-muted-foreground">يتم الاحتساب حسب نظام العمل السعودي</p></div></Panel>;
}

export function EmployeeAdvancesPage() {
  const [rows, setRows] = useState(initialRows);
  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div><h1 className="flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><span className="grid size-9 place-items-center rounded-lg bg-brand-deep text-primary-foreground"><WalletCards size={20} /></span>السلف للموظفين</h1><p className="mt-1 text-xs">إدارة طلبات السلف وحساب الاستحقاق بناءً على الراتب والخبرة ومكافأة نهاية الخدمة</p></div>
      <div className="grid grid-cols-3 gap-2"><button className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm text-primary-foreground"><Plus size={18} />سلفة جديدة</button><button className="flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-6 text-sm">تصدير<Download size={18} /></button><button className="flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-6 text-sm">طباعة<Printer size={18} /></button></div></header>
    <Stats />
    <div className="mt-3 grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)_290px]">
      <div className="grid content-start gap-3"><Summary /><Distribution /><Extra /></div>
      <div className="grid content-start gap-3"><NewAdvance onSave={r => setRows(p => [...p, r])} /><History rows={rows} /></div>
      <div className="grid content-start gap-3"><Rules /><EndOfService /></div>
    </div>
  </div></main></AppShell>;
}
