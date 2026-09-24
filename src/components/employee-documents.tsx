import { useMemo, useRef, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Building2, CalendarDays, CheckCircle2, ChevronLeft, Clock, CloudUpload, Download, Eye, FileText, Filter, Info, MoreHorizontal, Plus, Save, Search, SquarePen, UserCog, Users, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import photo from "@/assets/candidate-ahmed.jpg";

type Status = "ساري" | "قريب الانتهاء" | "منتهي" | "غير مكتمل";
type Doc = { id: number; name: string; type: string; no: string; issue: string; expiry: string; issuer: string; notes: string; alert: boolean; alertDays: number; file?: File; fileName?: string };
const TODAY = "2025/09/22"; // reference date used for statuses
const addDays = (d: string, n: number) => { const x = new Date(d.replaceAll("/", "-")); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10).replaceAll("-", "/"); };
const statusOf = (d: Doc): Status => !d.fileName ? "غير مكتمل" : !d.expiry ? "ساري" : d.expiry < TODAY ? "منتهي" : d.expiry <= addDays(TODAY, Math.max(d.alertDays, 180)) ? "قريب الانتهاء" : "ساري";
const ST: Record<Status, string> = { "ساري": "--success", "قريب الانتهاء": "--warning", "منتهي": "--destructive", "غير مكتمل": "--muted-foreground" };
const TYPES0 = ["الهوية والإقامة", "العقود", "المؤهلات", "الخبرات", "الشهادات المهنية", "التأمين", "المستندات البنكية", "مستندات أخرى", "القرارات الإدارية"];
const SEED: [string, string, string, string, string][] = [
  ["صورة الهوية الوطنية", "الهوية والإقامة", "1087654321", "2020/01/10", "2030/01/10"], ["عقد العمل", "العقود", "CON-2020-125", "2020/01/15", ""],
  ["المؤهل العلمي", "المؤهلات", "EDU-4587", "2018/06/01", ""], ["شهادة خبرة", "الخبرات", "EXP-7741", "2019/03/12", ""],
  ["شهادة تصنيف مهني", "الشهادات المهنية", "PM-3321", "2023/02/01", "2026/02/01"], ["بطاقة التأمين الطبي", "التأمين", "INS-6611", "2024/01/01", "2025/01/01"],
  ["إثبات حساب بنكي", "المستندات البنكية", "BNK-5542", "2023/05/10", ""], ["صورة شخصية", "مستندات أخرى", "", "2024/08/15", ""],
  ["شهادة صحية", "مستندات أخرى", "MED-2211", "2023/08/01", "2024/08/01"], ["خطاب تعريف", "القرارات الإدارية", "ADM-8877", "2024/03/01", ""],
  ["جواز السفر", "الهوية والإقامة", "P1234567", "2021/05/01", "2031/05/01"], ["رخصة القيادة", "الهوية والإقامة", "DL-99812", "2022/02/10", "2032/02/10"],
  ["ملحق عقد العمل", "العقود", "CON-2023-044", "2023/01/01", ""], ["شهادة دورة ITIL", "الشهادات المهنية", "ITIL-5521", "2022/10/01", "2025/12/01"],
  ["شهادة البكالوريوس", "المؤهلات", "EDU-4588", "2018/06/01", ""], ["شهادة خبرة سابقة", "الخبرات", "EXP-7742", "2017/12/20", ""],
  ["قرار التعيين", "القرارات الإدارية", "ADM-1001", "2020/01/15", ""], ["شهادة الإسعافات الأولية", "الشهادات المهنية", "FA-3310", "2023/06/01", "2024/06/01"],
];
const initial = (): Doc[] => SEED.map(([name, type, no, issue, expiry], i) => ({ id: i + 1, name, type, no, issue, expiry, issuer: "", notes: "", alert: true, alertDays: 60, fileName: i === 9 ? undefined : `${name}.pdf` }));
const empty = (): Doc => ({ id: 0, name: "", type: "", no: "", issue: "2025/09/22", expiry: "2026/09/22", issuer: "", notes: "", alert: true, alertDays: 60 });
const TABS = ["البيانات الأساسية", "الوظائف والرواتب", "الإجازات", "الخبرات", "التقييمات", "الاجتماعات", "الجزاءات", "التدريب", "المستندات والمرفقات"];
const card = "rounded-xl border border-border bg-card shadow-sm";
const inp = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const toIso = (d: string) => d.replaceAll("/", "-"), fromIso = (d: string) => d.replaceAll("-", "/");
const Badge = ({ s }: { s: Status }) => <span className="inline-block min-w-20 rounded-md px-2 py-0.5 text-xs font-bold" style={{ color: `var(${ST[s]})`, background: `color-mix(in oklch, var(${ST[s]}) 14%, transparent)` }}>{s}</span>;

export function EmployeeDocuments() {
  const router = useRouter();
  const [docs, setDocs] = useState(initial);
  const [types, setTypes] = useState(TYPES0);
  const [q, setQ] = useState(""), [fs, setFs] = useState(""), [ft, setFt] = useState("");
  const [page, setPage] = useState(1), [size, setSize] = useState(10);
  const [form, setForm] = useState<Doc>(empty), [err, setErr] = useState(""), [panel, setPanel] = useState(false);
  const [view, setView] = useState<Doc | null>(null), [menu, setMenu] = useState<number | null>(null), [msg, setMsg] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const withS = docs.map(d => ({ ...d, s: statusOf(d) }));
  const count = (s: Status) => withS.filter(d => d.s === s).length;
  const filtered = useMemo(() => withS.filter(d => (!q || d.name.includes(q) || d.no.includes(q)) && (!fs || d.s === fs) && (!ft || d.type === ft)), [withS, q, fs, ft]);
  const pages = Math.max(1, Math.ceil(filtered.length / size)), cur = Math.min(page, pages);
  const rows = filtered.slice((cur - 1) * size, cur * size);
  const stats: [string, number, string, typeof FileText, Status | ""][] = [["إجمالي المستندات", docs.length, "--primary", FileText, ""], ["سارية", count("ساري"), "--success", CheckCircle2, "ساري"], ["قريب الانتهاء", count("قريب الانتهاء"), "--warning", Clock, "قريب الانتهاء"], ["منتهية", count("منتهي"), "--destructive", AlertCircle, "منتهي"], ["غير مكتملة", count("غير مكتمل"), "--muted-foreground", MoreHorizontal, "غير مكتمل"]];

  const pickFile = (f?: File) => { if (!f) return; if (!/\.(pdf|jpe?g|png)$/i.test(f.name)) return setErr("نوع الملف غير مدعوم (PDF, JPG, PNG فقط)"); if (f.size > 10 * 1024 * 1024) return setErr("حجم الملف أكبر من 10 ميجابايت"); setErr(""); setForm(p => ({ ...p, file: f, fileName: f.name })); };
  const save = () => {
    if (!form.name.trim() || !form.type || !form.issue) return setErr("يرجى تعبئة الحقول المطلوبة (*)");
    if (!form.fileName) return setErr("يرجى إرفاق الملف");
    if (form.expiry && form.expiry < form.issue) return setErr("تاريخ الانتهاء يجب أن يكون بعد تاريخ الإصدار");
    if (form.id) { setDocs(d => d.map(x => x.id === form.id ? form : x)); flash("تم تعديل المستند"); }
    else { setDocs(d => [{ ...form, id: Math.max(0, ...d.map(x => x.id)) + 1 }, ...d]); setPage(1); flash("تم حفظ المستند بنجاح"); }
    setForm(empty()); setErr(""); setPanel(false);
  };
  const download = (d: Doc) => { if (d.file) { const u = URL.createObjectURL(d.file); const a = document.createElement("a"); a.href = u; a.download = d.file.name; a.click(); URL.revokeObjectURL(u); } else flash(d.fileName ? `جاري تحميل «${d.fileName}»...` : "لا يوجد ملف مرفق لهذا المستند"); };
  const addType = () => { const t = window.prompt("اسم نوع المستند الجديد")?.trim(); if (t && !types.includes(t)) { setTypes([...types, t]); setForm(p => ({ ...p, type: t })); } };

  const Field = ({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) => <label className="block text-sm font-bold">{label}{req && <span className="text-destructive"> *</span>}<div className="mt-1.5 font-normal">{children}</div></label>;
  const formPanel = <aside className={`${card} space-y-3.5 p-4`}>
    <div className="flex items-center justify-between"><h2 className="text-xl font-extrabold text-brand-deep">{form.id ? "تعديل المستند" : "إضافة مستند جديد"}</h2><button onClick={() => { setForm(empty()); setErr(""); setPanel(false); }} aria-label="إغلاق"><X /></button></div>
    <Field label="اسم المستند" req><input maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: شهادة تصنيف مهني" className={inp} /></Field>
    <div><div className="flex items-center justify-between text-sm font-bold"><span>نوع المستند<span className="text-destructive"> *</span></span><button type="button" onClick={addType} className="flex items-center gap-1 text-primary"><Plus size={15} />إضافة نوع جديد</button></div>
      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={`${inp} mt-1.5`}><option value="">اختر النوع</option>{types.map(t => <option key={t}>{t}</option>)}</select></div>
    <Field label="رقم المستند"><input maxLength={40} value={form.no} onChange={e => setForm({ ...form, no: e.target.value })} placeholder="أدخل رقم المستند" className={inp} /></Field>
    <div className="grid grid-cols-2 gap-3"><Field label="تاريخ الإصدار" req><input type="date" value={toIso(form.issue)} onChange={e => setForm({ ...form, issue: fromIso(e.target.value) })} className={inp} /></Field><Field label="تاريخ الانتهاء"><input type="date" value={toIso(form.expiry)} onChange={e => setForm({ ...form, expiry: fromIso(e.target.value) })} className={inp} /></Field></div>
    <Field label="الجهة المصدرة"><input maxLength={100} value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} placeholder="مثال: الهيئة السعودية للتخصصات الصحية" className={inp} /></Field>
    <div className="text-sm font-bold">إرفاق الملف<span className="text-destructive"> *</span>
      <button type="button" onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }} className={`mt-1.5 flex w-full flex-col items-center gap-1.5 rounded-lg border-2 border-dashed p-5 font-normal ${drag ? "border-primary bg-primary-soft" : "border-border bg-primary-soft/30"}`}>
        <CloudUpload size={34} className="text-primary" />{form.fileName ? <b className="text-primary">{form.fileName}</b> : <span>اسحب الملفات هنا أو اضغط للاختيار</span>}<span className="text-xs text-muted-foreground">(PDF, JPG, PNG - الحد الأقصى 10 ميجابايت)</span></button>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={e => pickFile(e.target.files?.[0])} /></div>
    <div className="text-sm font-bold">تنبيه قبل انتهاء المستند<div className="mt-1.5 flex items-center gap-3"><input type="checkbox" checked={form.alert} onChange={e => setForm({ ...form, alert: e.target.checked })} className="size-5 accent-primary" /><select disabled={!form.alert} value={form.alertDays} onChange={e => setForm({ ...form, alertDays: +e.target.value })} className={`${inp} font-normal disabled:opacity-50`}>{[30, 60, 90].map(n => <option key={n} value={n}>قبل {n} يوم</option>)}</select></div></div>
    <Field label="ملاحظات"><textarea maxLength={500} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="أدخل أي ملاحظات إضافية ..." className="min-h-20 w-full rounded-md border border-border p-3 text-sm outline-none focus:border-primary" /><span className="text-xs text-muted-foreground">{form.notes.length}/500</span></Field>
    {err && <p className="rounded-md bg-destructive/10 p-2 text-sm font-bold text-destructive">{err}</p>}
    <div className="grid grid-cols-[2fr_1fr] gap-3"><button onClick={save} className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary font-bold text-primary-foreground"><Save size={18} />حفظ المستند</button><button onClick={() => { setForm(empty()); setErr(""); setPanel(false); }} className="h-11 rounded-md border border-border font-bold">إلغاء</button></div>
    <p className="flex items-center gap-2 rounded-md bg-primary-soft/60 p-3 text-xs"><Info size={16} className="shrink-0 text-primary" />سيتم إشعارك تلقائياً قبل انتهاء المستند حسب المدة المحددة.</p>
  </aside>;

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4" onClick={() => setMenu(null)}><div className="mx-auto grid max-w-[1400px] gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="min-w-0 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div><nav className="flex flex-wrap items-center gap-1.5 text-xs text-primary"><Users size={14} />الموارد البشرية<ChevronLeft size={12} />الموظفون<ChevronLeft size={12} />ملف الموظف<ChevronLeft size={12} />المستندات والمرفقات</nav>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><FileText className="text-primary" />مستندات الموظف</h1><p className="text-sm">إدارة جميع مستندات الموظف ومتابعة حالة صلاحيتها</p></div>
        <button onClick={() => router.history.back()} className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-border bg-card px-6 font-bold"><ArrowRight size={18} />رجوع</button>
      </div>
      {msg && <p className="rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

      <section className={`${card} grid gap-4 p-4 md:grid-cols-2`}>
        <div className="flex items-center gap-4"><img src={photo} alt="أحمد محمد السبيعي" className="size-24 shrink-0 rounded-full object-cover" /><div className="space-y-1"><h2 className="text-xl font-extrabold">أحمد محمد السبيعي</h2><span className="inline-block rounded-md bg-primary-soft px-3 py-0.5 text-sm">EMP-00125</span><p>أخصائي نظم معلومات</p><p>تقنية المعلومات</p></div></div>
        <dl className="space-y-2 text-sm">{([[Building2, "القسم", "تقنية المعلومات"], [Users, "المدير المباشر", "فهد العتيبي"], [CalendarDays, "تاريخ التعيين", "2020/01/15"], [UserCog, "حالة الموظف", "على رأس العمل"]] as const).map(([I, k, v], i) => <div key={k} className="grid grid-cols-[24px_110px_12px_1fr] items-center"><I size={18} className={i === 3 ? "text-success" : "text-primary"} /><dt>{k}</dt><span>:</span><dd className={i === 3 ? "font-bold text-success" : ""}>{v}</dd></div>)}</dl>
      </section>

      <nav className={`${card} flex gap-1 overflow-x-auto px-2`}>{TABS.map((t, i) => i === 8 ? <span key={t} className="shrink-0 border-b-2 border-primary px-3 py-3 text-sm font-bold text-primary">{t}</span> : <Link key={t} to="/employees/profile" className="shrink-0 px-3 py-3 text-sm hover:text-primary">{t}</Link>)}</nav>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">{stats.map(([l, n, c, I, s]) => <button key={l} onClick={() => { setFs(s); setPage(1); }} className={`flex items-center justify-between gap-2 rounded-xl border bg-card p-4 ${fs === s ? "border-primary" : "border-border"}`}><I size={30} style={{ color: `var(${c})` }} /><div className="text-center"><b className="block text-sm">{l}</b><b className="text-2xl" style={{ color: `var(${c === "--primary" ? "--brand-deep" : c})` }}>{n}</b></div></button>)}</section>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => { setQ(""); setFs(""); setFt(""); setPage(1); }} title="مسح الفلاتر" className="grid size-10 place-items-center rounded-md border border-border bg-card text-primary"><Filter size={18} /></button>
        <select value={fs} onChange={e => { setFs(e.target.value as Status | ""); setPage(1); }} className={`${inp} w-44`}><option value="">جميع الحالات</option>{Object.keys(ST).map(s => <option key={s}>{s}</option>)}</select>
        <select value={ft} onChange={e => { setFt(e.target.value); setPage(1); }} className={`${inp} w-48`}><option value="">جميع الأنواع</option>{types.map(t => <option key={t}>{t}</option>)}</select>
        <label className="relative min-w-48 flex-1"><Search size={16} className="absolute left-3 top-3 text-primary" /><input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="ابحث في المستندات ..." className={inp} /></label>
        <button onClick={() => { setForm(empty()); setErr(""); setPanel(true); }} className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 font-bold text-primary-foreground"><Plus size={18} />إضافة مستند جديد</button>
      </div>

      <section className={`${card} p-3`}>
        <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-center text-sm [&_td]:whitespace-nowrap [&_td]:p-2 [&_th]:p-2.5">
          <thead><tr className="bg-primary-soft/60"><th>#</th><th className="text-right">اسم المستند</th><th>النوع</th><th>رقم المستند</th><th>تاريخ الإصدار</th><th>تاريخ الانتهاء</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
          <tbody>{rows.map((d, i) => <tr key={d.id} className="border-b border-border"><td>{(cur - 1) * size + i + 1}</td><td className="text-right font-semibold">{d.name}</td><td>{d.type}</td><td>{d.no || "-"}</td><td>{d.issue}</td><td style={{ color: d.s === "منتهي" || d.s === "قريب الانتهاء" ? "var(--destructive)" : undefined }}>{d.expiry || "-"}</td><td><Badge s={d.s} /></td>
            <td onClick={e => e.stopPropagation()}><div className="relative flex justify-center gap-1">
              <button onClick={() => { setForm({ ...d }); setErr(""); setPanel(true); }} className="rounded border border-border p-1 text-primary" aria-label="تعديل"><SquarePen size={15} /></button>
              <button onClick={() => setView(d)} className="rounded border border-border p-1 text-primary" aria-label="عرض"><Eye size={15} /></button>
              <button onClick={() => download(d)} className="rounded border border-border p-1 text-primary" aria-label="تحميل"><Download size={15} /></button>
              <button onClick={() => setMenu(menu === d.id ? null : d.id)} className="rounded border border-border p-1" aria-label="المزيد"><MoreHorizontal size={15} /></button>
              {menu === d.id && <div className="absolute left-0 top-8 z-20 w-36 rounded-md border border-border bg-card py-1 text-right shadow-lg"><button onClick={() => { if (window.confirm(`حذف «${d.name}»؟`)) { setDocs(x => x.filter(y => y.id !== d.id)); flash("تم حذف المستند"); } setMenu(null); }} className="block w-full px-3 py-2 text-destructive hover:bg-muted">حذف المستند</button></div>}
            </div></td></tr>)}
            {!rows.length && <tr><td colSpan={8} className="py-10 text-muted-foreground">لا توجد مستندات مطابقة</td></tr>}</tbody></table></div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-1"><button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="h-9 rounded border border-border px-3 disabled:opacity-40">السابق</button>{Array.from({ length: pages }, (_, k) => k + 1).map(n => <button key={n} onClick={() => setPage(n)} className={`size-9 rounded border ${n === cur ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}<button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="h-9 rounded border border-border px-3 disabled:opacity-40">التالي</button></div>
          <div className="flex items-center gap-3"><span>عرض {filtered.length ? (cur - 1) * size + 1 : 0} - {Math.min(cur * size, filtered.length)} من {filtered.length} مستند</span><select value={size} onChange={e => { setSize(+e.target.value); setPage(1); }} className="h-9 rounded border border-border bg-card px-2">{[10, 20, 50].map(n => <option key={n}>{n}</option>)}</select></div>
        </div>
      </section>
    </div>

    <div className="hidden xl:block">{formPanel}</div>
    {panel && <div className="fixed inset-0 z-50 flex justify-start bg-foreground/40 xl:hidden" onClick={() => setPanel(false)}><div className="h-full w-full max-w-sm overflow-y-auto p-2" onClick={e => e.stopPropagation()}>{formPanel}</div></div>}

    {view && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setView(null)}><div dir="rtl" onClick={e => e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">{view.name}</h3><button onClick={() => setView(null)}><X /></button></div>
      <dl className="grid grid-cols-2 gap-2">{[["النوع", view.type], ["رقم المستند", view.no || "-"], ["تاريخ الإصدار", view.issue], ["تاريخ الانتهاء", view.expiry || "-"], ["الجهة المصدرة", view.issuer || "-"], ["الملف", view.fileName || "غير مرفق"], ["التنبيه", view.alert ? `قبل ${view.alertDays} يوم` : "بدون"], ["الحالة", statusOf(view)]].map(([k, v]) => <div key={k} className="rounded-md bg-muted p-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>
      {view.notes && <p>{view.notes}</p>}
      <button onClick={() => download(view)} className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary font-bold text-primary-foreground"><Download size={17} />تحميل الملف</button>
    </div></div>}
  </div></main></AppShell>;
}
