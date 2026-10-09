import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, Building2, Check, Clock3, FileText, Flag, IdCard, Mail, MapPin, MessageSquareText, Phone, RotateCcw, ShieldCheck, UserRound, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getRegistrationRequest } from "@/components/registration-requests";
import { Route } from "@/routes/recruitment.requests.$requestId";
import ahmedImage from "@/assets/candidate-ahmed.jpg";
import idCardImage from "@/assets/registration-id-card.jpg";

const panel = "rounded-md border border-border bg-card shadow-sm";
const tabs = ["بيانات المستخدم", "المستندات", "السجل والإجراءات"] as const;

export function RegistrationRequestDetailsPage() {
  const { requestId } = Route.useParams();
  const row = getRegistrationRequest(requestId);
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [action, setAction] = useState("");
  if (!row) return <AppShell><main dir="rtl" className="grid min-h-[70vh] place-items-center p-4"><div className="text-center"><h1 className="text-xl font-black">الطلب غير موجود</h1><Button asChild className="mt-4"><Link to="/recruitment/requests">العودة للطلبات</Link></Button></div></main></AppShell>;
  const info = [
    [UserRound, "الاسم الكامل", row.name], [IdCard, "رقم الهوية", row.identity], [Flag, "الجنسية", row.nationality], [Clock3, "تاريخ الميلاد", row.birth],
    [Mail, "البريد الإلكتروني", row.email], [Phone, "رقم الجوال", row.phone], [BriefcaseBusiness, "نوع الحساب", row.account], [Building2, "جهة العمل", row.employer],
    [ShieldCheck, "رقم التصنيف المهني", row.classification], [MapPin, "العنوان", row.address],
  ] as const;
  return <AppShell><main dir="rtl" className="min-w-0 p-3 sm:p-5"><div className="mx-auto max-w-[1380px]">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div className="min-w-0"><Link to="/recruitment/requests" className="inline-flex items-center gap-1 text-xs font-bold text-primary"><ArrowRight className="size-4"/>العودة إلى طلبات التسجيل</Link><h1 className="mt-1 truncate text-xl font-black text-buy-navy sm:text-2xl">تفاصيل طلب التسجيل</h1><p className="text-xs text-muted-foreground">رقم الطلب: {row.id}</p></div><span className="rounded-full bg-warning-soft px-4 py-2 text-xs font-bold text-warning">{row.status}</span></div>
    <section className={`${panel} mt-4 grid items-center gap-4 p-4 md:grid-cols-[auto_1fr_auto]`}><img src={ahmedImage} width={816} height={816} alt={row.name} className="size-20 rounded-full border-4 border-primary-soft object-cover"/><div><h2 className="text-lg font-black">{row.name}</h2><p className="text-sm text-muted-foreground">{row.job}</p><div className="mt-2 flex flex-wrap gap-4 text-xs"><span className="inline-flex items-center gap-1"><Mail className="size-4 text-primary"/>{row.email}</span><span className="inline-flex items-center gap-1"><Phone className="size-4 text-primary"/><bdi>{row.phone}</bdi></span></div></div><div className="rounded-md bg-primary-soft p-3 text-center"><span className="text-xs text-muted-foreground">تاريخ تقديم الطلب</span><b className="mt-1 block text-sm">{row.registered}</b></div></section>
    {action && <p className="mt-3 rounded-md border border-success/20 bg-success-soft p-3 text-sm font-bold text-success">{action} — إجراء توضيحي غير محفوظ.</p>}
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] [direction:ltr]">
      <section dir="rtl" className={panel}><nav className="flex overflow-x-auto border-b border-border px-4">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`shrink-0 border-b-2 px-5 py-4 text-sm font-bold ${tab === item ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{item}</button>)}</nav>
        {tab === "بيانات المستخدم" && <div className="p-4"><h2 className="flex items-center gap-2 text-base font-black"><UserRound className="text-primary"/>البيانات الأساسية</h2><div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">{info.map(([Icon,label,value]) => <div key={label} className="flex min-w-0 items-center gap-3 bg-card p-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="size-4"/></span><div className="min-w-0"><span className="block text-[10px] text-muted-foreground">{label}</span><b className="block truncate text-xs">{value}</b></div></div>)}</div><h2 className="mt-5 flex items-center gap-2 text-base font-black"><MessageSquareText className="text-primary"/>ملاحظات المستخدم</h2><p className="mt-2 rounded-md bg-muted/50 p-4 text-xs leading-6">{row.note}</p><h2 className="mt-5 flex items-center gap-2 text-base font-black"><MessageSquareText className="text-warning"/>ملاحظات الإدارة</h2><textarea className="mt-2 min-h-24 w-full rounded-md border border-border p-3 text-xs outline-none focus:border-primary" placeholder="أضف ملاحظة إدارية حول الطلب..." /></div>}
        {tab === "المستندات" && <div className="grid gap-4 p-4 sm:grid-cols-2"><DocumentCard title="صورة الهوية الوطنية"/><DocumentCard title="بطاقة التصنيف المهني"/></div>}
        {tab === "السجل والإجراءات" && <div className="p-5"><div className="border-r-2 border-primary/30 pr-5"><b className="text-sm">تم تقديم طلب التسجيل</b><p className="mt-1 text-xs text-muted-foreground">{row.registered}</p><p className="mt-3 rounded-md bg-primary-soft p-3 text-xs">الطلب بانتظار مراجعة واعتماد الإدارة المختصة.</p></div></div>}
      </section>
      <aside dir="rtl" className="space-y-4"><section className={`${panel} p-4`}><h2 className="text-base font-black">حالة الطلب</h2><div className="mt-3 rounded-md bg-warning-soft p-4 text-center text-warning"><Clock3 className="mx-auto size-10"/><b className="mt-2 block">{row.status}</b><span className="text-[10px]">يحتاج إلى اتخاذ إجراء</span></div><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between"><dt className="text-muted-foreground">نوع التسجيل</dt><dd className="font-bold">{row.type}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">رقم الطلب</dt><dd className="font-bold">{row.id}</dd></div></dl></section><section className={`${panel} p-4`}><h2 className="text-base font-black">صورة الهوية الوطنية</h2><img src={idCardImage} width={1200} height={760} alt="نموذج توضيحي لبطاقة الهوية" className="mt-3 w-full rounded-md border border-border"/><p className="mt-2 text-center text-[9px] text-muted-foreground">صورة توضيحية وليست مستندًا حقيقيًا</p></section></aside>
    </div>
    <section className={`${panel} mt-4 grid gap-2 p-4 sm:grid-cols-3`}><Button onClick={() => setAction("تمت الموافقة على الطلب")} className="h-11 bg-success"><Check/>الموافقة على الطلب</Button><Button onClick={() => setAction("تم رفض الطلب")} variant="destructive" className="h-11"><X/>رفض الطلب</Button><Button onClick={() => setAction("تمت إعادة الطلب للتعديل")} variant="outline" className="h-11"><RotateCcw/>إعادة للتعديل</Button></section>
  </div></main></AppShell>;
}

function DocumentCard({ title }: { title: string }) { return <article className="rounded-md border border-border p-3"><div className="relative overflow-hidden rounded-md bg-muted"><img src={idCardImage} width={1200} height={760} alt={title} className="aspect-[1.58] w-full object-cover"/></div><div className="mt-2 flex items-center justify-between"><b className="text-xs">{title}</b><Button size="sm" variant="ghost"><FileText/>عرض</Button></div></article>; }