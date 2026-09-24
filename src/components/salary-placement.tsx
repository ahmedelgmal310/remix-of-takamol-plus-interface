import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, BarChart3, Building2, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Database,
  FileCheck2, FileSpreadsheet, FileText, Filter, Hexagon, Info, Printer, Search, ShieldCheck, Clock3, Link2, UserCheck, UserRound, UserSearch,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { placementEmployee as e, placementEmployees } from "@/data/mockData";

const flow = [
  { n: 1, title: "مطابقة البيانات", sub: "مع التعيين وقرار التوظيف", icon: UserSearch },
  { n: 3, title: "إصدار القرار", sub: "وتحديد الدرجة والفئة", icon: FileCheck2 },
  { n: 4, title: "سحب البيانات", sub: "وتسكين الموظف في سلم الرواتب", icon: Database },
  { n: 5, title: "انعكاس التسكين", sub: "في الملف الشخصي للموظف", icon: FileText },
];

const pages = [
  { n: 1, to: "/salary-placement/select", title: "اختيار الموظف من قائمة الموظفين" },
  { n: 2, to: "/salary-placement/match", title: "عرض بيانات الموظف ومطابقتها" },
  { n: 3, to: "/salary-placement/decision", title: "إصدار قرار التسكين" },
  { n: 4, to: "/salary-placement/pull", title: "سحب بيانات الموظف وتسكينه في سلم الرواتب" },
  { n: 5, to: "/salary-placement/profile", title: "انعكاس التسكين في الملف الشخصي للموظف" },
  { n: 6, to: "/salary-placement/confirm", title: "إشعار التسكين وتأكيد العملية" },
] as const;

function Shell({ step, children }: { step: number; children: ReactNode }) {
  const page = pages[step - 1] ?? pages[0];
  const prev = pages[step - 2];
  const next = pages[step];
  return (
    <AppShell>
      <main className="p-3 sm:p-4" dir="rtl">
        <div className="mx-auto max-w-[1180px] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-2 truncate text-[10px] text-muted-foreground">الرواتب والبدلات <ChevronLeft className="inline" size={11} /> سلم الرواتب <ChevronLeft className="inline" size={11} /> {page.title}</p>
              <h1 className="rounded-lg bg-primary px-4 py-2 text-base font-extrabold text-primary-foreground">آلية اختيار الموظف للتسكين وسحب بياناته في سلم الرواتب</h1>
            </div>
            <div className="flex gap-2">
              {prev && <Button asChild variant="outline" size="sm"><Link to={prev.to}><ChevronRight />السابق</Link></Button>}
              {next && <Button asChild size="sm"><Link to={next.to}>التالي<ChevronLeft /></Link></Button>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center">
            {flow.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.n} className="contents">
                  <div className="panel flex flex-1 items-center gap-3 p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Icon size={20} /></span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-xs font-extrabold"><span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{f.n}</span>{f.title}</p>
                      <p className="mt-1 truncate text-[10px] text-muted-foreground">{f.sub}</p>
                    </div>
                  </div>
                  {i < flow.length - 1 && <ArrowRight className="hidden shrink-0 text-primary lg:block" size={16} />}
                </div>
              );
            })}
          </div>
          <nav className="flex gap-1 overflow-x-auto" aria-label="مراحل التسكين">
            {pages.map((p) => (
              <Link key={p.n} to={p.to} className={`shrink-0 rounded-md border px-3 py-1.5 text-[10px] font-bold ${p.n === step ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}>{p.n}. {p.title}</Link>
            ))}
          </nav>
          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between bg-primary px-4 py-2.5 text-primary-foreground">
              <h2 className="text-sm font-extrabold">{page.title}</h2>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-card text-xs font-extrabold text-primary">{step}</span>
            </div>
            <div className="p-4">{children}</div>
          </section>
          <footer className="panel flex flex-col items-center justify-between gap-3 p-3 text-[11px] font-bold md:flex-row">
            <div className="flex flex-wrap gap-5 text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck size={15} className="text-primary" />دقة في البيانات</span>
              <span className="flex items-center gap-1"><Clock3 size={15} className="text-primary" />سرعة في الإجراءات</span>
              <span className="flex items-center gap-1"><Link2 size={15} className="text-primary" />تكامل مع الأنظمة</span>
            </div>
            <p className="text-primary">إدارة الرواتب تبدأ من بيانات صحيحة ... وتكتمل بتسكين دقيق</p>
            <div className="flex items-center gap-2"><Hexagon className="text-primary" size={26} /><div><p className="font-extrabold">منصة الأعمال</p><p className="text-[9px] text-muted-foreground">إدارة شؤون الموظفين والرواتب</p></div></div>
          </footer>
        </div>
      </main>
    </AppShell>
  );
}

function EmpHeader({ badge }: { badge?: boolean }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><UserRound size={32} /></span>
        <div className="space-y-1 text-[11px] text-muted-foreground">
          <p className="text-sm font-extrabold text-foreground">{e.name}</p>
          <p>رقم الهوية: {e.nationalId}</p><p>الإدارة: {e.department}</p><p>المسمى الوظيفي: {e.title}</p>
        </div>
      </div>
      {badge && <span className="flex items-center gap-2 rounded-lg bg-success-soft px-4 py-2 text-xs font-extrabold text-success"><CheckCircle2 size={18} />تم المطابقة</span>}
    </div>
  );
}

function Tabs({ tabs, active }: { tabs: string[]; active: number }) {
  const [a, setA] = useState(active);
  return (
    <div className="flex overflow-x-auto border-b border-border">
      {tabs.map((t, i) => <button key={t} onClick={() => setA(i)} className={`shrink-0 flex-1 px-3 py-2 text-[11px] font-bold ${a === i ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>{t}</button>)}
    </div>
  );
}

function Box({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return <div className="rounded-md border border-border bg-muted/40 p-3"><p className="text-[10px] text-muted-foreground">{label}</p><p className={`mt-2 text-xs ${strong ? "font-extrabold" : "font-bold"}`}>{value}</p></div>;
}

export function PlacementSelectPage() {
  const [selected, setSelected] = useState(3);
  return (
    <Shell step={1}>
      <h3 className="mb-3 text-xs font-extrabold">قائمة الموظفين</h3>
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} /><input className="h-9 w-full rounded-md border border-input bg-card pr-9 text-xs" placeholder="ابحث باسم الموظف أو رقم الهوية..." /></div>
        <select className="h-9 rounded-md border border-input bg-card px-3 text-xs"><option>جميع الإدارات</option></select>
        <Button variant="outline" size="icon" className="h-9 w-9" aria-label="تصدير"><FileSpreadsheet /></Button>
        <Button size="sm" className="h-9"><Filter />تصفية</Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[720px] text-right text-[11px]">
          <thead className="bg-muted text-muted-foreground"><tr>{["م", "اسم الموظف", "رقم الهوية", "الإدارة", "المسمى الوظيفي", "الحالة", "إجراءات"].map((h) => <th key={h} className="px-3 py-2.5 font-bold">{h}</th>)}</tr></thead>
          <tbody>{placementEmployees.map((r) => (
            <tr key={r.id} className={`border-t border-border ${selected === r.id ? "bg-primary-soft" : ""}`}>
              <td className="px-3 py-3">{r.id}</td><td className="px-3 font-bold">{r.name}</td><td className="px-3">{r.nationalId}</td><td className="px-3">{r.department}</td><td className="px-3">{r.title}</td>
              <td className="px-3 font-bold text-success">{r.status}</td>
              <td className="px-3"><Button size="sm" className="h-7 px-4" onClick={() => setSelected(r.id)}>اختيار</Button></td>
            </tr>))}</tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-1">{["›", "1", "2", "3", "...", "‹"].map((p) => <Button key={p} variant={p === "1" ? "default" : "outline"} size="sm" className="h-7 w-7 p-0">{p}</Button>)}</div>
    </Shell>
  );
}

export function PlacementMatchPage() {
  return (
    <Shell step={2}>
      <EmpHeader badge />
      <div className="mt-4"><Tabs tabs={["البيانات الأساسية", "الراتب والعقد", "الخبرات والمهارات", "الوثائق"]} active={0} /></div>
      <div className="mt-3 rounded-md border border-border p-3">
        <h3 className="mb-3 text-xs font-extrabold">بيانات التوظيف</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Box label="نوع العقد" value={e.contractType} /><Box label="تاريخ المباشرة" value={e.startDate} />
          <Box label="الدرجة الوظيفية" value={e.grade} /><Box label="رقم التعيين" value={e.number} />
          <Box label="الفئة الوظيفية" value="الفئة السابعة" /><Box label="جهة العمل" value={e.workplace} />
        </div>
        <div className="mt-4 flex gap-2"><Button asChild><Link to="/salary-placement/decision">التالي: إصدار القرار</Link></Button><Button variant="outline">إلغاء</Button></div>
      </div>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[11px] font-bold">{label}</span>{children}</label>;
}
const inp = "h-9 w-full rounded-md border border-input bg-card px-3 text-xs";

export function PlacementDecisionPage() {
  return (
    <Shell step={3}>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold"><FileText className="text-primary" size={18} />إصدار قرار التسكين</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="رقم القرار"><input className={inp} defaultValue={e.decisionNo} /></Field>
        <Field label="تاريخ القرار"><div className="relative"><CalendarDays className="absolute left-3 top-2.5 text-muted-foreground" size={15} /><input className={inp} placeholder="تاريخ القرار" /></div></Field>
        <Field label="الدرجة"><input className={inp} defaultValue="1234" /></Field>
        <Field label="التاريخ"><div className="relative"><CalendarDays className="absolute left-3 top-2.5 text-muted-foreground" size={15} /><input className={inp} defaultValue={e.placementDate} /></div></Field>
        <Field label="الدرجة الوظيفية"><select className={inp}><option>الدرجة الثالثة</option></select></Field>
        <Field label="الفئة"><select className={inp}><option>الفئة السابعة</option></select></Field>
        <Field label="تاريخ التسكين"><div className="relative"><CalendarDays className="absolute left-3 top-2.5 text-muted-foreground" size={15} /><input className={inp} defaultValue={e.placementDate} /></div></Field>
      </div>
      <div className="mt-3"><Field label="ملاحظات (اختياري)"><textarea className="min-h-20 w-full rounded-md border border-input bg-card p-3 text-xs" placeholder="أدخل ملاحظات إن وجدت..." /></Field></div>
      <div className="mt-4 flex justify-end"><Button asChild className="px-8"><Link to="/salary-placement/pull">إصدار القرار</Link></Button></div>
    </Shell>
  );
}

export function PlacementPullPage() {
  const steps = ["سحب البيانات", "مطابقة البيانات", "تسكين الموظف"];
  return (
    <Shell step={4}>
      <div className="flex items-center rounded-md border border-border bg-muted/40 p-3">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-primary-foreground ${i === 0 ? "bg-success" : "bg-primary"}`}><Check size={14} /></span>
            <span className={`text-[11px] font-bold ${i === 2 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < 2 && <span className="mx-2 h-px flex-1 bg-border" />}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-md bg-success-soft p-3 text-xs font-extrabold text-success"><CheckCircle2 size={18} />تم سحب بيانات الموظف بنجاح وتسكينه في سلم الرواتب</div>
      <div className="mt-3 rounded-md border border-border p-4">
        <h3 className="mb-3 text-sm font-extrabold">تفاصيل التسكين</h3>
        <div className="grid grid-cols-2 gap-4 text-[11px] md:grid-cols-4">
          <div><p className="text-muted-foreground">الإسم</p><p className="mt-2 font-bold">{e.name}</p></div>
          <div><p className="text-muted-foreground">الدرجة</p><p className="mt-2 font-bold">{e.grade}</p></div>
          <div><p className="text-muted-foreground">الفئة</p><p className="mt-2 font-bold">{e.category}</p></div>
          <div><p className="text-muted-foreground">الراتب الأساسي</p><p className="mt-2 font-extrabold">{e.basicSalary} ريال</p></div>
          <div><p className="text-muted-foreground">المؤهل</p><p className="mt-2 font-bold">{e.qualification}</p></div>
          <div><p className="text-muted-foreground">بدلات</p><p className="mt-2 font-bold">{e.housing} ريال</p></div>
          <div><p className="text-muted-foreground">بدلات</p><p className="mt-2 font-bold">{e.allowances} ريال</p></div>
          <div><p className="text-muted-foreground">إجمالي الراتب</p><p className="mt-2 font-extrabold text-primary">{e.total} ريال</p></div>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button variant="outline"><Printer />طباعة إشعار التسكين</Button>
        <Button asChild variant="outline"><Link to="/salary-placement/profile"><UserCheck />عرض ملف الموظف</Link></Button>
      </div>
    </Shell>
  );
}

export function PlacementProfilePage() {
  return (
    <Shell step={5}>
      <EmpHeader />
      <div className="mt-4"><Tabs tabs={["بيانات الموظف", "السلم الوظيفي", "الرواتب والبدلات", "القرارات"]} active={1} /></div>
      <div className="mt-3 rounded-md border border-border p-3">
        <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-extrabold">بيانات السلم الوظيفي</h3><Button variant="outline" size="icon" className="h-8 w-8" aria-label="مستند"><FileText /></Button></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Box label="الدرجة الوظيفية" value={e.grade} strong /><Box label="الفئة الوظيفية" value={e.category} strong /><Box label="تاريخ التسكين" value={e.placementDate} strong />
        </div>
        <Button asChild className="mt-3 w-full"><Link to="/salary-placement/confirm">عرض تفاصيل سلم الرواتب</Link></Button>
      </div>
    </Shell>
  );
}

export function PlacementConfirmPage() {
  return (
    <Shell step={6}>
      <div className="rounded-md bg-success-soft p-4">
        <p className="flex items-center gap-2 text-sm font-extrabold text-success"><CheckCircle2 size={20} />تم بنجاح</p>
        <p className="mt-2 text-[11px] font-bold">تم تسكين الموظف في سلم الرواتب وإدراج بياناته في ملفه الإلكتروني.</p>
      </div>
      <div className="mt-3 rounded-md border border-border bg-muted/40 p-4">
        <h3 className="text-xs font-extrabold">رقم العملية</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
          <div><p className="font-bold">{e.operationNo}</p></div>
          <div><p className="text-muted-foreground">تاريخ العملية</p><p className="mt-1 font-bold">{e.operationTime}</p></div>
        </div>
      </div>
      <h3 className="mb-2 mt-4 text-xs font-extrabold">خيارات إضافية</h3>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button variant="outline"><Printer />طباعة الإشعار</Button>
        <Button variant="outline"><BarChart3 />عرض التقرير</Button>
        <Button asChild variant="outline"><Link to="/salary-placement/select"><ArrowLeft />العودة للقائمة</Link></Button>
      </div>
      <p className="mt-3 flex items-center gap-2 rounded-md bg-primary-soft p-3 text-[10px] font-bold text-primary"><Info size={15} />يمكنك متابعة التغييرات من خلال ملف الموظف أو تقارير الرواتب.</p>
    </Shell>
  );
}
