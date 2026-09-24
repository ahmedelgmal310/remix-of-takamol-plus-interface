import { useMemo, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { CheckCircle2, ChevronDown, ChevronLeft, ClipboardList, CloudUpload, FileText, FlaskConical, Home, Info, Mail, Paperclip, Phone, Plus, Save, Search, Send, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import tubes from "@/assets/lab-tubes.jpg";
import { labCatalog, labCategories, type LabTest } from "@/data/mockData";

const initEmp = { id: "EMP-0087", name: "سارة عبدالله العتيبي", dept: "الموارد البشرية", job: "أخصائي موارد بشرية", nid: "1023456789", phone: "0501234567", email: "sara@company.sa" };
const initReq = { type: "فحص دوري", priority: "عادي", from: "إدارة الموارد البشرية", reason: "فحص دوري سنوي للموظفة" };
const initTests = labCatalog.slice(0, 4);
const input = "h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";

function Section({ n, icon, title, extra, children }: { n?: number; icon: ReactNode; title: string; extra?: ReactNode; children: ReactNode }) {
  return <section className="panel p-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3"><h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-deep"><span className="grid size-8 place-items-center rounded-full bg-primary text-sm text-primary-foreground">{n ?? icon}</span>{title}</h2>{extra}</div>{children}</section>;
}
function F({ label, req, children }: { label: string; req?: boolean; children: ReactNode }) {
  return <label className="block min-w-0"><span className="mb-1.5 block text-sm font-bold">{req && <b className="text-destructive">* </b>}{label}</span>{children}</label>;
}
function IconInput({ icon, ...p }: { icon: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return <div className="relative"><input {...p} className={`${input} pl-9`} /><span className="absolute left-3 top-3 text-muted-foreground">{icon}</span></div>;
}
function Sel({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: string[] }) {
  return <div className="relative"><select value={value} onChange={e => onChange(e.target.value)} className={`${input} appearance-none`}>{opts.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>;
}

export function LabTestRequestPage() {
  const [emp, setEmp] = useState(initEmp);
  const [req, setReq] = useState(initReq);
  const [tests, setTests] = useState<LabTest[]>(initTests);
  const [tab, setTab] = useState("الكل");
  const [q, setQ] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [picker, setPicker] = useState(false);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => tests.filter(t => (tab === "الكل" || t.cat === tab) && (!q || (t.name + t.code).toLowerCase().includes(q.toLowerCase()))), [tests, tab, q]);
  const addFiles = (l: FileList | null) => { if (!l) return; const ok = [...l].filter(x => /\.(pdf|jpe?g|png)$/i.test(x.name) && x.size <= 5 * 1024 * 1024); setFiles(p => [...p, ...ok]); if (ok.length < l.length) setMsg({ t: "بعض الملفات غير مدعومة أو أكبر من 5 ميجابايت.", ok: false }); };
  const submit = () => {
    if (!emp.id.trim() || !emp.name.trim() || !emp.nid.trim() || !emp.phone.trim()) return setMsg({ t: "يرجى استكمال بيانات الموظف المطلوبة.", ok: false });
    if (!tests.length) return setMsg({ t: "يرجى إضافة تحليل واحد على الأقل.", ok: false });
    setMsg({ t: `تم إرسال الطلب بنجاح برقم LAB-2025-${String(Math.floor(1000 + Math.random() * 9000))}.`, ok: true }); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => { setEmp(initEmp); setReq(initReq); setTests(initTests); setFiles([]); setNotes(""); setTab("الكل"); setQ(""); setMsg({ t: "تم إلغاء الطلب وإعادة النموذج.", ok: true }); };

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <nav className="flex items-center gap-2 text-xs text-primary"><Home size={14} />الرئيسية<ChevronLeft size={12} />طلبات الفحص<ChevronLeft size={12} />طلب جديد</nav>
    <header className="panel mt-3 grid overflow-hidden sm:grid-cols-[1fr_minmax(0,0.9fr)]">
      <div className="flex items-center gap-4 p-5"><span className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><FlaskConical size={34} /></span><div><h1 className="text-2xl font-extrabold text-brand-deep sm:text-3xl">طلب فحص مخبري جديد</h1><p className="mt-1 text-sm">قم بإدخال بيانات الطلب واختيار التحاليل المطلوبة</p></div></div>
      <img src={tubes} alt="أنابيب تحاليل مخبرية" width={1152} height={576} className="hidden h-full max-h-32 w-full object-cover sm:block" style={{ maskImage: "linear-gradient(to left, transparent, black 35%)" }} />
    </header>
    {msg && <p className={`mt-3 flex items-center justify-between gap-2 rounded-md p-3 text-sm font-bold ${msg.ok ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive"}`}>{msg.t}<button onClick={() => setMsg(null)}><X size={16} /></button></p>}

    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <Section n={1} icon={null} title="بيانات الموظف / المراجع">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <F label="رقم الموظف" req><IconInput icon={<UserRound size={15} />} value={emp.id} onChange={e => setEmp({ ...emp, id: e.target.value })} /></F>
            <F label="اسم الموظف" req><input className={input} value={emp.name} onChange={e => setEmp({ ...emp, name: e.target.value })} /></F>
            <F label="الجهة / الإدارة"><Sel value={emp.dept} onChange={v => setEmp({ ...emp, dept: v })} opts={["الموارد البشرية", "المالية", "تقنية المعلومات", "خدمة العملاء"]} /></F>
            <F label="المسمى الوظيفي"><Sel value={emp.job} onChange={v => setEmp({ ...emp, job: v })} opts={["أخصائي موارد بشرية", "محاسب", "مطور نظم", "أخصائي خدمة عملاء"]} /></F>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <F label="رقم الهوية" req><IconInput icon={<UserRound size={15} />} value={emp.nid} onChange={e => setEmp({ ...emp, nid: e.target.value })} /></F>
            <F label="رقم الجوال" req><IconInput icon={<Phone size={15} />} value={emp.phone} onChange={e => setEmp({ ...emp, phone: e.target.value })} /></F>
            <F label="البريد الإلكتروني"><IconInput icon={<Mail size={15} />} type="email" value={emp.email} onChange={e => setEmp({ ...emp, email: e.target.value })} /></F>
          </div>
        </Section>

        <Section icon={<FileText size={16} />} title="تفاصيل الطلب">
          <div className="grid gap-4 sm:grid-cols-3">
            <F label="نوع الفحص" req><Sel value={req.type} onChange={v => setReq({ ...req, type: v })} opts={["فحص دوري", "فحص ما قبل التوظيف", "فحص عودة من إجازة مرضية", "فحص طارئ"]} /></F>
            <F label="الأولوية"><Sel value={req.priority} onChange={v => setReq({ ...req, priority: v })} opts={["عادي", "عاجل", "عاجل جداً"]} /></F>
            <F label="الجهة الطالبة" req><Sel value={req.from} onChange={v => setReq({ ...req, from: v })} opts={["إدارة الموارد البشرية", "الإدارة الطبية", "المدير المباشر"]} /></F>
          </div>
          <div className="mt-4"><F label="سبب الطلب"><textarea rows={2} value={req.reason} onChange={e => setReq({ ...req, reason: e.target.value })} className={`${input} h-auto py-2`} /></F></div>
        </Section>

        <Section icon={<FlaskConical size={16} />} title="التحاليل المطلوبة" extra={<label className="relative w-full sm:w-56"><input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث عن تحليل ..." className={`${input} pl-9`} /><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /></label>}>
          <div className="flex gap-1 overflow-x-auto rounded-md bg-muted/50 p-1">{["الكل", ...labCategories].map(c => <button key={c} onClick={() => setTab(c)} className={`flex-1 whitespace-nowrap rounded px-3 py-2 text-sm font-semibold ${tab === c ? "bg-primary text-primary-foreground" : ""}`}>{c}</button>)}</div>
          <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[560px] text-center text-sm"><thead><tr className="bg-muted/50">{["#", "اسم التحليل", "الرمز", "النوع", "ملاحظات", "إجراءات"].map(h => <th key={h} className={`p-2 font-bold ${h === "اسم التحليل" || h === "#" ? "text-right" : ""}`}>{h}</th>)}</tr></thead>
            <tbody>{shown.length === 0 ? <tr><td colSpan={6} className="p-6 text-muted-foreground">لا توجد تحاليل في هذا التصنيف.</td></tr> : shown.map((t, i) => <tr key={t.code} className="border-b border-border"><td className="p-2 text-right">{i + 1}</td><td className="p-2 text-right font-bold">{t.name}</td><td className="p-2">{t.code}</td><td className="p-2">{t.kind}</td><td className="p-2">{t.note}</td><td className="p-2"><button onClick={() => setTests(p => p.filter(x => x.code !== t.code))} aria-label="حذف" className="rounded bg-destructive/10 p-1.5 text-destructive"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>
          <button onClick={() => setPicker(true)} className="mt-3 flex w-full items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary/50 bg-primary-soft/60 p-4 text-brand-deep"><span className="grid size-10 place-items-center rounded-full border-2 border-brand-deep"><Plus size={20} /></span><span className="text-right"><b className="block text-lg">إضافة تحليل آخر</b><span className="text-sm">ابحث عن التحليل أو أضفه يدوياً</span></span></button>
        </Section>

        <Section icon={<Paperclip size={16} />} title="المرفقات (اختياري)">
          <div className="grid gap-4 md:grid-cols-2">
            <div><F label="ملاحظات إضافية"><textarea rows={3} maxLength={500} value={notes} onChange={e => setNotes(e.target.value)} placeholder="أكتب أي ملاحظات أو تعليمات خاصة بالمختبر ..." className={`${input} h-auto py-2`} /></F></div>
            <div><button onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }} className="flex h-full min-h-24 w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary/40 bg-primary-soft/30 p-4"><CloudUpload className="text-primary" size={34} /><span className="text-right"><b className="block text-sm">اسحب الملفات هنا أو اضغط للاختيار</b><span className="text-xs text-muted-foreground">(PDF, JPG, PNG الحد الأقصى 5 ميجابايت)</span></span></button>
              <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
              {files.length > 0 && <ul className="mt-2 space-y-1">{files.map((x, i) => <li key={i} className="flex items-center justify-between rounded bg-muted/40 px-3 py-1.5 text-xs"><span className="truncate">{x.name}</span><button onClick={() => setFiles(p => p.filter((_, j) => j !== i))}><X size={14} /></button></li>)}</ul>}</div>
          </div>
        </Section>

        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={submit} className="flex h-12 min-w-40 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-bold text-primary-foreground"><Send size={18} />إرسال الطلب</button>
          <button onClick={() => setMsg({ t: "تم حفظ الطلب كمسودة.", ok: true })} className="flex h-12 min-w-40 items-center justify-center gap-2 rounded-md border border-border bg-card px-8 text-sm font-bold"><Save size={18} />حفظ كمسودة</button>
          <button onClick={reset} className="flex h-12 min-w-32 items-center justify-center gap-2 rounded-md border border-border bg-card px-8 text-sm font-bold"><X size={18} />إلغاء</button>
        </div>
      </div>

      <aside className="space-y-4">
        <section className="panel p-4"><h3 className="mb-3 flex items-center gap-2 border-b border-border pb-3 font-extrabold text-brand-deep"><Info className="fill-primary text-primary-foreground" size={22} />معلومات مهمة</h3>
          <ul className="list-disc space-y-3 pr-4 text-sm leading-6">{["تأكد من اختيار التحاليل المطلوبة بدقة.", "سيتم إشعارك بحالة الطلب عبر النظام.", "في حال وجود ملفات طبية سابقة أرفقها.", "مدة معالجة الطلب تعتمد على نوع التحليل.", "يمكن متابعة الطلب من قائمة طلبات الفحص."].map(x => <li key={x}>{x}</li>)}</ul></section>
        <section className="panel p-4"><h3 className="mb-3 flex items-center gap-2 border-b border-border pb-3 font-extrabold text-brand-deep"><ShieldCheck className="text-primary" size={22} />سياسة الخصوصية</h3><p className="text-sm leading-7">جميع البيانات الطبية سرية وتستخدم فقط لأغراض الفحص الطبي وفق سياسة أمن المعلومات.</p></section>
        <div className="hidden p-4 text-center lg:block"><div className="relative mx-auto grid size-40 place-items-center rounded-full bg-primary-soft"><ClipboardList className="text-brand-deep" size={96} strokeWidth={1.3} /><FlaskConical className="absolute text-primary" size={30} style={{ top: "52%" }} /><CheckCircle2 className="absolute bottom-4 left-4 fill-primary text-primary-foreground" size={44} /></div><b className="mt-4 block text-2xl text-brand-deep">معاً نحو</b><span className="text-lg">بيئة عمل صحية وآمنة</span></div>
      </aside>
    </div>

    {picker && <Picker existing={tests} onClose={() => setPicker(false)} onAdd={t => { setTests(p => [...p, t]); setTab("الكل"); setMsg({ t: `تمت إضافة تحليل «${t.name}».`, ok: true }); }} />}
  </div></main></AppShell>;
}

function Picker({ existing, onClose, onAdd }: { existing: LabTest[]; onClose: () => void; onAdd: (t: LabTest) => void }) {
  const [q, setQ] = useState(""), [cat, setCat] = useState("الكل"), [manual, setManual] = useState(false);
  const [m, setM] = useState({ name: "", code: "", kind: "دم", note: "", cat: "تحاليل أخرى" });
  const list = labCatalog.filter(t => !existing.some(e => e.code === t.code) && (cat === "الكل" || t.cat === cat) && (!q || (t.name + t.code).toLowerCase().includes(q.toLowerCase())));
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={onClose}><div dir="rtl" onClick={e => e.stopPropagation()} className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-card p-5">
    <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold text-brand-deep">إضافة تحليل</h3><button onClick={onClose}><X /></button></div>
    <div className="mt-3 flex gap-2 rounded-md bg-muted/50 p-1 text-sm font-bold">{["من القائمة", "إضافة يدوية"].map((l, i) => <button key={l} onClick={() => setManual(i === 1)} className={`flex-1 rounded py-2 ${manual === (i === 1) ? "bg-primary text-primary-foreground" : ""}`}>{l}</button>)}</div>
    {!manual ? <>
      <div className="mt-3 flex gap-2"><input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث عن تحليل ..." className={input} /><div className="w-40 shrink-0"><Sel value={cat} onChange={setCat} opts={["الكل", ...labCategories]} /></div></div>
      <ul className="mt-3 flex-1 space-y-2 overflow-y-auto">{list.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">لا توجد نتائج. جرّب الإضافة اليدوية.</li>}{list.map(t => <li key={t.code} className="flex items-center justify-between rounded-md border border-border p-3 text-sm"><div><b>{t.name}</b> <span className="text-muted-foreground">({t.code})</span><span className="block text-xs text-muted-foreground">{t.cat} · {t.kind}</span></div><button onClick={() => { onAdd(t); onClose(); }} className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"><Plus size={14} />إضافة</button></li>)}</ul>
    </> : <form onSubmit={e => { e.preventDefault(); if (!m.name.trim() || !m.code.trim()) return; onAdd({ ...m, note: m.note || "—" }); onClose(); }} className="mt-3 grid gap-3 sm:grid-cols-2">
      <F label="اسم التحليل" req><input required value={m.name} onChange={e => setM({ ...m, name: e.target.value })} className={input} /></F>
      <F label="الرمز" req><input required value={m.code} onChange={e => setM({ ...m, code: e.target.value })} className={input} /></F>
      <F label="النوع"><Sel value={m.kind} onChange={v => setM({ ...m, kind: v })} opts={["دم", "بول", "أشعة", "أخرى"]} /></F>
      <F label="التصنيف"><Sel value={m.cat} onChange={v => setM({ ...m, cat: v })} opts={labCategories} /></F>
      <div className="sm:col-span-2"><F label="ملاحظة"><input value={m.note} onChange={e => setM({ ...m, note: e.target.value })} className={input} /></F></div>
      <button className="h-11 rounded-md bg-primary font-bold text-primary-foreground sm:col-span-2">إضافة التحليل</button>
    </form>}
  </div></div>;
}
