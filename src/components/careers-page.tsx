import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Bookmark, BookmarkCheck, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, ClipboardList, FileText, Filter, Gift, HeartHandshake, MapPin, RotateCcw, Scale, Search, Send, Share2, ShieldPlus, Star, Upload, UserRound, Users, Wallet, X, BarChart3, Armchair } from "lucide-react";
import hero from "@/assets/careers-hero.jpg";
import { careerJobs, type CareerJob } from "@/data/mockData";

const navy = "bg-[var(--careers-navy)] text-primary-foreground";
const departments = ["الإدارة التنفيذية", "الموارد البشرية", "المالية", "تقنية المعلومات", "خدمة العملاء", "التسويق والاتصال", "أخرى"];
const types = ["دوام كامل", "دوام جزئي", "عقد مؤقت", "تدريب تعاوني"];
const cities = ["الرياض", "جدة", "الدمام", "عن بعد"];

function Check({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
  return <label className="flex cursor-pointer items-center gap-2 py-1 text-sm"><input type="checkbox" checked={on} onChange={toggle} className="size-4 accent-[var(--careers-navy)]" />{label}</label>;
}
function Group({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mt-5"><h4 className="mb-2 font-extrabold text-[var(--careers-navy)]">{title}</h4>{children}</div>;
}

export function CareersPage() {
  const [q, setQ] = useState(""), [heroQ, setHeroQ] = useState("");
  const [draft, setDraft] = useState({ d: [] as string[], t: [] as string[], c: [] as string[] });
  const [applied, setApplied] = useState(draft);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(careerJobs[0].id);
  const [saved, setSaved] = useState<string[]>([]);
  const [apply, setApply] = useState(false), [done, setDone] = useState(false), [toast, setToast] = useState("");

  const list = useMemo(() => {
    const s = (q || heroQ).trim();
    return careerJobs.filter(j => (!s || (j.title + j.dept).includes(s)) && (!applied.d.length || applied.d.includes(j.dept)) && (!applied.t.length || applied.t.includes(j.type)) && (!applied.c.length || applied.c.includes(j.city)))
      .sort((a, b) => sort === "new" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [q, heroQ, applied, sort]);
  const pages = Math.max(1, Math.ceil(list.length / 6));
  const shown = list.slice((page - 1) * 6, page * 6);
  const job = careerJobs.find(j => j.id === selected)!;
  const tog = (k: "d" | "t" | "c", v: string) => setDraft(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const toggleSave = (id: string) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const pick = (j: CareerJob) => { setSelected(j.id); if (window.innerWidth < 1024) document.getElementById("job-details")?.scrollIntoView({ behavior: "smooth" }); };

  return <div dir="rtl" className="min-h-screen bg-[var(--careers-page)] text-foreground">
    <header className="border-b border-border bg-card"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
      <div className="flex items-center gap-3"><button className={`${navy} h-11 rounded-md px-7 text-sm font-bold`}>إنشاء حساب</button><Link to="/" className="flex items-center gap-2 text-sm font-bold text-[var(--careers-navy)]"><span className="grid size-9 place-items-center rounded-full bg-primary-soft"><UserRound size={20} /></span><span className="hidden sm:inline">تسجيل الدخول</span></Link><span className="relative"><Bell className="text-[var(--careers-navy)]" /><b className="absolute -top-2 -right-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] text-primary-foreground">5</b></span></div>
      <nav className="order-3 flex w-full justify-center gap-6 overflow-x-auto text-sm font-semibold md:order-none md:w-auto">{["الرئيسية", "الوظائف", "نبذة عنا", "الأسئلة الشائعة", "تواصل معنا"].map(n => <a key={n} className={`whitespace-nowrap py-2 ${n === "الوظائف" ? "border-b-2 border-[var(--careers-navy)] font-extrabold text-[var(--careers-navy)]" : "text-[var(--careers-navy)]/80"}`}>{n}</a>)}</nav>
      <div className="flex items-center gap-2"><div className="text-left leading-tight"><b className="block text-2xl font-black text-[var(--careers-navy)]">تكامل بلس</b><span className="block text-[9px] font-bold tracking-widest text-[var(--careers-navy)]" dir="ltr">TAKAMUL PLUS</span><span className="block text-[10px] text-[var(--careers-navy)]">حلول متكاملة لإدارة الأعمال</span></div><span className="size-8 rotate-45 rounded-sm bg-[var(--careers-navy)]" /></div>
    </div></header>

    <section className="relative h-[230px] overflow-hidden sm:h-[260px]">
      <img src={hero} alt="موظف ينظر إلى أفق مدينة الرياض" width={1920} height={640} className="absolute inset-0 size-full -scale-x-100 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-card/70 via-card/35 to-card/10" />
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-black text-[var(--careers-navy)] sm:text-4xl">فرص تصنع مستقبلك</h1>
        <p className="mt-2 text-sm font-bold text-[var(--careers-navy)] sm:text-lg">انضم إلى فريقنا وساهم في بناء بيئة عمل متميزة</p>
        <div className="mt-5 flex w-full max-w-[510px] overflow-hidden rounded-lg bg-card shadow-lg"><input value={heroQ} onChange={e => { setHeroQ(e.target.value); setPage(1); }} placeholder="ابحث عن وظيفة، مسمى وظيفي أو قسم ..." className="h-11 flex-1 bg-transparent px-4 text-sm outline-none" /><button className={`${navy} m-1 grid w-10 place-items-center rounded-md`}><Search size={18} /></button></div>
      </div>
      <p className="absolute top-12 right-6 hidden text-3xl font-bold leading-snug text-primary-foreground drop-shadow lg:block">معاً<br />نبني<br />المستقبل</p>
    </section>

    <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-y-4 px-4 py-6 lg:grid-cols-4">
      {[[Star, "فريق احترافي", "هنا تصنع الفرق"], [Scale, "توازن بين الحياة والعمل", "نهتم بمرتباتك"], [BarChart3, "فرص للنمو والتطوير", "برامج تدريبية مستمرة"], [Users, "بيئة عمل محفزة", "ندعم تطورك المهني"]].map(([I, t, s], i) => { const Icon = I as typeof Star; return <div key={i} className={`text-center ${i < 3 ? "lg:border-l lg:border-border" : ""}`}><Icon className="mx-auto text-primary" size={32} /><b className="mt-2 block text-[var(--careers-navy)]">{t as string}</b><span className="text-sm text-muted-foreground">{s as string}</span></div>; })}
    </section>

    <main className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-10 lg:grid-cols-[1fr_1.35fr_0.8fr]">
      <aside id="job-details" className="rounded-xl border border-border bg-card p-4 lg:self-start">
        <div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2"><button onClick={() => toggleSave(job.id)} className="grid size-9 place-items-center rounded-md bg-primary-soft text-[var(--careers-navy)]">{saved.includes(job.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button><h2 className="text-2xl font-black text-[var(--careers-navy)]">{job.title}</h2></div>{job.isNew && <span className="rounded-md bg-success px-3 py-1 text-xs font-bold text-primary-foreground">جديدة</span>}</div>
        <p className="mt-2 flex items-center gap-2 font-semibold text-[var(--careers-navy)]"><span className="grid size-9 place-items-center rounded-md bg-primary-soft"><Building2 size={18} /></span>{job.dept}</p>
        <p className="mt-2 flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin size={15} />{job.city}</span>|<span className="flex items-center gap-1"><ClipboardList size={15} />{job.type}</span></p>
        <button onClick={() => { setApply(true); setDone(false); }} className={`${navy} mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md font-bold`}><Send size={18} />التقديم على الوظيفة</button>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">{[[BriefcaseBusiness, "نوع العقد", job.type], [Users, "عدد الشواغر", String(job.vacancies)], [CalendarDays, "تاريخ النشر", job.date]].map(([I, l, v], i) => { const Icon = I as typeof Users; return <div key={i} className="rounded-lg bg-primary-soft/60 p-3"><Icon className="mx-auto text-[var(--careers-navy)]" size={22} /><span className="mt-1 block">{l as string}</span><span className="block">{v as string}</span></div>; })}</div>
        <h3 className="mt-5 flex items-center gap-2 font-extrabold text-[var(--careers-navy)]"><FileText size={18} />الوصف الوظيفي</h3>
        <p className="mt-2 text-sm leading-7">{job.desc}</p>
        <h3 className="mt-4 flex items-center gap-2 font-extrabold text-[var(--careers-navy)]"><ClipboardCheck size={18} />المتطلبات</h3>
        <ul className="mt-2 space-y-2 text-sm">{job.reqs.map(r => <li key={r} className="flex items-center gap-2"><CheckCircle2 size={16} className="fill-success text-card" />{r}</li>)}</ul>
        <h3 className="mt-5 flex items-center gap-2 font-extrabold text-[var(--careers-navy)]"><Gift size={18} />المزايا</h3>
        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">{[[Wallet, "راتب تنافسي"], [ShieldPlus, "تأمين طبي"], [HeartHandshake, "تطوير مهني"], [Armchair, "بيئة عمل مرنة"]].map(([I, l], i) => { const Icon = I as typeof Wallet; return <div key={i} className="rounded-lg bg-primary-soft/60 p-2"><Icon className="mx-auto text-[var(--careers-navy)]" size={20} /><span className="mt-1 block">{l as string}</span></div>; })}</div>
        <button onClick={() => { navigator.clipboard?.writeText(window.location.href); flash("تم نسخ رابط الوظيفة."); }} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-primary-soft/40 font-bold text-[var(--careers-navy)]"><Share2 size={18} />مشاركة الوظيفة</button>
      </aside>

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between"><h2 className="text-xl font-black text-[var(--careers-navy)]">الوظائف المتاحة ({list.length})</h2><label className="relative"><select value={sort} onChange={e => setSort(e.target.value as "new" | "old")} className="h-8 appearance-none rounded-md border border-border bg-card pl-8 pr-3 text-xs"><option value="new">الأحدث أولاً</option><option value="old">الأقدم أولاً</option></select><ChevronDown size={14} className="pointer-events-none absolute left-2 top-2" /></label></div>
        <div className="mt-4 space-y-3">{shown.length === 0 && <p className="rounded-lg bg-muted p-8 text-center text-sm text-muted-foreground">لا توجد وظائف مطابقة لبحثك.</p>}
          {shown.map(j => { const on = j.id === selected; return <article key={j.id} onClick={() => pick(j)} className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${on ? "border-primary bg-primary-soft/50 shadow-sm" : "border-border hover:border-primary/50"}`}>
            <div className="min-w-0 flex-1"><b className="block text-lg font-extrabold text-[var(--careers-navy)]">{j.title}</b><span className="text-sm text-muted-foreground">{j.dept}</span><p className="mt-2 flex gap-5 text-sm"><span className="flex items-center gap-1"><MapPin size={14} />{j.city}</span><span className="flex items-center gap-1"><ClipboardList size={14} />{j.type}</span></p></div>
            <div className="flex flex-col items-end justify-between gap-2"><div className="flex items-center gap-3">{j.isNew ? <span className="rounded bg-success-soft px-2 py-0.5 text-xs font-bold text-success">جديدة</span> : <span className="text-sm text-muted-foreground">{j.date}</span>}<button onClick={e => { e.stopPropagation(); toggleSave(j.id); }} className="text-[var(--careers-navy)]" aria-label="حفظ">{saved.includes(j.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div><button className={`h-8 rounded-md px-6 text-xs font-bold ${on ? "bg-primary text-primary-foreground" : "border border-[var(--careers-navy)]/50 text-[var(--careers-navy)]"}`}>عرض التفاصيل</button></div>
            <span className="order-first grid size-16 shrink-0 place-items-center rounded-lg bg-primary-soft text-[var(--careers-navy)]"><Building2 size={30} /></span>
          </article>; })}</div>
        <div className="mt-5 flex justify-center gap-2"><button onClick={() => setPage(p => Math.max(1, p - 1))} className="grid size-8 place-items-center rounded-md border border-border"><ChevronRight size={16} /></button>{Array.from({ length: Math.max(3, pages) }, (_, i) => i + 1).map(n => <button key={n} disabled={n > pages} onClick={() => setPage(n)} className={`size-8 rounded-md border text-sm ${n === page ? "border-primary bg-primary text-primary-foreground" : "border-border"} disabled:opacity-50`}>{n}</button>)}<button onClick={() => setPage(p => Math.min(pages, p + 1))} className="grid size-8 place-items-center rounded-md border border-border"><ChevronLeft size={16} /></button></div>
      </section>

      <aside className="rounded-xl border border-border bg-card p-4 lg:self-start">
        <h3 className="flex items-center gap-2 text-lg font-black text-[var(--careers-navy)]"><Filter size={20} />تصفية النتائج</h3>
        <label className="mt-4 flex h-10 items-center gap-2 rounded-md border border-border px-3"><input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="ابحث في الوظائف ..." className="flex-1 bg-transparent text-sm outline-none" /><Search size={16} className="text-muted-foreground" /></label>
        <Group title="القسم">{departments.map(v => <Check key={v} label={v} on={draft.d.includes(v)} toggle={() => tog("d", v)} />)}</Group>
        <Group title="نوع الدوام">{types.map(v => <Check key={v} label={v} on={draft.t.includes(v)} toggle={() => tog("t", v)} />)}</Group>
        <Group title="الموقع">{cities.map(v => <Check key={v} label={v} on={draft.c.includes(v)} toggle={() => tog("c", v)} />)}</Group>
        <button onClick={() => { setApplied(draft); setPage(1); }} className={`${navy} mt-6 h-11 w-full rounded-md font-bold`}>تطبيق الفلاتر</button>
        <button onClick={() => { const e = { d: [], t: [], c: [] }; setDraft(e); setApplied(e); setQ(""); setHeroQ(""); setPage(1); }} className="mt-3 flex w-full items-center justify-center gap-2 py-2 text-sm font-bold text-[var(--careers-navy)]"><RotateCcw size={16} />إعادة تعيين</button>
      </aside>
    </main>

    {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-success px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg">{toast}</div>}
    {apply && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setApply(false)}><div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-card p-5">
      <div className="flex items-center justify-between"><h3 className="text-lg font-black text-[var(--careers-navy)]">التقديم على وظيفة {job.title}</h3><button onClick={() => setApply(false)}><X /></button></div>
      {done ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto text-success" size={48} /><b className="mt-3 block">تم إرسال طلبك بنجاح</b><p className="mt-1 text-sm text-muted-foreground">سنتواصل معك قريبًا عبر البريد الإلكتروني.</p></div> :
        <form onSubmit={e => { e.preventDefault(); setDone(true); }} className="mt-4 space-y-3 text-sm">{[["الاسم الكامل", "text"], ["رقم الجوال", "tel"], ["البريد الإلكتروني", "email"]].map(([l, t]) => <label key={l} className="block"><span className="font-bold">{l}</span><input required type={t} className="mt-1 h-10 w-full rounded-md border border-border px-3" /></label>)}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-primary bg-primary-soft/40 p-4 font-bold text-primary"><Upload size={18} />رفع السيرة الذاتية (PDF)<input required type="file" accept=".pdf,.doc,.docx" className="sr-only" /></label>
          <button className={`${navy} h-11 w-full rounded-md font-bold`}>إرسال الطلب</button></form>}
    </div></div>}
  </div>;
}
