import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleUserRound,
  Clock3, Eye, FilePenLine, FileText, Search, ShieldCheck, SlidersHorizontal,
  Stethoscope, UserRoundCheck, UserRoundCog, UsersRound, X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { registrationRequestRows, registrationRequestStats, registrationTypeStats } from "@/data/mockData";
import ahmedImage from "@/assets/candidate-ahmed.jpg";
import saraImage from "@/assets/candidate-sara.jpg";
import khaledImage from "@/assets/candidate-khaled.jpg";
import reemImage from "@/assets/candidate-reem.jpg";
import doctorImage from "@/assets/registration-doctor.jpg";

type RegistrationRow = (typeof registrationRequestRows)[number];
const avatars = [doctorImage, saraImage, khaledImage, reemImage, ahmedImage, reemImage, khaledImage, saraImage];
const tones = {
  blue: "bg-primary-soft text-primary", red: "bg-destructive/10 text-destructive",
  amber: "bg-warning-soft text-warning", green: "bg-success-soft text-success",
  violet: "bg-buy-violet-soft text-buy-violet",
} as const;

export function RegistrationRequestsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [kind, setKind] = useState("");
  const rows = useMemo(() => registrationRequestRows.filter((row) =>
    (!query || `${row.name} ${row.email} ${row.phone} ${row.id}`.includes(query)) &&
    (!status || row.status === status) && (!kind || row.type === kind)
  ), [query, status, kind]);

  return <AppShell><main dir="rtl" className="registration-dashboard"><div className="mx-auto max-w-[1450px]">
    <section className="flex min-h-20 items-end px-1 pb-2 sm:min-h-24">
      <div><h1 className="text-2xl font-black text-buy-navy sm:text-3xl">طلبات التسجيل الجديدة</h1><p className="mt-1 max-w-xl text-xs font-semibold text-buy-navy sm:text-sm">مراجعة طلبات تسجيل المستخدمين وتحديد نوع الحساب المناسب لهم</p></div>
    </section>

    <section className="registration-statistics">
      {registrationRequestStats.map((stat) => <div key={stat.label} className={`rounded-md border border-current/10 p-3 ${tones[stat.tone]}`}><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-full bg-card/70">{stat.tone === "green" ? <CheckCircle2 /> : stat.tone === "red" ? <X /> : stat.tone === "amber" ? <Clock3 /> : <FileText />}</span><div className="text-left"><b className="text-3xl font-black">{stat.value}</b><span className="mr-2 text-xs">{stat.percent}</span></div></div><h2 className="mt-2 text-sm font-extrabold">{stat.label}</h2><Link to="/recruitment/requests" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold">عرض التفاصيل <ChevronLeft className="size-3" /></Link></div>)}
      <div className="rounded-md border border-border bg-card p-3"><h2 className="text-center text-sm font-extrabold">حسب نوع التسجيل</h2><div className="mt-3 grid grid-cols-3 gap-1">{registrationTypeStats.map((stat) => <div key={stat.label} className={`rounded-md p-2 text-center ${tones[stat.tone]}`}><span className="mx-auto grid size-9 place-items-center rounded-full bg-card/70">{stat.tone === "blue" ? <UsersRound /> : stat.tone === "amber" ? <UserRoundCog /> : <Stethoscope />}</span><b className="mt-1 block text-lg">{stat.value}</b><span className="block text-[8px] font-bold">{stat.label}</span></div>)}</div></div>
      <div className="registration-total"><div className="registration-total-labels"><h2>إجمالي الطلبات <b>64</b></h2><ul>{[...registrationRequestStats].reverse().map((stat) => <li key={stat.label}><i className={stat.tone === "green" ? "bg-success" : stat.tone === "red" ? "bg-destructive" : stat.tone === "amber" ? "bg-warning" : "bg-primary"}/>{stat.label === "المعتمدون" ? "معتمد" : stat.label === "المرفوضون" ? "مرفوض" : stat.label}<b>{stat.value}</b></li>)}</ul></div><div className="registration-ring"><UsersRound className="size-7 text-buy-navy"/><span className="ring-green">38%</span><span className="ring-amber">19%</span><span className="ring-red">12%</span><span className="ring-blue">31%</span></div></div>
    </section>

    <section className="mt-2 min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="registration-filters">
        <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-border px-3"><Search className="size-5 shrink-0 text-muted-foreground"/><input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-xs outline-none" placeholder="البحث بالاسم أو رقم الجوال أو البريد الإلكتروني أو رقم الطلب" /></label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border border-border bg-card px-3 text-xs"><option value="">حالة الطلب: الكل</option>{registrationRequestStats.map((stat) => <option key={stat.label}>{stat.label}</option>)}</select>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="h-10 rounded-md border border-border bg-card px-3 text-xs"><option value="">نوع التسجيل: الكل</option>{registrationTypeStats.map((stat) => <option key={stat.label}>{stat.label}</option>)}</select>
        <label className="flex h-10 items-center gap-2 rounded-md border border-border px-3 text-xs text-muted-foreground"><CalendarDays className="size-4"/>تاريخ التسجيل من - إلى</label>
        <Button className="h-10"><SlidersHorizontal />تصفية متقدمة</Button>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-center text-[10px]"><thead className="bg-primary-soft/70 text-buy-navy"><tr>{["#","اسم المستخدم","البريد الإلكتروني","رقم الجوال","نوع التسجيل","تاريخ التسجيل","الحالة","سبب الرفض","الإجراءات"].map((head) => <th key={head} className="border-b border-border px-2 py-3 font-extrabold">{head}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id} className="border-b border-border last:border-0"><td className="p-2">{index + 1}</td><td className="p-2"><div className="flex items-center gap-2 text-right"><img src={avatars[index] ?? ahmedImage} width={816} height={816} loading="lazy" alt="" className="size-9 shrink-0 rounded-full object-cover"/><div><b className="block text-[11px]">{row.name}</b><span className="text-[8px] text-muted-foreground">{row.job}</span></div></div></td><td className="p-2" dir="ltr">{row.email}</td><td className="p-2" dir="ltr">{row.phone}</td><td className="p-2"><TypeBadge type={row.type}/></td><td className="whitespace-pre-line p-2">{row.registered.replace(" ", "\n")}</td><td className="p-2"><StatusBadge status={row.status}/></td><td className="max-w-32 p-2 text-destructive">{row.reason}</td><td className="p-2"><div className="flex justify-center gap-1"><Button asChild size="icon" variant="secondary" className="size-8 text-primary"><Link to="/recruitment/requests/$requestId" params={{ requestId: row.id }} aria-label={`عرض ${row.name}`}><Eye/></Link></Button><Button size="icon" className="size-8 bg-success" aria-label="موافقة"><Check/></Button><Button size="icon" variant="destructive" className="size-8" aria-label="رفض"><X/></Button><Button size="icon" className="size-8" aria-label="تعديل"><FilePenLine/></Button></div></td></tr>)}</tbody></table></div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border p-3 text-xs"><b>إجمالي الطلبات: 64</b><div className="flex items-center gap-1"><Button size="icon" variant="ghost"><ChevronRight/></Button><Button size="sm">1</Button>{[2,3,4].map((n) => <Button key={n} size="sm" variant="ghost">{n}</Button>)}<Button size="icon" variant="ghost"><ChevronLeft/></Button></div></div>
    </section>
  </div></main></AppShell>;
}

function TypeBadge({ type }: { type: string }) { const cls = type === "مدير" ? tones.amber : type.includes("الموظفين") ? tones.blue : tones.violet; return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-bold ${cls}`}>{type === "مدير" ? <UserRoundCog className="size-3"/> : type.includes("الموظفين") ? <UsersRound className="size-3"/> : <Stethoscope className="size-3"/>}{type}</span>; }
function StatusBadge({ status }: { status: string }) { const cls = status === "معتمد" ? tones.green : status === "مرفوض" ? tones.red : status === "قيد الانتظار" ? tones.amber : tones.blue; return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-bold ${cls}`}>{status === "معتمد" ? <CheckCircle2 className="size-3"/> : status === "مرفوض" ? <X className="size-3"/> : status === "قيد الانتظار" ? <Clock3 className="size-3"/> : <FileText className="size-3"/>}{status}</span>; }

export function getRegistrationRequest(id: string): RegistrationRow | undefined { return registrationRequestRows.find((row) => row.id === id); }