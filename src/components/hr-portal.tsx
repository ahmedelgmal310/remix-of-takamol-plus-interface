import { Link } from "@tanstack/react-router";
import { BarChart3, Building2, CalendarDays, ChevronLeft, FileText, House, Users, Wallet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import platform from "@/assets/hr-platform.png";

const items = [
  { t: "الرئيسية", icon: House, to: "/", cls: "bg-primary/10 text-primary", card: "bg-primary/5 border-primary/40" },
  { t: "الموظفون", icon: Users, to: "/employees/profile", cls: "bg-chart-2/15 text-chart-2", card: "bg-chart-2/5", n: "120", s: "موظف" },
  { t: "المنشآت", icon: Building2, to: "/employees/structure", cls: "bg-chart-4/15 text-chart-4", card: "bg-chart-4/5", n: "5", s: "منشأة مسجلة" },
  { t: "العقود", icon: FileText, to: "/employees/documents", cls: "bg-primary/10 text-primary", card: "bg-primary/5", n: "48", s: "عقد نشط" },
  { t: "الرواتب", icon: Wallet, to: "/salaries/scale", cls: "bg-warning/15 text-warning", card: "bg-warning/5", n: "25", s: "موظف مستفيد من الرواتب" },
  { t: "الإجازات", icon: CalendarDays, to: "/leaves/new", cls: "bg-success/15 text-success", card: "bg-success/5", n: "8", s: "طلب إجازة قيد المراجعة" },
  { t: "التقارير", icon: BarChart3, to: "/reports/hr", cls: "bg-chart-4/15 text-chart-4", card: "bg-chart-4/5", n: "12", s: "تقرير متاح" },
] as const;

export function HrPortal() {
  return (
    <AppShell>
      <main className="space-y-6 p-4 md:p-6">
        <div><h1 className="text-2xl font-extrabold">أهلاً بك في نظام الموارد البشرية</h1><p className="mt-1 text-sm text-muted-foreground">اختر من القائمة الجانبية أو من الأيقونات أدناه للبدء</p></div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {items.map((i) => (
            <Link key={i.t} to={i.to} className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${i.card}`}>
              <span className={`grid size-14 place-items-center rounded-2xl ${i.cls}`}><i.icon className="size-7" /></span>
              <span className="font-bold">{i.t}</span>
            </Link>
          ))}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">إحصائيات سريعة</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {items.slice(1).map((i) => (
              <Link key={i.t} to={i.to} className="rounded-2xl border bg-card p-4 transition hover:shadow-md">
                <span className={`grid size-11 place-items-center rounded-xl ${i.cls}`}><i.icon className="size-5" /></span>
                <p className="mt-3 font-bold">{i.t}</p>
                <p className="mt-1 text-2xl font-extrabold">{"n" in i ? i.n : ""}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">{"s" in i ? i.s : ""}<ChevronLeft className="size-4 shrink-0" /></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:justify-between">
          <div><h3 className="text-lg font-bold">منصة إلكترونية متكاملة</h3><p className="mt-1 max-w-md text-sm leading-7 text-muted-foreground">تسهل عليك إدارة الموارد البشرية وتوفر الوقت والجهد من خلال أدوات ذكية وآمنة.</p></div>
          <img src={platform} alt="منصة آمنة لإدارة المستندات" width={992} height={672} loading="lazy" className="h-32 w-auto" />
        </section>
      </main>
    </AppShell>
  );
}
