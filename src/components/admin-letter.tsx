import { useState, type ReactNode } from "react";
import { CalendarDays, Check, ChevronDown, ChevronLeft, Eye, FileText, Globe, Home, MapPin, Paperclip, Phone, Printer, Save, Search, Send, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Logo, Qr, Stamp } from "@/components/financial-letter";

const employees = [
  { name: "أحمد محمد السبيعي", no: "EMP-00125", nid: "1012345678", title: "أخصائي نظم معلومات", dept: "إدارة تقنية المعلومات", hire: "2020/01/15", birth: "1992/03/10", male: true },
  { name: "سارة عبدالله أحمد", no: "EMP-00051", nid: "1098765432", title: "محاسب أول", dept: "الإدارة المالية", hire: "2019/06/01", birth: "1994/07/22", male: false },
  { name: "خالد علي الغامدي", no: "EMP-00063", nid: "1055566677", title: "محاسب", dept: "الإدارة المالية", hire: "2021/09/12", birth: "1990/11/05", male: true },
];
const approvers: Record<string, string> = { "مدير إدارة الموارد البشرية": "سعد بن عبدالله العنزي", "المدير العام": "فهد بن محمد العتيبي", "مدير الإدارة المالية": "علي بن سعيد الشهري" };
const initial = { type: "تعريف إداري", emp: 0, query: "", to: "إلى من يهمه الأمر", purpose: "حسب الطلب", notes: "تصدر هذه الشهادة بناءً على طلب الموظف.", birth: false, hire: true, service: true, special: true, specialText: "تم إصدار هذا الخطاب بناءً على طلبه دون أدنى مسؤولية على الجهة.", approver: "مدير إدارة الموارد البشرية", sign: "e", seal: "الختم الرسمي", showSeal: true, ref: "HR-LTR-2025-0145" };
type S = typeof initial;

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="panel p-4"><h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-letter-navy"><span className="[&_svg]:size-6">{icon}</span>{title}</h2><div className="grid gap-3">{children}</div></section>;
}
const Lbl = ({ t, req }: { t: string; req?: boolean }) => <label className="text-sm font-bold">{req && <span className="ml-1 text-destructive">*</span>}{t}</label>;
function Sel({ v, opts, on }: { v: string; opts: string[]; on: (v: string) => void }) {
  return <div className="relative"><select value={v} onChange={e => on(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-input bg-background pr-3 pl-8 text-sm">{opts.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" /></div>;
}
const Toggle = ({ on, set, t }: { on: boolean; set: (b: boolean) => void; t: string }) => <div className="flex items-center justify-between"><span className="text-sm">{t}</span><button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-muted-foreground/30"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${on ? "left-0.5" : "left-[22px]"}`} /></button></div>;

function years(hire: string) { const [y, m] = hire.split("/").map(Number); const t = 2025 * 12 + 10 - (y! * 12 + m!); return `${Math.floor(t / 12)} سنوات و ${t % 12} أشهر`; }

function Letter({ s, id }: { s: S; id?: string }) {
  const e = employees[s.emp]!; const g = e.male;
  return <article id={id} dir="rtl" className="relative mx-auto flex w-full max-w-[800px] flex-col bg-card px-[5%] py-6 text-foreground">
    <div className="flex items-start justify-between border-b-2 border-letter-navy pb-4">
      <div className="space-y-1 text-[15px]"><p>المملكة العربية السعودية</p><b className="block text-letter-navy">تكامل بلس</b><p>إدارة الموارد البشرية</p></div>
      <Logo />
    </div>
    <dl className="mt-4 grid w-fit grid-cols-[auto_auto_auto] gap-x-2 gap-y-2 text-[14px]"><dt>التاريخ</dt><span>:</span><dd>2025/10/09 م</dd><dt>الرقم المرجعي</dt><span>:</span><dd>{s.ref}</dd></dl>
    <h1 className="mx-auto mt-6 rounded-md bg-search px-14 py-3 text-2xl font-extrabold text-letter-navy">شهادة {s.type === "تعريف إداري" ? "تعريف إدارية" : s.type}</h1>
    <b className="mt-8 block text-xl text-letter-navy">{s.to || "..."}</b>
    <p className="mt-4 text-[16px]">السلام عليكم ورحمة الله وبركاته ،،</p>
    <div className="mt-6 space-y-2 text-[16px] leading-9">
      <p>نفيد بأن {g ? "الأستاذ" : "الأستاذة"}/ <b>{e.name}</b></p>
      <p>{g ? "يحمل" : "تحمل"} الهوية الوطنية رقم ( {e.nid} )</p>
      {s.birth && <p>{g ? "المولود" : "المولودة"} بتاريخ {e.birth} م</p>}
      <p>{g ? "يعمل" : "تعمل"} لدينا في شركة <b>تكامل بلس</b> على وظيفة <b>{e.title}</b> <b>ب{e.dept}</b></p>
      {s.hire && <p>وذلك منذ تاريخ {e.hire} م وحتى تاريخه.</p>}
      {s.service && <p>بمدة خدمة قدرها {years(e.hire)}.</p>}
      {s.purpose !== "حسب الطلب" && <p>وقد صدرت هذه الشهادة لغرض: {s.purpose}.</p>}
    </div>
    {s.special && s.specialText && <p className="mt-6 text-[16px] leading-9">{s.specialText}</p>}
    <p className="mt-6 text-center text-[16px]">وتقبلوا خالص التحية والتقدير ،،</p>
    <div className="mt-8 flex items-center justify-between gap-4">
      <div className="text-center"><b className="text-base">{s.approver}</b>
        {s.sign === "e" ? <svg viewBox="0 0 200 60" className="mx-auto h-16 w-48 text-letter-stamp"><path d="M10 45 C40 10, 80 5, 70 30 S30 60, 60 40 S120 20, 110 30 S150 25, 190 28 M60 30 L185 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg> : <div className="mx-auto my-2 h-12 w-48 border-b border-dashed border-muted-foreground" />}
        <b className="text-base">{approvers[s.approver]}</b></div>
      <div className="grid w-40 place-items-center">{s.showSeal && <Stamp />}</div>
    </div>
    <div className="mt-6 flex items-end justify-between gap-3 border-b-2 border-letter-navy pb-3">
      <div className="text-[12px]"><p>للتحقق من صحة هذه الشهادة</p><p>يرجى مسح رمز QR أو زيارة الرابط</p><p className="text-letter-stamp" dir="ltr">https://verify.takamul.sa</p><p className="mt-2 text-sm">{s.ref}</p></div>
      <Qr />
    </div>
    <div className="mt-3 flex flex-wrap justify-between gap-2 text-[12px]"><span className="flex items-center gap-1"><MapPin size={14} />الرياض - المملكة العربية السعودية</span><span className="flex items-center gap-1"><Phone size={14} />920000000</span><span className="flex items-center gap-1"><Globe size={14} />www.takamul.sa</span></div>
  </article>;
}

export function AdminLetterPage() {
  const [s, setS] = useState<S>(initial);
  const [q, setQ] = useState(`${employees[0]!.name} ( ${employees[0]!.no} )`);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [msg, setMsg] = useState("");
  const set = <K extends keyof S>(k: K, v: S[K]) => setS(p => ({ ...p, [k]: v }));
  const matches = employees.map((e, i) => ({ e, i })).filter(({ e }) => !q || `${e.name} ${e.no}`.includes(q.replace(/[()]/g, "").trim().split(" ")[0]!));
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };
  const issue = () => {
    if (!s.to.trim() || !s.purpose || !s.approver || !s.seal) return flash("يرجى تعبئة الحقول الإجبارية");
    const ref = `HR-LTR-2025-${String(146 + Math.floor(Math.random() * 800)).padStart(4, "0")}`;
    setS(p => ({ ...p, ref })); flash(`تم إصدار الخطاب بنجاح برقم ${ref}`); setTimeout(() => window.print(), 300);
  };
  const ta = "h-20 w-full resize-none rounded-md border border-input bg-background p-2 text-sm";

  return <AppShell>
    <nav className="flex flex-wrap items-center gap-2 text-xs text-primary print:hidden"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />الموظفون<ChevronLeft size={12} />الخطابات والشهادات<ChevronLeft size={12} />إصدار شهادة تعريف إدارية</nav>
    <header className="mt-3 flex items-center gap-2 print:hidden"><FileText className="size-8 text-letter-navy" /><div><h1 className="text-2xl font-extrabold text-letter-navy">إصدار شهادة تعريف إدارية</h1><p className="text-xs text-muted-foreground">يمكنك إصدار خطاب تعريف إداري للموظف مع إمكانية التخصيص والاعتماد الإلكتروني</p></div></header>
    {msg && <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-letter-navy px-5 py-3 text-sm text-primary-foreground shadow-lg print:hidden">{msg}</div>}

    <div className="mt-4 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="grid content-start gap-4 print:hidden">
        <Card icon={<FileText />} title="بيانات الشهادة">
          <Lbl t="نوع الشهادة" /><Sel v={s.type} opts={["تعريف إداري", "تعريف بالراتب", "خبرة"]} on={v => set("type", v)} />
          <Lbl t="الموظف" req />
          <div className="relative"><input value={q} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)} onChange={e => { setQ(e.target.value); setOpen(true); }} className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm" /><Search size={18} className="absolute left-3 top-2.5 text-muted-foreground" />
            {open && <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">{(matches.length ? matches : employees.map((e, i) => ({ e, i }))).map(({ e, i }) => <li key={e.no}><button onMouseDown={() => { set("emp", i); setQ(`${e.name} ( ${e.no} )`); setOpen(false); }} className="w-full px-3 py-2 text-right text-sm hover:bg-search">{e.name} <span className="text-muted-foreground">({e.no})</span></button></li>)}</ul>}
          </div>
          <Lbl t="الجهة الموجه إليها" req /><input value={s.to} onChange={e => set("to", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" />
          <Lbl t="الغرض من الشهادة" req /><Sel v={s.purpose} opts={["حسب الطلب", "تقديمها للبنك", "تقديمها للسفارة", "تقديمها لجهة حكومية"]} on={v => set("purpose", v)} />
          <Lbl t="ملاحظات إضافية" /><textarea maxLength={500} value={s.notes} onChange={e => set("notes", e.target.value)} className={ta} /><span className="-mt-2 text-left text-[11px] text-muted-foreground">{s.notes.length}/500</span>
        </Card>
        <Card icon={<CalendarDays />} title="خيارات إضافية">
          <Toggle t="إظهار تاريخ الميلاد" on={s.birth} set={b => set("birth", b)} />
          <Toggle t="إظهار تاريخ التعيين" on={s.hire} set={b => set("hire", b)} />
          <Toggle t="إظهار مدة الخدمة" on={s.service} set={b => set("service", b)} />
          <Toggle t="إضافة عبارة خاصة" on={s.special} set={b => set("special", b)} />
          {s.special && <><textarea maxLength={500} value={s.specialText} onChange={e => set("specialText", e.target.value)} className={ta} /><span className="-mt-2 text-left text-[11px] text-muted-foreground">{s.specialText.length}/500</span></>}
        </Card>
        <Card icon={<Paperclip />} title="التوقيع والاعتماد">
          <Lbl t="المعتمد" req /><Sel v={s.approver} opts={Object.keys(approvers)} on={v => set("approver", v)} />
          <Lbl t="طريقة التوقيع" />
          <div className="flex gap-8">{[["e", "توقيع إلكتروني"], ["m", "توقيع يدوي"]].map(([k, t]) => <button key={k} onClick={() => set("sign", k!)} className="flex items-center gap-2 text-sm"><span className={`grid size-5 place-items-center rounded-full border-2 ${s.sign === k ? "border-primary" : "border-muted-foreground/40"}`}>{s.sign === k && <span className="size-2.5 rounded-full bg-primary" />}</span>{t}</button>)}</div>
          <Lbl t="ختم الجهة" req /><Sel v={s.seal} opts={["الختم الرسمي", "ختم الموارد البشرية"]} on={v => set("seal", v)} />
          <button onClick={() => set("showSeal", !s.showSeal)} className="flex items-center gap-2 text-sm"><span className={`grid size-5 place-items-center rounded ${s.showSeal ? "bg-primary text-primary-foreground" : "border-2 border-muted-foreground/40"}`}>{s.showSeal && <Check size={14} />}</span>إظهار الختم</button>
          <div className="mt-2 grid grid-cols-[1.4fr_1fr] gap-2">
            <button onClick={issue} className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-primary-foreground"><Send size={18} />إصدار الخطاب</button>
            <button onClick={() => setPreview(true)} className="flex h-11 items-center justify-center gap-2 rounded-md border border-primary text-sm font-bold text-primary"><Eye size={18} />معاينة</button>
            <button onClick={() => flash("تم حفظ المسودة")} className="flex h-11 items-center justify-center gap-2 rounded-md border border-primary text-sm font-bold text-primary"><Save size={18} />حفظ مسودة</button>
            <button onClick={() => { setS(initial); setQ(`${employees[0]!.name} ( ${employees[0]!.no} )`); }} className="flex h-11 items-center justify-center gap-2 rounded-md border border-border text-sm font-bold text-letter-navy"><X size={18} />إلغاء</button>
          </div>
        </Card>
      </div>

      <section className="panel min-w-0 p-3">
        <h2 className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-base font-extrabold text-letter-navy print:hidden"><Printer className="size-6" />معاينة الخطاب</h2>
        <Letter s={s} id="admin-letter" />
      </section>
    </div>

    {preview && <div className="fixed inset-0 z-50 overflow-auto bg-foreground/50 p-4 print:hidden" onClick={() => setPreview(false)}><div className="relative mx-auto max-w-[820px] rounded-lg bg-card" onClick={e => e.stopPropagation()}><button onClick={() => setPreview(false)} className="absolute left-3 top-3 z-10"><X /></button><Letter s={s} /></div></div>}
  </AppShell>;
}
