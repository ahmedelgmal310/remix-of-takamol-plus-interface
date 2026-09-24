import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, Banknote, BarChart3, CheckCircle2, ChevronDown, ChevronLeft,
  CircleDollarSign, CreditCard, FileText, Hand, HandCoins, Landmark, ReceiptText,
  Send, TrendingUp, WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { financeAccounts, financeStats, financeTransactions } from "@/data/mockData";
import financeHero from "@/assets/finance-hero.png";
import snbLogo from "@/assets/banks/snb.svg";
import alrajhiLogo from "@/assets/banks/alrajhi.svg";
import bsfLogo from "@/assets/banks/bsf.svg";

const bankLogos = [snbLogo, alrajhiLogo, bsfLogo];

const iconMap: Record<string, LucideIcon> = {
  flow: TrendingUp,
  bank: Landmark,
  document: FileText,
  card: CreditCard,
  cash: HandCoins,
};

const statStyles = [
  "bg-finance-mint border-finance-mint-border text-finance-teal",
  "bg-finance-sky border-finance-sky-border text-finance-blue",
  "bg-finance-violet border-finance-violet-border text-finance-purple",
  "bg-finance-peach border-finance-peach-border text-finance-orange",
  "bg-finance-green border-finance-green-border text-finance-green-strong",
];

function PanelTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex h-10 items-center justify-between border-b border-border px-4">
      <h2 className="text-[11px] font-extrabold">{title}</h2>
      {action && <Button variant="ghost" size="sm" className="h-7 px-1 text-[8px] font-normal text-primary">{action}<ChevronLeft size={11}/></Button>}
    </div>
  );
}

function Stats() {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {financeStats.map((stat, index) => {
        const Icon = iconMap[stat[4]] ?? FileText;
        return (
          <article key={stat[0]} className={`h-[130px] rounded-md border px-4 py-3 shadow-sm ${statStyles[index]}`}>
            <div className="flex items-start justify-between">
              <div className="text-foreground">
                <h2 className="text-[10px] font-extrabold">{stat[0]}</h2>
                <strong className="mt-4 block whitespace-nowrap text-[18px] leading-none">{stat[1]}</strong>
                <p className="mt-3 text-[8px] text-muted-foreground">{stat[2]}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-full bg-current/15"><Icon size={19}/></span>
            </div>
            <Button variant="ghost" size="sm" className="mt-1 h-6 px-0 text-[8px] font-normal text-current">{stat[3]}<ArrowLeft size={11}/></Button>
          </article>
        );
      })}
    </section>
  );
}

function Accounts() {
  return (
    <section className="panel h-[232px] overflow-hidden">
      <PanelTitle title="حركة الحسابات البنكية" action="عرض الكل" />
      <div className="divide-y divide-border">
        {financeAccounts.map((account, index) => (
          <div key={account[0]} className="grid h-[63px] grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3 px-4">
            <span className="grid h-10 w-16 place-items-center overflow-hidden rounded-lg border border-border bg-card p-1.5"><img src={bankLogos[index]} alt={`شعار ${account[0]}`} className={`max-h-full max-w-full object-contain ${index === 1 ? "scale-[1.7]" : ""}`} loading="lazy" /></span>
            <div className="min-w-0"><b className="block text-[9px]">{account[0]}</b><span className="block truncate text-[7px] text-muted-foreground">{account[1]}</span></div>
            <div className="text-left"><span className="block text-[7px] text-success">نشط</span><b className="text-[10px]">{account[2]}</b></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExpenseDistribution() {
  const rows = [
    ["المشروعات", "32%", "bg-success"], ["الموارد البشرية", "18%", "bg-primary"],
    ["التشغيل والصيانة", "15%", "bg-warning"], ["التسويق", "12%", "bg-destructive"],
    ["أخرى", "23%", "bg-muted-foreground"],
  ];
  return (
    <section className="panel h-[232px] overflow-hidden">
      <PanelTitle title="توزيع المصروفات حسب القطاع" />
      <div className="grid h-[191px] grid-cols-[minmax(0,1fr)_126px] items-center gap-4 px-5">
        <div className="report-ring"><strong>1,250,000</strong><span>ر.س</span></div>
        <div className="grid gap-3">
          {rows.map(([name, percent, color]) => <div key={name} className="grid grid-cols-[8px_1fr_auto] items-center gap-2 text-[8px]"><span className={`size-2 rounded-full ${color}`}/><span>{name}</span><b>{percent}</b></div>)}
        </div>
      </div>
    </section>
  );
}

function CashChart() {
  const months = ["أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر"];
  const green = [60, 48, 40, 55, 58, 62];
  const blue = [40, 34, 27, 44, 32, 47];
  return (
    <section className="panel h-[232px] overflow-hidden">
      <div className="flex h-10 items-center justify-between border-b border-border px-4"><Button variant="outline" size="sm" className="h-7 gap-2 text-[8px]">آخر 6 أشهر<ChevronDown size={11}/></Button><h2 className="text-[11px] font-extrabold">تحليل المصروفات والإيرادات</h2></div>
      <div className="flex justify-end gap-4 px-5 pt-2 text-[8px]"><span className="text-success">● <span className="text-foreground">الإيرادات</span></span><span className="text-primary">● <span className="text-foreground">المصروفات</span></span></div>
      <div className="relative mx-5 mt-1 h-[153px] border-b border-border pr-8">
        {["800K", "600K", "400K", "200K", "0"].map((label, index) => <div key={label} className="absolute right-0 flex w-full items-center" style={{top: `${index * 25}%`}}><span className="w-8 text-[6px] text-muted-foreground">{label}</span><span className="h-px flex-1 bg-border/60"/></div>)}
        <div className="absolute inset-y-0 right-8 left-0 flex items-end justify-around gap-2 pb-4">
          {months.map((month, index) => <div key={month} className="flex h-full flex-1 flex-col justify-end"><div className="flex h-[112px] items-end justify-center gap-1"><span className="w-3 bg-primary" style={{height:`${blue[index]}%`}}/><span className="w-3 bg-success" style={{height:`${green[index]}%`}}/></div><span className="mt-1 text-center text-[7px]">{month}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const steps: { title: string; text: string; Icon: LucideIcon; complete?: boolean }[] = [
    { title: "استقبال المعاملة", text: "تم استلام المعاملة وتسجيلها", Icon: ReceiptText },
    { title: "المراجعة والموافقة", text: "جاري المراجعة من الإدارة المختصة", Icon: CheckCircle2 },
    { title: "الترحيل للصندوق", text: "تم الترحيل إلى الصندوق", Icon: WalletCards },
    { title: "أمر الصرف / الدفع", text: "تم إصدار أمر الصرف أو الدفع", Icon: FileText },
    { title: "تنفيذ المعاملة", text: "تم تنفيذ المعاملة بنجاح", Icon: CheckCircle2, complete: true },
  ];
  return (
    <section className="panel h-[122px] overflow-hidden">
      <h2 className="px-4 pt-3 text-[11px] font-extrabold">رحلة المعاملة المالية</h2>
      <div className="overflow-x-auto px-7 pb-3 pt-1">
        <div className="flex min-w-[760px] flex-row-reverse">
          {steps.map(({ title, text, Icon, complete }, index) => <div key={title} className="relative flex flex-1 flex-col items-center text-center after:absolute after:left-1/2 after:top-5 after:h-px after:w-full after:bg-border last:after:hidden"><span className={`z-10 grid size-10 place-items-center rounded-full border-4 border-card shadow-sm ${complete || index < 2 ? "bg-finance-green text-success" : "bg-finance-sky text-primary"}`}><Icon size={17}/></span><b className="mt-1 text-[8px]">{title}</b><span className="mt-0.5 text-[6px] text-muted-foreground">{text}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function FinancialSummary() {
  const rows = [
    ["إجمالي الإيرادات", "2,850,000 ر.س", "+ 12%", "text-success", Banknote],
    ["إجمالي المصروفات", "1,250,000 ر.س", "- 8%", "text-destructive", CreditCard],
    ["صافي التدفق النقدي", "1,600,000 ر.س", "+ 15%", "text-success", WalletCards],
  ] as const;
  return <section className="panel h-[180px] overflow-hidden"><PanelTitle title="ملخص مالي"/>{rows.map(([name,value,percent,color,Icon]) => <div key={name} className="grid h-[46px] grid-cols-[28px_1fr_auto] items-center gap-2 border-b border-border px-3 last:border-0"><span className="grid size-7 place-items-center rounded-full bg-search text-primary"><Icon size={13}/></span><div><span className="text-[7px]">{name}</span><b className="block text-[9px]">{value}</b></div><strong className={`text-[8px] ${color}`}>{percent}</strong></div>)}</section>;
}

function Transactions() {
  return <section className="panel h-[180px] overflow-hidden"><PanelTitle title="أحدث المعاملات المالية" action="عرض الكل"/><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-[7px]"><thead className="bg-search"><tr>{["رقم المعاملة","نوع المعاملة","المبلغ","الجهة","الحالة","التاريخ",""].map(header => <th key={header} className="h-7 px-2 text-right">{header}</th>)}</tr></thead><tbody className="divide-y divide-border">{financeTransactions.map(row => <tr key={row[0]}>{row.map((cell,index) => <td key={`${row[0]}-${index}`} className="h-[27px] whitespace-nowrap px-2 font-bold">{index === 4 ? <span className={`rounded-full px-2 py-1 ${cell.includes("تمت") ? "bg-success-soft text-success" : cell.includes("الترحيل") ? "bg-search text-primary" : "bg-warning-soft text-warning"}`}>{cell}</span> : cell}</td>)}<td className="px-2">••</td></tr>)}</tbody></table></div></section>;
}

function QuickTools() {
  const tools: { name:string; Icon:LucideIcon; tone:string }[] = [
    {name:"رفع سند قبض",Icon:ReceiptText,tone:"bg-finance-sky text-finance-blue"},
    {name:"إصدار أمر دفع",Icon:CreditCard,tone:"bg-finance-violet text-finance-purple"},
    {name:"إصدار أمر صرف",Icon:Send,tone:"bg-finance-green text-success"},
    {name:"تحليل البيانات",Icon:BarChart3,tone:"bg-finance-violet text-finance-purple"},
  ];
  return <section className="panel h-[180px] overflow-hidden"><PanelTitle title="أدوات سريعة"/><div className="grid h-[139px] grid-cols-3 border-border">{tools.map(({name,Icon,tone},index) => <Button key={name} variant="ghost" className={`h-[69px] flex-col gap-1 rounded-none border-l border-b border-border bg-card text-[7px] ${index===3?"col-start-1":""}`}><span className={`grid size-8 place-items-center rounded-full ${tone}`}><Icon size={15}/></span>{name}</Button>)}</div></section>;
}

export function FinanceDashboardPage() {
  return (
    <AppShell>
      <main className="min-w-0 bg-background p-3 sm:p-4" dir="rtl">
        <div className="mx-auto max-w-[1250px] space-y-3">
          <section className="panel relative h-[106px] overflow-hidden bg-finance-hero px-6">
            <div className="relative z-10 flex h-full items-center justify-between gap-4">
              <div><h1 className="flex items-center gap-2 text-[23px] font-extrabold"><Hand className="text-warning" size={26}/>مرحباً، أحمد</h1><p className="mt-2 text-[9px] text-muted-foreground">تابع معاملاتك المالية، وأصدر الموافقات، واطلع على حركة حسابات الشركة في مكان واحد.</p></div>
              <img src={financeHero} alt="تحليلات مالية" width={768} height={512} className="h-[104px] w-[220px] object-contain object-left" />
            </div>
          </section>
          <Stats />
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]"><Accounts/><ExpenseDistribution/><CashChart/></div>
          <Journey />
          <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_250px]"><FinancialSummary/><Transactions/><QuickTools/></div>
        </div>
      </main>
    </AppShell>
  );
}