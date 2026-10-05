import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, BarChart3, Boxes, Building2, CheckCircle2, Cloud, FileCheck2,
  Headphones, Menu, Play, Settings, ShieldCheck, UsersRound, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { publicFeatures, publicSystems, publicStats } from "@/data/mockData";
import hero from "@/assets/public-hero.jpg";
import hr from "@/assets/public-hr.jpg";
import finance from "@/assets/public-finance.jpg";
import service from "@/assets/public-service.jpg";

const systemImages = { hr, finance, service };
const systemIcons = { hr: UsersRound, finance: BarChart3, service: Headphones };
const featureIcons = [Boxes, BarChart3, Settings, Cloud, ShieldCheck];
const statIcons = [Headphones, Building2, UsersRound, Headphones];

export function PublicBrand() {
  return <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="تكامل بلس - الرئيسية">
    <span className="text-2xl font-black leading-none text-buy-navy sm:text-3xl">تكامل</span>
    <span className="text-xl font-black leading-none text-buy-gold sm:text-2xl">بلس</span>
    <span className="relative grid h-10 w-7 place-items-end rounded-sm bg-buy-navy pb-0.5 text-xl font-black text-buy-gold before:absolute before:-top-1.5 before:right-0 before:h-2.5 before:w-9 before:rounded-sm before:bg-buy-navy">+</span>
  </Link>;
}

const nav = [
  ["الرئيسية", "/"], ["عن المنصة", "/about"], ["المميزات", "/features"],
  ["الباقات", "/pricing"], ["الأنظمة", "/systems"], ["الأسئلة الشائعة", "/faq"], ["تواصل معنا", "/contact"],
] as const;

export function PublicHeader({ active = "/" }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return <header className="relative z-40 border-b border-border bg-card">
    <div className="mx-auto flex h-[70px] max-w-[1370px] items-center justify-between gap-5 px-4 lg:px-8">
      <PublicBrand />
      <nav className="hidden items-center gap-6 text-[13px] font-bold text-buy-navy lg:flex" aria-label="التنقل العام">
        {nav.map(([label, to]) => <Link key={to} to={to} className={`relative py-6 ${active === to ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary" : "hover:text-primary"}`}>{label}</Link>)}
      </nav>
      <div className="hidden shrink-0 items-center gap-3 sm:flex">
        <Button asChild variant="outline" className="h-10 border-buy-navy px-5 font-extrabold text-buy-navy"><Link to="/login">تسجيل الدخول <ArrowLeft /></Link></Button>
        <Button asChild className="h-10 bg-buy-gold px-5 font-extrabold text-buy-navy hover:bg-buy-gold/90"><Link to="/register"><UsersRound /> تسجيل مستخدم جديد</Link></Button>
      </div>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <div className="absolute inset-x-0 top-full border-b border-border bg-card p-4 shadow-lg lg:hidden"><nav className="grid gap-1">{nav.map(([label, to]) => <Button key={to} asChild variant="ghost" className="justify-start font-bold"><Link to={to} onClick={() => setOpen(false)}>{label}</Link></Button>)}</nav><div className="mt-3 grid grid-cols-2 gap-2"><Button asChild variant="outline"><Link to="/login">تسجيل الدخول</Link></Button><Button asChild className="bg-buy-gold text-buy-navy"><Link to="/register">مستخدم جديد</Link></Button></div></div>}
  </header>;
}

export function PublicHome() {
  const [video, setVideo] = useState(false);
  return <div dir="rtl" className="min-h-screen overflow-x-hidden bg-card text-buy-navy">
    <PublicHeader />
    <main>
      <section className="relative min-h-[390px] overflow-hidden lg:min-h-[440px]">
        <img src={hero} width={1920} height={1088} alt="منصة تكامل بلس على جهاز محمول في مكتب حديث" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-public-hero" />
        <div className="relative mx-auto flex min-h-[390px] max-w-[1370px] items-center px-5 py-10 lg:min-h-[440px] lg:px-10">
          <div className="mr-auto w-full max-w-[600px] text-center lg:text-right">
            <span className="inline-flex rounded-full border border-primary/50 bg-card/75 px-4 py-1.5 text-xs font-bold backdrop-blur-sm">منصة متكاملة لإدارة الموارد البشرية والشؤون المالية وخدمة العملاء</span>
            <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start"><span className="text-5xl font-black text-buy-navy sm:text-7xl">تكامل</span><span className="text-4xl font-black text-buy-gold sm:text-6xl">بلس</span><span className="grid h-20 w-12 place-items-end rounded-md bg-buy-navy pb-1 text-4xl font-black text-buy-gold">+</span></div>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">إدارة أسهل .. أداء أعلى</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm font-semibold leading-7 lg:mx-0">منصة واحدة تجمع مواردك البشرية وشؤونك المالية<br className="hidden sm:block"/> وخدمة عملائك في مكان واحد.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button asChild className="h-12 min-w-40 bg-buy-gold text-buy-navy hover:bg-buy-gold/90"><Link to="/register">ابدأ الآن <ArrowLeft /></Link></Button>
              <Button variant="outline" className="h-12 min-w-40 border-buy-navy bg-card/80 text-buy-navy" onClick={() => setVideo(true)}>شاهد الفيديو <Play /></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-public-strip">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 px-3 sm:grid-cols-3 lg:grid-cols-5">{publicFeatures.map((item, i) => { const Icon = featureIcons[i] ?? Boxes; return <div key={item.title} className="flex min-h-[102px] items-center justify-center gap-3 border-border p-3 text-center lg:border-l"><Icon className="size-7 shrink-0 text-buy-navy"/><div><h2 className="text-xs font-extrabold">{item.title}</h2><p className="mt-1 text-[10px] text-muted-foreground">{item.text}</p></div></div>; })}</div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-8" id="systems">
        <div className="text-center"><span className="text-xs font-bold text-primary">الأنظمة الرئيسية</span><h2 className="mt-1 text-2xl font-black sm:text-3xl">ثلاثة أنظمة .. منصة واحدة</h2><p className="mt-1 text-sm text-muted-foreground">كل ما تحتاجه لإدارة منشأتك بكفاءة واحترافية</p></div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">{publicSystems.map((system) => { const Icon = systemIcons[system.key]; return <article key={system.key} className={`group relative min-h-[260px] overflow-hidden rounded-lg border border-border shadow-sm ${system.tone}`}><img src={systemImages[system.key]} width={992} height={672} loading="lazy" alt={system.title} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"/><div className="absolute inset-0 bg-system-card"/><div className="relative flex min-h-[260px] flex-col items-start p-6"><span className="grid size-12 place-items-center rounded-full bg-card/90 shadow"><Icon className="size-7"/></span><h3 className="mt-3 text-xl font-black">{system.title}</h3><p className="mt-1 max-w-[240px] text-xs font-semibold leading-5">{system.text}</p><ul className="mt-3 space-y-1 text-[11px] font-bold">{system.points.map(point => <li key={point} className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5"/>{point}</li>)}</ul><Button asChild className="mt-auto h-9 w-full bg-current text-card hover:opacity-90"><Link to={system.to}><span className="text-inherit">اكتشف المزيد</span><ArrowLeft /></Link></Button></div></article>; })}</div>
      </section>

      <section className="border-y border-border bg-public-strip"><div className="mx-auto grid max-w-[1170px] grid-cols-2 px-3 md:grid-cols-4">{publicStats.map((item, i) => { const Icon = statIcons[i] ?? Building2; return <div key={item.label} className="flex min-h-[88px] items-center justify-center gap-4 border-border px-3 text-center md:border-l"><Icon className="size-8 text-primary"/><div><strong className="block text-xl font-black">{item.value}</strong><span className="text-xs text-muted-foreground">{item.label}</span></div></div>; })}</div></section>

      <section className="relative overflow-hidden bg-buy-navy px-4 py-7 text-primary-foreground"><div className="absolute inset-0 opacity-15 public-city"/><div className="relative mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-right"><div><h2 className="text-2xl font-black">التحقق من الشهادات</h2><p className="mt-1 text-sm opacity-85">تحقق من صحة الشهادات والمؤهلات للطبيب ومن الكادر الصحي المعتمد</p></div><Button asChild className="h-11 bg-buy-gold px-7 font-extrabold text-buy-navy hover:bg-buy-gold/90"><Link to="/verify-certificate"><FileCheck2/> التحقق من الشهادات</Link></Button></div></section>
    </main>
    <Dialog open={video} onOpenChange={setVideo}><DialogContent dir="rtl" className="max-w-xl"><DialogHeader className="text-right"><DialogTitle>جولة سريعة في تكامل بلس</DialogTitle><DialogDescription>عرض توضيحي للمنصة وأنظمتها الرئيسية.</DialogDescription></DialogHeader><div className="grid aspect-video place-items-center rounded-lg bg-buy-navy text-primary-foreground"><div className="text-center"><Play className="mx-auto size-14 text-buy-gold"/><p className="mt-3 font-bold">الفيديو التعريفي التجريبي</p></div></div></DialogContent></Dialog>
  </div>;
}