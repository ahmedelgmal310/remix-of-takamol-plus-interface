import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock, FileSearch, FolderOpen, Home, MoreVertical, Plus, Search, SquarePen, Eye, Users, X, XCircle, Circle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import banner from "@/assets/recruit-banner.jpg";

type Status = "بالانتظار" | "قيد المراجعة" | "مقبولة" | "تم رفضها" | "مستمرة";
type Req = { id: string; job: string; dept: string; applicants: number; status: Status; date: string; updated: string; desc: string };
const ST: Record<Status, string> = { "بالانتظار": "--warning", "قيد المراجعة": "--primary", "مقبولة": "--success", "مستمرة": "--success", "تم رفضها": "--destructive" };
const STEP_OF: Record<Status, number> = { "بالانتظار": 1, "قيد المراجعة": 2, "مستمرة": 3, "مقبولة": 4, "تم رفضها": 2 };
const STEPS = ["استلام الطلبات", "فرز الطلبات", "المقابلات", "العرض الوظيفي", "التعيين"];
const FIRST: [string, string, number, Status, string, string][] = [
  ["أخصائي دعم فني", "تقنية المعلومات", 15, "بالانتظار", "2025/09/24", "يقدم الدعم الفني وحل المشكلات التقنية للمستخدمين."],
  ["أخصائي موارد بشرية", "الموارد البشرية", 28, "قيد المراجعة", "2025/09/22", "يتابع إجراءات التوظيف وشؤون الموظفين."],
  ["محلل مالي", "الإدارة المالية", 12, "مقبولة", "2025/09/20", "يحلل البيانات المالية ويعد التقارير الدورية."],
  ["أخصائي تسويق رقمي", "التسويق", 7, "تم رفضها", "2025/09/18", "يدير الحملات التسويقية على المنصات الرقمية."],
  ["مشرف عمليات", "العمليات", 20, "مستمرة", "2025/09/16", "يشرف على سير العمليات اليومية."],
  ["مندوب مبيعات", "المبيعات", 9, "بالانتظار", "2025/09/14", "يتواصل مع العملاء لتحقيق أهداف المبيعات."],
  ["مطور برمجيات", "تقنية المعلومات", 31, "قيد المراجعة", "2025/09/12", "يطور ويصون أنظمة الشركة البرمجية."],
  ["طبيب استشاري", "الإدارة الطبية", 14, "مقبولة", "2025/09/10", "يقدم الاستشارات الطبية للموظفين."],
  ["محاسب عام", "المالية", 6, "تم رفضها", "2025/09/08", "يسجل القيود المحاسبية ويطابق الحسابات."],
  ["أخصائي خدمة عملاء", "خدمة العملاء", 18, "مستمرة", "2025/09/05", "يستقبل استفسارات العملاء ويتابع حلها."],
];
// 124 requests: 32 waiting, 45 review, 38 accepted/continuing, 9 rejected
const buildData = (): Req[] => {
  const pool: Status[] = [...Array(32 - 2).fill("بالانتظار"), ...Array(45 - 2).fill("قيد المراجعة"), ...Array(38 - 4).fill("مقبولة"), ...Array(9 - 2).fill("تم رفضها")];
  const list: Req[] = FIRST.map(([job, dept, applicants, status, date, desc], i) => ({ id: `JOB-2025-${String(i + 1).padStart(3, "0")}`, job, dept, applicants, status, date, updated: i === 0 ? "2025/09/25 10:30" : `${date} 09:00`, desc }));
  for (let i = 0; i < 114; i++) { const f = FIRST[i % 10]!; const day = new Date(2025, 8, 4 - Math.floor(i / 2)); const date = `${day.getFullYear()}/${String(day.getMonth() + 1).padStart(2, "0")}/${String(day.getDate()).padStart(2, "0")}`;
    list.push({ id: `JOB-2025-${String(i + 11).padStart(3, "0")}`, job: f[0], dept: f[1], applicants: 5 + (i * 7) % 30, status: pool[(i * 37) % 114]!, date, updated: `${date} 11:00`, desc: f[5] }); }
  return list;
};
const card = "rounded-xl border border-border bg-card shadow-sm";
const sel = "h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const Badge = ({ s }: { s: Status }) => <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-bold" style={{ color: `var(${ST[s]})`, background: `color-mix(in oklch, var(${ST[s]}) 13%, transparent)` }}><span className="size-2 rounded-full" style={{ background: `var(${ST[s]})` }} />{s}</span>;

export function RecruitmentTracking() {
  const [data, setData] = useState(buildData);
  const [q, setQ] = useState(""), [fs, setFs] = useState(""), [fj, setFj] = useState(""), [fd, setFd] = useState(""), [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [page, setPage] = useState(1), [size, setSize] = useState(10);
  const [selId, setSelId] = useState("JOB-2025-001"), [menu, setMenu] = useState<string | null>(null);
  const [edit, setEdit] = useState<Req | null>(null), [full, setFull] = useState(false), [msg, setMsg] = useState("");
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const jobs = [...new Set(data.map(r => r.job))], depts = [...new Set(data.map(r => r.dept))];
  const filtered = useMemo(() => data.filter(r => (!q || r.id.includes(q.toUpperCase()) || r.job.includes(q)) && (!fs || (fs === "مقبولة" ? r.status === "مقبولة" || r.status === "مستمرة" : r.status === fs)) && (!fj || r.job === fj) && (!fd || r.dept === fd) && (!from || r.date >= from.replaceAll("-", "/")) && (!to || r.date <= to.replaceAll("-", "/"))), [data, q, fs, fj, fd, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / size)), cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * size, cur * size);
  const sel_ = data.find(r => r.id === selId) ?? data[0];
  const cnt = (f: (r: Req) => boolean) => data.filter(f).length;
  const stats: [number, string, string, typeof Users][] = [
    [data.length, "إجمالي الطلبات", "--primary", FolderOpen], [cnt(r => r.status === "بالانتظار"), "بالانتظار", "--warning", Clock],
    [cnt(r => r.status === "قيد المراجعة"), "قيد المراجعة", "--primary", Users], [cnt(r => r.status === "مقبولة" || r.status === "مستمرة"), "مقبولة / مستمرة", "--success", CheckCircle2], [cnt(r => r.status === "تم رفضها"), "تم رفضها", "--destructive", XCircle]];
  const setStatus = (r: Req, s: Status, m: string) => { setData(d => d.map(x => x.id === r.id ? { ...x, status: s, updated: new Date().toLocaleString("en-CA", { hour12: false }).slice(0, 16).replaceAll("-", "/").replace(",", "") } : x)); setMenu(null); flash(m); };
  const next: Record<Status, Status> = { "بالانتظار": "قيد المراجعة", "قيد المراجعة": "مستمرة", "مستمرة": "مقبولة", "مقبولة": "مقبولة", "تم رفضها": "تم رفضها" };
  const step = sel_ ? STEP_OF[sel_.status] : 0;
  const reset = () => setPage(1);

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4" onClick={() => setMenu(null)}><div className="mx-auto max-w-[1400px] space-y-4">
    <nav className="flex items-center gap-2 text-xs text-primary"><Home size={14} />الرئيسية<ChevronLeft size={12} />التوظيف<ChevronLeft size={12} /><span>متابعة طلب التوظيف</span></nav>
    <section className="relative flex min-h-32 items-center overflow-hidden rounded-xl bg-primary-soft">
      <div className="relative z-10 flex items-center gap-4 p-5"><span className="grid size-20 shrink-0 place-items-center rounded-xl bg-card/70 text-primary"><Users size={44} /></span><div><h1 className="text-2xl font-extrabold text-brand-deep sm:text-3xl">متابعة طلب التوظيف</h1><p className="mt-1 text-sm sm:text-base">تابع جميع مراحل طلبات التوظيف من التقديم حتى التعيين</p></div></div>
      <img src={banner} alt="فرصة جديدة لمستقبل أفضل" width={1248} height={544} className="absolute inset-y-0 left-0 hidden h-full w-[52%] object-cover md:block" style={{ maskImage: "linear-gradient(to left, transparent, black 35%)" }} />
    </section>
    <section className="grid grid-cols-2 gap-3 md:grid-cols-5">{stats.map(([n, l, c, I]) => <button key={l} onClick={() => { setFs(l === "إجمالي الطلبات" ? "" : l === "مقبولة / مستمرة" ? "مقبولة" : l); reset(); }} className="flex items-center gap-3 rounded-xl border border-border p-4 text-right" style={{ background: `color-mix(in oklch, var(${c}) 7%, var(--card))` }}><span className="grid size-14 shrink-0 place-items-center rounded-full" style={{ color: `var(${c})`, background: `color-mix(in oklch, var(${c}) 14%, transparent)` }}><I size={28} /></span><div><b className="block text-2xl text-brand-deep">{n}</b><span className="text-sm">{l}</span></div></button>)}</section>
    {msg && <p className="rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-4 xl:order-first">
        <div className={`${card} flex flex-wrap items-center gap-2 p-3`}>
          <label className="relative min-w-52 flex-1"><Search size={16} className="absolute right-3 top-3 text-muted-foreground" /><input value={q} onChange={e => { setQ(e.target.value); reset(); }} placeholder="ابحث برقم الطلب أو اسم المتقدم ..." className={`${sel} w-full pr-9`} /></label>
          <select value={fs} onChange={e => { setFs(e.target.value); reset(); }} className={sel}><option value="">جميع الحالات</option>{(["بالانتظار", "قيد المراجعة", "مقبولة", "مستمرة", "تم رفضها"] as Status[]).map(s => <option key={s}>{s}</option>)}</select>
          <select value={fj} onChange={e => { setFj(e.target.value); reset(); }} className={sel}><option value="">جميع الوظائف</option>{jobs.map(s => <option key={s}>{s}</option>)}</select>
          <select value={fd} onChange={e => { setFd(e.target.value); reset(); }} className={sel}><option value="">جميع الإدارات</option>{depts.map(s => <option key={s}>{s}</option>)}</select>
          <span className={`${sel} flex items-center gap-1`}><CalendarDays size={16} className="text-primary" /><input type="date" aria-label="من تاريخ" value={from} onChange={e => { setFrom(e.target.value); reset(); }} className="w-28 bg-transparent text-xs outline-none" />-<input type="date" aria-label="إلى تاريخ" value={to} onChange={e => { setTo(e.target.value); reset(); }} className="w-28 bg-transparent text-xs outline-none" /></span>
        </div>
        <section className={`${card} p-4`}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><FileSearch className="text-primary" size={22} />قائمة طلبات التوظيف</h2>
          <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-center text-sm [&_td]:p-2.5 [&_th]:p-2.5">
            <thead><tr className="bg-primary-soft/60"><th>#</th><th>رقم الطلب</th><th>اسم الوظيفة</th><th>الجهة/القسم</th><th>عدد المتقدمين</th><th>حالة الطلب</th><th>تاريخ الطلب</th><th>الإجراءات</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={r.id} onClick={() => setSelId(r.id)} className={`cursor-pointer border-b border-border hover:bg-muted/50 ${r.id === selId ? "bg-primary-soft/40" : ""}`}><td className="font-bold">{(cur - 1) * size + i + 1}</td><td>{r.id}</td><td>{r.job}</td><td>{r.dept}</td><td>{r.applicants}</td><td><Badge s={r.status} /></td><td>{r.date}</td>
              <td onClick={e => e.stopPropagation()}><div className="relative flex justify-center gap-1"><button onClick={() => setEdit({ ...r })} className="rounded border border-border p-1 text-primary" aria-label="تعديل"><SquarePen size={15} /></button><button onClick={() => { setSelId(r.id); setFull(true); }} className="rounded border border-border p-1 text-primary" aria-label="عرض"><Eye size={15} /></button><button onClick={() => setMenu(menu === r.id ? null : r.id)} className="rounded border border-border p-1" aria-label="المزيد"><MoreVertical size={15} /></button>
                {menu === r.id && <div className="absolute left-0 top-8 z-20 w-44 rounded-md border border-border bg-card py-1 text-right text-sm shadow-lg">
                  <button onClick={() => setStatus(r, next[r.status], `تم نقل ${r.id} للمرحلة التالية`)} className="block w-full px-3 py-2 hover:bg-muted">تقديم للمرحلة التالية</button>
                  <button onClick={() => setStatus(r, "مقبولة", `تم قبول ${r.id}`)} className="block w-full px-3 py-2 text-success hover:bg-muted">قبول</button>
                  <button onClick={() => window.confirm(`رفض الطلب ${r.id}؟`) && setStatus(r, "تم رفضها", `تم رفض ${r.id}`)} className="block w-full px-3 py-2 text-destructive hover:bg-muted">رفض</button>
                  <button onClick={() => { if (window.confirm(`حذف الطلب ${r.id}؟`)) { setData(d => d.filter(x => x.id !== r.id)); setMenu(null); flash(`تم حذف ${r.id}`); } }} className="block w-full px-3 py-2 text-destructive hover:bg-muted">حذف</button></div>}
              </div></td></tr>)}
              {!rows.length && <tr><td colSpan={8} className="py-10 text-muted-foreground">لا توجد طلبات مطابقة</td></tr>}</tbody></table></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span>إظهار {filtered.length ? (cur - 1) * size + 1 : 0} - {Math.min(cur * size, filtered.length)} من أصل <b>{filtered.length}</b> نتيجة</span>
            <div className="flex items-center gap-1"><button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded border border-border disabled:opacity-40"><ChevronRight size={16} /></button>
              {Array.from({ length: Math.min(5, pages) }, (_, k) => Math.max(1, Math.min(cur - 2, pages - 4)) + k).map(n => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded border ${n === cur ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
              <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded border border-border disabled:opacity-40"><ChevronLeft size={16} /></button></div>
            <label className="flex items-center gap-2">عدد النتائج في الصفحة<select value={size} onChange={e => { setSize(+e.target.value); reset(); }} className="h-8 rounded border border-border bg-card px-2">{[10, 20, 50].map(n => <option key={n}>{n}</option>)}</select></label>
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <Link to="/recruitment/job-posting" className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary font-bold text-primary-foreground"><Plus size={18} />طلب توظيف جديد</Link>
        {sel_ && <section className={`${card} p-4 text-sm`}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><FileSearch className="text-primary" size={20} />تفاصيل الطلب</h2>
          <div className="mb-3 flex items-center justify-between"><Badge s={sel_.status} /><b>{sel_.id}</b></div>
          <dl className="space-y-2.5">{[["اسم الوظيفة", sel_.job], ["القسم", sel_.dept], ["تاريخ الطلب", sel_.date], ["آخر تحديث", sel_.updated], ["عدد المتقدمين", sel_.applicants]].map(([k, v]) => <div key={k} className="flex justify-between gap-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>
          <p className="mt-2 text-muted-foreground">الوصف</p><p>{sel_.desc}</p>
          <h3 className="mb-3 mt-5 font-extrabold">مراحل الطلب</h3>
          <ol className="space-y-3">{STEPS.map((s, i) => { const done = i < step, rej = sel_.status === "تم رفضها" && i === step; return <li key={s} className="flex items-start gap-3">{done ? <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={13} /></span> : rej ? <XCircle size={20} className="text-destructive" /> : <Circle size={20} className="text-muted-foreground" />}<div><b className="block">{s}</b><span className="text-xs text-muted-foreground">{i === 0 ? sel_.date : done ? (i === step - 1 ? "قيد التنفيذ" : "مكتملة") : rej ? "تم الرفض" : "لم تبدأ بعد"}</span></div></li>; })}</ol>
          <button onClick={() => setFull(true)} className="mt-4 flex items-center gap-1 font-bold text-primary">عرض جميع التفاصيل<ArrowLeft size={16} /></button>
        </section>}
      </div>
    </div>

    {full && sel_ && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setFull(false)}><div dir="rtl" onClick={e => e.stopPropagation()} className="w-full max-w-lg space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">طلب التوظيف {sel_.id}</h3><button onClick={() => setFull(false)}><X /></button></div>
      <dl className="grid grid-cols-2 gap-3">{[["اسم الوظيفة", sel_.job], ["الجهة/القسم", sel_.dept], ["عدد المتقدمين", sel_.applicants], ["تاريخ الطلب", sel_.date], ["آخر تحديث", sel_.updated], ["المرحلة الحالية", sel_.status === "تم رفضها" ? "مرفوض" : STEPS[Math.min(step, 4)]]].map(([k, v]) => <div key={k as string} className="rounded-md bg-muted p-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>
      <div className="flex items-center gap-2"><span className="text-muted-foreground">الحالة:</span><Badge s={sel_.status} /></div><p>{sel_.desc}</p>
    </div></div>}

    {edit && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setEdit(null)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); setData(d => d.map(x => x.id === edit.id ? edit : x)); flash(`تم تعديل ${edit.id}`); setEdit(null); }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">تعديل {edit.id}</h3><button type="button" onClick={() => setEdit(null)}><X /></button></div>
      <label className="block font-bold">اسم الوظيفة<input required maxLength={80} value={edit.job} onChange={e => setEdit({ ...edit, job: e.target.value })} className={`${sel} mt-1 w-full font-normal`} /></label>
      <label className="block font-bold">الجهة/القسم<input required maxLength={80} value={edit.dept} onChange={e => setEdit({ ...edit, dept: e.target.value })} className={`${sel} mt-1 w-full font-normal`} /></label>
      <label className="block font-bold">الحالة<select value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value as Status })} className={`${sel} mt-1 w-full font-normal`}>{Object.keys(ST).map(s => <option key={s}>{s}</option>)}</select></label>
      <label className="block font-bold">الوصف<textarea maxLength={500} value={edit.desc} onChange={e => setEdit({ ...edit, desc: e.target.value })} className="mt-1 min-h-20 w-full rounded-md border border-border p-2 font-normal" /></label>
      <button className="h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">حفظ</button>
    </form></div>}
  </div></main></AppShell>;
}
