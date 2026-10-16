import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, BriefcaseBusiness, CheckCircle2, ChevronLeft, Clock3, ClipboardList, FileText, Headphones,
  Inbox, MapPin, Plus, Search, ShieldCheck, Ticket, UserRound, UsersRound, XCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/applicant-portal-medical.jpg";

// حالات الطلب المعتمدة في البوابة
export type ApplicantStatus = "قيد المراجعة" | "مقبول" | "مرفوض";

export interface ApplicantApplication {
  id: string;
  jobTitle: string;
  employer: string;
  appliedOn: string;
  status: ApplicantStatus;
}

export interface ApplicantStats {
  total?: number;
  reviewing?: number;
  accepted?: number;
  rejected?: number;
}

export interface ApplicantPortalProps {
  stats?: ApplicantStats;
  applications?: ApplicantApplication[];
  onViewDetails?: (application: ApplicantApplication) => void;
}

// القيمة الغائبة تُعرض «—» ولا تُخترع
const show = (v?: number | string) => (v === undefined || v === "" ? "—" : v);

const statusStyle: Record<ApplicantStatus, { cls: string; icon: ReactNode }> = {
  "قيد المراجعة": { cls: "bg-warning-soft text-warning", icon: <Clock3 className="size-3.5" /> },
  "مقبول": { cls: "bg-success-soft text-success", icon: <CheckCircle2 className="size-3.5" /> },
  "مرفوض": { cls: "bg-destructive/10 text-destructive", icon: <XCircle className="size-3.5" /> },
};

// خدمات المتقدم — روابط لصفحات قائمة في المشروع
const services = [
  { title: "متابعة طلبي", desc: "باستخدام رقم الطلب أو الباركود أو الجوال", icon: Search, to: "/recruitment/tracking", tone: "bg-primary-soft text-primary" },
  { title: "طلباتي", desc: "عرض جميع طلباتك وحالتها", icon: ClipboardList, to: "/recruitment/tracking", tone: "bg-buy-violet-soft text-buy-violet" },
  { title: "التقديم على وظيفة", desc: "تصفح الوظائف المتاحة والتقديم", icon: BriefcaseBusiness, to: "/careers", tone: "bg-primary-soft text-primary" },
  { title: "حسابي", desc: "تحديث بياناتك الشخصية والمهنية", icon: UserRound, to: "/careers/login", tone: "bg-warning-soft text-warning" },
  { title: "الدعم وخدمة العملاء", desc: "تواصل معنا أو اطرح استفساراتك", icon: Headphones, to: "/support", tone: "bg-buy-violet-soft text-buy-violet" },
  { title: "تذاكري", desc: "متابعة تذاكر الدعم الفني", icon: Ticket, to: "/customer-service/tickets", tone: "bg-success-soft text-success" },
] as const;

export function ApplicantPortal({ stats = {}, applications = [], onViewDetails }: ApplicantPortalProps) {
  const counters = [
    { label: "طلباتي", sub: "إجمالي الطلبات المقدمة", value: stats.total, icon: FileText, tone: "bg-primary-soft text-primary", text: "text-buy-navy" },
    { label: "قيد المراجعة", sub: "طلبات تحت المراجعة", value: stats.reviewing, icon: Clock3, tone: "bg-warning-soft text-warning", text: "text-warning" },
    { label: "مقبولة", sub: "طلبات تم قبولها", value: stats.accepted, icon: CheckCircle2, tone: "bg-success-soft text-success", text: "text-success" },
    { label: "مرفوضة", sub: "طلبات مرفوضة", value: stats.rejected, icon: XCircle, tone: "bg-destructive/10 text-destructive", text: "text-destructive" },
  ];

  return (
    <AppShell>
      <main dir="rtl" className="mx-auto max-w-[1450px] space-y-4 p-3 sm:p-5">
        {/* لافتة الترحيب */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-primary-soft">
          <img src={heroImage} alt="" width={1600} height={600} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-card/40 to-card/90" />
          <div className="relative grid min-h-[190px] gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="md:order-2 md:text-left" dir="rtl">
              <h1 className="text-2xl font-black text-buy-navy sm:text-4xl">مرحباً بك في بوابة المتقدمين</h1>
              <p className="mt-2 text-sm font-bold text-buy-navy sm:text-base">اكتشف فرص العمل للأطباء والكادر الصحي في منصة تكامل بلس</p>
            </div>
            <ul className="space-y-2 rounded-xl bg-card/80 p-3 text-sm font-bold text-buy-navy md:order-1 md:bg-transparent md:p-0">
              {[[BriefcaseBusiness, "فرص عمل متنوعة"], [MapPin, "في جميع مناطق المملكة"], [UsersRound, "تخصصات متعددة"], [ShieldCheck, "بيئة عمل احترافية"]].map(([Icon, label]) => {
                const I = Icon as typeof MapPin;
                return <li key={label as string} className="flex items-center gap-2"><I className="size-5 text-primary" />{label as string}</li>;
              })}
            </ul>
          </div>
        </section>

        {/* بطاقات العدّ وبطاقة الدعوة */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {counters.map((c) => (
            <div key={c.label} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
              <div>
                <p className={`text-sm font-extrabold ${c.text}`}>{c.label}</p>
                <b className="my-1 block text-3xl font-black text-buy-navy">{show(c.value)}</b>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
              <span className={`grid size-14 place-items-center rounded-xl ${c.tone}`}><c.icon className="size-7" /></span>
            </div>
          ))}
          <Link to="/careers" className="flex items-center gap-3 rounded-xl bg-gradient-to-l from-buy-violet to-primary p-4 text-primary-foreground shadow-sm sm:col-span-2 xl:col-span-1">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary-foreground/50"><Plus /></span>
            <div className="flex-1"><p className="font-extrabold">التقديم على وظيفة جديدة</p><p className="text-xs opacity-90">ابدأ رحلتك المهنية الآن</p></div>
            <ArrowLeft />
          </Link>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* خدمات المتقدم */}
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-black text-buy-navy">خدمات المتقدم</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {services.map((s) => (
                <Link key={s.title} to={s.to} className={`rounded-xl p-3 text-center transition hover:shadow-md ${s.tone}`}>
                  <s.icon className="mx-auto size-8" />
                  <p className="mt-2 text-sm font-extrabold">{s.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{s.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* آخر الوظائف المتقدم عليها */}
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-buy-navy">آخر الوظائف المتقدم عليها</h2>
              <Link to="/recruitment/tracking" className="text-sm font-bold text-primary">عرض الكل</Link>
            </div>
            {applications.length === 0 ? (
              <div className="grid place-items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center text-muted-foreground">
                <Inbox className="size-10" />
                <p className="font-bold text-foreground">لا توجد طلبات بعد</p>
                <p className="text-xs">ستظهر هنا الوظائف التي تتقدم عليها.</p>
                <Button asChild size="sm" className="mt-2"><Link to="/careers">تصفح الوظائف المتاحة</Link></Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-right text-sm">
                  <thead className="bg-muted text-buy-navy"><tr>{["م", "اسم الوظيفة", "الجهة", "تاريخ التقديم", "الحالة", "الإجراء"].map((h) => <th key={h} className="px-3 py-2 font-extrabold">{h}</th>)}</tr></thead>
                  <tbody>
                    {applications.map((a, i) => (
                      <tr key={a.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">{i + 1}</td>
                        <td className="px-3 py-2 font-extrabold text-buy-navy">{show(a.jobTitle)}</td>
                        <td className="px-3 py-2">{show(a.employer)}</td>
                        <td className="px-3 py-2" dir="ltr">{show(a.appliedOn)}</td>
                        <td className="px-3 py-2"><span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${statusStyle[a.status].cls}`}>{statusStyle[a.status].icon}{a.status}</span></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" disabled={!onViewDetails} onClick={() => onViewDetails?.(a)}>عرض التفاصيل<ChevronLeft /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
