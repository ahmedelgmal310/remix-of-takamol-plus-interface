import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BarChart3, BriefcaseBusiness, CalendarDays, Check, CheckCircle2,
  ChevronDown, CircleUserRound, Download, FileCheck2, FileText, Mail, Search, ShieldCheck,
  Upload, UserCheck, UserRoundPlus, Users, X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DataTable, PageHeader, StatCard, StatusBadge } from "@/components/salary-ui";
import {
  candidateDetails, candidates, employeeSystems, hiringTimeline, jobApplications,
  recruitmentStats, recruitmentSteps,
} from "@/data/mockData";

type StepId = (typeof recruitmentSteps)[number]["id"];
const paths: Record<StepId, string> = {
  requests: "/recruitment/requests", screening: "/recruitment/screening", medical: "/recruitment/medical",
  offer: "/recruitment/offer", decision: "/recruitment/decision", appointment: "/recruitment/appointment",
  tracking: "/recruitment/tracking", reports: "/recruitment/reports", registration: "/recruitment/registration",
};

const titleIcons: Record<StepId, typeof Users> = {
  requests: BriefcaseBusiness, screening: Users, medical: ShieldCheck, offer: Mail,
  decision: UserCheck, appointment: FileCheck2, tracking: CalendarDays, reports: BarChart3, registration: UserRoundPlus,
};

export function RecruitmentPage({ step }: { step: StepId }) {
  const meta = recruitmentSteps.find((item) => item.id === step);
  if (!meta) return null;
  const Icon = titleIcons[step];
  return <AppShell><main className="p-3 sm:p-5 lg:px-6 lg:py-4">
    <div className="mb-2 flex items-center gap-2 text-[9px] text-muted-foreground"><span>الرئيسية</span><span>/</span><span>التوظيف</span><span>/</span><b className="text-foreground">{meta.title}</b></div>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <PageHeader icon={Icon} title={meta.title} description={meta.subtitle} />
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{meta.number}</span>
    </div>
    <StepProgress active={meta.number} />
    <StepContent step={step} />
    <FlowNavigation step={step} />
  </main></AppShell>;
}

function StepProgress({ active }: { active: number }) {
  return <div className="mb-3 overflow-x-auto"><div className="flex min-w-[690px] items-center rounded-md border border-border bg-card p-2">
    {recruitmentSteps.map((item, index) => <div key={item.id} className="flex flex-1 items-center">
      <Link to={paths[item.id]} className={`flex min-w-0 items-center gap-1.5 text-[9px] font-bold ${item.number <= active ? "text-primary" : "text-muted-foreground"}`}>
        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${item.number < active ? "bg-success text-primary-foreground" : item.number === active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{item.number < active ? <Check size={12}/> : item.number}</span>
        <span className="truncate">{item.title}</span>
      </Link>{index < recruitmentSteps.length - 1 && <span className="mx-1 h-px flex-1 bg-border"/>}
    </div>)}
  </div></div>;
}

function StepContent({ step }: { step: StepId }) {
  if (step === "requests") return <Requests />;
  if (step === "screening") return <Screening />;
  if (step === "medical") return <Medical />;
  if (step === "offer") return <Offer />;
  if (step === "decision") return <Decision />;
  if (step === "appointment") return <Appointment />;
  if (step === "tracking") return <Tracking />;
  if (step === "reports") return <Reports />;
  return <Registration />;
}

function Requests() {
  return <><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{recruitmentStats.map((s)=><StatCard key={s.label} {...s}/>)}</section>
    <section className="panel mt-3 overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3"><h2 className="text-sm font-extrabold">طلبات التوظيف</h2><div className="flex flex-wrap gap-2"><label className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14}/><input className="h-8 rounded-md border border-input bg-background pr-9 pl-3 text-[10px]" placeholder="بحث في الطلبات"/></label><select className="h-8 rounded-md border border-input bg-background px-3 text-[10px]"><option>جميع الحالات</option></select><Button size="sm"><UserRoundPlus/>طلب توظيف جديد</Button></div></div>
    <DataTable><thead className="bg-search"><tr>{["#","الاسم","المسمى الوظيفي","تاريخ التقديم","مصدر الطلب","الحالة","الإجراء"].map(h=><th key={h} className="border-b border-l border-border p-3">{h}</th>)}</tr></thead><tbody>{jobApplications.map(a=><tr key={a.id}>{[a.id,a.name,a.job,a.date,a.source].map(v=><td key={v} className="border-b border-l border-border p-3">{v}</td>)}<td className="border-b border-l border-border"><StatusPill status={a.status}/></td><td className="border-b border-border"><Button size="sm" variant="outline">عرض</Button></td></tr>)}</tbody></DataTable></section></>;
}

function Screening() {
  const [selected,setSelected]=useState(0); const c=candidates[selected];
  return <div className="grid gap-3 lg:grid-cols-[290px_minmax(0,1fr)]"><section className="panel overflow-hidden"><div className="border-b border-border p-3 font-extrabold">المرشحون <span className="text-primary">(42)</span></div><div className="p-2"><label className="relative block"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14}/><input className="h-8 w-full rounded-md border border-input pr-9 text-[9px]" placeholder="بحث"/></label>{candidates.map((x,i)=><button key={x.name} onClick={()=>setSelected(i)} className={`mt-2 flex w-full items-center gap-2 border p-2 text-right ${selected===i?"border-primary bg-search":"border-border bg-card"}`}><span className="avatar">{x.initials}</span><span className="min-w-0 flex-1"><b className="block truncate text-[10px]">{x.name}</b><small className="text-muted-foreground">{x.job}</small></span><StatusPill status={x.status}/></button>)}</div></section>
  <section className="panel p-4"><div className="flex items-center gap-3 border-b border-border pb-3"><span className="avatar h-14 w-14 text-sm">{c.initials}</span><div><h2 className="font-extrabold">{c.name}</h2><p className="text-[10px] text-muted-foreground">متقدم لوظيفة {c.job}</p><StatusPill status="مرشح مناسب"/></div></div><div className="mt-3 flex gap-4 border-b border-border text-[10px] font-bold"><span className="border-b-2 border-primary pb-2 text-primary">البيانات الشخصية</span><span>المؤهلات والخبرات</span></div><InfoGrid items={candidateDetails}/><h3 className="mt-4 text-xs font-extrabold">سنوات الخبرة: 3 سنوات</h3><div className="mt-5 flex justify-end gap-2"><Button variant="destructive"><X/>رفض</Button><Button><Check/>ترشيح للاختبار</Button></div></section></div>;
}

function Medical() {
 return <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_330px]"><section className="panel p-4"><CandidateHeader/><h2 className="mt-4 border-b border-border pb-2 text-sm font-extrabold">بيانات الفحص الطبي</h2><InfoGrid items={[["رقم الطلب","#1025"],["تاريخ الفحص","2025/09/22"],["المستشفى","مستشفى الحياة"],["حالة الفحص","مكتمل الفحص"]]}/><div className="mt-3 grid gap-2 sm:grid-cols-2"><DocumentRow title="تقرير الفحص الطبي"/><DocumentRow title="هوية المستفيد"/></div><Button className="mt-4"><Check/>اعتماد النتيجة</Button></section><section className="panel p-4"><h2 className="text-sm font-extrabold">مراحل الفحص الطبي</h2>{[["تم حجز الموعد","2025/09/20"],["تم إجراء الفحص","2025/09/22"],["النتيجة","لائق طبياً"]].map(([t,d],i)=><div key={t} className="mt-4 flex gap-3"><span className={`grid h-7 w-7 place-items-center rounded-full ${i===2?"bg-success":"bg-primary"} text-primary-foreground`}>{i+1}</span><div><b className="block text-[10px]">{t}</b><small className="text-muted-foreground">{d}</small></div></div>)}</section></div>;
}

function Offer() {
 return <div className="grid gap-3 lg:grid-cols-[270px_minmax(0,1fr)]"><CandidateSummary/><section className="panel p-4"><h2 className="mb-4 text-sm font-extrabold">تفاصيل العرض الوظيفي</h2><FormGrid fields={[["الراتب الأساسي","8,000 ريال"],["بدل السكن","1,000 ريال"],["بدل النقل","500 ريال"],["الإجمالي","9,500 ريال"],["تاريخ بدء العمل","2025/10/01"],["مدة العرض","7 أيام"]]}/><div className="mt-4 flex justify-end gap-2"><Button variant="secondary">حفظ كمسودة</Button><Button><Mail/>إرسال العرض</Button></div></section></div>;
}

function Decision() {
 return <section className="panel mx-auto max-w-3xl p-4"><h2 className="border-b border-border pb-3 text-sm font-extrabold">تفاصيل عرض العمل</h2><InfoGrid items={[["رقم العرض الوظيفي","#OF-2029"],["تاريخ الإصدار","2025/09/23"],["الراتب","8,000 ر.س"],["الإجمالي","9,500 ر.س"],["المدة","7 أيام"]]}/><div className="mt-4 grid gap-3 sm:grid-cols-2"><CandidateHeader/><div className="rounded-md border border-border p-3"><h3 className="text-xs font-extrabold">رد المرشح</h3>{["إرسال العرض","استلام العرض","الرد على العرض"].map((x,i)=><div key={x} className="mt-3 flex items-center gap-2 text-[10px]"><CheckCircle2 className={i<2?"text-success":"text-primary"} size={16}/><span>{x}</span></div>)}</div></div><div className="mt-4 flex justify-end gap-2"><Button variant="destructive">رفض العرض</Button><Button><Check/>قبول العرض</Button></div></section>;
}

function Appointment() {
 return <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]"><section className="panel p-4"><h2 className="mb-3 text-sm font-extrabold">قرار التعيين</h2><InfoGrid items={[["اسم الموظف","أحمد محمد العتيبي"],["المسمى الوظيفي","محاسب"],["تاريخ المباشرة","2025/10/01"],["الراتب الأساسي","8,000 ريال"],["الإجمالي","9,500 ريال"],["رقم القرار","#DEC-2025-001"]]}/><div className="mt-4 flex justify-end gap-2"><Button variant="secondary">إلغاء</Button><Button><FileCheck2/>إصدار القرار</Button></div></section><section className="panel grid min-h-72 place-items-center bg-success-soft p-6 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-primary-foreground"><Check size={34}/></span><h3 className="mt-4 font-extrabold text-success">تم إصدار قرار التعيين بنجاح</h3><p className="mt-2 text-[10px] text-muted-foreground">تم إشعار الموظف وجميع الجهات المعنية</p></div></section></div>;
}

function Tracking() {
 return <section className="panel p-4"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-extrabold">أحمد محمد العتيبي</h2><p className="text-[10px] text-muted-foreground">محاسب · طلب #1025</p></div><StatusPill status="تم التعيين"/></div><div className="overflow-x-auto"><div className="flex min-w-[720px] items-start">{hiringTimeline.map((x,i)=><div key={x.label} className="relative flex flex-1 flex-col items-center text-center after:absolute after:right-1/2 after:top-4 after:-z-0 after:h-px after:w-full after:bg-success last:after:hidden"><span className={`z-10 grid h-8 w-8 place-items-center rounded-full ${i===5?"bg-primary":"bg-success"} text-primary-foreground`}><Check size={15}/></span><b className="mt-2 text-[10px]">{x.label}</b><small className="text-muted-foreground">{x.date}</small></div>)}</div></div></section>;
}

function Reports() {
 const bars=[84,62,42,18,10];
 return <><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{recruitmentStats.map((s)=><StatCard key={s.label} {...s}/>)}</section><section className="mt-3 grid gap-3 lg:grid-cols-2"><div className="panel p-4"><h2 className="text-sm font-extrabold">مصادر الطلبات</h2><div className="mt-5 flex h-44 items-end justify-around gap-4 border-b border-border">{bars.map((h,i)=><div key={h} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px]">{[43,28,14,9,6][i]}%</span><div className="w-full max-w-12 rounded-t-sm bg-primary" style={{height:`${h}%`}}/><small className="text-center text-[8px] text-muted-foreground">{["بوابة التوظيف","لينكد إن","ترشيح موظف","الموقع","أخرى"][i]}</small></div>)}</div></div><div className="panel p-4"><h2 className="text-sm font-extrabold">حالة الطلبات</h2><div className="grid min-h-52 place-items-center"><div className="report-ring"><strong>128</strong><span>طلب</span></div><div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px]">{["مكتمل 32%","قيد الفرز 34%","جديد 14%","مرفوض 16%"].map(x=><span key={x}>● {x}</span>)}</div></div></div></section></>;
}

function Registration() {
 return <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]"><section className="panel p-4"><CandidateHeader/><InfoGrid items={[["الرقم الوظيفي","EMP-1025"],["تاريخ المباشرة","2025/10/01"],["الإدارة","المالية"],["المسمى الوظيفي","محاسب"],["الراتب الأساسي","8,000 ريال"],["إجمالي الراتب","9,500 ريال"]]}/><div className="mt-4 rounded-md border border-success/30 bg-success-soft p-3 text-center text-[10px] font-bold text-success">تم إضافة الموظف إلى النظام بنجاح</div></section><section className="panel p-4"><h2 className="text-sm font-extrabold">الأنظمة المرتبطة</h2>{employeeSystems.map(x=><div key={x} className="mt-2 flex items-center justify-between border-b border-border py-2 text-[10px]"><span>{x}</span><CheckCircle2 className="text-success" size={16}/></div>)}</section></div>;
}

function CandidateHeader(){return <div className="flex items-center gap-3"><span className="avatar h-12 w-12">أع</span><div><b className="text-xs">أحمد محمد العتيبي</b><p className="text-[9px] text-muted-foreground">محاسب · طلب توظيف #1025</p></div></div>}
function CandidateSummary(){return <aside className="panel p-4"><CandidateHeader/><div className="mt-4"><StatusPill status="مرشح مختار"/></div><InfoGrid items={[["رقم الطلب","#1025"],["تاريخ التقديم","2025/09/23"],["المسمى الوظيفي","محاسب"]]}/></aside>}
function DocumentRow({title}:{title:string}){return <div className="flex items-center justify-between rounded-md border border-border p-3 text-[10px]"><span className="flex items-center gap-2"><FileText className="text-primary" size={16}/>{title}</span><Button size="icon" variant="ghost" aria-label={`تنزيل ${title}`}><Download/></Button></div>}
function InfoGrid({items}:{items:readonly (readonly [string,string])[]}){return <div className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">{items.map(([k,v])=><div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] border-b border-border pb-2 text-[10px]"><span className="text-muted-foreground">{k}</span><b>{v}</b></div>)}</div>}
function FormGrid({fields}:{fields:readonly (readonly [string,string])[]}){return <div className="grid gap-3 sm:grid-cols-2">{fields.map(([k,v])=><label key={k} className="text-[10px] font-bold">{k}<div className="mt-1 flex h-9 items-center justify-between rounded-md border border-input px-3 font-normal"><span>{v}</span><ChevronDown size={13}/></div></label>)}</div>}
function StatusPill({status}:{status:string}){const bad=status.includes("مرفوض")||status==="رفض";const waiting=status.includes("الفرز")||status.includes("المراجعة");return <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-bold ${bad?"bg-destructive/10 text-destructive":waiting?"bg-warning-soft text-warning":"bg-success-soft text-success"}`}>{status}</span>}
function FlowNavigation({step}:{step:StepId}){const i=recruitmentSteps.findIndex(x=>x.id===step);return <div className="mt-3 flex justify-between"><div>{i>0&&<Button variant="outline" asChild><Link to={paths[recruitmentSteps[i-1].id]}><ArrowRight/>السابق</Link></Button>}</div><div>{i<recruitmentSteps.length-1&&<Button asChild><Link to={paths[recruitmentSteps[i+1].id]}>التالي<ArrowLeft/></Link></Button>}</div></div>}