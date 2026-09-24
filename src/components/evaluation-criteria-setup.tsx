import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Briefcase, ChevronDown, ChevronLeft, CopyPlus, FileText, GripVertical, Home, Info, PlusCircle, Settings, SquarePen, Trash2, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Crit = { name: string; desc: string; weight: number; type: string };
const TYPES = ["تقييم رقمي", "تقييم وصفي", "قائمة اختيار"];
const base: Crit[] = [
  { name: "المؤهلات", desc: "مؤهل مناسب للتخصص", weight: 20, type: "تقييم رقمي" },
  { name: "الخبرات العملية", desc: "عدد سنوات الخبرة ومجالاتها", weight: 25, type: "تقييم رقمي" },
  { name: "الاختبار المهني", desc: "نتيجة الاختبار الفني", weight: 20, type: "تقييم رقمي" },
  { name: "المقابلة الشخصية", desc: "مهارات التواصل والسلوك المهني", weight: 20, type: "تقييم رقمي" },
  { name: "الملاءمة الثقافية", desc: "مدى توافق القيم مع ثقافة الجهة", weight: 10, type: "تقييم رقمي" },
  { name: "اللغات والمهارات الإضافية", desc: "إجادة اللغة الإنجليزية وبرامج ذات صلة", weight: 5, type: "تقييم رقمي" },
];
const initialTemplates: Record<string, Crit[]> = {
  "وظائف الإدارة المالية": base,
  "الوظائف الإدارية العامة": [
    { name: "المؤهلات", desc: "مؤهل إداري مناسب", weight: 20, type: "تقييم رقمي" },
    { name: "الخبرات العملية", desc: "خبرة في الأعمال الإدارية", weight: 30, type: "تقييم رقمي" },
    { name: "المقابلة الشخصية", desc: "التواصل وإدارة الوقت", weight: 30, type: "تقييم رقمي" },
    { name: "مهارات الحاسب", desc: "برامج الأوفيس والأنظمة", weight: 20, type: "تقييم رقمي" },
  ],
  "الوظائف التقنية": [
    { name: "المؤهلات", desc: "تخصص تقني ذو صلة", weight: 15, type: "تقييم رقمي" },
    { name: "الاختبار الفني", desc: "حل مسائل برمجية وتقنية", weight: 40, type: "تقييم رقمي" },
    { name: "الخبرات العملية", desc: "مشاريع سابقة ذات صلة", weight: 25, type: "تقييم رقمي" },
    { name: "المقابلة الشخصية", desc: "العمل الجماعي والتواصل", weight: 20, type: "تقييم وصفي" },
  ],
  "الوظائف الطبية": [
    { name: "الترخيص المهني", desc: "تصنيف الهيئة السعودية للتخصصات الصحية", weight: 25, type: "قائمة اختيار" },
    { name: "الخبرات السريرية", desc: "سنوات الخبرة في المجال", weight: 35, type: "تقييم رقمي" },
    { name: "الاختبار المهني", desc: "تقييم المعرفة الطبية", weight: 25, type: "تقييم رقمي" },
    { name: "المقابلة الشخصية", desc: "التعامل مع المرضى", weight: 15, type: "تقييم رقمي" },
  ],
};
const card = "rounded-xl border border-border bg-card p-4 shadow-sm";
const input = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const steps = ["إعداد معايير التقييم", "تحديد أعضاء اللجان", "تقييم المرشحين", "عرض النتائج والمفاضلة"];
const scale: [string, string, string][] = [["ممتاز", "100 - 90", "--success"], ["جيد جداً", "89 - 80", "--success"], ["جيد", "79 - 70", "--warning"], ["مقبول", "69 - 60", "--warning"], ["ضعيف", "أقل من 60", "--destructive"]];

function Sel({ value, onChange, opts, placeholder }: { value: string; onChange: (v: string) => void; opts: string[]; placeholder?: string }) {
  return <div className="relative"><select value={value} onChange={e => onChange(e.target.value)} className={`${input} appearance-none`}>{placeholder && <option value="">{placeholder}</option>}{opts.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>;
}

export function EvaluationCriteriaSetup() {
  const router = useRouter();
  const [rows, setRows] = useState<Crit[]>(base);
  const [templates, setTemplates] = useState(initialTemplates);
  const [tpl, setTpl] = useState("");
  const [edit, setEdit] = useState<{ i: number; c: Crit } | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [defType, setDefType] = useState("تقييم رقمي"), [defScale, setDefScale] = useState("من 100 درجة");
  const [msg, setMsg] = useState("");
  const total = rows.reduce((s, r) => s + r.weight, 0);
  const ok = total === 100;
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const apply = (name: string) => { setTpl(name); const t = templates[name]; if (t) { setRows(t.map(c => ({ ...c }))); flash(`تم تطبيق قالب «${name}».`); } };
  const saveTpl = () => { const name = window.prompt("اسم القالب الجديد:", "قالب محاسب أول"); if (!name) return; setTemplates(t => ({ ...t, [name]: rows.map(c => ({ ...c })) })); flash(`تم حفظ القالب «${name}».`); };
  const drop = (to: number) => { if (drag === null || drag === to) return; setRows(p => { const a = [...p]; const [m] = a.splice(drag, 1); a.splice(to, 0, m!); return a; }); setDrag(null); };

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1400px] space-y-4">
    <nav className="flex flex-wrap items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />التوظيف<ChevronLeft size={12} />تقييم المرشحين من اللجان<ChevronLeft size={12} /><span>إعداد معايير التقييم</span></nav>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><Settings className="text-primary" />إعداد معايير التقييم</h1><p className="mt-1 text-sm">إضافة وتحديد عناصر التقييم والوزن النسبي لكل معيار</p></div>
      <div className="flex flex-wrap gap-2">
        {ok ? <Link to="/performance/committee" className="flex h-11 min-w-36 items-center justify-center gap-2 rounded-md bg-primary px-6 font-bold text-primary-foreground">التالي<ArrowLeft size={18} /></Link> : <span title="يجب أن يكون الإجمالي 100%" className="flex h-11 min-w-36 cursor-not-allowed items-center justify-center gap-2 rounded-md bg-muted px-6 font-bold text-muted-foreground">التالي<ArrowLeft size={18} /></span>}
        <button onClick={saveTpl} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 font-bold"><CopyPlus size={18} />حفظ كقالب</button>
        <button onClick={() => router.history.back()} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 font-bold"><ArrowRight size={18} />رجوع</button>
      </div>
    </div>
    {msg && <p className="rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <div className={`${card} overflow-x-auto`}><ol className="flex min-w-[560px] justify-between">{steps.map((s, i) => <li key={s} className="relative flex flex-1 flex-col items-center gap-2 text-sm font-semibold">
      {i < 3 && <span className="absolute top-4 h-0.5 w-full -translate-x-1/2 bg-border" />}
      <span className={`relative grid size-8 place-items-center rounded-full font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/40 text-primary-foreground"}`}>{i + 1}</span>{s}</li>)}</ol></div>

    <div className="grid gap-4 xl:grid-cols-[230px_minmax(0,1fr)_230px]">
      <section className={`${card} space-y-4`}>
        <h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-extrabold"><FileText className="text-primary" size={20} />خطوات الإعداد</h2>
        <ol className="space-y-5">{[["إضافة معايير التقييم", "حدد المعايير الرئيسية المناسبة للوظيفة"], ["تحديد الوزن النسبي", "وزع النسب على كل معيار (الإجمالي 100)"], ["تحديد نوع التقييم", "رقمي - وصفي - قائمة اختيار"], ["حفظ كقالب (اختياري)", "يمكن استخدام نفس المعايير لوظائف مشابهة"]].map(([t, d], i) => <li key={t} className="flex gap-3"><span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted-foreground/40 text-primary-foreground"}`}>{i + 1}</span><div><b className="block text-sm">{t}</b><span className="text-xs text-muted-foreground">{d}</span></div></li>)}</ol>
        <div className="rounded-lg bg-primary-soft/60 p-3"><h3 className="flex items-center gap-2 text-sm font-extrabold text-primary"><Info size={16} />ملاحظات مهمة</h3>
          <ul className="mt-2 list-inside list-disc space-y-1.5 text-xs marker:text-primary">{["يجب أن يكون إجمالي الأوزان 100%.", "يمكن إضافة أو حذف أو تعديل المعايير.", "يمكن استخدام قالب جاهز من الوظائف السابقة.", "بعد الحفظ يمكنك الانتقال لتحديد أعضاء اللجنة."].map(n => <li key={n}>{n}</li>)}</ul></div>
      </section>

      <section className={`${card} min-w-0`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-extrabold">عناصر التقييم</h2>
          <div className="flex flex-wrap gap-2"><button onClick={() => setEdit({ i: -1, c: { name: "", desc: "", weight: Math.max(0, 100 - total), type: defType } })} className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground"><PlusCircle size={17} />إضافة معيار جديد</button>
            <div className="w-48"><Sel value={tpl} onChange={apply} opts={Object.keys(templates)} placeholder="استخدام قالب جاهز" /></div></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-center text-xs [&_th]:p-2 [&_td]:p-2 [&_th]:whitespace-nowrap">
          <thead><tr className="bg-primary-soft/60">{["#", "اسم المعيار", "الوصف", "الوزن النسبي (%)", "نوع التقييم", "إجراء"].map(h => <th key={h} className="p-3 font-bold">{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={r.name + i} draggable onDragStart={() => setDrag(i)} onDragOver={e => e.preventDefault()} onDrop={() => drop(i)} className={`border-b border-border ${drag === i ? "opacity-50" : ""}`}>
            <td className="p-3">{i + 1}</td><td className="p-3 font-semibold">{r.name}</td><td className="p-3 text-xs">{r.desc}</td><td className="p-3 font-bold">{r.weight}%</td><td className="p-3">{r.type}</td>
            <td className="p-3"><div className="flex items-center justify-center gap-2"><GripVertical size={18} className="cursor-grab text-primary" /><button onClick={() => setEdit({ i, c: { ...r } })} className="rounded border border-border p-1 text-primary" aria-label="تعديل"><SquarePen size={16} /></button><button onClick={() => { if (window.confirm(`حذف معيار «${r.name}»؟`)) setRows(p => p.filter((_, j) => j !== i)); }} className="p-1 text-destructive" aria-label="حذف"><Trash2 size={17} /></button></div></td></tr>)}
            <tr className={ok ? "bg-success-soft" : "bg-destructive/10"}><td colSpan={3} className={`p-3 text-lg font-extrabold ${ok ? "text-success" : "text-destructive"}`}>الإجمالي</td><td className={`p-3 text-lg font-extrabold ${ok ? "text-success" : "text-destructive"}`}>{total}%</td><td colSpan={2} className="p-3 text-xs text-destructive">{!ok && `يجب أن يكون الإجمالي 100% (${total > 100 ? "زيادة" : "متبقي"} ${Math.abs(100 - total)}%)`}</td></tr>
          </tbody></table></div>
      </section>

      <section className={card}><h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-extrabold"><Briefcase className="text-primary" size={20} />معلومات الوظيفة</h2>
        <dl className="mt-4 space-y-5 text-sm">{[["المسمى الوظيفي", "محاسب أول"], ["القسم", "الإدارة المالية"], ["نوع التوظيف", "دائم"], ["عدد المرشحين", "5"], ["تاريخ التقييم", "2025/09/28"]].map(([k, v]) => <div key={k} className="flex justify-between"><dt>{k}</dt><dd className="font-bold">: {v}</dd></div>)}</dl></section>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      <section className={card}><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><FileText className="text-primary" size={20} />قالب المعايير الجاهزة</h2>
        <Sel value={tpl} onChange={apply} opts={Object.keys(templates)} placeholder="اختر قالب" />
        <div className="mt-3 space-y-2">{Object.keys(templates).map(t => <button key={t} onClick={() => apply(t)} className={`flex w-full items-center justify-between rounded-md border p-2.5 text-sm ${tpl === t ? "border-primary bg-primary-soft" : "border-border"}`}>{t}<FileText size={17} className="text-primary" /></button>)}</div></section>
      <section className={card}><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><BarChart3 className="text-primary" size={20} />مقياس التقييم</h2>
        <div className="grid grid-cols-5 gap-1.5 pt-6">{scale.map(([t, r, c]) => <div key={t} className="rounded-lg p-3 text-center font-bold" style={{ color: `var(${c})`, background: `color-mix(in oklch, var(${c}) 12%, transparent)` }}><b className="block whitespace-nowrap text-sm">{t}</b><span dir="ltr" className="mt-2 block whitespace-nowrap text-xs">{r}</span></div>)}</div></section>
      <section className={`${card} space-y-3`}><h2 className="flex items-center gap-2 text-lg font-extrabold"><Settings className="text-primary" size={20} />طريقة التقييم</h2>
        <label className="block text-sm">نوع التقييم الافتراضي<div className="mt-1"><Sel value={defType} onChange={setDefType} opts={TYPES} /></div></label>
        <label className="block text-sm">مقياس التقييم<div className="mt-1"><Sel value={defScale} onChange={setDefScale} opts={["من 100 درجة", "من 10 درجات", "من 5 درجات"]} /></div></label>
        <p className="flex gap-2 rounded-lg bg-primary-soft/60 p-3 text-xs"><Info size={16} className="shrink-0 text-primary" />يتم تقييم كل معيار من قبل أعضاء اللجنة حسب المقياس المحدد.</p></section>
    </div>

    {edit && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setEdit(null)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); setRows(p => edit.i < 0 ? [...p, edit.c] : p.map((r, j) => j === edit.i ? edit.c : r)); flash(edit.i < 0 ? "تمت إضافة المعيار." : "تم تعديل المعيار."); setEdit(null); }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">{edit.i < 0 ? "إضافة معيار جديد" : "تعديل المعيار"}</h3><button type="button" onClick={() => setEdit(null)}><X /></button></div>
      <label className="block font-bold">اسم المعيار<input required value={edit.c.name} onChange={e => setEdit({ ...edit, c: { ...edit.c, name: e.target.value } })} className={`${input} mt-1 font-normal`} /></label>
      <label className="block font-bold">الوصف<input required value={edit.c.desc} onChange={e => setEdit({ ...edit, c: { ...edit.c, desc: e.target.value } })} className={`${input} mt-1 font-normal`} /></label>
      <label className="block font-bold">الوزن النسبي (%)<input required type="number" min={1} max={100} value={edit.c.weight} onChange={e => setEdit({ ...edit, c: { ...edit.c, weight: +e.target.value } })} className={`${input} mt-1 font-normal`} /></label>
      <label className="block font-bold">نوع التقييم<div className="mt-1 font-normal"><Sel value={edit.c.type} onChange={v => setEdit({ ...edit, c: { ...edit.c, type: v } })} opts={TYPES} /></div></label>
      <button className="h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">حفظ</button>
    </form></div>}
  </div></main></AppShell>;
}
