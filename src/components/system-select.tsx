import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle, BarChart3, Bell, Boxes, ChevronDown, ChevronLeft, CircleDollarSign, CircleHelp, CalendarDays, FileSignature,
  FileText, FolderKanban, GraduationCap, Handshake, MessagesSquare, Search, Settings, UserRound, Users, ClipboardList, TreePalm,
} from "lucide-react";
import office from "@/assets/systems-office.jpg";

const systems = [
  { t: "التقارير والإحصائيات", d: "تقارير شاملة ومؤشرات الأداء", icon: BarChart3, to: "/reports/financial", c: "bg-primary/10 text-primary" },
  { t: "المالية والمحاسبة", d: "الحركة المالية والميزانيات والتقارير", icon: CircleDollarSign, to: "/finance", c: "bg-success/15 text-success" },
  { t: "إدارة العقود", d: "عقود الأطباء الجزئية والمؤقتة", icon: FileSignature, to: "/employees/documents", c: "bg-primary/10 text-primary" },
  { t: "التقييم الوظيفي", d: "تقييم الموظفين وإدارة الترقيات", icon: ClipboardList, to: "/performance/evaluation", c: "bg-primary/10 text-primary" },
  { t: "الموارد البشرية", d: "إدارة الموظفين والرواتب والأداء الوظيفي", icon: Users, to: "/hr", c: "bg-primary/10 text-primary" },
  { t: "الخدمة الذاتية", d: "خدمات الموظفين والطلبات الإلكترونية", icon: Handshake, to: "/self-service", c: "bg-primary/10 text-primary" },
  { t: "المستندات والنماذج", d: "قوالب المستندات والخطابات", icon: FileText, to: "/employees/documents", c: "bg-primary/10 text-primary" },
  { t: "الإجازات والغياب", d: "إدارة الإجازات والحضور والانصراف", icon: CalendarDays, to: "/leaves/new", c: "bg-primary/10 text-primary" },
  { t: "الإجراءات والمخالفات", d: "إدارة الجزاءات وسجل المخالفات", icon: AlertTriangle, to: "/attendance/penalties", c: "bg-destructive/10 text-destructive" },
  { t: "التدريب والتطوير", d: "إدارة الدورات والبرامج التدريبية", icon: GraduationCap, to: "/performance/evaluation", c: "bg-primary/10 text-primary" },
  { t: "الدعم والمساعدة", d: "مركز المساعدة والدعم الفني", icon: CircleHelp, to: "/support", c: "bg-primary/10 text-primary" },
  { t: "الإعدادات", d: "إعدادات النظام وإدارة المستخدمين", icon: Settings, to: "/settings", c: "bg-primary/10 text-primary" },
  { t: "إدارة المشاريع", d: "متابعة المشاريع والميزانيات", icon: FolderKanban, to: "/projects", c: "bg-primary/10 text-primary" },
  { t: "المشتريات والمخزون", d: "إدارة المشتريات والمخزون والأصول", icon: Boxes, to: "/purchases/new", c: "bg-success/15 text-success" },
  { t: "خدمة العملاء", d: "متابعة تواصل العملاء وتقييم الأداء", icon: MessagesSquare, to: "/customer-service/inbox", c: "bg-primary/10 text-primary" },
] as const;

export function SystemSelect() {
  const [q, setQ] = useState("");
  const list = systems.filter((s) => (s.t + s.d).includes(q.trim()));
  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-background">
      <aside className="absolute inset-y-0 left-0 hidden w-[22%] overflow-hidden lg:block">
        <img src={office} alt="مكتب حديث" width={768} height={1344} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex h-64 flex-col items-center justify-center gap-3 rounded-tr-[50%] bg-sidebar text-center text-sidebar-foreground">
          <TreePalm className="size-12 text-primary-foreground/80" />
          <p className="text-xl font-bold leading-relaxed">نحو مستقبل<br />أكثر تكاملاً</p>
          <span className="h-0.5 w-10 bg-primary" />
        </div>
      </aside>

      <div className="relative mx-auto max-w-[1500px] px-4 py-5 lg:pl-[18%] lg:pr-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:flex md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted"><UserRound className="size-5 text-foreground" /></span>
            <span className="truncate font-bold">مدير النظام</span><ChevronDown className="size-4 shrink-0" />
            <Link to="/notifications" aria-label="الإشعارات" className="relative mr-3 shrink-0"><Bell className="size-5 text-muted-foreground" /><span className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] text-primary-foreground">5</span></Link>
          </div>
          <Link to="/" className="shrink-0 text-left md:order-last"><b className="block text-xl text-foreground">تكامل بلس</b><span className="text-[10px] tracking-widest text-muted-foreground">TAKAMUL PLUS</span></Link>
          <div className="relative col-span-2 md:w-[440px]"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن نظام أو خدمة ..." className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" /></div>
        </header>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div><h1 className="text-2xl font-extrabold md:text-3xl">مرحباً بك في تكامل بلس</h1><p className="mt-2 text-muted-foreground md:text-lg">اختر النظام الذي ترغب في استخدامه</p><span className="mt-3 block h-1 w-12 rounded bg-primary" /></div>
          <p className="hidden text-left text-xl font-bold leading-relaxed text-foreground/80 xl:block">معاً ..<br />لبناء إدارة أكثر كفاءة</p>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {list.map((s) => (
            <Link key={s.t} to={s.to} className="group flex flex-col items-center rounded-2xl border bg-card p-4 text-center shadow-sm transition hover:border-primary hover:shadow-md md:p-5">
              <span className={`grid size-16 place-items-center rounded-2xl ${s.c}`}><s.icon className="size-8" /></span>
              <b className="mt-3 text-sm md:text-base">{s.t}</b>
              <p className="mt-1.5 mb-3 min-h-10 text-xs leading-relaxed text-muted-foreground md:text-sm">{s.d}</p>
              <span className="mt-auto grid size-8 place-items-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground"><ChevronLeft className="size-4" /></span>
            </Link>
          ))}
        </section>
        {list.length === 0 && <p className="mt-10 text-center text-muted-foreground">لا توجد نتائج</p>}
      </div>
    </div>
  );
}
