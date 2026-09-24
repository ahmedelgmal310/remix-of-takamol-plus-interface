import { useState, type ReactNode } from "react";
import { ArrowLeftRight, CalendarDays, ChevronDown, ChevronLeft, CloudUpload, FileText, Home, Info, Link2, Paperclip, Save, Send, Trash2, User, Clock, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import ahmed from "@/assets/candidate-ahmed.jpg";

const steps = ["بيانات الطلب", "المرفقات", "المراجعة", "الموافقات", "النتيجة"];
const empInfo = [["الوظيفة الحالية", "أخصائي نظم معلومات"], ["القسم الحالي", "تقنية المعلومات"], ["المدير المباشر", "سعد العتيبي"], ["تاريخ التعيين", "2020/01/15"], ["الدرجة", "السابعة"], ["الموقع الحالي", "الرياض - المقر الرئيسي"]];
const approvals = ["المدير المباشر", "مدير القسم المتنقل إليها", "إدارة الموارد البشرية", "المدير التنفيذي"];
const impactsL = ["تحديث الهيكل التنظيمي", "تحديث الصلاحيات والأنظمة", "نقل العهد والأصول", "تحديث الموقع في الحضور والانصراف", "إشعار الإدارات ذات العلاقة"];
const initReason = "نظراً للحاجة إلى دعم إدارة المشاريع بخبرات تقنية وللاستفادة من خبرات الموظف في إدارة الأنظمة. لذا نأمل الموافقة على نقله إلى إدارة المشاريع.";

function Card({ icon, title, children, className = "" }: { icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return <section className={`panel min-w-0 p-4 ${className}`}><h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-brand-deep"><span className="[&_svg]:size-6">{icon}</span>{title}</h2>{children}</section>;
}
const L = ({ t, r }: { t: string; r?: boolean }) => <label className="mb-1.5 block text-sm font-bold">{r && <span className="ml-1 text-destructive">*</span>}{t}</label>;
function Sel({ v, o, on, ph }: { v: string; o: string[]; on: (v: string) => void; ph?: string }) {
  return <div className="relative"><select value={v} onChange={e => on(e.target.value)} className={`h-10 w-full appearance-none rounded-md border border-input bg-background pr-3 pl-8 text-sm ${!v ? "text-muted-foreground" : ""}`}>{ph && <option value="">{ph}</option>}{o.map(x => <option key={x}>{x}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>;
}
const Ro = ({ v }: { v: string }) => <div className="flex h-10 items-center rounded-md bg-search px-3 text-sm text-muted-foreground">{v}</div>;
const Dt = ({ v, on }: { v: string; on: (v: string) => void }) => <div className="relative"><input type="date" value={v} onChange={e => on(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" /><CalendarDays size={16} className="pointer-events-none absolute left-3 top-3 hidden" /></div>;
const Sw = ({ on, set }: { on: boolean; set: (b: boolean) => void }) => <button role="switch" aria-checked={on} onClick={() => set(!on)} className={`relative h-6 w-11 shrink-0 rounded-full ${on ? "bg-primary" : "bg-muted-foreground/30"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-card transition-all ${on ? "left-0.5" : "left-[22px]"}`} /></button>;

export function EmployeeTransferPage() {
  const init = { type: "نقل داخلي (بين الأقسام)", date: "2025-10-09", start: "2025-11-01", toDept: "إدارة المشاريع", toLoc: "الرياض - الفرع الشمالي", title: "أخصائي مشاريع", reason: "مصلحة العمل", grade: "السابعة", salary: false, why: initReason, notes: "", sub: "", trial: "3 أشهر", moveCustody: true, notify: true };
  const [f, setF] = useState(init);
  const [files, setFiles] = useState([{ n: "موافقة المدير المباشر.pdf", s: "245 KB" }, { n: "دراسة الاحتياج.docx", s: "156 KB" }]);
  const [imp, setImp] = useState(impactsL.map(() => true));
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState("");
  const set = <K extends keyof typeof init>(k: K, v: (typeof init)[K]) => setF(p => ({ ...p, [k]: v }));
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };
  const addFiles = (l: FileList | null) => { if (!l) return; const ok = [...l].filter(x => /\.(pdf|jpe?g|png|docx?)$/i.test(x.name) && x.size <= 10 * 1024 * 1024); if (ok.length < l.length) flash("بعض الملفات غير مدعومة أو أكبر من 10 ميجابايت"); setFiles(p => [...p, ...ok.map(x => ({ n: x.name, s: `${Math.max(1, Math.round(x.size / 1024))} KB` }))]); };
  const submit = () => { if (!f.toDept || !f.toLoc || !f.title || !f.reason || !f.why.trim() || !f.date || !f.start) return flash("يرجى تعبئة جميع الحقول الإجبارية"); setStep(3); flash(`تم إرسال طلب النقل بنجاح برقم TRF-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`); };

  return <AppShell>
    {msg && <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-brand-deep px-5 py-3 text-sm text-primary-foreground shadow-lg">{msg}</div>}
    <nav className="flex flex-wrap items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />النقل والحركة الوظيفية<ChevronLeft size={12} />طلب نقل جديد</nav>
    <header className="mt-2 flex items-center gap-2"><FileText className="size-8 text-brand-deep" /><div><h1 className="text-2xl font-extrabold text-brand-deep">طلب نقل موظف</h1><p className="text-sm text-muted-foreground">تقديم طلب نقل موظف بين الأقسام أو الفروع أو المواقع</p></div></header>

    <section className="panel mt-3 overflow-x-auto px-5 py-4"><div className="flex min-w-[560px]">{steps.map((x, i) => <button key={x} onClick={() => setStep(i)} className={`relative flex flex-1 flex-col items-center after:absolute after:right-1/2 after:top-4 after:h-px after:w-full last:after:hidden ${i < step ? "after:bg-primary" : "after:bg-border"}`}><span className={`z-10 grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i <= step ? "bg-primary" : "bg-evaluation-step"}`}>{i + 1}</span><span className={`mt-2 text-sm ${i === step ? "font-bold text-primary" : ""}`}>{x}</span></button>)}</div></section>

    <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]">
      <Card icon={<ArrowLeftRight />} title="بيانات النقل المطلوبة" className="lg:order-1 order-2">
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div><L t="نوع النقل" r /><Sel v={f.type} o={["نقل داخلي (بين الأقسام)", "نقل بين الفروع", "نقل بين المواقع", "نقل مؤقت"]} on={v => set("type", v)} /></div>
          <div><L t="تاريخ طلب النقل" r /><Dt v={f.date} on={v => set("date", v)} /></div>
          <div><L t="القسم الحالي" /><Ro v="تقنية المعلومات" /></div>
          <div><L t="تاريخ المباشرة المقترح" r /><Dt v={f.start} on={v => set("start", v)} /></div>
          <div><L t="القسم المتنقل إليه" r /><Sel v={f.toDept} o={["إدارة المشاريع", "الإدارة المالية", "الموارد البشرية", "خدمة العملاء"]} on={v => set("toDept", v)} /></div>
          <div><L t="الموقع الحالي" /><Ro v="الرياض - المقر الرئيسي" /></div>
          <div><L t="المسمى الوظيفي بعد النقل" r /><Sel v={f.title} o={["أخصائي مشاريع", "مدير مشروع", "محلل أعمال", "أخصائي نظم معلومات"]} on={v => set("title", v)} /></div>
          <div><L t="الموقع المتنقل إليه" r /><Sel v={f.toLoc} o={["الرياض - الفرع الشمالي", "الرياض - المقر الرئيسي", "جدة - الفرع الغربي", "الدمام - الفرع الشرقي"]} on={v => set("toLoc", v)} /></div>
          <div><L t="الدرجة بعد النقل" /><Sel v={f.grade} o={["الخامسة", "السادسة", "السابعة", "الثامنة"]} on={v => set("grade", v)} /></div>
          <div><L t="سبب النقل" r /><Sel v={f.reason} o={["مصلحة العمل", "طلب الموظف", "إعادة هيكلة", "ترقية"]} on={v => set("reason", v)} /></div>
          <div className="sm:col-start-2"><L t="هل يوجد تغيير في الراتب؟" /><div className="flex gap-10">{[["نعم", true], ["لا", false]].map(([t, v]) => <button key={String(t)} onClick={() => set("salary", v as boolean)} className="flex items-center gap-2 text-sm"><span className={`grid size-5 place-items-center rounded-full border-2 ${f.salary === v ? "border-primary" : "border-muted-foreground/40"}`}>{f.salary === v && <span className="size-2.5 rounded-full bg-primary" />}</span>{t as string}</button>)}</div></div>
        </div>
      </Card>
      <Card icon={<User />} title="بيانات الموظف" className="lg:order-2 order-1">
        <div className="flex items-center justify-between gap-3"><div><b className="block text-lg text-brand-deep">أحمد محمد السبيعي</b><span className="mt-2 inline-block rounded bg-primary/10 px-3 py-1 text-sm text-brand-deep">EMP-00125</span></div><img src={ahmed} alt="أحمد محمد السبيعي" className="size-24 rounded-full object-cover" /></div>
        <dl className="mt-4 grid gap-3 text-sm">{empInfo.map(([k, v]) => <div key={k} className="grid grid-cols-[110px_16px_1fr]"><dt>{k}</dt><span>:</span><dd>{v}</dd></div>)}<div className="grid grid-cols-[110px_16px_1fr]"><dt>حالة الموظف</dt><span>:</span><dd className="flex items-center gap-2 text-success"><span className="size-2.5 rounded-full bg-success" />على رأس العمل</dd></div></dl>
      </Card>
    </div>

    <section className="panel mt-3 p-4"><L t="مبررات النقل" r /><textarea maxLength={500} value={f.why} onChange={e => set("why", e.target.value)} className="h-20 w-full resize-none rounded-md border border-input bg-background p-3 text-sm" /><span className="text-[11px] text-muted-foreground">{f.why.length}/500</span></section>

    <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
      <Card icon={<Paperclip />} title="المرفقات" className="order-2 lg:order-1">
        <div className="grid gap-3 md:grid-cols-2">
          <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }} className="order-2 grid cursor-pointer place-items-center rounded-md border-2 border-dashed border-primary/40 p-4 text-center text-sm md:order-2"><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={e => addFiles(e.target.files)} /><CloudUpload className="size-9 text-primary" /><span>اسحب الملفات هنا أو اضغط للاختيار</span><span className="text-xs text-muted-foreground">(الحد الأقصى 10 ميجابايت - PDF, JPG, PNG)</span></label>
          <div className="order-1"><b className="mb-2 flex items-center gap-2 text-sm text-brand-deep">الملفات المرفقة ({files.length})</b><div className="grid gap-2">{files.map((x, i) => <div key={x.n + i} className="flex items-center justify-between rounded-md bg-search px-3 py-2"><div className="flex items-center gap-2"><span className={`grid size-7 place-items-center rounded text-[9px] font-bold text-primary-foreground ${x.n.endsWith(".pdf") ? "bg-destructive" : "bg-primary"}`}>{x.n.split(".").pop()?.toUpperCase().slice(0, 3)}</span><div><p className="text-xs">{x.n}</p><p className="text-[10px] text-muted-foreground">{x.s}</p></div></div><button aria-label="حذف" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-muted-foreground"><Trash2 size={16} /></button></div>)}</div></div>
        </div>
      </Card>
      <Card icon={<FileText />} title="ملاحظات إضافية" className="order-1 lg:order-2"><textarea maxLength={500} value={f.notes} onChange={e => set("notes", e.target.value)} placeholder="أضف أي ملاحظات إضافية ..." className="h-24 w-full resize-none rounded-md border border-input bg-background p-3 text-sm" /><span className="text-[11px] text-muted-foreground">{f.notes.length}/500</span></Card>
    </div>

    <div className="mt-3 grid gap-3 lg:grid-cols-3">
      <Card icon={<Link2 />} title="التأثيرات والربط"><div className="grid gap-3">{impactsL.map((t, i) => <button key={t} onClick={() => setImp(imp.map((b, j) => j === i ? !b : b))} className="flex items-center gap-3 text-sm"><span className={`grid size-5 place-items-center rounded ${imp[i] ? "bg-primary text-primary-foreground" : "border-2 border-muted-foreground/40"}`}>{imp[i] && "✓"}</span>{t}</button>)}</div></Card>
      <Card icon={<Info />} title="معلومات إضافية"><div className="grid gap-3"><div><L t="بديل الموظف (إن وجد)" /><Sel v={f.sub} ph="اختر موظف" o={["سارة العنزي", "محمد الشهري", "خالد الغامدي"]} on={v => set("sub", v)} /></div><div><L t="مدة التجربة في القسم الجديد" /><Sel v={f.trial} o={["بدون", "شهر", "3 أشهر", "6 أشهر"]} on={v => set("trial", v)} /></div><div className="flex items-center justify-between text-sm"><span>نقل العهد والموجودات للجهة الجديدة</span><Sw on={f.moveCustody} set={b => set("moveCustody", b)} /></div><div className="flex items-center justify-between text-sm"><span>إشعار الموظف بعد الموافقة</span><Sw on={f.notify} set={b => set("notify", b)} /></div></div></Card>
      <Card icon={<Clock />} title="سير الموافقات"><ol className="relative grid gap-4 before:absolute before:right-3 before:top-2 before:bottom-2 before:w-px before:bg-border">{approvals.map((a, i) => { const done = step >= 3 && i === 0; const cur = step >= 3 ? i === 1 : i === 0; return <li key={a} className="relative flex gap-3"><span className={`z-10 grid size-6 place-items-center rounded-full text-xs font-bold text-primary-foreground ${done ? "bg-success" : cur ? "bg-primary" : "bg-evaluation-step"}`}>{i + 1}</span><div><b className="block text-sm">{a}</b><span className={`text-xs ${done ? "text-success" : "text-muted-foreground"}`}>{done ? "تمت الموافقة" : "قيد الانتظار"}</span></div></li>; })}</ol></Card>
    </div>

    <div className="mt-3 grid gap-3 sm:grid-cols-[1.6fr_1.6fr_1fr]">
      <button onClick={submit} className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary text-base font-bold text-primary-foreground"><Send size={20} />إرسال الطلب</button>
      <button onClick={() => flash("تم حفظ الطلب كمسودة")} className="flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-card text-base font-bold text-brand-deep"><Save size={20} />حفظ كمسودة</button>
      <button onClick={() => { setF(init); setStep(0); setImp(impactsL.map(() => true)); }} className="flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-card text-base font-bold text-brand-deep"><X size={20} />إلغاء</button>
    </div>
  </AppShell>;
}
