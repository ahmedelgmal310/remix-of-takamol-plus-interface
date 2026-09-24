import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, ChevronLeft, ClipboardCheck, FileText, Filter, History, Home, PencilLine, Plus, Search, Send, SquarePen, Trash2, Upload, User, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Level = "خفيفة" | "متوسطة" | "كبيرة" | "شديدة";
type Rule = { name: string; cat: string; level: Level; penalty: string; repeat: string; notes: string; active: boolean; deduct: string };
type Rec = { date: string; v: string; p: string; status: "مكتملة" | "قيد الاعتماد" };
type Emp = { id: string; name: string; dept: string; job: string; hire: string; manager: string; history: Rec[] };

const LEVELS: Level[] = ["خفيفة", "متوسطة", "كبيرة", "شديدة"];
const levelTone: Record<Level, string> = { "خفيفة": "bg-success-soft text-success", "متوسطة": "bg-warning-soft text-warning", "كبيرة": "bg-warning/25 text-warning", "شديدة": "bg-destructive/10 text-destructive" };
const initialRules: Rule[] = [
  { name: "التأخر عن الحضور", cat: "الانضباط الوظيفي", level: "خفيفة", penalty: "الإنذار الشفهي", repeat: "من 1 إلى 3 مرات", notes: "كل تأخير أكثر من 10 دقائق", active: true, deduct: "لا يوجد" },
  { name: "الغياب بدون عذر", cat: "الانضباط الوظيفي", level: "متوسطة", penalty: "إنذار كتابي + حسم يوم", repeat: "من 1 إلى 3 مرات", notes: "غياب يوم عمل بدون عذر مقبول", active: true, deduct: "1 يوم" },
  { name: "الغياب المتكرر", cat: "الانضباط الوظيفي", level: "متوسطة", penalty: "حسم 3 أيام", repeat: "أكثر من 3 مرات", notes: "خلال 6 أشهر", active: true, deduct: "3 أيام" },
  { name: "مخالفة تعليمات السلامة", cat: "السلامة المهنية", level: "متوسطة", penalty: "إنذار كتابي", repeat: "حسب تقدير الإدارة", notes: "يحدد حسب نوع المخالفة", active: true, deduct: "لا يوجد" },
  { name: "إساءة استخدام ممتلكات الشركة", cat: "سلوك مهني", level: "كبيرة", penalty: "حسم 5 أيام", repeat: "من 1 إلى 2 مرة", notes: "بعد التحقيق", active: true, deduct: "5 أيام" },
  { name: "التزوير أو تقديم معلومات غير صحيح", cat: "سلوك مهني", level: "شديدة", penalty: "فصل من الخدمة", repeat: "مرة واحدة", notes: "بعد التحقيق الرسمي", active: true, deduct: "—" },
];
const initialEmps: Emp[] = [
  { id: "EMP-00125", name: "أحمد محمد السبيعي", dept: "تقنية المعلومات", job: "أخصائي نظم", hire: "2020/01/15", manager: "هند العتيبي", history: [
    { date: "2025/06/10", v: "التأخر عن الحضور", p: "إنذار شفهي", status: "مكتملة" },
    { date: "2024/12/05", v: "الغياب بدون عذر", p: "حسم يوم", status: "مكتملة" },
    { date: "2024/08/21", v: "عدم الالتزام بالزي", p: "إنذار كتابي", status: "مكتملة" }] },
  { id: "EMP-00087", name: "سارة عبدالله العتيبي", dept: "الموارد البشرية", job: "أخصائي موارد بشرية", hire: "2021/03/01", manager: "سعد العنزي", history: [
    { date: "2025/02/14", v: "التأخر عن الحضور", p: "إنذار شفهي", status: "مكتملة" }] },
  { id: "EMP-00142", name: "خالد علي الغامدي", dept: "المالية", job: "محاسب", hire: "2019/07/20", manager: "فهد القحطاني", history: [] },
];
const card = "rounded-xl border border-border bg-card p-4 shadow-sm";
const input = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const ro = "flex h-10 items-center rounded-md bg-muted px-3 text-sm";
const flow = [["إرسال الطلب", "يتم إرسال الطلب لموافقة المدير المباشر"], ["اعتماد المدير المباشر", "موافقة أو رفض الطلب"], ["مراجعة الموارد البشرية", "التحقق من البيانات وتأكيد الجزاء"], ["اعتماد الإدارة العليا", "الموافقة النهائية"], ["ترحيل الجزاء", "تطبيق الجزاء في النظام (الخصم/الرواتب)"]];

function Sel({ value, onChange, opts, all, icon }: { value: string; onChange: (v: string) => void; opts: string[]; all: string; icon?: React.ReactNode }) {
  return <div className="relative">{icon && <span className="absolute right-3 top-3 text-primary">{icon}</span>}<select value={value} onChange={e => onChange(e.target.value)} className={`${input} appearance-none ${icon ? "pr-9" : ""}`}><option value="">{all}</option>{opts.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>;
}

export function PenaltiesRegulation() {
  const [rules, setRules] = useState(initialRules);
  const [emps, setEmps] = useState(initialEmps);
  const [status, setStatus] = useState(""), [lvl, setLvl] = useState(""), [cat, setCat] = useState(""), [q, setQ] = useState("");
  const [edit, setEdit] = useState<{ i: number; r: Rule } | null>(null);
  const [empId, setEmpId] = useState("EMP-00125");
  const [ruleName, setRuleName] = useState(""), [date, setDate] = useState("2025-09-22"), [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [stage, setStage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (t: string, ok = true) => { setMsg({ t, ok }); setTimeout(() => setMsg(null), 3000); };
  const emp = emps.find(e => e.id === empId)!;
  const rule = rules.find(r => r.name === ruleName);
  const repeatCount = rule ? emp.history.filter(h => h.v === rule.name).length + 1 : 0;
  const cats = [...new Set(rules.map(r => r.cat))];
  const list = rules.filter(r => (!status || (status === "مفعلة") === r.active) && (!lvl || r.level === lvl) && (!cat || r.cat === cat) && (!q || (r.name + r.penalty + r.notes).includes(q)));
  const reset = () => { setRuleName(""); setDetails(""); setFiles([]); setDate("2025-09-22"); };
  const addFiles = (fl: FileList | null) => { if (!fl) return; const ok = [...fl].filter(f => /\.(pdf|jpe?g|png)$/i.test(f.name) && f.size <= 10 * 1024 * 1024); if (ok.length < fl.length) flash("بعض الملفات غير مدعومة أو أكبر من 10 ميجا.", false); setFiles(p => [...p, ...ok]); };
  const submit = () => {
    if (!rule) return flash("اختر نوع المخالفة.", false);
    if (!date) return flash("حدد تاريخ المخالفة.", false);
    if (!details.trim()) return flash("اكتب تفاصيل المخالفة.", false);
    setEmps(p => p.map(e => e.id === empId ? { ...e, history: [{ date: date.replaceAll("-", "/"), v: rule.name, p: rule.penalty, status: "قيد الاعتماد" }, ...e.history] } : e));
    setStage(1); flash(`تم إرسال جزاء «${rule.penalty}» على ${emp.name} للاعتماد.`); reset();
  };

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1400px] space-y-4">
    <nav className="flex flex-wrap items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />الحضور والانصراف<ChevronLeft size={12} />الجزاءات والمخالفات<ChevronLeft size={12} /><span>لائحة الجزاءات</span></nav>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3"><FileText size={40} className="text-brand-deep" /><div><h1 className="text-2xl font-extrabold text-brand-deep">لائحة الجزاءات</h1><p className="text-sm">إدارة أنواع المخالفات والجزاءات حسب سياسة الشركة</p></div></div>
      <button onClick={() => setEdit({ i: -1, r: { name: "", cat: cats[0]!, level: "خفيفة", penalty: "", repeat: "", notes: "", active: true, deduct: "لا يوجد" } })} className="flex h-11 items-center gap-2 rounded-md bg-primary px-6 font-bold text-primary-foreground"><Plus size={18} />إضافة مخالفة جديدة</button>
    </div>
    {msg && <p className={`rounded-md p-3 text-sm font-bold ${msg.ok ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive"}`}>{msg.t}</p>}

    <section className={card}>
      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_2fr]">
        <Sel value={status} onChange={setStatus} opts={["مفعلة", "معطلة"]} all="الكل" icon={<Filter size={16} />} />
        <Sel value={lvl} onChange={setLvl} opts={LEVELS} all="جميع الدرجات" />
        <Sel value={cat} onChange={setCat} opts={cats} all="جميع الفئات" />
        <label className="relative"><input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث في لائحة الجزاءات ..." className={`${input} pr-9`} /><Search size={17} className="absolute right-3 top-3 text-primary" /></label>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-center text-sm [&_td]:p-2.5 [&_th]:p-2.5 [&_th]:whitespace-nowrap">
        <thead><tr className="bg-primary-soft/60">{["#", "المخالفة", "الفئة", "الدرجة", "الجزاء", "التكرار", "ملاحظات", "الحالة", "إجراء"].map(h => <th key={h} className="font-bold">{h}</th>)}</tr></thead>
        <tbody>{list.length === 0 ? <tr><td colSpan={9} className="text-muted-foreground">لا توجد مخالفات مطابقة.</td></tr> : list.map(r => { const i = rules.indexOf(r); return <tr key={r.name} className="border-b border-border">
          <td>{i + 1}</td><td className="text-right font-semibold">{r.name}</td><td>{r.cat}</td><td><span className={`rounded px-3 py-1 text-xs font-bold ${levelTone[r.level]}`}>{r.level}</span></td><td>{r.penalty}</td><td>{r.repeat}</td><td className="text-xs">{r.notes}</td>
          <td><button onClick={() => setRules(p => p.map((x, j) => j === i ? { ...x, active: !x.active } : x))} className={`rounded px-3 py-1 text-xs font-bold ${r.active ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{r.active ? "مفعلة" : "معطلة"}</button></td>
          <td><div className="flex justify-center gap-3"><button onClick={() => { if (window.confirm(`حذف مخالفة «${r.name}»؟`)) setRules(p => p.filter((_, j) => j !== i)); }} className="text-destructive" aria-label="حذف"><Trash2 size={16} /></button><button onClick={() => setEdit({ i, r: { ...r } })} className="text-primary" aria-label="تعديل"><SquarePen size={16} /></button></div></td>
        </tr>; })}</tbody></table></div>
    </section>

    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_1.8fr]">
      <div className="space-y-4">
        <section className={card}><h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-extrabold"><User className="text-primary" size={20} />ملف الموظف</h2>
          <div className="mt-3 flex items-center justify-between gap-3"><div><b className="block">{emp.name}</b><span className="text-sm">{emp.id}</span></div><span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground"><User size={30} /></span></div>
          <dl className="mt-3 space-y-2 text-sm">{[["القسم", emp.dept], ["الوظيفة", emp.job], ["تاريخ التعيين", emp.hire], ["المدير المباشر", emp.manager]].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="font-bold">{k} :</dt><dd className="text-xs">{v}</dd></div>)}</dl>
          <Link to="/employees/profile" className="mt-3 flex h-9 items-center justify-center gap-2 rounded-md border border-border text-sm font-bold text-primary"><PencilLine size={15} />عرض الملف الكامل</Link></section>
        <section className={card}><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><History className="text-primary" size={20} />سجل الجزاءات للموظف</h2>
          <table className="w-full text-center text-xs [&_td]:p-1.5 [&_th]:p-1.5"><thead><tr className="bg-primary-soft/60"><th>التاريخ</th><th>المخالفة</th><th>الجزاء</th><th>الحالة</th></tr></thead>
            <tbody>{emp.history.length === 0 ? <tr><td colSpan={4} className="py-4 text-muted-foreground">لا توجد جزاءات سابقة.</td></tr> : (showAll ? emp.history : emp.history.slice(0, 3)).map((h, i) => <tr key={i} className="border-b border-border"><td>{h.date}</td><td>{h.v}</td><td>{h.p}</td><td><span className={`rounded px-1.5 py-0.5 font-bold ${h.status === "مكتملة" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{h.status}</span></td></tr>)}</tbody></table>
          {emp.history.length > 3 && <button onClick={() => setShowAll(s => !s)} className="mt-2 h-8 w-full rounded-md border border-border text-xs font-bold text-primary">{showAll ? "عرض أقل" : "عرض جميع الجزاءات"}</button>}
          {emp.history.length <= 3 && <p className="mt-2 text-center text-xs text-primary">عرض جميع الجزاءات</p>}</section>
      </div>

      <section className={card}><h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-extrabold"><ClipboardCheck className="text-primary" size={20} />مسار اعتماد الجزاء</h2>
        <ol className="relative mt-4 space-y-6 pr-10 before:absolute before:right-[15px] before:top-3 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-border">{flow.map(([t, d], i) => <li key={t} className="relative"><span className={`absolute -right-10 top-0 grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i < stage ? "bg-success" : "bg-muted-foreground/40"}`}>{i + 1}</span><b className="block">{t}</b><span className="text-xs text-muted-foreground">{d}</span></li>)}</ol>
        {stage > 0 && stage < 4 && <button onClick={() => { setStage(s => s + 1); flash(`تم ${flow[stage]![0]}.`); }} className="mt-4 h-9 w-full rounded-md bg-success font-bold text-primary-foreground">اعتماد المرحلة: {flow[stage]![0]}</button>}
      </section>

      <section className={`${card} lg:col-span-2 xl:col-span-1`}><h2 className="flex items-center gap-2 text-xl font-extrabold"><FileText className="text-primary" />تطبيق جزاء على موظف</h2><p className="mb-3 text-sm text-muted-foreground">تسجيل مخالفة وتطبيق الجزاء حسب لائحة الجزاءات</p>
        <div className="grid gap-4 rounded-lg border border-border p-3 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm font-bold">الموظف <span className="text-destructive">*</span><div className="mt-1 font-normal"><div className="relative"><Search size={16} className="absolute right-3 top-3 text-primary" /><select value={empId} onChange={e => { setEmpId(e.target.value); setShowAll(false); }} className={`${input} appearance-none pr-9`}>{emps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div></div></label>
            <label className="block text-sm font-bold">نوع المخالفة <span className="text-destructive">*</span><div className="mt-1 font-normal"><Sel value={ruleName} onChange={setRuleName} opts={rules.filter(r => r.active).map(r => r.name)} all="اختر نوع المخالفة ..." icon={<Search size={16} />} /></div></label>
            <label className="block text-sm font-bold">تاريخ المخالفة <span className="text-destructive">*</span><div className="relative mt-1"><input type="date" value={date} onChange={e => setDate(e.target.value)} className={`${input} font-normal`} /><CalendarDays size={16} className="pointer-events-none absolute left-9 top-3 text-primary" /></div></label>
            <label className="block text-sm font-bold">تفاصيل المخالفة <span className="text-destructive">*</span><textarea value={details} maxLength={500} onChange={e => setDetails(e.target.value)} placeholder="اكتب تفاصيل المخالفة ..." className="mt-1 min-h-24 w-full rounded-md border border-border p-3 font-normal outline-none focus:border-primary" /><span className="text-xs font-normal text-muted-foreground">{details.length}/500</span></label>
          </div>
          <div className="space-y-3 text-sm">
            {[["الدرجة", rule ? <span className={`rounded px-3 py-0.5 text-xs font-bold ${levelTone[rule.level]}`}>{rule.level}</span> : "—"], ["الجزاء المطبق", rule?.penalty ?? "—"], ["عدد التكرار", rule ? repeatCount : "—"], ["حسم من الراتب", rule?.deduct ?? "—"]].map(([k, v]) => <div key={k as string} className="grid grid-cols-[90px_1fr] items-center gap-2"><span className="font-bold">{k}</span><div className={ro}>{v}</div></div>)}
            <span className="block font-bold">مرفقات</span>
            <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }} className="cursor-pointer rounded-lg border-2 border-dashed border-primary/40 p-4 text-center text-xs"><Upload className="mx-auto mb-1 text-primary" /><b className="block text-sm">اسحب الملفات هنا أو اضغط للاختيار</b><span className="text-muted-foreground">PDF, JPG, PNG - الحد الأقصى 10 ميجابايت</span>
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" hidden onChange={e => addFiles(e.target.files)} /></div>
            {files.map((f, i) => <div key={i} className="flex items-center justify-between rounded bg-muted px-2 py-1 text-xs"><span className="truncate">{f.name}</span><button onClick={() => setFiles(p => p.filter((_, j) => j !== i))}><X size={14} /></button></div>)}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[2fr_1fr] gap-3"><button onClick={submit} className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary font-bold text-primary-foreground"><Send size={17} />إرسال للاعتماد</button><button onClick={reset} className="h-11 rounded-md border border-border font-bold">إلغاء</button></div>
      </section>
    </div>

    {edit && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setEdit(null)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); setRules(p => edit.i < 0 ? [...p, edit.r] : p.map((r, j) => j === edit.i ? edit.r : r)); flash(edit.i < 0 ? "تمت إضافة المخالفة." : "تم تعديل المخالفة."); setEdit(null); }} className="grid w-full max-w-lg gap-3 rounded-xl bg-card p-5 text-sm sm:grid-cols-2">
      <div className="flex items-center justify-between sm:col-span-2"><h3 className="text-lg font-extrabold">{edit.i < 0 ? "إضافة مخالفة جديدة" : "تعديل المخالفة"}</h3><button type="button" onClick={() => setEdit(null)}><X /></button></div>
      {([["name", "المخالفة"], ["cat", "الفئة"], ["penalty", "الجزاء"], ["repeat", "التكرار"], ["deduct", "الحسم من الراتب"], ["notes", "ملاحظات"]] as const).map(([k, l]) => <label key={k} className="block font-bold">{l}<input required={k !== "notes"} value={edit.r[k]} onChange={e => setEdit({ ...edit, r: { ...edit.r, [k]: e.target.value } })} className={`${input} mt-1 font-normal`} /></label>)}
      <label className="block font-bold">الدرجة<select value={edit.r.level} onChange={e => setEdit({ ...edit, r: { ...edit.r, level: e.target.value as Level } })} className={`${input} mt-1 font-normal`}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></label>
      <button className="h-10 self-end rounded-md bg-primary font-bold text-primary-foreground">حفظ</button>
    </form></div>}
  </div></main></AppShell>;
}
