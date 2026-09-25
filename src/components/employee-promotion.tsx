import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Calculator, CheckSquare, ChevronDown, ChevronLeft, CloudUpload, FileText, Home, Paperclip, Save, Send, Trash2, Trophy, Wallet, User, FileSearch, Settings, FileSignature, UserCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import ahmed from "@/assets/candidate-ahmed.jpg";

const steps = ["بيانات الطلب", "المرفقات والتقييم", "المسار الوظيفي والمالي", "الموافقات", "النتيجة"];
const emp = [["الوظيفة الحالية", "أخصائي نظم معلومات"], ["القسم", "تقنية المعلومات"], ["الإدارة", "الإدارة العامة لتقنية المعلومات"], ["تاريخ المباشرة", "2020/01/15"], ["سنوات الخدمة", "5 سنوات و 8 أشهر"], ["المؤهل العلمي", "بكالوريوس علوم حاسب"], ["التقييم الأخير", "ممتاز (92%)"]];
const path = [["أخصائي دعم فني", "2020/01/15"], ["أخصائي نظم معلومات", "2022/06/01"], ["أخصائي أول نظم معلومات", "(متوقع)"]];
const docsL = ["التقييمات السنوية", "شهادات الدورات التدريبية", "إنجازات ومشاريع سابقة", "خطاب التوصية من المدير المباشر", "أي مستندات أخرى"];
const flow = [[User, "المدير المباشر", "قيد المراجعة"], [FileSearch, "مدير الإدارة", "بانتظار الاعتماد"], [Settings, "إدارة الموارد البشرية", "بانتظار الاعتماد"], [FileSignature, "المدير المالي\n(عند وجود تأثير مالي)", "بانتظار الاعتماد"], [UserCheck, "الرئيس التنفيذي", "الاعتماد النهائي"]] as const;
const n = (v: number) => v.toLocaleString("en-US");

function Card({ icon, title, children, className = "" }: { icon?: ReactNode; title: string; children: ReactNode; className?: string }) {
  return <section className={`panel min-w-0 p-4 ${className}`}><h2 className="mb-4 flex items-center gap-2 border-b border-border pb-3 text-base font-extrabold text-brand-deep"><span className="[&_svg]:size-6">{icon}</span>{title}</h2>{children}</section>;
}
const L = ({ t, r }: { t: string; r?: boolean }) => <label className="mb-1.5 block text-sm font-bold">{r && <span className="ml-1 text-destructive">*</span>}{t}</label>;
function Sel({ v, o, on }: { v: string; o: string[]; on: (v: string) => void }) {
  return <div className="relative"><select value={v} onChange={e => on(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-input bg-background pr-3 pl-8 text-sm">{o.map(x => <option key={x}>{x}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>;
}
const inp = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
function Area({ v, on, h = "h-16" }: { v: string; on: (v: string) => void; h?: string }) {
  return <><textarea maxLength={500} value={v} onChange={e => on(e.target.value)} className={`${h} w-full resize-none rounded-md border border-input bg-background p-2 text-sm`} /><span className="text-[11px] text-muted-foreground">{v.length}/500</span></>;
}

export function EmployeePromotionPage() {
  const init = { from: "الإدارة المباشرة", date: "2025-09-22", job: "أخصائي أول نظم معلومات", type: "ترقية وظيفية", grade: "الدرجة (7)", wish: "2025-10-01", why: "تقديراً للأداء المتميز للموظف، وتحقيقه لجميع الأهداف السنوية، وتحمله مسؤوليات إضافية.", avg: "90%", last: "ممتاز (92%)", years: "5", courses: "12", notes: "يتمتع الموظف بكفاءة عالية وروح مبادرة.", skills: "إدارة مشاريع. تطوير أنظمة. قيادة فريق. تحسين العمليات.", budget: "ميزانية الرواتب", eff: "2025-10-01", finNote: "تم التحقق من توفر الميزانية." };
  const [f, setF] = useState(init);
  const [docs, setDocs] = useState(docsL.map(() => true));
  const [files, setFiles] = useState<string[]>([]);
  const [after, setAfter] = useState([10000, 500, 1500, 500]);
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState("");
  const set = <K extends keyof typeof init>(k: K, v: string) => setF(p => ({ ...p, [k]: v }));
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };
  const cur = [8000, 500, 1500, 0];
  const rows = ["الراتب الأساسي", "بدل النقل", "بدل السكن", "بدلات أخرى"];
  const tc = cur.reduce((a, b) => a + b, 0), ta = after.reduce((a, b) => a + b, 0);
  const submit = () => { if (!f.why.trim() || !f.job || !f.date || !f.wish) return flash("يرجى تعبئة جميع الحقول الإجبارية"); setStep(3); flash(`تم إرسال طلب الترقية بنجاح برقم PRM-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(4, "0")}`); };

  return <AppShell>
    {msg && <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-brand-deep px-5 py-3 text-sm text-primary-foreground shadow-lg">{msg}</div>}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><nav className="flex flex-wrap items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />التوظيف والتطوير<ChevronLeft size={12} />الترقيات<ChevronLeft size={12} />طلب ترقية جديد</nav>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><FileText className="size-7" />طلب ترقية موظف</h1><p className="text-sm text-muted-foreground">إدارة طلبات الترقية ومتابعة إجراءاتها واعتمادها</p></div>
      <Link to="/employees/profile" className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-6 text-sm">رجوع<ArrowLeft size={18} /></Link>
    </div>

    <section className="panel mt-3 overflow-x-auto px-5 py-4"><div className="flex min-w-[600px]">{steps.map((x, i) => <button key={x} onClick={() => setStep(i)} className={`relative flex flex-1 flex-col items-center after:absolute after:right-1/2 after:top-4 after:h-px after:w-full last:after:hidden ${i < step ? "after:bg-primary" : "after:bg-border"}`}><span className={`z-10 grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i <= step ? "bg-primary" : "bg-evaluation-step"}`}>{i + 1}</span><span className={`mt-2 text-sm ${i === step ? "font-bold text-primary" : ""}`}>{x}</span></button>)}</div></section>

    <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="grid min-w-0 content-start gap-3">
        <Card icon={<Calculator />} title="بيانات الطلب">
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div><L t="رقم الطلب" /><div className="flex h-10 items-center rounded-md bg-search px-3 text-xs text-muted-foreground">يولد تلقائياً بعد الحفظ</div></div>
            <div><L t="الجهة الطالبة" r /><Sel v={f.from} o={["الإدارة المباشرة", "إدارة الموارد البشرية", "الإدارة العليا"]} on={v => set("from", v)} /></div>
            <div><L t="تاريخ الطلب" r /><input type="date" value={f.date} onChange={e => set("date", e.target.value)} className={inp} /></div>
            <div><L t="الوظيفة المراد الترقية إليها" r /><Sel v={f.job} o={["أخصائي أول نظم معلومات", "رئيس قسم الأنظمة", "مهندس حلول تقنية"]} on={v => set("job", v)} /></div>
            <div><L t="نوع الترقية" r /><Sel v={f.type} o={["ترقية وظيفية", "ترقية استثنائية", "ترقية بالأقدمية"]} on={v => set("type", v)} /></div>
            <div><L t="الدرجة / المستوى" r /><Sel v={f.grade} o={["الدرجة (6)", "الدرجة (7)", "الدرجة (8)"]} on={v => set("grade", v)} /></div>
            <div className="sm:col-start-2"><L t="تاريخ الرغبة في الترقية" r /><input type="date" value={f.wish} onChange={e => set("wish", e.target.value)} className={inp} /></div>
          </div>
          <div className="mt-3"><L t="مبررات الترقية" r /><Area v={f.why} on={v => set("why", v)} h="h-20" /></div>
        </Card>

        <Card icon={<BarChart3 />} title="الأداء والكفاءات">
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <div><L t="متوسط تقييم آخر 3 سنوات" /><Sel v={f.avg} o={["80%", "85%", "90%", "95%"]} on={v => set("avg", v)} /></div>
            <div><L t="نتيجة التقييم السنوي الأخير" /><Sel v={f.last} o={["ممتاز (92%)", "جيد جداً (85%)", "جيد (75%)"]} on={v => set("last", v)} /></div>
            <div><L t="عدد سنوات الخبرة في المجال" /><input value={`${f.years} سنوات`} onChange={e => set("years", e.target.value.replace(/\D/g, ""))} className={inp} /></div>
            <div><L t="عدد الدورات التدريبية" /><input type="number" value={f.courses} onChange={e => set("courses", e.target.value)} className={inp} /></div>
            <div><L t="الملاحظات" /><Area v={f.notes} on={v => set("notes", v)} /></div>
            <div><L t="المهارات والإنجازات البارزة" /><Area v={f.skills} on={v => set("skills", v)} /></div>
          </div>
        </Card>

        <Card icon={<Paperclip />} title="المرفقات">
          <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <div><b className="mb-2 block text-sm">المستندات المطلوبة</b><div className="grid gap-2">{docsL.map((d, i) => <button key={d} onClick={() => setDocs(docs.map((b, j) => j === i ? !b : b))} className="flex items-center gap-2 text-xs"><span className={`grid size-4 place-items-center rounded text-[10px] ${docs[i] ? "bg-primary text-primary-foreground" : "border-2 border-muted-foreground/40"}`}>{docs[i] && "✓"}</span>{d}</button>)}</div></div>
            <div>
              <label onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFiles(p => [...p, ...[...e.dataTransfer.files].map(x => x.name)]); }} className="grid h-full min-h-32 cursor-pointer place-items-center rounded-md border-2 border-dashed border-primary/40 p-4 text-center text-sm"><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { const l = [...(e.target.files ?? [])]; const ok = l.filter(x => x.size <= 10485760); if (ok.length < l.length) flash("الحد الأقصى 10 ميجابايت للملف"); setFiles(p => [...p, ...ok.map(x => x.name)]); }} /><div><CloudUpload className="mx-auto size-9 text-brand-deep" /><p>اسحب الملفات هنا أو اضغط للاختيار</p><p className="text-xs text-muted-foreground">PDF, JPG, PNG · الحد الأقصى 10 ميجابايت</p></div></label>
              {files.map((x, i) => <div key={x + i} className="mt-2 flex items-center justify-between rounded bg-search px-3 py-1.5 text-xs">{x}<button aria-label="حذف" onClick={() => setFiles(files.filter((_, j) => j !== i))}><Trash2 size={14} /></button></div>)}
            </div>
          </div>
        </Card>

        <Card icon={<Calculator />} title="التأثير المالي للترقية">
          <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <div className="grid content-start gap-3"><div><L t="البند المالي" /><Sel v={f.budget} o={["ميزانية الرواتب", "ميزانية الترقيات"]} on={v => set("budget", v)} /></div><div><L t="تاريخ سريان الترقية" /><input type="date" value={f.eff} onChange={e => set("eff", e.target.value)} className={inp} /></div><div><L t="ملاحظات مالية" /><input maxLength={500} value={f.finNote} onChange={e => set("finNote", e.target.value)} className={inp} /><span className="text-[11px] text-muted-foreground">{f.finNote.length}/500</span></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[380px] overflow-hidden rounded-md text-center text-xs"><thead className="bg-search"><tr><th className="p-2 text-right">البيان</th><th className="p-2">الحالي</th><th className="p-2">بعد الترقية</th><th className="p-2">الفرق</th></tr></thead>
              <tbody>{rows.map((r, i) => <tr key={r} className="border-b border-border"><td className="p-2 text-right">{r}</td><td className="p-2">{n(cur[i]!)}</td><td className="p-1"><input type="number" value={after[i]} onChange={e => setAfter(after.map((v, j) => j === i ? Math.max(0, +e.target.value) : v))} className="h-7 w-20 rounded border border-input bg-background text-center" /></td><td className={`p-2 ${after[i]! - cur[i]! > 0 ? "text-success" : ""}`}>{n(after[i]! - cur[i]!)}</td></tr>)}</tbody>
              <tfoot><tr className="bg-success-soft text-base font-extrabold text-success"><td className="p-2 text-right">إجمالي الراتب</td><td className="p-2">{n(tc)}</td><td className="p-2">{n(ta)}</td><td className="p-2">{n(ta - tc)}</td></tr></tfoot></table></div>
          </div>
        </Card>
      </div>

      <div className="grid content-start gap-3">
        <Card title="بيانات الموظف">
          <div className="text-center"><img src={ahmed} alt="أحمد محمد السبيعي" className="mx-auto size-24 rounded-full object-cover" /><b className="mt-2 block text-lg text-brand-deep">أحمد محمد السبيعي</b><span className="text-sm text-brand-deep">EMP-00125</span></div>
          <dl className="mt-3 divide-y divide-border text-xs">{emp.map(([k, v]) => <div key={k} className="flex justify-between gap-2 py-2"><dt>{k}</dt><dd className="text-left">{v}</dd></div>)}</dl>
          <Link to="/employees/profile" className="mt-2 flex h-10 items-center justify-center rounded-md border border-border text-sm font-bold text-brand-deep">عرض الملف الوظيفي</Link>
        </Card>
        <Card icon={<Trophy />} title="المسار الوظيفي للموظف">
          <ol className="relative grid gap-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/20">{path.map(([t, d], i) => <li key={t} className="relative flex items-start justify-between gap-2"><div><b className="block text-sm">{t}</b><span className="text-xs text-muted-foreground">{d}</span></div><span className={`z-10 mt-1 size-5 rounded-full border-4 ${i === 1 ? "border-primary bg-card" : "border-primary/30 bg-card"}`} /></li>)}</ol>
        </Card>
        <Card icon={<Wallet />} title="حلول إضافية">
          <dl className="grid gap-3 text-sm">{rows.slice(0, 3).map((r, i) => <div key={r} className="flex justify-between"><dt>{r === "الراتب الأساسي" ? r : r}</dt><dd>{n(cur[i]!)} ريال</dd></div>)}<div className="flex justify-between border-t border-border pt-3 font-extrabold"><dt>إجمالي الراتب</dt><dd>{n(tc)} ريال</dd></div></dl>
          <Link to="/salaries/scale" className="mt-3 flex h-10 items-center justify-center rounded-md border border-border text-sm font-bold text-brand-deep">عرض تفاصيل الرواتب</Link>
        </Card>
      </div>
    </div>

    <Card icon={<CheckSquare />} title="مسار الموافقة" className="mt-3">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">{flow.map(([I, t, s], i) => { const done = step >= 3 && i === 0; return <div key={t} className="text-center"><span className={`mx-auto grid size-12 place-items-center rounded-full ${done ? "bg-success-soft text-success" : "bg-primary/10 text-brand-deep"}`}><I size={22} /></span><b className="mt-2 block whitespace-pre-line text-sm">{t}</b><span className={`text-xs ${done ? "text-success" : "text-muted-foreground"}`}>{done ? "تمت الموافقة" : step >= 3 && i === 1 ? "قيد المراجعة" : s}</span></div>; })}</div>
    </Card>

    <div className="mt-3 grid gap-3 sm:grid-cols-[1.2fr_1fr_1fr]">
      <button onClick={submit} className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary text-base font-bold text-primary-foreground"><Send size={20} />إرسال الطلب</button>
      <button onClick={() => flash("تم حفظ الطلب كمسودة")} className="flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-card text-base font-bold text-brand-deep"><Save size={20} />حفظ كمسودة</button>
      <button onClick={() => { setF(init); setAfter([10000, 500, 1500, 500]); setDocs(docsL.map(() => true)); setFiles([]); setStep(0); }} className="h-12 rounded-md border border-border bg-card text-base font-bold text-brand-deep">إلغاء</button>
    </div>
  </AppShell>;
}
