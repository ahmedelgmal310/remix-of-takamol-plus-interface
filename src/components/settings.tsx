import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Crown, Database, FileBadge, Fingerprint, Home, Lock, LogIn, Settings as Gear, ShieldCheck, User, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import banner from "@/assets/settings-banner.jpg";

type Key = "access" | "roles" | "team" | "sub" | "tax" | "security" | "password" | "profile" | "attendance" | "currency";
const cards: { k: Key; t: string; d: string; icon: typeof Gear; cls: string }[] = [
  { k: "access", t: "طلبات الوصول", d: "مراجعة واعتماد طلبات الوصول للأنظمة والمزايا", icon: LogIn, cls: "bg-primary-soft text-primary" },
  { k: "roles", t: "الصلاحيات", d: "إدارة الصلاحيات والأدوار وتحديد مستويات الوصول", icon: ShieldCheck, cls: "bg-success/10 text-success" },
  { k: "team", t: "الفريق", d: "إدارة أعضاء الفريق وإضافة المستخدمين وتحديد الأدوار", icon: Users, cls: "bg-finance-violet text-finance-purple" },
  { k: "sub", t: "الاشتراك", d: "إدارة باقات الاشتراك والمزايا وتفاصيل الفوترة والدفع", icon: Crown, cls: "bg-warning/15 text-warning" },
  { k: "tax", t: "الضرائب", d: "إدارة معلومات الضرائب والفواتير الضريبية", icon: FileBadge, cls: "bg-finance-violet text-finance-purple" },
  { k: "security", t: "البيانات والأمان", d: "إعدادات الأمان والخصوصية وحماية البيانات", icon: ShieldCheck, cls: "bg-success/10 text-success" },
  { k: "password", t: "كلمة المرور", d: "تغيير كلمة المرور وإدارة خيارات تسجيل الدخول", icon: Lock, cls: "bg-primary-soft text-primary" },
  { k: "profile", t: "بياناتي", d: "إدارة بياناتك الشخصية والمهنية", icon: User, cls: "bg-destructive/10 text-destructive" },
  { k: "attendance", t: "الحضور والبصمة", d: "إعدادات الحضور والانصراف وأجهزة البصمة", icon: Fingerprint, cls: "bg-success/10 text-success" },
  { k: "currency", t: "العملات", d: "إدارة العملات وأسعار الصرف والإعدادات المالية", icon: Database, cls: "bg-warning/15 text-warning" },
];
const field = "mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const F = ({ l, ...p }: { l: string } & React.InputHTMLAttributes<HTMLInputElement>) => <label className="block text-sm">{l}<input className={field} {...p} /></label>;
const Toggle = ({ l, def = true }: { l: string; def?: boolean }) => <label className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">{l}<input type="checkbox" defaultChecked={def} className="size-4 accent-primary" /></label>;

export function SettingsPage() {
  const [open, setOpen] = useState<Key | null>(null);
  const [requests, setRequests] = useState([["سارة الشهري", "نظام الرواتب"], ["فهد العتيبي", "التقارير المالية"], ["نورة القحطاني", "المشتريات"]]);
  const [team, setTeam] = useState([["أحمد السبيعي", "مدير النظام"], ["محمد الزهراني", "محاسب"], ["ريم الدوسري", "موارد بشرية"]]);
  const [member, setMember] = useState("");
  const [rates, setRates] = useState<[string, string][]>([["ريال سعودي (SAR)", "1.00"], ["دولار أمريكي (USD)", "3.75"], ["يورو (EUR)", "4.08"]]);
  const cur = cards.find((c) => c.k === open);
  const save = () => { toast.success("تم حفظ الإعدادات"); setOpen(null); };
  const decide = (i: number, ok: boolean) => { toast.success(ok ? "تم قبول الطلب" : "تم رفض الطلب"); setRequests((r) => r.filter((_, x) => x !== i)); };

  const body = () => {
    switch (open) {
      case "access": return requests.length ? requests.map(([n, s], i) => <div key={n} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"><div><b>{n}</b><p className="text-xs text-muted-foreground">يطلب الوصول إلى: {s}</p></div><div className="flex gap-1.5"><Button size="sm" onClick={() => decide(i, true)}>قبول</Button><Button size="sm" variant="outline" onClick={() => decide(i, false)}>رفض</Button></div></div>) : <p className="text-sm text-muted-foreground">لا توجد طلبات معلقة</p>;
      case "roles": return <>{["مدير النظام", "محاسب", "موارد بشرية", "موظف"].map((r) => <label key={r} className="block text-sm">{r}<select className={field} defaultValue={r === "موظف" ? "قراءة فقط" : "كامل"}><option>كامل</option><option>تعديل</option><option>قراءة فقط</option></select></label>)}</>;
      case "team": return <>{team.map(([n, r], i) => <div key={i} className="flex justify-between rounded-lg border border-border p-3 text-sm"><b>{n}</b><span className="text-muted-foreground">{r}</span></div>)}<div className="flex gap-2"><input className={field} placeholder="اسم العضو الجديد" value={member} onChange={(e) => setMember(e.target.value)} /><Button className="mt-1" onClick={() => { if (!member.trim()) return; setTeam([...team, [member, "موظف"]]); setMember(""); toast.success("تمت إضافة العضو"); }}>إضافة</Button></div></>;
      case "sub": return <><div className="rounded-xl bg-warning/15 p-4"><p className="text-sm">الباقة الحالية</p><p className="text-xl font-extrabold">الباقة الاحترافية</p><p className="text-sm text-muted-foreground">تتجدد في 2026/01/01 — 50 مستخدم</p></div><Button variant="outline" className="w-full" onClick={() => toast.info("سيتم التواصل معك لترقية الباقة")}>ترقية الباقة</Button></>;
      case "tax": return <><F l="الرقم الضريبي" defaultValue="300123456700003" /><F l="نسبة ضريبة القيمة المضافة (%)" type="number" defaultValue="15" /><Toggle l="إصدار فواتير ضريبية إلكترونية" /></>;
      case "security": return <><Toggle l="التحقق بخطوتين" /><Toggle l="تسجيل الخروج التلقائي بعد 30 دقيقة" /><Toggle l="نسخ احتياطي يومي للبيانات" /><Toggle l="إشعار عند تسجيل دخول جديد" def={false} /></>;
      case "password": return <><F l="كلمة المرور الحالية" type="password" /><F l="كلمة المرور الجديدة" type="password" /><F l="تأكيد كلمة المرور" type="password" /></>;
      case "profile": return <><F l="الاسم" defaultValue="أحمد السبيعي" /><F l="المسمى الوظيفي" defaultValue="مدير النظام" /><F l="البريد الإلكتروني" type="email" defaultValue="ahmed@takamul.sa" /><F l="رقم الجوال" defaultValue="0551234567" /></>;
      case "attendance": return <><F l="بداية الدوام" type="time" defaultValue="08:00" /><F l="نهاية الدوام" type="time" defaultValue="16:00" /><F l="فترة السماح للتأخير (دقيقة)" type="number" defaultValue="15" /><Toggle l="ربط أجهزة البصمة" /></>;
      case "currency": return <>{rates.map(([n, r], i) => <label key={n} className="block text-sm">{n}<input className={field} type="number" step="0.01" value={r} onChange={(e) => setRates(rates.map((x, j) => j === i ? [n!, e.target.value] as [string, string] : x))} /></label>)}</>;
      default: return null;
    }
  };

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Home size={13} className="text-primary" /><Link to="/" className="text-primary">الرئيسية</Link> ‹ الإعدادات</p>
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <img src={banner} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="relative flex flex-col gap-5 bg-gradient-to-l from-card via-card/85 to-transparent p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Gear size={28} /></span>
              <div><h1 className="text-2xl font-extrabold">الإعدادات</h1><p className="text-sm text-muted-foreground">إدارة إعدادات النظام حسب احتياجات منشأتك</p></div>
            </div>
            <div className="hidden md:block md:pl-48"><p className="text-2xl font-extrabold text-primary">إعدادات مرنة ..</p><p className="text-2xl font-extrabold text-primary">لبيئة عمل أكثر كفاءة</p><span className="mt-2 block h-1 w-10 rounded bg-primary" /></div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <button key={c.k} onClick={() => setOpen(c.k)} className="flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`grid size-16 place-items-center rounded-2xl ${c.cls}`}><c.icon size={30} /></span>
              <h2 className="mt-3 text-lg font-extrabold">{c.t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
              <span className="mt-3 grid size-8 place-items-center rounded-full bg-primary-soft text-primary"><ChevronLeft size={16} /></span>
            </button>
          ))}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
          <div className="flex gap-3">{["سياسة الخصوصية", "الشروط والأحكام", "الدعم الفني"].map((l) => <button key={l} onClick={() => toast.info(`صفحة «${l}» قريبًا`)} className="hover:text-primary">{l}</button>)}</div>
          <span>تكامل بلس © 2025 جميع الحقوق محفوظة</span>
        </footer>
      </main>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent side="left" dir="rtl" className="overflow-y-auto">
          <SheetHeader><SheetTitle className="text-right">{cur?.t}</SheetTitle></SheetHeader>
          <p className="mb-4 text-sm text-muted-foreground">{cur?.d}</p>
          <div className="space-y-3">{body()}</div>
          {open !== "access" && open !== "sub" && <Button className="mt-5 w-full" onClick={save}>حفظ</Button>}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
