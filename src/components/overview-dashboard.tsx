import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, CalendarDays, Check, Database, FilePlus2, FileText, BarChart3, Headset, History, ReceiptText, Settings, UserRoundPlus, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import office from "@/assets/overview-banner.jpg";
import hrImg from "@/assets/dashboard-hr.jpg";
import finImg from "@/assets/dashboard-finance.jpg";
import srvImg from "@/assets/dashboard-service.jpg";

const panel = "min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm";

const systems = [
  { title: "الموارد البشرية", desc: "إدارة الموظفين والرواتب والتوظيف والتقييم", btn: "الدخول إلى الموارد البشرية", icon: Users, img: hrImg, bg: "from-buy-violet to-buy-violet/70", to: "/hr" },
  { title: "الشؤون المالية", desc: "إدارة المعاملات المالية والميزانيات والمصروفات", btn: "الدخول إلى المالية", icon: Database, img: finImg, bg: "from-primary to-primary/70", to: "/finance" },
  { title: "خدمة العملاء", desc: "إدارة تذاكر العملاء وتحسين تجربة الخدمة", btn: "الدخول إلى خدمة العملاء", icon: Headset, img: srvImg, bg: "from-success to-success/70", to: "/customer-service" },
] as const;

const kpis = [
  { title: "الطلبات والموافقات", value: "45", icon: CalendarDays, tone: "bg-warning-soft text-warning", card: "from-warning-soft", num: "text-warning", sub: [["بانتظار الموافقة", "12", ""], ["مكتمل", "33", "text-success"]] },
  { title: "عدد الموظفين", value: "312", icon: Users, tone: "bg-buy-violet-soft text-buy-violet", card: "from-buy-violet-soft", num: "text-buy-navy", sub: [["سعودي", "182", ""], ["غير سعودي", "130", ""]] },
  { title: "المعاملات المالية", value: "1,285", icon: FileText, tone: "bg-primary-soft text-primary", card: "from-primary-soft", num: "text-primary", sub: [["مصروف", "920", ""], ["مستحق", "365", "text-primary"]] },
  { title: "تذاكر العملاء", value: "248", icon: Headset, tone: "bg-success-soft text-success", card: "from-success-soft", num: "text-buy-navy", sub: [["مفتوح", "277", "text-destructive"], ["مغلق", "211", ""]] },
] as const;

const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];
const staff = [210, 230, 250, 280, 305, 330];
const hires = [60, 75, 90, 110, 125, 140];
const leavers = [20, 22, 25, 28, 30, 35];
const spend = [330, 380, 420, 450, 520, 690];
const due = [160, 260, 290, 300, 350, 500];

const tickets = [
  { label: "مفتوحة", value: 37, pct: 15, color: "var(--primary)" },
  { label: "قيد المعالجة", value: 68, pct: 27, color: "var(--warning)" },
  { label: "بانتظار العميل", value: 24, pct: 10, color: "var(--home-yellow)" },
  { label: "مغلقة", value: 119, pct: 48, color: "var(--success)" },
];

const recent = [
  ["10:25 ص", "أ. أحمد العتيبي", "اعتماد سند صرف", "المالية"],
  ["09:40 ص", "د. سارة القحطاني", "إضافة موظف جديد", "الموارد البشرية"],
  ["09:15 ص", "خالد الشهري", "إغلاق تذكرة عميل", "خدمة العملاء"],
  ["08:50 ص", "أ. نورة المطيري", "تحديث بيانات موظف", "الموارد البشرية"],
] as const;

const tasks = [
  ["الموارد البشرية", "طلب توظيف جديد بانتظار الموافقة", "منذ 10 دقائق"],
  ["المالية", "سند صرف بانتظار الاعتماد", "منذ 30 دقيقة"],
  ["خدمة العملاء", "تذكرة جديدة من عميل", "منذ ساعة"],
  ["الموارد البشرية", "قرب انتهاء عقد موظف", "منذ 3 ساعات"],
] as const;

const tag = (s: string) => s === "المالية" ? "bg-primary-soft text-primary" : s === "خدمة العملاء" ? "bg-success-soft text-success" : s === "الموارد البشرية" ? "bg-buy-violet-soft text-buy-violet" : "bg-warning-soft text-warning";

const quick = [
  { label: "تذكرة جديدة", icon: Headset, to: "/customer-service/inbox", tone: "bg-success-soft text-success" },
  { label: "سند صرف جديد", icon: ReceiptText, to: "/finance/payment-orders", tone: "bg-primary-soft text-primary" },
  { label: "إضافة موظف", icon: UserRoundPlus, to: "/employees/new", tone: "bg-buy-violet-soft text-buy-violet" },
  { label: "الإعدادات", icon: Settings, to: "/settings", tone: "bg-buy-violet-soft text-buy-navy" },
  { label: "المستندات", icon: FilePlus2, to: "/employees/documents", tone: "bg-primary-soft text-primary" },
  { label: "التقارير", icon: BarChart3, to: "/reports/hr", tone: "bg-warning-soft text-warning" },
] as const;

function Title({ icon: Icon, text, more }: { icon: typeof Users; text: string; more?: boolean }) {
  return <div className="mb-3 flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-sm font-extrabold text-buy-navy"><Icon size={17} />{text}</h2>{more && <button type="button" className="text-[11px] text-muted-foreground hover:text-primary">عرض الكل</button>}</div>;
}
function Legend({ items }: { items: [string, string][] }) {
  return <div className="mb-2 flex flex-wrap justify-center gap-4 text-[11px] text-buy-navy">{items.map(([l, c]) => <span key={l} className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: c }} />{l}</span>)}</div>;
}
function Axis({ max, ticks }: { max: number; ticks: string[] }) {
  return <>{ticks.map((t, i) => { const y = 10 + (i * 100) / (ticks.length - 1); return <g key={t}><line x1="40" x2="350" y1={y} y2={y} stroke="var(--border)" /><text x="34" y={y + 3} textAnchor="end" fontSize="8" fill="var(--muted-foreground)">{t}</text></g>; })}{months.map((m, i) => <text key={m} x={60 + i * 56} y="126" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)">{m}</text>)}<desc>{max}</desc></>;
}
function LineChart() {
  const y = (v: number) => 110 - (v / 400) * 100;
  const pts = (a: number[]) => a.map((v, i) => `${60 + i * 56},${y(v)}`).join(" ");
  const series: [number[], string][] = [[staff, "var(--primary)"], [hires, "var(--success)"], [leavers, "var(--destructive)"]];
  return <svg viewBox="0 0 360 132" className="h-[150px] w-full" role="img" aria-label="حركة الموظفين"><Axis max={400} ticks={["400", "300", "200", "100", "0"]} />{series.map(([a, c]) => <g key={c}><polygon points={`60,110 ${pts(a)} 340,110`} fill={c} opacity=".1" /><polyline points={pts(a)} fill="none" stroke={c} strokeWidth="2" />{a.map((v, i) => <circle key={i} cx={60 + i * 56} cy={y(v)} r="2.2" fill={c} />)}</g>)}</svg>;
}
function BarChart() {
  const h = (v: number) => (v / 800) * 100;
  return <svg viewBox="0 0 360 132" className="h-[150px] w-full" role="img" aria-label="المصروفات المالية"><Axis max={800} ticks={["800K", "600K", "400K", "200K", "0"]} />{months.map((m, i) => <g key={m}><rect x={50 + i * 56} y={110 - h(spend[i]!)} width="9" height={h(spend[i]!)} rx="1.5" fill="var(--primary)" /><rect x={61 + i * 56} y={110 - h(due[i]!)} width="9" height={h(due[i]!)} rx="1.5" fill="var(--success)" opacity=".75" /></g>)}</svg>;
}
function Donut() {
  let s = 0;
  const seg = tickets.map((t) => { const a = s; s += t.pct; return `${t.color} ${a}% ${s}%`; }).join(",");
  return <div className="relative size-[150px] shrink-0 rounded-full" style={{ background: `conic-gradient(${seg})` }}><div className="absolute inset-[18%] grid place-items-center rounded-full bg-card text-center"><div><strong className="block text-2xl font-black text-buy-navy">248</strong><small className="text-[11px] text-buy-navy">تذكرة</small></div></div></div>;
}
function More({ text, to }: { text: string; to: "/customer-service" | "/reports/financial" | "/reports/hr" }) {
  return <Link to={to} className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-buy-navy hover:text-primary">{text}<ArrowLeft size={13} /></Link>;
}

export function OverviewDashboard() {
  return (
    <AppShell>
      <main dir="rtl" className="min-w-0 space-y-4 bg-background p-3 text-buy-navy md:p-5">
        <section className="relative overflow-hidden rounded-xl">
          <img src={office} alt="مكتب حديث مع حاسوب يعرض شعار تكاملة بلس" className="absolute inset-0 h-full w-full object-cover object-left" width={1920} height={640} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, transparent 35%, oklch(0.98 0.01 80 / 85%) 60%, oklch(0.98 0.01 80 / 95%) 100%)" }} />
          <div className="relative flex flex-col gap-4 p-5 pb-44 lg:flex-row lg:items-start lg:justify-between lg:pb-36">
            <div>
              <p className="text-2xl font-extrabold text-buy-navy">مرحباً بك في</p>
              <h1 className="text-4xl font-black text-buy-navy sm:text-5xl">تكاملة بلس</h1>
              <p className="mt-3 text-sm text-buy-navy/80">نظام متكامل لإدارة الموارد البشرية والمالية وخدمة العملاء</p>
            </div>
            <div className="flex flex-col items-start gap-2 lg:ml-[18%] lg:items-center">
              <span className="rounded-md bg-buy-navy px-4 py-1.5 text-xs font-bold text-background">لديك صلاحية الوصول إلى</span>
              <div className="flex flex-wrap gap-2">{["الموارد البشرية", "المالية", "خدمة العملاء"].map((s) => <span key={s} className="flex items-center gap-2 rounded-md bg-card px-4 py-2 text-xs font-bold shadow-sm"><Check size={14} className="rounded-full border border-success text-success" />{s}</span>)}</div>
            </div>
          </div>
        </section>

        <div className="relative z-10 -mt-44 grid gap-3 px-2 md:grid-cols-3 lg:-mt-36">
          {systems.map((s) => (
            <section key={s.title} className={`relative min-h-[170px] overflow-hidden rounded-xl bg-gradient-to-l ${s.bg} p-5 text-background shadow-lg`}>
              <img src={s.img} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover opacity-70 [mask-image:linear-gradient(to_left,transparent,black)]" />
              <div className="relative">
                <h2 className="flex items-center gap-2 text-2xl font-black"><s.icon size={26} />{s.title}</h2>
                <p className="mt-3 text-xs opacity-90">{s.desc}</p>
                <Link to={s.to} className="mt-5 flex w-full max-w-[230px] items-center justify-between rounded-full bg-card px-5 py-2.5 text-xs font-extrabold text-buy-navy">{s.btn}<ArrowLeft size={15} /></Link>
              </div>
            </section>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <section key={k.title} className={`${panel} flex items-center justify-between gap-3 bg-gradient-to-l ${k.card} to-card`}>
              <div>
                <p className="text-sm font-extrabold">{k.title}</p>
                <strong className={`block text-3xl font-black ${k.num}`}>{k.value}</strong>
                <p className="text-[11px]">{k.sub.map(([l, v, c], i) => <span key={l}>{i > 0 && " | "}{l} <b className={c}>{v}</b></span>)}</p>
              </div>
              <span className={`grid size-14 shrink-0 place-items-center rounded-full ${k.tone}`}><k.icon size={26} /></span>
            </section>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <section className={panel}><Title icon={Users} text="حركة الموظفين" /><Legend items={[["الموظفين", "var(--primary)"], ["الجدد", "var(--success)"], ["المغادرين", "var(--destructive)"]]} /><LineChart /><More text="عرض تقارير الموارد البشرية" to="/reports/hr" /></section>
          <section className={panel}><Title icon={Database} text="المصروفات المالية" /><Legend items={[["المستحقات", "var(--success)"], ["المصروفات", "var(--primary)"]]} /><BarChart /><More text="عرض التقارير المالية" to="/reports/financial" /></section>
          <section className={panel}><Title icon={Headset} text="مؤشرات خدمة العملاء" /><div className="flex flex-wrap items-center justify-center gap-5"><div className="min-w-[170px] flex-1 space-y-3">{tickets.map((t) => <div key={t.label} className="flex items-center gap-2 text-xs"><span className="size-3 rounded-full" style={{ background: t.label === "مفتوحة" ? "var(--buy-violet)" : t.color }} /><span className="flex-1">{t.label}</span><b className="w-8">{t.value}</b><span>({t.pct}%)</span></div>)}</div><Donut /></div><More text="عرض تفاصيل خدمة العملاء" to="/customer-service" /></section>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <section className={panel}><Title icon={Zap} text="الوصول السريع" /><div className="grid grid-cols-3 gap-2">{quick.map((q) => <Link key={q.label} to={q.to} className={`flex h-[70px] flex-col items-center justify-center gap-1.5 rounded-lg text-[11px] font-bold transition-transform hover:-translate-y-0.5 ${q.tone}`}><q.icon size={21} />{q.label}</Link>)}</div></section>
          <section className={panel}><Title icon={History} text="أحدث العمليات في النظام" more /><div className="overflow-x-auto"><table className="w-full min-w-[340px] text-right text-[11px]"><thead className="bg-primary-soft"><tr>{["الوقت", "المستخدم", "العملية", "البرنامج"].map((h) => <th key={h} className="px-2 py-2 font-extrabold">{h}</th>)}</tr></thead><tbody>{recent.map((r) => <tr key={r[0]} className="border-b border-border last:border-0"><td className="whitespace-nowrap px-2 py-2">{r[0]}</td><td className="whitespace-nowrap px-2 py-2">{r[1]}</td><td className="whitespace-nowrap px-2 py-2">{r[2]}</td><td className="px-2 py-2"><span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold ${tag(r[3])}`}>{r[3]}</span></td></tr>)}</tbody></table></div></section>
          <section className={panel}><Title icon={Bell} text="المهام والتنبيهات الأخيرة" more /><div className="divide-y divide-border">{tasks.map((t) => <div key={t[1]} className="flex items-center gap-2 py-2.5 text-[11px]"><span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold ${tag(t[0])}`}>{t[0]}</span><span className="flex-1">{t[1]}</span><span className="whitespace-nowrap text-muted-foreground">{t[2]}</span></div>)}</div></section>
        </div>
        <p className="text-[10px] text-muted-foreground">بيانات توضيحية للعرض فقط</p>
      </main>
    </AppShell>
  );
}
