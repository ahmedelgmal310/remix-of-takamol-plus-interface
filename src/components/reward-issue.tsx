import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Calculator,
  Check,
  ChevronLeft,
  CircleHelp,
  Gift,
  MapPin,
  Pencil,
  Save,
  UserRound,
  WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  employeeRewardHistory,
  rewardEmployee,
  rewardPreviewRows,
  rewardQuickStats,
} from "@/data/mockData";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <Button type="button" variant="ghost" size="icon" aria-label={label} aria-pressed={checked} onClick={onChange} className={`h-5 w-9 rounded-full p-0 ${checked ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted"}`}>
      <span className={`h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${checked ? "-translate-x-2" : "translate-x-2"}`} />
    </Button>
  );
}

function RewardSteps() {
  const steps = [
    { number: 1, title: "بيانات الموظف", done: true },
    { number: 2, title: "تفاصيل المكافأة", active: true },
    { number: 3, title: "المراجعة" },
    { number: 4, title: "الإرسال" },
  ];
  return (
    <div className="panel mt-3 px-4 py-3">
      <div className="grid grid-cols-4 items-center">
        {steps.map((step, index) => (
          <div key={step.title} className="relative flex min-w-0 items-center justify-center gap-2">
            {index > 0 && <span className="absolute right-0 top-1/2 h-px w-1/3 bg-border" />}
            {index < steps.length - 1 && <span className="absolute left-0 top-1/2 h-px w-1/3 bg-border" />}
            <span className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-extrabold ${step.done ? "bg-success text-primary-foreground" : step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {step.done ? <Check size={13} /> : step.number}
            </span>
            <span className={`relative z-10 hidden bg-card px-1 text-[10px] font-bold sm:block ${step.done ? "text-success" : step.active ? "text-primary" : "text-muted-foreground"}`}>{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeCard() {
  const fields = [
    ["القسم", rewardEmployee.department, BriefcaseBusiness],
    ["الوظيفة", rewardEmployee.position, BriefcaseBusiness],
    ["الفرع", rewardEmployee.branch, MapPin],
    ["تاريخ التعيين", rewardEmployee.hireDate, CalendarDays],
    ["الراتب الأساسي", rewardEmployee.basicSalary, WalletCards],
  ] as const;
  return (
    <section className="panel h-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="text-xs font-extrabold">معلومات الموظف</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" aria-label="تعديل معلومات الموظف"><Pencil /></Button>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-success-soft text-success"><UserRound size={28} /></div>
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold">{rewardEmployee.name}</p>
            <p className="mt-1 text-[9px] text-muted-foreground">رقم الموظف: {rewardEmployee.id}</p>
            <span className="mt-2 inline-flex rounded-full bg-success-soft px-2 py-1 text-[8px] font-bold text-success">{rewardEmployee.status}</span>
          </div>
        </div>
        <dl className="divide-y divide-border">
          {fields.map(([label, value, Icon]) => <div key={label} className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-2 py-2 text-[9px]"><dt className="flex items-center gap-2 text-muted-foreground"><Icon size={13} />{label}</dt><dd className="truncate font-bold">{value}</dd></div>)}
        </dl>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-[9px] font-bold text-muted-foreground"><span>{label}</span>{children}</label>;
}

const inputClass = "h-9 w-full rounded-md border border-input bg-card px-3 text-[10px] font-bold text-foreground outline-none focus:ring-2 focus:ring-ring";

function RewardDetails() {
  const [method, setMethod] = useState<"salary" | "manual">("salary");
  const [percentage, setPercentage] = useState(10);
  const amount = useMemo(() => method === "salary" ? 12000 * percentage / 100 : 1200, [method, percentage]);
  return (
    <section className="panel h-full p-3">
      <h2 className="mb-3 text-xs font-extrabold">تفاصيل المكافأة</h2>
      <p className="mb-2 text-[9px] font-bold text-muted-foreground">طريقة الحساب</p>
      <div className="mb-3 grid grid-cols-2 rounded-md bg-muted p-1">
        <Button type="button" size="sm" variant={method === "salary" ? "default" : "ghost"} onClick={() => setMethod("salary")}>احتساب من الراتب</Button>
        <Button type="button" size="sm" variant={method === "manual" ? "default" : "ghost"} onClick={() => setMethod("manual")}>إدخال يدوي</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="الراتب الأساسي"><div className="relative"><input className={`${inputClass} pl-12`} value="12,000" readOnly /><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">ريال</span></div></Field>
        <Field label="نسبة المكافأة"><div className="relative"><input type="number" min="0" max="100" className={`${inputClass} pl-9`} value={percentage} onChange={(event) => setPercentage(Number(event.target.value))} /><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span></div></Field>
        <Field label="نوع المكافأة"><select className={inputClass} defaultValue="annual"><option value="annual">سنوية</option><option value="performance">مكافأة أداء</option></select></Field>
        <Field label="تاريخ الاستحقاق"><div className="relative"><input className={`${inputClass} pl-9`} defaultValue="2025/09/30" /><CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} /></div></Field>
      </div>
      <div className="mt-3 rounded-md bg-search p-3">
        <p className="mb-1 flex items-center gap-2 text-[9px] font-bold text-muted-foreground"><Calculator size={14} className="text-primary" />قيمة المكافأة المحسوبة</p>
        <p className="text-xs font-extrabold">12,000 × {percentage}% = {amount.toLocaleString("en-US")} ريال</p>
      </div>
    </section>
  );
}

function ExtraOptions() {
  const [send, setSend] = useState(true);
  const [payslip, setPayslip] = useState(true);
  const [note, setNote] = useState(false);
  return (
    <section className="panel h-full p-3">
      <h2 className="mb-4 text-xs font-extrabold">خيارات إضافية</h2>
      <div className="mb-2 flex items-center justify-between text-[9px] font-bold"><span>إضافة ملاحظة</span><Toggle checked={note} onChange={() => setNote(!note)} label="إضافة ملاحظة" /></div>
      <textarea disabled={!note} className="h-[76px] w-full resize-none rounded-md border border-input bg-card p-2 text-[9px] outline-none disabled:bg-muted" placeholder="اكتب ملاحظة هنا..." />
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between text-[9px] font-bold"><span>إرسال إشعار للموظف</span><Toggle checked={send} onChange={() => setSend(!send)} label="إرسال إشعار للموظف" /></div>
        <div className="flex items-center justify-between text-[9px] font-bold"><span>إظهار في كشف الراتب</span><Toggle checked={payslip} onChange={() => setPayslip(!payslip)} label="إظهار في كشف الراتب" /></div>
      </div>
    </section>
  );
}

function RewardPreview() {
  return (
    <section className="panel overflow-hidden">
      <h2 className="border-b border-border px-3 py-2 text-xs font-extrabold">معاينة المكافأة</h2>
      <div className="overflow-x-auto px-3 py-2">
        <table className="w-full min-w-[430px] text-[9px]"><thead><tr className="text-muted-foreground"><th className="py-1 text-right">البند</th><th className="py-1 text-right">القيمة</th></tr></thead><tbody className="divide-y divide-border">{rewardPreviewRows.map(([label, value], index) => <tr key={label}><td className="py-2"><span className="ml-2 inline-block h-2 w-2 rounded-full border border-muted-foreground" />{label}</td><td className={`py-2 font-extrabold ${index === 2 ? "text-primary" : ""}`}>{value}</td></tr>)}</tbody></table>
      </div>
      <div className="grid gap-2 border-t border-border p-3 sm:grid-cols-[1fr_2fr]">
        <Button variant="outline"><Save />حفظ كمسودة</Button><Button>التالي<ArrowLeft /></Button>
      </div>
    </section>
  );
}

function TotalCard() {
  return <section className="panel grid min-h-[124px] place-content-center bg-success-soft p-4 text-center"><Check className="mx-auto mb-2 rounded-full bg-success p-1 text-primary-foreground" /><p className="text-[9px] font-extrabold">إجمالي المكافأة المستحقة</p><p className="my-2 text-2xl font-extrabold">1,200 <span className="text-xs">ريال</span></p><p className="rounded-md bg-card/60 px-3 py-2 text-[8px] text-success">سيتم إضافتها للراتب في شهر 09/2025</p></section>;
}

function History() {
  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3 py-2"><h2 className="text-xs font-extrabold">سجل مكافآت الموظف</h2><Button variant="link" size="sm">عرض الكل<ChevronLeft /></Button></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-[8px]"><thead className="bg-search text-muted-foreground"><tr>{["التاريخ", "نوع المكافأة", "الأسلوب", "المبلغ", "الحالة"].map((heading) => <th key={heading} className="px-3 py-2 text-right">{heading}</th>)}</tr></thead><tbody className="divide-y divide-border">{employeeRewardHistory.map((row) => <tr key={row[0]}>{row.map((value, index) => <td key={`${row[0]}-${index}`} className="px-3 py-2 font-bold">{index === 4 ? <span className="rounded-full bg-success-soft px-2 py-1 text-success">{value}</span> : value}</td>)}</tr>)}</tbody></table></div>
    </section>
  );
}

function QuickStats() {
  const icons = [BarChart3, WalletCards, Gift];
  return <section className="panel p-3"><h2 className="mb-3 text-[10px] font-extrabold">إحصائيات سريعة</h2><div className="grid grid-cols-3 gap-2">{rewardQuickStats.map(([label, value], index) => { const Icon = icons[index]; return <div key={label} className="rounded-md border border-border p-3 text-center"><Icon className="mx-auto mb-2 text-primary" size={16} /><p className="text-[7px] text-muted-foreground">{label}</p><p className="mt-1 text-[11px] font-extrabold">{value}</p></div>; })}</div></section>;
}

export function RewardIssuePage() {
  return (
    <AppShell>
      <main className="p-3 sm:p-4" dir="rtl">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <div className="min-w-0"><p className="mb-2 truncate text-[9px] text-muted-foreground">الموارد البشرية <ChevronLeft className="inline" size={11} /> المكافآت والحوافز <ChevronLeft className="inline" size={11} /> إصدار مكافأة</p><h1 className="flex items-center gap-2 text-lg font-extrabold"><Gift className="text-primary" size={20} />إصدار مكافأة</h1><p className="mt-1 text-[9px] text-muted-foreground">يمكنك إصدار مكافأة للموظف مع احتسابها تلقائياً من الراتب أو تحديدها يدوياً.</p></div>
            <Button variant="outline" size="sm"><ArrowLeft />عودة</Button>
          </div>
          <RewardSteps />
          <div className="mt-3 grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)_230px]">
            <ExtraOptions /><RewardDetails /><EmployeeCard />
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_250px]"><RewardPreview /><TotalCard /></div>
          <div className="mt-3 grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)_360px]"><section className="panel flex items-start gap-3 p-4"><CircleHelp className="shrink-0 text-primary" /><div><h2 className="text-[10px] font-extrabold">معلومة</h2><p className="mt-2 text-[8px] leading-5 text-muted-foreground">يمكنك تحديد طريقة احتساب المكافأة من الراتب أو إدخال مبلغ ثابت يدوياً حسب سياسة الشركة المعتمدة.</p></div></section><History /><QuickStats /></div>
        </div>
      </main>
    </AppShell>
  );
}