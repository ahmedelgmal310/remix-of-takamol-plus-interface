import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, Box, CalendarDays, ChevronLeft, Coins, FileText, Gift, GraduationCap, HandCoins, Headphones, Smartphone, UserRound, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Qr } from "@/components/financial-letter";
import hero from "@/assets/self-service-hero.jpg";

type Tone = "blue" | "green" | "violet" | "red" | "orange";
const tones: Record<Tone, string> = { blue: "bg-primary-soft text-primary", green: "bg-success-soft text-success", violet: "bg-[var(--finance-violet-soft,oklch(0.95_0.03_290))] text-[var(--finance-violet,oklch(0.5_0.2_290))]", red: "bg-destructive/10 text-destructive", orange: "bg-warning-soft text-warning" };
type S = { t: string; d: string; icon: ReactNode; tone: Tone; to?: string };
const row1: S[] = [
  { t: "ملفي", d: "عرض وتحديث بياناتي الشخصية والوظيفية", icon: <UserRound />, tone: "blue", to: "/employees/profile" },
  { t: "راتبي", d: "عرض تفاصيل الراتب والبدلات والاستقطاعات", icon: <Coins />, tone: "green", to: "/" },
  { t: "قسيمة الراتب", d: "تحميل وعرض قسائم الرواتب السابقة والحالية", icon: <FileText />, tone: "violet" },
];
const row2: S[] = [
  { t: "استئذاناتي", d: "عرض وطلب الاستئذانات ومتابعة حالتها", icon: <CalendarDays />, tone: "red", to: "/attendance/permission" },
  { t: "السلف", d: "طلب سلفة جديدة ومتابعة الطلبات السابقة", icon: <HandCoins />, tone: "green", to: "/salaries/advances" },
  { t: "المكافآت", d: "عرض المكافآت المستحقة ومتابعة طلباتها", icon: <Gift />, tone: "orange", to: "/rewards/issue" },
];
const row3: S[] = [
  { t: "العهد", d: "عرض العهد المسلمة لي وحالاتها", icon: <Box />, tone: "blue", to: "/employees/custody" },
  { t: "مستنداتي", d: "إدارة ورفع مستنداتي الشخصية والوظيفية", icon: <FileText />, tone: "violet", to: "/employees/admin-letter" },
  { t: "شهاداتي", d: "عرض شهاداتي العلمية والمهنية", icon: <GraduationCap />, tone: "blue", to: "/verify-certificate" },
  { t: "تقييماتي", d: "الاطلاع على تقييماتي الوظيفية ومؤشرات الأداء", icon: <BarChart3 />, tone: "green", to: "/performance/evaluation" },
];

function Card({ s, onSoon }: { s: S; onSoon: () => void }) {
  const body = <><span className={`mx-auto grid size-[72px] place-items-center rounded-2xl [&_svg]:size-9 ${tones[s.tone]}`}>{s.icon}</span><b className="mt-4 block text-xl font-extrabold text-brand-deep">{s.t}</b><p className="mx-auto mt-2 max-w-[230px] text-sm leading-6 text-primary/80">{s.d}</p><span className="mx-auto mt-3 grid size-8 place-items-center rounded-full bg-primary-soft text-brand-deep"><ChevronLeft size={16} /></span></>;
  const cls = "block rounded-xl border border-border bg-card p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md";
  return s.to ? <Link to={s.to} className={cls}>{body}</Link> : <button onClick={onSoon} className={`${cls} w-full`}>{body}</button>;
}

export function SelfServicePage() {
  const [soon, setSoon] = useState(false);
  const toast = () => { setSoon(true); setTimeout(() => setSoon(false), 2500); };
  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <section className="relative h-[200px] overflow-hidden rounded-xl sm:h-[210px]">
      <img src={hero} alt="موظف يستخدم منصة الخدمة الذاتية" width={1920} height={640} className="absolute inset-0 size-full object-cover object-[30%_50%] [transform:scaleX(-1)]" />
      <div className="relative flex h-full items-center justify-between px-6 sm:px-12">
        <div className="hidden text-center text-brand-deep md:block"><b className="block text-5xl font-extrabold">معاً</b><span className="text-xs">نصنع بيئة عمل أفضل</span></div>
        <div className="text-brand-deep"><h1 className="text-3xl font-extrabold sm:text-5xl">مرحباً أحمد</h1><p className="mt-2 text-lg font-bold sm:text-xl">في خدمتك دائماً ..</p><p className="mt-4 text-lg font-extrabold sm:text-2xl">منصة الخدمة الذاتية للموظف</p></div>
      </div>
    </section>

    <section className="panel mt-4 p-4">
      <div className="mb-4 flex items-center gap-3"><span className="grid size-14 place-items-center rounded-xl bg-primary-soft text-primary"><Users size={28} /></span><div><h2 className="text-xl font-extrabold text-brand-deep">خدمة ذاتية للموظف</h2><p className="mt-1 text-xs text-primary/80">إدارة بياناتك وخدماتك الوظيفية بسهولة ومن مكان واحد</p></div></div>
      <div className="grid gap-3 md:grid-cols-3">{[...row1, ...row2].map(s => <Card key={s.t} s={s} onSoon={toast} />)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{row3.map(s => <Card key={s.t} s={s} onSoon={toast} />)}</div>
    </section>

    <section className="mt-4 grid gap-3 md:grid-cols-3">
      {[
        { t: "تطبيق تكامل بلس", d: "جميع خدماتك في تطبيق واحد", b: "تحميل التطبيق", icon: <Smartphone />, qr: true, primary: true },
        { t: "دليل المستخدم", d: "تعرف على جميع الخدمات", b: "عرض الدليل", icon: <BookOpen /> },
        { t: "تحتاج إلى مساعدة؟", d: "يمكنك التواصل مع فريق الموارد البشرية", b: "تواصل معنا", icon: <Headphones />, primary: true },
      ].map(x => <div key={x.t} className="panel flex items-center gap-3 p-4">
        {x.qr && <div className="shrink-0 scale-75"><Qr /></div>}
        <div className="min-w-0 flex-1 text-center"><b className="block text-sm font-extrabold text-brand-deep">{x.t}</b><small className="mt-1 block text-[11px]">{x.d}</small><button className={`mt-2 h-8 rounded-md px-6 text-xs font-bold ${x.primary ? "bg-primary text-primary-foreground" : "border border-border bg-secondary"}`}>{x.b}</button></div>
        <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary-soft text-brand-deep [&_svg]:size-8">{x.icon}</span>
      </div>)}
    </section>
    {soon && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-brand-deep px-5 py-3 text-sm font-bold text-primary-foreground">قسيمة الراتب ستتوفر قريبًا</div>}
  </div></main></AppShell>;
}
