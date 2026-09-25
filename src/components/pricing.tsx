import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BarChart3, Box, Building2, CalendarDays, Check, ChevronLeft, CloudCog, Crown, Headphones, Lock, Menu, Monitor, Phone, Settings, ShieldCheck, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import devices from "@/assets/pricing-devices.png";
import bot from "@/assets/pricing-bot.png";

type Plan = { id: string; name: string; sub: string; price: string; icon: typeof Box; features: [string, boolean][]; tone: "base" | "pro" | "gold" | "ent" };
const plans: Plan[] = [
  { id: "basic", name: "الباقة الأساسية", sub: "للفرق الصغيرة والشركات الناشئة", price: "199", icon: Box, tone: "base",
    features: [["حتى 10 مستخدمين", true], ["جميع الأنظمة الأساسية", true], ["دعم عبر البريد الإلكتروني", true], ["تقارير أساسية", true], ["سعة تخزين 10 جيجا", true], ["بعض الميزات المتقدمة", false]] },
  { id: "pro", name: "الباقة الاحترافية", sub: "للشركات المتوسطة", price: "399", icon: BarChart3, tone: "pro",
    features: [["حتى 50 مستخدم", true], ["جميع الأنظمة والمميزات", true], ["دعم فني عبر الهاتف والبريد", true], ["تقارير متقدمة", true], ["سعة تخزين 100 جيجا", true], ["ربط مع أنظمة خارجية (API)", true], ["نسخ احتياطي تلقائي", true]] },
  { id: "premium", name: "الباقة المميزة", sub: "للشركات الكبيرة والمؤسسات", price: "699", icon: Building2, tone: "gold",
    features: [["مستخدمين غير محدودين", true], ["جميع الأنظمة والمميزات", true], ["دعم فني مخصص 24/7", true], ["تقارير وتحليلات بالذكاء الاصطناعي", true], ["ربط مع جميع الأنظمة الخارجية", true], ["سعة تخزين غير محدودة", true], ["مدير حساب مخصص", true], ["تخصيص النظام حسب احتياجاتك", true]] },
  { id: "ent", name: "باقة المؤسسات", sub: "حلول مخصصة لاحتياجاتك", price: "", icon: Building2, tone: "ent",
    features: [["مستخدمين غير محدودين", true], ["تخصيص كامل للنظام", true], ["تكامل مع الأنظمة الحكومية", true], ["دعم فني مخصص داخل الموقع", true], ["اتفاقية مستوى الخدمة (SLA)", true], ["تدريب وتأهيل الفريق", true], ["استشارات تقنية وإدارية", true]] },
];
const perks = [
  { t: "بياناتك بأمان", s: "أعلى معايير الحماية والتشفير", icon: Lock },
  { t: "تحديثات مستمرة", s: "مميزات جديدة بشكل دوري", icon: Settings },
  { t: "دعم فني متميز", s: "فريق متخصص لخدمتك", icon: Headphones },
  { t: "متاح على جميع الأجهزة", s: "ويب - سطح المكتب - الجوال", icon: Monitor },
];
const nav = [["الرئيسية", "top"], ["المميزات", "features"], ["الأسعار", "plans"], ["آراء العملاء", "help"], ["الأسئلة الشائعة", "help"]] as const;
const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function Pricing() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [contact, setContact] = useState(false);
  const [demo, setDemo] = useState(false);
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", date: "" });
  const submit = (ok: string, need: (keyof typeof form)[]) => {
    if (need.some((k) => !form[k])) { toast.error("يرجى تعبئة الحقول المطلوبة"); return false; }
    toast.success(ok); setForm({ name: "", company: "", email: "", phone: "", date: "" }); return true;
  };
  const inputs = (keys: [keyof typeof form, string, string][]) => (
    <div className="grid gap-3 text-sm">{keys.map(([k, l, t]) => <label key={k} className="grid gap-1">{l}<input type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>)}</div>
  );

  return (
    <div id="top" dir="rtl" className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground">t</span>
            <div className="leading-tight"><p className="text-lg font-black">تكامل بلس</p><p className="text-[10px] font-bold tracking-widest text-muted-foreground" dir="ltr">TAKAMUL PLUS</p></div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            {nav.map(([l, id]) => <button key={l} onClick={() => scroll(id)} className={`border-b-2 py-1 ${l === "الأسعار" ? "border-sidebar text-sidebar" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>)}
          </nav>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => setContact(true)} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold"><Headphones className="h-4 w-4" />تواصل معنا</button>
            <button onClick={() => scroll("plans")} className="flex items-center gap-2 rounded-lg bg-sidebar px-5 py-2 text-sm font-bold text-sidebar-foreground">ابدأ الآن<ChevronLeft className="h-4 w-4" /></button>
          </div>
          <button onClick={() => setMenu(!menu)} className="lg:hidden" aria-label="القائمة">{menu ? <X /> : <Menu />}</button>
        </div>
        {menu && <div className="grid gap-1 border-t p-3 lg:hidden">{nav.map(([l, id]) => <button key={l} onClick={() => { scroll(id); setMenu(false); }} className="rounded-md p-2 text-right text-sm font-semibold hover:bg-muted">{l}</button>)}
          <button onClick={() => { setContact(true); setMenu(false); }} className="rounded-md p-2 text-right text-sm font-semibold text-primary">تواصل معنا</button></div>}
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 pb-6">
        <section id="features" className="grid items-center gap-4 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h1 className="text-3xl font-black leading-tight text-sidebar sm:text-5xl">باقات اشتراك مرنة<br />تناسب جميع احتياجاتك</h1>
            <p className="mt-3 text-lg text-muted-foreground">اختر الباقة المناسبة ونمو بعملك مع تكامل بلس</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
              {[["دعم فني متميز", Headphones], ["تحديثات مستمرة", Settings], ["أمان عالي للبيانات", ShieldCheck], ["متاح على جميع الأجهزة", CloudCog]].map(([l, I]) => { const Ic = I as typeof Box; return <span key={l as string} className="flex items-center gap-2"><Ic className="h-5 w-5 text-sidebar" />{l as string}</span>; })}
            </div>
          </div>
          <div className="relative">
            <img src={devices} alt="لوحة تحكم تكامل بلس على اللابتوب والجوال" width={1024} height={640} className="w-full" />
            <p className="absolute bottom-4 left-0 -rotate-6 text-xl font-bold text-sidebar sm:text-2xl">إدارة أسهل<br />لمستقبل أفضل</p>
          </div>
        </section>

        <section id="plans" className="grid gap-4 pt-4 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => {
            const gold = p.tone === "gold", ent = p.tone === "ent";
            return (
              <div key={p.id} className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${gold ? "border-warning bg-sidebar text-sidebar-foreground shadow-xl xl:-mt-3" : ent ? "bg-finance-purple/5" : p.tone === "pro" ? "bg-primary-soft/40" : "bg-card"}`}>
                {gold && <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-warning/90 px-4 py-1.5 text-xs font-bold text-foreground"><Crown className="h-4 w-4" />الأكثر اختيارًا<Crown className="h-4 w-4" /></span>}
                <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${gold ? "bg-warning/80 text-sidebar" : ent ? "bg-finance-purple/15 text-finance-purple" : "bg-primary-soft text-primary"}`}><p.icon className="h-8 w-8" /></span>
                <h2 className={`mt-3 text-center text-2xl font-black ${gold ? "text-warning" : ""}`}>{p.name}</h2>
                <p className={`text-center text-sm ${gold ? "opacity-80" : "text-muted-foreground"}`}>{p.sub}</p>
                <p className="my-4 text-center">{p.price ? <><span className="text-5xl font-black">{p.price}</span><span className="mr-1 text-sm">ريال / شهريًا</span></> : <span className="text-4xl font-black">حسب الطلب</span>}</p>
                <ul className="flex-1 space-y-3 text-sm">
                  {p.features.map(([f, ok]) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${!ok ? "bg-destructive text-destructive-foreground" : gold ? "bg-warning text-sidebar" : ent ? "bg-finance-purple text-primary-foreground" : "bg-success text-primary-foreground"}`}>{ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}</span>{f}
                    </li>))}
                </ul>
                {ent
                  ? <button onClick={() => setContact(true)} className="mt-6 flex items-center justify-center gap-2 rounded-lg border-2 border-finance-purple py-3 font-bold text-finance-purple"><Headphones className="h-5 w-5" />تواصل معنا</button>
                  : <button onClick={() => setPlan(p)} className={`mt-6 flex items-center justify-center gap-2 rounded-lg py-3 font-bold ${gold ? "bg-warning text-sidebar" : p.tone === "pro" ? "border border-primary bg-primary-soft text-sidebar" : "border border-primary text-sidebar"}`}>ابدأ الآن<ChevronLeft className="h-4 w-4" /></button>}
              </div>);
          })}
        </section>

        <section className="grid grid-cols-1 gap-4 rounded-2xl border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((k) => (
            <div key={k.t} className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-sidebar"><k.icon className="h-6 w-6" /></span>
              <div><p className="font-extrabold">{k.t}</p><p className="text-xs text-muted-foreground">{k.s}</p></div>
            </div>))}
        </section>

        <section id="help" className="grid items-center gap-4 overflow-hidden rounded-2xl bg-primary-soft/60 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto]">
          <Headphones className="hidden h-16 w-16 text-sidebar md:block" />
          <div>
            <h2 className="text-2xl font-black">تحتاج إلى باقة مخصصة؟</h2>
            <p className="text-sm text-muted-foreground">تواصل مع فريق المبيعات لنقدم لك عرضًا يناسب احتياجاتك</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setContact(true)} className="flex items-center gap-2 rounded-lg bg-sidebar px-6 py-2.5 text-sm font-bold text-sidebar-foreground"><Phone className="h-4 w-4" />تواصل الآن</button>
              <button onClick={() => setDemo(true)} className="flex items-center gap-2 rounded-lg border bg-card px-6 py-2.5 text-sm font-bold"><CalendarDays className="h-4 w-4" />احجز عرض توضيحي</button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="rounded-xl bg-card px-3 py-2 text-sm font-bold text-primary shadow">نحن هنا<br />لمساعدتك</span>
            <img src={bot} alt="مساعد الدعم الفني" width={816} height={816} loading="lazy" className="h-28 w-28" />
            <p className="-rotate-6 text-xl font-bold text-sidebar">شريكك في<br />التحول الرقمي</p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex gap-4">{["سياسة الخصوصية", "الشروط والأحكام"].map((l) => <button key={l} onClick={() => toast(l, { description: "سيتم نشر الصفحة قريبًا" })}>{l}</button>)}<button onClick={() => setContact(true)}>اتصل بنا</button></div>
          <p>جميع الحقوق محفوظة © 2025 تكامل بلس</p>
        </div>
      </footer>

      <Dialog open={!!plan} onOpenChange={() => setPlan(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>الاشتراك في {plan?.name}</DialogTitle></DialogHeader>
          <div className="rounded-lg bg-primary-soft p-3 text-sm"><b>{plan?.name}</b> — {plan?.price} ريال / شهريًا</div>
          {inputs([["name", "الاسم الكامل", "text"], ["company", "اسم الشركة", "text"], ["email", "البريد الإلكتروني", "email"], ["phone", "رقم الجوال", "tel"]])}
          <DialogFooter><button onClick={() => submit("تم استلام طلب الاشتراك، سنتواصل معك قريبًا", ["name", "company", "email", "phone"]) && setPlan(null)} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">تأكيد الاشتراك</button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={contact} onOpenChange={setContact}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>تواصل مع فريق المبيعات</DialogTitle></DialogHeader>
          {inputs([["name", "الاسم", "text"], ["email", "البريد الإلكتروني", "email"], ["phone", "رقم الجوال", "tel"]])}
          <DialogFooter><button onClick={() => submit("تم إرسال طلبك، سيتواصل معك فريق المبيعات", ["name", "phone"]) && setContact(false)} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">إرسال</button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={demo} onOpenChange={setDemo}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>احجز عرض توضيحي</DialogTitle></DialogHeader>
          {inputs([["name", "الاسم", "text"], ["company", "اسم الشركة", "text"], ["date", "التاريخ المناسب", "date"]])}
          <DialogFooter><button onClick={() => submit("تم حجز العرض التوضيحي", ["name", "date"]) && setDemo(false)} className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">تأكيد الحجز</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
