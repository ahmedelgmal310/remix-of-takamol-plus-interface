import { useMemo, useRef, useState, type ReactNode } from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, CloudUpload, FileText, Home, Info, Paperclip, Save, Send, UserRound, Users, X, AlertTriangle, NotebookPen } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import ahmed from "@/assets/candidate-ahmed.jpg";

const steps = ["بيانات الطلب", "مراجعة الرصيد", "الموافقات", "تأكيد وإرسال"];
const balance = { total: 30, used: 12, pending: 3, left: 15 };
const init = { type: "إجازة سنوية", start: "2025-10-05", end: "2025-10-09", method: "أيام عمل (تستبعد الإجازات الرسمية)", title: "إجازة عائلية", reason: "قضاء إجازة مع العائلة.", notes: "" };

const fmt = (d: Date) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
const isWork = (d: Date) => d.getDay() !== 5 && d.getDay() !== 6;
const shift = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

function Card({ icon, title, children, className = "" }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return <section className={`panel p-4 ${className}`}><h3 className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-base font-extrabold text-brand-deep"><span className="text-primary">{icon}</span>{title}</h3>{children}</section>;
}
function Field({ label, req, children }: { label: string; req?: boolean; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-bold">{req && <b className="text-destructive">* </b>}{label}</span>{children}</label>;
}
const input = "h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";

export function LeaveRequestPage() {
  const [f, setF] = useState(init);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [msg, setMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof init, v: string) => setF(p => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const s = new Date(f.start), e = new Date(f.end);
    if (isNaN(+s) || isNaN(+e) || e < s) return null;
    const workOnly = f.method.startsWith("أيام عمل");
    let days = 0; for (let d = new Date(s); d <= e; d = shift(d, 1)) if (!workOnly || isWork(d)) days++;
    let before = shift(s, -1); while (!isWork(before)) before = shift(before, -1);
    let after = shift(e, 1); while (!isWork(after)) after = shift(after, 1);
    return { days, before: fmt(before), after: fmt(after) };
  }, [f.start, f.end, f.method]);
  const over = !!calc && f.type === "إجازة سنوية" && calc.days > balance.left;

  const addFiles = (list: FileList | null) => { if (!list) return; const ok = [...list].filter(x => /\.(pdf|jpe?g|png)$/i.test(x.name) && x.size <= 10 * 1024 * 1024); setFiles(p => [...p, ...ok]); if (ok.length < list.length) setMsg({ t: "بعض الملفات غير مدعومة أو أكبر من 10 ميجابايت.", ok: false }); };
  const submit = () => {
    if (!calc) return setMsg({ t: "تأكد من صحة تاريخ البداية والنهاية.", ok: false });
    if (!f.reason.trim()) return setMsg({ t: "يرجى كتابة سبب الإجازة.", ok: false });
    if (over) return setMsg({ t: "مدة الإجازة تتجاوز الرصيد المتاح.", ok: false });
    setSent(true); setStep(2); setMsg({ t: "تم إرسال طلب الإجازة بنجاح وهو الآن بانتظار موافقة المدير المباشر.", ok: true });
  };
  const approvals = [["موافقة المدير المباشر", sent ? "بانتظار موافقة المدير" : "بانتظار الارسال"], ["موافقة إدارة الموارد البشرية", "بانتظار موافقة المدير"], ["اعتماد نهائي", "بانتظار الموافقة"]];
  const leftPct = (balance.left / balance.total) * 100, usedPct = (balance.used / balance.total) * 100, pendPct = (balance.pending / balance.total) * 100;

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <nav className="flex flex-wrap items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />الإجازات<ChevronLeft size={12} />طلب إجازة جديد</nav>
    <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><CalendarDays className="text-primary" size={28} />طلب إجازة جديد</h1>
    <p className="mt-1 text-sm">تقديم طلب إجازة ومتابعة حالته واعتماده إلكترونياً</p>

    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <div className="space-y-4 lg:order-none">
        <section className="panel overflow-x-auto p-4 lg:hidden"><Stepper step={step} set={setStep} /></section>
        <Card icon={<UserRound size={20} />} title="بيانات الموظف">
          <div className="flex items-center gap-3"><img src={ahmed} alt="أحمد محمد السبيعي" className="size-20 rounded-full object-cover" /><div><b className="block">أحمد محمد السبيعي</b><span className="mt-1 inline-block rounded bg-primary-soft px-2 py-0.5 text-xs font-bold text-brand-deep">EMP-00125</span></div></div>
          <dl className="mt-4 space-y-2 text-sm">{[["القسم", "تقنية المعلومات"], ["المسمى الوظيفي", "أخصائي نظم معلومات"], ["المدير المباشر", "سعد العتيبي"]].map(([k, v]) => <div key={k} className="grid grid-cols-[1fr_auto_1fr] gap-2"><dt>{k}</dt><span>:</span><dd>{v}</dd></div>)}</dl>
        </Card>
        <Card icon={<FileText size={20} />} title="رصيد الإجازات">
          <div className="flex items-center justify-between gap-4">
            <ul className="flex-1 space-y-3 text-sm">{[["الرصيد السنوي", balance.total, "bg-primary"], ["المستخدم", balance.used, "bg-brand-deep"], ["المعلق", balance.pending, "bg-warning"], ["المتبقي", balance.left, "bg-success"]].map(([l, v, c]) => <li key={l as string} className="flex items-center gap-2"><span className={`size-3 rounded-full ${c}`} /><span className="flex-1">{l}</span><b className="font-semibold">{v} يوم</b></li>)}</ul>
            <div className="grid size-32 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--primary) 0 ${usedPct}%, var(--warning) ${usedPct}% ${usedPct + pendPct}%, var(--success) ${usedPct + pendPct}% ${usedPct + pendPct + leftPct}%, var(--muted) 0)` }}><div className="grid size-24 place-items-center rounded-full bg-card text-center"><div><b className="block text-3xl text-brand-deep">{balance.left}</b><span className="text-sm">يوم متاح</span></div></div></div>
          </div>
        </Card>
        <Card icon={<CalendarDays size={20} />} title="مواعيد مهمة">
          <table className="w-full text-sm"><tbody>{[["آخر يوم عمل قبل الإجازة", calc?.before ?? "—"], ["أول يوم عمل بعد الإجازة", calc?.after ?? "—"], ["عدد أيام الإجازة (أيام عمل)", calc ? `${calc.days} أيام` : "—"]].map(([k, v]) => <tr key={k} className="border-b border-border last:border-0"><td className="py-2">‹ {k}</td><td className="border-r border-border py-2 text-center">{v}</td></tr>)}</tbody></table>
        </Card>
        <Card icon={<Info size={20} />} title="سياسة الإجازات">
          <p className="text-sm leading-7">يجب تقديم طلب الإجازة قبل 3 أيام عمل على الأقل من تاريخ بداية الإجازة.</p>
          <button onClick={() => setMsg({ t: "سياسة الإجازات: 30 يومًا سنويًا، ويُشترط التقديم قبل 3 أيام عمل.", ok: true })} className="mt-2 flex items-center gap-2 text-sm font-bold text-primary"><Save size={16} />عرض سياسة الإجازات</button>
        </Card>
        <Card icon={<Users size={20} />} title="الموافقات المطلوبة">
          <ol className="relative space-y-5 before:absolute before:right-4 before:top-4 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-border">{approvals.map(([t, s], i) => <li key={t} className="relative flex items-start gap-3"><span className={`z-10 grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i === 0 ? "bg-primary" : "bg-muted-foreground/60"}`}>{i + 1}</span><div><b className="block">{t}</b><span className={`text-sm ${i === 0 && sent ? "text-warning" : "text-muted-foreground"}`}>{s}</span></div></li>)}</ol>
        </Card>
      </div>

      <div className="space-y-4">
        <section className="panel hidden overflow-x-auto p-4 lg:block"><Stepper step={step} set={setStep} /></section>
        {msg && <p className={`flex items-center justify-between gap-2 rounded-md p-3 text-sm font-bold ${msg.ok ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive"}`}>{msg.t}<button onClick={() => setMsg(null)}><X size={16} /></button></p>}
        <Card icon={<FileText size={20} />} title="بيانات الطلب">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نوع الإجازة" req><div className="relative"><select value={f.type} onChange={e => set("type", e.target.value)} className={`${input} appearance-none`}>{["إجازة سنوية", "إجازة مرضية", "إجازة اضطرارية", "إجازة بدون راتب", "إجازة زواج"].map(x => <option key={x}>{x}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3.5" /></div></Field>
            <Field label="مدة الإجازة"><div className={`${input} flex items-center justify-between bg-muted/30`}><span>{calc ? `${calc.days} أيام` : "—"}</span><CalendarDays size={18} /></div></Field>
            <Field label="تاريخ بداية الإجازة" req><input type="date" value={f.start} onChange={e => set("start", e.target.value)} className={input} /></Field>
            <Field label="تاريخ نهاية الإجازة" req><input type="date" value={f.end} min={f.start} onChange={e => set("end", e.target.value)} className={input} /></Field>
            <div className="sm:col-span-2"><Field label="طريقة احتساب الإجازة"><div className="relative"><select value={f.method} onChange={e => set("method", e.target.value)} className={`${input} appearance-none`}><option>أيام عمل (تستبعد الإجازات الرسمية)</option><option>أيام تقويمية (تشمل العطلات)</option></select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3.5" /></div></Field></div>
            <div className="sm:col-span-2"><Field label="عنوان الإجازة"><input value={f.title} onChange={e => set("title", e.target.value)} className={input} /></Field></div>
            <div className="sm:col-span-2"><Field label="سبب الإجازة" req><textarea maxLength={500} rows={4} value={f.reason} onChange={e => set("reason", e.target.value)} className={`${input} h-auto py-2`} /></Field><span className="text-xs text-muted-foreground">{f.reason.length}/500</span></div>
          </div>
          {over && <p className="mt-3 flex items-center gap-2 rounded-md bg-warning-soft p-3 text-sm font-bold text-warning"><AlertTriangle size={16} />مدة الإجازة ({calc?.days} أيام) أكبر من رصيدك المتاح ({balance.left} يوم).</p>}
        </Card>
        <Card icon={<Paperclip size={20} />} title="مرفقات (اختياري)">
          <button type="button" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }} className="w-full rounded-lg border-2 border-dashed border-primary/40 bg-primary-soft/30 p-8 text-center"><CloudUpload className="mx-auto text-brand-deep" size={40} /><b className="mt-2 block">اسحب الملفات هنا أو اضغط للاختيار</b><span className="text-sm text-muted-foreground">(PDF, JPG, PNG - الحد الأقصى 10 ميجابايت)</span></button>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
          {files.length > 0 && <ul className="mt-3 space-y-2">{files.map((x, i) => <li key={i} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"><span className="truncate">{x.name}</span><button onClick={() => setFiles(p => p.filter((_, j) => j !== i))}><X size={15} /></button></li>)}</ul>}
        </Card>
        <Card icon={<NotebookPen size={20} />} title="ملاحظات إضافية">
          <textarea maxLength={500} rows={3} value={f.notes} onChange={e => set("notes", e.target.value)} placeholder="أضف أي ملاحظات إضافية ..." className={`${input} h-auto py-2`} /><span className="text-xs text-muted-foreground">{f.notes.length}/500</span>
        </Card>
        <div className="panel flex flex-wrap gap-3 p-3">
          <button onClick={submit} disabled={sent} className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"><Send size={18} />{sent ? "تم الإرسال" : "إرسال الطلب"}</button>
          <button onClick={() => setMsg({ t: "تم حفظ الطلب كمسودة.", ok: true })} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-border text-sm font-bold"><Save size={18} />حفظ كمسودة</button>
          <button onClick={() => { setF(init); setFiles([]); setSent(false); setStep(0); setMsg({ t: "تم إلغاء الطلب وإعادة النموذج.", ok: true }); }} className="flex h-12 flex-1 items-center justify-center rounded-md border border-border text-sm font-bold">إلغاء</button>
        </div>
      </div>
    </div>
  </div></main></AppShell>;
}

function Stepper({ step, set }: { step: number; set: (n: number) => void }) {
  return <ol className="flex min-w-[480px]">{steps.map((s, i) => <li key={s} className="relative flex flex-1 flex-col items-center">{i < 3 && <span className={`absolute top-4 h-0.5 ${i < step ? "bg-success" : "bg-border"}`} style={{ right: "50%", left: "-50%" }} />}<button onClick={() => set(i)} className={`relative z-10 grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i === step ? "bg-primary" : i < step ? "bg-success" : "bg-muted-foreground/60"}`}>{i < step ? <Check size={15} /> : i + 1}</button><b className={`mt-2 text-sm ${i === step ? "text-primary" : ""}`}>{s}</b></li>)}</ol>;
}
