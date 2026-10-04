import { Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Bell, CalendarDays, ChevronLeft, Database, FileCheck2, FileText, Headset, ReceiptText, Settings, TrendingUp, UserPlus, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import office from "@/assets/dashboard-office.jpg";
import hr from "@/assets/dashboard-hr.jpg";
import finance from "@/assets/dashboard-finance.jpg";
import service from "@/assets/dashboard-service.jpg";

const box = "min-w-0 rounded border border-border bg-card shadow-sm";
const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];
const employeeData = months.map((month, i) => ({ month, employees: [210, 240, 275, 290, 320, 350][i], new: [145, 160, 175, 185, 197, 210][i], leaving: [62, 65, 69, 72, 78, 82][i] }));
const financeData = months.map((month, i) => ({ month, expense: [350, 400, 430, 465, 530, 660][i], due: [150, 175, 225, 350, 365, 480][i] }));
const ticketData = [{ name: "مغلقة", value: 119, color: "var(--success)" }, { name: "بانتظار العميل", value: 24, color: "var(--primary)" }, { name: "قيد المعالجة", value: 68, color: "var(--finance-orange)" }, { name: "مفتوحة", value: 37, color: "var(--finance-purple)" }];
const systems = [
  { title: "الموارد البشرية", description: "إدارة الموظفين والرواتب والتوظيف والتقييم", image: hr, path: "/hr" as const, icon: Users, tone: "text-buy-violet" },
  { title: "الشؤون المالية", description: "إدارة المعاملات المالية والميزانيات والمصروفات", image: finance, path: "/finance" as const, icon: Database, tone: "text-primary" },
  { title: "خدمة العملاء", description: "إدارة تذاكر العملاء وتحسين تجربة الخدمة", image: service, path: "/customer-service/inbox" as const, icon: Headset, tone: "text-success" },
];
const stats = [
  { title: "الطلبات والموافقات", number: "45", sub: <>بانتظار الموافقة <b>12</b> | مكتمل <b>33</b></>, icon: CalendarDays, tone: "text-warning", soft: "bg-warning-soft" },
  { title: "عدد الموظفين", number: "312", sub: <>سعودي <b>182</b> | غير سعودي <b>130</b></>, icon: Users, tone: "text-buy-violet", soft: "bg-buy-violet-soft" },
  { title: "المعاملات المالية", number: "1,285", sub: <>مصروف <b>920</b> | مستحق <b>365</b></>, icon: ReceiptText, tone: "text-primary", soft: "bg-primary-soft" },
  { title: "تذاكر العملاء", number: "248", sub: <>مفتوح <b>37</b> | مغلق <b>211</b></>, icon: Headset, tone: "text-success", soft: "bg-success-soft" },
];
const quick = [
  { title: "تذكرة جديدة", icon: Headset, to: "/customer-service/inbox" as const, tone: "text-success", soft: "bg-success-soft" },
  { title: "سند صرف جديد", icon: ReceiptText, to: "/finance/payment-orders" as const, tone: "text-primary", soft: "bg-primary-soft" },
  { title: "إضافة موظف", icon: UserPlus, to: "/employees/profile" as const, tone: "text-buy-violet", soft: "bg-buy-violet-soft" },
  { title: "الإعدادات", icon: Settings, to: "/settings" as const, tone: "text-buy-navy", soft: "bg-muted" },
  { title: "المستندات", icon: FileText, to: "/documents" as const, tone: "text-primary", soft: "bg-primary-soft" },
  { title: "التقارير", icon: TrendingUp, to: "/reports/financial" as const, tone: "text-warning", soft: "bg-warning-soft" },
];
const activity = [
  { time: "10:25 ص", person: "أحمد العتيبي", action: "اعتماد سند صرف", program: "المالية", tone: "bg-primary-soft text-primary" },
  { time: "09:40 ص", person: "سارة القحطاني", action: "إضافة موظف جديد", program: "الموارد البشرية", tone: "bg-buy-violet-soft text-buy-violet" },
  { time: "09:15 ص", person: "خالد الشهري", action: "إغلاق تذكرة عميل", program: "خدمة العملاء", tone: "bg-success-soft text-success" },
  { time: "08:50 ص", person: "نورة المطيري", action: "تحديث بيانات موظف", program: "الموارد البشرية", tone: "bg-buy-violet-soft text-buy-violet" },
];
const alerts = [
  { program: "الموارد البشرية", action: "طلب توظيف جديد بانتظار الموافقة", time: "منذ 10 دقائق", tone: "bg-warning-soft text-warning" },
  { program: "المالية", action: "سند صرف بانتظار الاعتماد", time: "منذ 30 دقيقة", tone: "bg-primary-soft text-primary" },
  { program: "خدمة العملاء", action: "تذكرة جديدة من عميل", time: "منذ ساعة", tone: "bg-success-soft text-success" },
  { program: "الموارد البشرية", action: "قرب انتهاء عقد موظف", time: "منذ 3 ساعات", tone: "bg-buy-violet-soft text-buy-violet" },
];
function More({ to, children }: { to: "/hr" | "/finance" | "/customer-service/rating" | "/activity-log" | "/notifications"; children: string }) { return <Link to={to} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">{children}<ChevronLeft size={12}/></Link>; }

export function HomeDashboard() {
  return <AppShell><main dir="rtl" className="min-w-0 space-y-2 bg-background px-3 py-3 md:px-5">
    <section className="relative min-h-[112px] overflow-hidden rounded border border-border bg-primary-soft sm:min-h-[120px]"><img src={office} alt="مكتب تكامل بلس" className="absolute inset-0 h-full w-full object-cover object-left"/><div className="absolute inset-0 bg-gradient-to-l from-primary-soft via-primary-soft/90 to-transparent"/><div className="relative flex min-h-[112px] flex-col justify-center gap-2 p-4 sm:min-h-[120px] sm:flex-row sm:items-center sm:justify-between"><div className="max-w-sm"><p className="text-sm font-extrabold text-buy-navy">مرحبًا بك في</p><h1 className="text-2xl font-black text-buy-navy sm:text-3xl">تكامل بلس</h1><p className="mt-1 text-[10px] text-buy-navy">نظام متكامل لإدارة الموارد البشرية والمالية وخدمة العملاء</p></div><div className="hidden items-center gap-1 sm:flex"><span className="rounded bg-buy-navy px-3 py-1 text-[10px] text-primary-foreground">لديك صلاحية الوصول إلى</span><div className="flex gap-1">{systems.map((s) => <Link key={s.title} to={s.path} className="rounded border border-border bg-card px-2 py-1 text-[10px] font-bold text-buy-navy">✓ {s.title}</Link>)}</div></div></div></section>
    <div className="grid gap-2 md:grid-cols-3">{systems.map((s) => <section key={s.title} className="relative min-h-32 overflow-hidden rounded bg-buy-navy sm:min-h-36"><img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-l from-buy-navy/85 via-buy-navy/40 to-transparent"/><div className="relative flex h-full flex-col items-start justify-between p-3 text-primary-foreground"><div><h2 className="flex items-center gap-2 text-base font-extrabold"><s.icon size={22}/>{s.title}</h2><p className="mt-1 text-[10px]">{s.description}</p></div><Link to={s.path} className="mt-3 inline-flex min-w-36 items-center justify-between gap-3 rounded-full bg-card px-3 py-1.5 text-[10px] font-extrabold text-buy-navy">الدخول إلى {s.title}<ChevronLeft size={12}/></Link></div></section>)}</div>
    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">{stats.map((s) => <div key={s.title} className={`${box} flex min-h-20 items-center justify-between gap-1 px-2.5 py-2`}><div className="min-w-0"><h2 className="text-[10px] font-extrabold text-buy-navy">{s.title}</h2><p className={`text-xl font-extrabold ${s.tone}`}>{s.number}</p><p className="text-[9px] text-muted-foreground">{s.sub}</p></div><span className={`grid size-10 shrink-0 place-items-center rounded-full ${s.soft} ${s.tone}`}><s.icon size={22}/></span></div>)}</div>
    <div className="grid min-w-0 gap-2 xl:grid-cols-3">
      <section className={`${box} p-3`}><h2 className="flex items-center gap-1 text-xs font-extrabold text-buy-navy"><Users size={14}/>حركة الموظفين</h2><div className="h-40 w-full" dir="ltr"><ResponsiveContainer width="100%" height="100%"><AreaChart data={employeeData} margin={{ top: 14, right: 8, left: -30, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="month" tick={{ fontSize: 9 }}/><YAxis tick={{ fontSize: 9 }}/><Tooltip/><Area type="monotone" dataKey="employees" name="الموظفون" stroke="var(--primary)" fill="var(--primary-soft)" isAnimationActive={false}/><Area type="monotone" dataKey="new" name="الجدد" stroke="var(--success)" fill="transparent" isAnimationActive={false}/><Area type="monotone" dataKey="leaving" name="المغادرون" stroke="var(--destructive)" fill="transparent" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><More to="/hr">عرض تقارير الموارد البشرية</More></section>
      <section className={`${box} p-3`}><h2 className="flex items-center gap-1 text-xs font-extrabold text-buy-navy"><Database size={14}/>المصروفات المالية</h2><div className="h-40 w-full" dir="ltr"><ResponsiveContainer width="100%" height="100%"><BarChart data={financeData} margin={{ top: 14, right: 8, left: -30, bottom: 0 }}><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="month" tick={{ fontSize: 9 }}/><YAxis tick={{ fontSize: 9 }}/><Tooltip/><Bar dataKey="expense" name="المصروفات" fill="var(--primary)" isAnimationActive={false}/><Bar dataKey="due" name="المستحقات" fill="var(--success)" isAnimationActive={false}/></BarChart></ResponsiveContainer></div><More to="/finance">عرض التقرير المالي</More></section>
      <section className={`${box} p-3`}><h2 className="flex items-center gap-1 text-xs font-extrabold text-buy-navy"><Headset size={14}/>مؤشرات خدمة العملاء</h2><div className="flex h-40 items-center gap-1"><div className="relative h-36 min-w-0 flex-1" dir="ltr"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ticketData} innerRadius="58%" outerRadius="85%" dataKey="value" stroke="none" isAnimationActive={false}>{ticketData.map((t) => <Cell key={t.name} fill={t.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-base text-buy-navy">248</strong><span className="text-[9px]">تذكرة</span></div></div><div className="w-28 space-y-2 text-[9px]">{ticketData.map((t) => <div key={t.name} className="flex justify-between gap-1"><span>{t.name}</span><b>{t.value}</b></div>)}</div></div><More to="/customer-service/rating">عرض تفاصيل خدمة العملاء</More></section>
    </div>
    <div className="grid min-w-0 gap-2 xl:grid-cols-[1fr_1fr_0.9fr]"><section className={`${box} p-3`}><h2 className="mb-2 flex items-center gap-1 text-xs font-extrabold text-buy-navy"><TrendingUp size={14}/>الوصول السريع</h2><div className="grid grid-cols-3 gap-1.5">{quick.map((q) => <Link key={q.title} to={q.to} className={`${q.soft} flex min-h-14 flex-col items-center justify-center gap-1 rounded p-1 text-center text-[9px] font-bold text-buy-navy`}><q.icon className={q.tone} size={18}/>{q.title}</Link>)}</div></section>
    <section className={`${box} p-3`}><div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-1 text-xs font-extrabold text-buy-navy"><FileCheck2 size={14}/>أحدث العمليات في النظام</h2><More to="/activity-log">عرض الكل</More></div><div className="overflow-x-auto"><table className="w-full min-w-[300px] text-right text-[9px]"><thead className="bg-primary-soft"><tr>{["الوقت", "المستخدم", "العملية", "البرنامج"].map((h) => <th key={h} className="px-1 py-1">{h}</th>)}</tr></thead><tbody>{activity.map((a) => <tr key={a.time} className="border-b border-border"><td className="whitespace-nowrap px-1 py-1.5">{a.time}</td><td className="whitespace-nowrap px-1 py-1.5">{a.person}</td><td className="whitespace-nowrap px-1 py-1.5">{a.action}</td><td className="px-1 py-1.5"><span className={`${a.tone} whitespace-nowrap rounded px-1`}>{a.program}</span></td></tr>)}</tbody></table></div></section>
    <section className={`${box} p-3`}><div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-1 text-xs font-extrabold text-buy-navy"><Bell size={14}/>المهام والتنبيهات الأخيرة</h2><More to="/notifications">عرض الكل</More></div><div>{alerts.map((a) => <div key={a.action} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5 border-b border-border py-1.5 text-[9px]"><span className={`${a.tone} rounded px-1 py-0.5`}>{a.program}</span><span className="truncate">{a.action}</span><span className="whitespace-nowrap text-muted-foreground">{a.time}</span></div>)}</div></section></div>
  </main></AppShell>;
}
