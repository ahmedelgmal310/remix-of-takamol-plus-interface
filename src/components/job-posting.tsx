import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Eye, FileText, Filter, Home, Link2, Mail, MapPin, MoreVertical, Save, Search, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import building from "@/assets/job-building.jpg";
import sara from "@/assets/candidate-sara.jpg";
import ahmed from "@/assets/candidate-ahmed.jpg";
import reem from "@/assets/candidate-reem.jpg";
import khaled from "@/assets/candidate-khaled.jpg";

type St = "new" | "review" | "fit" | "unfit";
const stMap: Record<St, [string, string]> = { new: ["جديد", "bg-primary-soft text-primary"], review: ["قيد المراجعة", "bg-warning-soft text-warning"], fit: ["مناسب مبدئياً", "bg-success-soft text-success"], unfit: ["غير مناسب", "bg-destructive/10 text-destructive"] };
const base = [
  { name: "سارة عبدالله أحمد", img: sara, id: "110********", q: "بكالوريوس محاسبة", exp: 4, date: "2025/09/23", st: "new" as St },
  { name: "أحمد محمد السبيعي", img: ahmed, id: "108********", q: "بكالوريوس محاسبة", exp: 5, date: "2025/09/22", st: "review" as St },
  { name: "ريم فهد العتيبي", img: reem, id: "107********", q: "ماجستير محاسبة", exp: 6, date: "2025/09/22", st: "fit" as St },
  { name: "خالد علي الغامدي", img: khaled, id: "109********", q: "بكالوريوس محاسبة", exp: 3, date: "2025/09/21", st: "unfit" as St },
];
const pages: (typeof base)[] = [base, [...base].reverse(), [2, 0, 3, 1].map(i => base[i]!)];
const steps = ["بيانات الوظيفة", "شروط ومتطلبات الوظيفة", "قنوات النشر", "مراجعة ونشر"];
const inp = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none";

function Sel({ v, on, opts }: { v: string; on: (s: string) => void; opts: string[] }) { return <div className="relative"><select value={v} onChange={e => on(e.target.value)} className={`${inp} appearance-none pl-8`}>{opts.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute left-3 top-3" /></div>; }
function Row({ label, req, children }: { label: string; req?: boolean; children: ReactNode }) { return <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3 text-sm font-bold"><span>{req && <span className="text-destructive">* </span>}{label}</span>{children}</div>; }

export function JobPostingPage() {
  const [step, setStep] = useState(0); const [msg, setMsg] = useState("");
  const [j, setJ] = useState({ title: "محاسب - 3 سنوات", dept: "الإدارة المالية", loc: "الرياض - المقر الرئيسي", type: "دوام كامل", count: "1", grade: "8", qual: "من 3 سنوات", sal: "10,000 إلى 14,000 ريال", from: "2025/09/22", to: "2025/10/10", desc: "المساهمة في إعداد التقارير المالية وتحليل البيانات وإعداد الميزانيات ومتابعة العمليات المحاسبية وفقاً للمعايير المالية المعتمدة." });
  const set = (k: keyof typeof j) => (v: string) => setJ(p => ({ ...p, [k]: v }));
  const [f, setF] = useState<"all" | St>("all"); const [q, setQ] = useState(""); const [page, setPage] = useState(0);
  const rows = useMemo(() => (pages[page] ?? base).filter(r => (f === "all" || r.st === f) && (!q || r.name.includes(q) || r.id.includes(q))), [f, q, page]);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const filters: [typeof f, string][] = [["all", "الطلبات (28)"], ["review", "قيد المراجعة (15)"], ["fit", "مناسب (5)"], ["unfit", "غير مناسب (8)"], ["all", "جميع الطلبات (28)"]];
  const share = [["LinkedIn", "in", "bg-primary text-primary-foreground"], ["X", "𝕏", "bg-foreground text-background"], ["واتساب", "✆", "bg-success text-primary-foreground"]];

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><nav className="flex items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />التوظيف<ChevronLeft size={12} />طرح وظيفة جديدة</nav><h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><BriefcaseBusiness className="text-primary" />طرح وظيفة جديدة</h1><p className="mt-1 text-sm">إنشاء إعلان وظيفي واستقبال طلبات التوظيف</p></div>
      <div className="flex gap-2"><button onClick={() => setStep(s => Math.min(3, s + 1))} className="flex h-11 items-center gap-2 rounded-md bg-primary px-10 text-sm font-bold text-primary-foreground">التالي<ArrowRight size={17} /></button><button onClick={() => flash("تم حفظ الإعلان كمسودة.")} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-8 text-sm font-bold">حفظ كمسودة<Save size={17} /></button><button onClick={() => setStep(s => Math.max(0, s - 1))} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-8 text-sm font-bold">رجوع<ArrowLeft size={17} /></button></div></div>

    <section className="panel mt-3 overflow-x-auto p-4"><ol className="flex min-w-[600px]">{steps.map((s, i) => <li key={s} className="relative flex flex-1 flex-col items-center">{i < 3 && <span className="absolute top-4 h-px bg-border" style={{ right: "50%", left: "-50%" }} />}<button onClick={() => setStep(i)} className={`relative z-10 grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i === step ? "bg-primary" : i < step ? "bg-success" : "bg-muted-foreground/60"}`}>{i < step ? <Check size={15} /> : i + 1}</button><b className={`mt-2 text-sm ${i === step ? "text-brand-deep" : ""}`}>{s}</b></li>)}</ol></section>
    {msg && <p className="mt-3 rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid min-w-0 content-start gap-3">
        <section className="panel p-4"><h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-brand-deep"><BriefcaseBusiness className="text-primary" />{steps[step]}</h2>
          {step === 0 ? <div className="grid gap-3 lg:grid-cols-2">
            <Row label="المسمى الوظيفي" req><input value={j.title} onChange={e => set("title")(e.target.value)} className={inp} /></Row>
            <Row label="الدرجة الوظيفية"><Sel v={j.grade} on={set("grade")} opts={["6", "7", "8", "9", "10"]} /></Row>
            <Row label="القسم" req><Sel v={j.dept} on={set("dept")} opts={["الإدارة المالية", "الموارد البشرية", "تقنية المعلومات", "المبيعات"]} /></Row>
            <Row label="المؤهل العلمي"><Sel v={j.qual} on={set("qual")} opts={["من 3 سنوات", "بكالوريوس", "ماجستير"]} /></Row>
            <Row label="الموقع" req><Sel v={j.loc} on={set("loc")} opts={["الرياض - المقر الرئيسي", "جدة - الفرع الغربي", "الدمام - الفرع الشرقي"]} /></Row>
            <Row label="الراتب المتوقع"><Sel v={j.sal} on={set("sal")} opts={["8,000 إلى 10,000 ريال", "10,000 إلى 14,000 ريال", "14,000 إلى 18,000 ريال"]} /></Row>
            <Row label="نوع العقد" req><Sel v={j.type} on={set("type")} opts={["دوام كامل", "دوام جزئي", "عقد مؤقت"]} /></Row>
            <Row label="تاريخ التقديم من"><div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2"><input value={j.from} onChange={e => set("from")(e.target.value)} className={inp} /><span className="text-xs">إلى</span><input value={j.to} onChange={e => set("to")(e.target.value)} className={inp} /></div></Row>
            <Row label="عدد الوظائف" req><input type="number" min={1} value={j.count} onChange={e => set("count")(e.target.value)} className={inp} /></Row>
            <Row label="وصف الوظيفة"><span /></Row>
            <div className="lg:col-span-2"><textarea maxLength={500} value={j.desc} onChange={e => set("desc")(e.target.value)} className="h-16 w-full resize-none rounded-md border border-input bg-background p-3 text-sm outline-none" /><small className="text-muted-foreground">{j.desc.length}/500</small></div>
          </div> : step === 1 ? <ul className="grid gap-2 text-sm">{["بكالوريوس محاسبة أو ما يعادله", "خبرة لا تقل عن 3 سنوات", "إجادة برامج المحاسبة وExcel", "شهادة SOCPA ميزة إضافية"].map(x => <li key={x} className="flex items-center gap-2 rounded-md border border-border p-3"><Check size={16} className="text-success" />{x}</li>)}</ul>
            : step === 2 ? <div className="grid gap-2 sm:grid-cols-2">{["موقع الشركة", "LinkedIn", "منصة جدارات", "X (تويتر)"].map(x => <label key={x} className="flex items-center justify-between rounded-md border border-border p-3 text-sm font-bold">{x}<input type="checkbox" defaultChecked className="size-4" /></label>)}</div>
            : <div className="grid gap-3 text-sm"><p>راجع بيانات الإعلان في النموذج ثم اضغط نشر.</p><button onClick={() => flash("تم نشر الإعلان الوظيفي بنجاح.")} className="h-11 w-40 rounded-md bg-primary font-bold text-primary-foreground">نشر الإعلان</button></div>}
        </section>

        <section className="panel p-4"><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-brand-deep"><Users className="text-primary" />المرشحون المتقدمون</h2>
          <div className="grid gap-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,1fr))]"><div className="relative"><input value={q} onChange={e => setQ(e.target.value)} placeholder="البحث باسم المرشح أو رقم الهوية أو البريد الإلكتروني ..." className={`${inp} pl-9 text-xs`} /><Search size={16} className="absolute left-3 top-3" /></div>{filters.map(([k, l], i) => <button key={l} onClick={() => setF(k)} className={`h-10 rounded-md border text-xs font-bold ${f === k && (i !== 4 || k !== "all") && !(i === 4) ? "border-primary bg-primary-soft text-primary" : "border-border"}`}>{l}</button>)}</div>
          <div className="mt-2 flex gap-2"><button className="flex h-9 items-center gap-2 rounded-md bg-primary px-6 text-xs font-bold text-primary-foreground">تصفية<Filter size={14} /></button><div className="w-52"><select className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"><option>عرض السيرة الذاتية</option><option>تحميل السير الذاتية</option></select></div></div>
          <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[760px] text-xs"><thead className="bg-search"><tr>{["#", "اسم المرشح", "رقم الهوية", "المؤهل العلمي", "الخبرة", "تاريخ التقديم", "حالة الطلب", "الإجراءات"].map(h => <th key={h} className="p-2 text-center font-bold">{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.name} className="border-b border-border text-center"><td className="p-2">{page * 4 + i + 1}</td><td className="p-2"><div className="flex items-center gap-2"><img src={r.img} alt={r.name} className="size-8 rounded-full object-cover" />{r.name}</div></td><td className="p-2">{r.id}</td><td className="p-2">{r.q}</td><td className="p-2">{r.exp} سنوات</td><td className="p-2">{r.date}</td><td className="p-2"><span className={`inline-block min-w-20 rounded px-2 py-1 ${stMap[r.st][1]}`}>{stMap[r.st][0]}</span></td><td className="p-2"><div className="flex justify-center gap-1">{[<MoreVertical key="m" size={15} />, <FileText key="f" size={15} />, <Eye key="e" size={15} />].map((ic, n) => <button key={n} className="grid size-7 place-items-center rounded border border-border text-primary">{ic}</button>)}</div></td></tr>)}{!rows.length && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">لا يوجد مرشحون مطابقون</td></tr>}</tbody></table></div>
          <div className="mt-3 flex items-center justify-between text-xs"><span>عرض {rows.length} من 28 نتيجة</span><div className="flex gap-1"><button onClick={() => setPage(p => Math.max(0, p - 1))} className="grid size-8 place-items-center rounded border border-border"><ChevronRight size={14} /></button>{[0, 1, 2].map(p => <button key={p} onClick={() => setPage(p)} className={`size-8 rounded border ${p === page ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{p + 1}</button>)}<button onClick={() => setPage(p => Math.min(2, p + 1))} className="grid size-8 place-items-center rounded border border-border"><ChevronLeft size={14} /></button></div></div>
        </section>
      </div>

      <aside className="panel h-fit p-4"><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-brand-deep"><FileText className="text-primary" />نموذج الإعلان</h2>
        <div className="overflow-hidden rounded-lg border border-border"><div className="relative h-24"><img src={building} alt="مقر الشركة" loading="lazy" className="size-full object-cover object-[15%_60%]" /><span className="absolute top-2 left-2 rounded bg-success px-2 py-0.5 text-xs font-bold text-primary-foreground">نشط</span></div>
          <div className="p-3"><b className="block text-xl font-extrabold text-brand-deep">{j.title.split(" - ")[0] === "محاسب" ? "محاسب أول" : j.title}</b><p className="mt-1 flex items-center gap-1 text-xs"><MapPin size={13} />{j.loc}</p>
            <div className="mt-3 grid grid-cols-3 border-y border-border py-3 text-center text-[11px]">{[[<Clock key="a" size={17} />, j.type], [<Building2 key="b" size={17} />, j.dept], [<BriefcaseBusiness key="c" size={17} />, `${j.count} وظيفة`]].map(([ic, t], i) => <div key={i} className="grid justify-items-center gap-1 text-primary"><span>{ic}</span><span className="text-foreground">{t}</span></div>)}</div>
            <p className="mt-3 text-sm leading-6">{j.desc}</p></div></div>
        <button className="mt-2 h-10 w-full rounded-md border border-border text-sm font-bold">تفاصيل أكثر</button>
        <button className="mt-2 h-10 w-full rounded-md bg-primary text-sm font-bold text-primary-foreground">تقدم الآن</button>
        <b className="mt-4 block text-sm text-brand-deep">شارك الإعلان</b>
        <div className="mt-3 flex justify-between">{share.map(([n, t, c]) => <button key={n} aria-label={n} className={`grid size-9 place-items-center rounded-md text-lg font-extrabold ${c}`}>{t}</button>)}<button aria-label="البريد" className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary"><Mail size={18} /></button><button aria-label="نسخ الرابط" onClick={() => { navigator.clipboard?.writeText(location.href); flash("تم نسخ رابط الإعلان."); }} className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary"><Link2 size={18} /></button></div>
      </aside>
    </div>
    <Link to="/recruitment/requests" className="sr-only">استقبال الطلبات</Link>
  </div></main></AppShell>;
}
