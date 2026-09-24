import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit3, Plus, Search, Trash2, UserRoundPlus, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DataTable, FilterBar, PageHeader, StatCard, Timeline } from "@/components/salary-ui";
import { quickActions, salaryRows, stats } from "@/data/mockData";

const actionToneClasses = {
  blue: "tone-blue",
  sky: "tone-sky",
  purple: "tone-purple",
  green: "tone-green",
} as const;

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "سلم الرواتب — تكامل بلس" },
    { name: "description", content: "إدارة سلم الرواتب وتسكين الموظفين على الدرجات والفئات الوظيفية." },
    { property: "og:title", content: "سلم الرواتب — تكامل بلس" },
    { property: "og:description", content: "إدارة سلم الرواتب وتسكين الموظفين على الدرجات والفئات الوظيفية." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <main className="p-3 sm:p-5 lg:px-6 lg:py-3">
        <div className="mb-2 flex items-center gap-2 text-[9px] text-muted-foreground"><span>الرئيسية</span><ChevronLeft size={11}/><span>الموارد البشرية</span><ChevronLeft size={11}/><span className="font-bold text-foreground">سلم الرواتب</span></div>
        <PageHeader icon={WalletCards} title="سلم الرواتب" description="إدارة سلم الرواتب وتسكين الموظفين على الدرجات والفئات بسهولة ومتابعة التحديثات تلقائياً في النظام" />
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>
        <section className="mt-3 grid items-start gap-3 [direction:ltr] xl:grid-cols-[minmax(0,2.55fr)_minmax(270px,1fr)]">
          <div className="min-w-0 [direction:rtl]">
            <SalaryTable />
            <QuickActions />
          </div>
          <EmployeePlacement />
        </section>
      </main>
    </AppShell>
  );
}

function SalaryTable() {
  return <section className="panel min-w-0 overflow-hidden [direction:rtl]">
    <FilterBar>
      <div className="flex flex-1 flex-wrap gap-2">
        <label className="relative min-w-48 flex-1"><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input className="h-8 w-full rounded-md border border-input bg-background pr-9 pl-3 text-[10px]" placeholder="ابحث في سلم الرواتب..."/></label>
        <select className="h-8 rounded-md border border-input bg-background px-3 text-[10px]"><option>كل الدرجات</option></select>
        <select className="h-8 rounded-md border border-input bg-background px-3 text-[10px]"><option>كل الفئات</option></select>
      </div>
      <Button size="sm"><Plus/> إضافة درجة / فئة جديدة</Button>
    </FilterBar>
    <DataTable><thead className="bg-search text-foreground"><tr>{["#","الدرجة","الفئة","الراتب الأساسي","بدل النقل","بدل السكن","إجمالي الراتب","الإجراءات"].map((h)=><th key={h} className="border-b border-l border-border px-3 py-3 font-extrabold">{h}</th>)}</tr></thead>
      <tbody>{salaryRows.map((row,index)=><tr key={row[0]} className="hover:bg-muted/30"><td className="border-b border-l border-border px-2 py-2">{index+1}</td>{row.map((cell)=><td key={cell} className="border-b border-l border-border px-3 py-2.5 font-semibold">{cell}</td>)}<td className="border-b border-border px-2"><div className="flex justify-center gap-1"><Button size="icon" variant="outline" className="h-7 w-7 text-primary" aria-label="تعديل"><Edit3/></Button><Button size="icon" variant="outline" className="h-7 w-7 text-destructive" aria-label="حذف"><Trash2/></Button></div></td></tr>)}</tbody>
    </DataTable>
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 text-[9px] text-muted-foreground"><span>إجمالي عدد الدرجات والفئات: 10</span><div className="flex gap-1"><Button variant="outline" size="icon" className="h-6 w-6"><ChevronsRight/></Button><Button variant="outline" size="icon" className="h-6 w-6"><ChevronRight/></Button>{[1,2,3,4,5].map(n=><Button key={n} variant={n===1?"default":"outline"} size="icon" className="h-6 w-6">{n}</Button>)}<Button variant="outline" size="icon" className="h-6 w-6"><ChevronLeft/></Button><Button variant="outline" size="icon" className="h-6 w-6"><ChevronsLeft/></Button></div></div>
  </section>;
}

function EmployeePlacement() {
  const [saved, setSaved] = useState(true);
  return <aside className="panel overflow-hidden [direction:rtl]">
    <div className="flex items-center gap-2 border-b border-border p-2.5 text-xs font-extrabold"><UserRoundPlus className="text-primary" size={17}/>تسكين موظف على سلم الرواتب</div>
    <div className="space-y-2 p-2.5">
      <label className="relative block"><Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"/><input className="h-8 w-full rounded-md border border-input pr-9 pl-3 text-[9px]" placeholder="ابحث عن موظف بالاسم أو رقم الهوية"/></label>
      <div className="flex items-center gap-2 border border-border p-2"><span className="avatar h-11 w-11 text-xs">مع</span><div><p className="text-[11px] font-extrabold">محمد عبدالله الشهري</p><p className="mt-0.5 text-[9px]">رقم الهوية: 1111433222</p><p className="text-[9px] text-muted-foreground">الإدارة: الإدارة المالية<br/>المسمى الوظيفي: محاسب</p></div></div>
      <SelectRow label="الدرجة" value="الدرجة الثالثة"/><SelectRow label="الفئة" value="الفئة الثانية"/>
      <label className="block text-[9px] font-bold">تاريخ التسكين<div className="mt-1 flex h-8 items-center justify-between rounded-md border border-input px-3 text-[10px]"><span>2025/09/22</span><CalendarDays className="text-primary" size={15}/></div></label>
      <Button className="w-full" onClick={()=>setSaved(true)}><UserRoundPlus/>تسكين الموظف</Button>
      {saved && <div className="rounded-md border border-success/20 bg-success-soft p-2 text-center text-[9px] text-success"><p className="flex items-center justify-center gap-1 font-extrabold"><CheckCircle2 size={14}/>تم تسكين الموظف بنجاح</p><p className="mt-0.5">تم إضافة الدرجة والفئة للموظف وتحديثها تلقائياً في ملفه الإلكتروني</p></div>}
      <Timeline />
      <div><h3 className="mb-2 text-xs font-extrabold">تفاصيل الراتب</h3>{[["الراتب الأساسي","6,500 ر.س"],["بدل النقل","750 ر.س"],["بدل السكن","1,200 ر.س"]].map(([k,v])=><div key={k} className="flex justify-between py-0.5 text-[9px]"><span>{k}</span><b>{v}</b></div>)}<div className="mt-1.5 flex justify-between border-t border-border pt-2 text-xs font-extrabold"><span>إجمالي الراتب</span><span className="text-primary">8,450 ر.س</span></div></div>
    </div>
  </aside>;
}

function SelectRow({label,value}:{label:string;value:string}) { return <label className="block text-[9px] font-bold">{label}<div className="mt-1 flex h-8 items-center justify-between rounded-md border border-input px-3"><span>{value}</span><ChevronDown size={13}/></div></label> }

function QuickActions(){ return <section className="panel mt-3 p-3"><h2 className="mb-3 text-xs font-extrabold">إجراءات سريعة</h2><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{quickActions.map(({title,subtitle,icon:Icon,tone})=><Button variant="outline" type="button" key={title} className="h-auto justify-start gap-3 bg-search p-3 text-right hover:bg-muted"><span className={`icon-well shrink-0 ${actionToneClasses[tone]}`}><Icon size={19}/></span><span className="min-w-0"><b className="block text-[10px]">{title}</b><small className="block text-[9px] text-muted-foreground">{subtitle}</small></span></Button>)}</div></section> }
