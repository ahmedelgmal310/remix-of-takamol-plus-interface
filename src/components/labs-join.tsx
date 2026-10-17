import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Building, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Clock3, CloudUpload, Copy, CreditCard, Database, Eye, FileCheck2, FileText, Hourglass, Landmark, Search, ShieldCheck, TrendingUp, UserRound, UsersRound, Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import heroImage from "@/assets/branch-hospital.jpg";

// أنواع البيانات الممرَّرة — لا أسماء ولا أرقام مكتوبة داخل الشيفرة
export interface LabsJoinPlan { title: string; price: number; badge: string; features: string[] }
export interface LabsJoinBank { beneficiary: string; iban: string; bankName: string }
export type JoinStageState = "done" | "current" | "pending";
export interface JoinStage { title: string; description: string; state: JoinStageState; at?: string }
export interface JoinSubmission { requestNo: string; submittedAt: string }
export interface LabsJoinProps {
  centerTypes?: string[]; cities?: string[]; positions?: string[]; documents?: string[];
  plan?: LabsJoinPlan; bank?: LabsJoinBank; reviewTime?: string;
  stages?: JoinStage[];
  onSubmit?: (data: Record<string, string>) => Promise<JoinSubmission | null> | JoinSubmission | null;
  onTrack?: (by: string, value: string) => Promise<JoinStage[] | null> | JoinStage[] | null;
  sampleRequestNo?: string;
}

const dash = (v?: string | number) => (v === undefined || v === "" ? "—" : v);
const inputCls = "h-9 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring";
const stageIcon = { done: [Check, "bg-success text-primary-foreground"], current: [Hourglass, "bg-buy-violet text-primary-foreground"], pending: [Clock3, "bg-muted text-muted-foreground"] } as const;

// مزايا ثابتة في الشريط العلوي (نصوص واجهة لا بيانات)
const perks = [[ShieldCheck, "بدون رسوم سنوية"], [Database, "دفع رسوم مرة واحدة"], [UsersRound, "إدارة متكاملة للموظفين والكوادر"], [TrendingUp, "زيادة الكفاءة وتحسين الأداء"]] as const;

function Card({ n, icon, title, children, className = "" }: { n?: number; icon: ReactNode; title: string; children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border bg-card p-4 shadow-sm ${className}`}>
    <header className="mb-4 flex items-center gap-2"><span className="text-primary">{icon}</span><h2 className="flex-1 text-base font-black text-buy-navy">{title}</h2>{n && <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{n}</span>}</header>
    {children}
  </section>;
}
const F = ({ label, children }: { label: string; children: ReactNode }) => <label className="block text-[11px] font-bold">{label} <b className="text-destructive">*</b><div className="mt-1">{children}</div></label>;
const NextBtn = ({ onClick, children = "التالي" }: { onClick: () => void; children?: ReactNode }) => <button onClick={onClick} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-l from-primary to-buy-violet text-sm font-bold text-primary-foreground">{children}<ChevronLeft className="size-4" /></button>;

export function LabsJoinPage({ centerTypes = [], cities = [], positions = [], documents = [], plan, bank, reviewTime, stages = [], onSubmit, onTrack, sampleRequestNo }: LabsJoinProps) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState("");
  const [submitted, setSubmitted] = useState<JoinSubmission | null>(null);
  const [trackBy, setTrackBy] = useState("رقم الطلب");
  const [trackValue, setTrackValue] = useState("");
  const [shownStages, setShownStages] = useState<JoinStage[]>(stages);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const inp = (k: string, ph: string, ltr = false) => <input className={inputCls} placeholder={ph} dir={ltr ? "ltr" : undefined} value={form[k] ?? ""} onChange={set(k)} />;
  const sel = (k: string, ph: string, opts: string[]) => <select className={inputCls} value={form[k] ?? ""} onChange={set(k)}><option value="">{ph}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
  const check = (keys: string[], msg: string) => { const ok = keys.every((k) => form[k]); toast[ok ? "success" : "error"](ok ? msg : "أكمل الحقول الإلزامية"); return ok; };
  const pickFile = (f: File | undefined, cb: (n: string) => void) => {
    if (!f) return; if (!/\.(pdf|png|jpe?g)$/i.test(f.name) || f.size > 5 * 1024 * 1024) { toast.error("اختر PDF أو JPG أو PNG حتى 5 ميجابايت"); return; } cb(f.name);
  };
  const submit = async () => {
    if (!["center", "cr", "type", "city", "address", "email", "phone", "manager", "mPhone", "position", "mEmail"].every((k) => form[k])) { toast.error("أكمل بيانات المركز والمسؤول"); return; }
    if (!receipt) { toast.error("أرفق إثبات التحويل"); return; }
    if (!onSubmit) { toast.info("عرض توضيحي: لا توجد خدمة طلبات متصلة بعد"); return; }
    const r = await onSubmit({ ...form, receipt, ...docs }); if (r) setSubmitted(r);
  };
  const track = async () => {
    if (!trackValue) { toast.error("أدخل قيمة البحث"); return; }
    if (!onTrack) { toast.info("عرض توضيحي: لا توجد خدمة متابعة متصلة بعد"); return; }
    const r = await onTrack(trackBy, trackValue); if (r) setShownStages(r); else toast.error("لم يتم العثور على طلب");
  };

  return <AppShell><main dir="rtl" className="mx-auto max-w-[1520px] px-4 pb-10 lg:px-7">
    {/* الشريط البطولي */}
    <section className="relative overflow-hidden rounded-2xl border bg-card">
      <img src={heroImage} alt="مبنى مركز طبي حديث" width={1600} height={600} className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/90 to-transparent" />
      <div className="relative px-4 py-6 text-center">
        <h1 className="text-3xl font-black text-buy-navy sm:text-4xl">انضمام مركز طبي</h1>
        <p className="mt-2 text-lg font-bold text-buy-navy">سجل مركزك الطبي في منصة تكامل بلس</p>
        <p className="mt-1 text-sm">إدارة الكوادر والموارد والمالية وخدمة العملاء في منصة واحدة</p>
        <ul className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">{perks.map(([Icon, t]) => <li key={t} className="flex flex-col items-center gap-1 text-xs font-bold"><span className="grid size-12 place-items-center rounded-xl bg-card text-primary shadow"><Icon className="size-6" /></span>{t}</li>)}</ul>
      </div>
    </section>

    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card n={1} icon={<Building className="size-6" />} title="بيانات المركز الطبي">
        <div className="space-y-3">
          <F label="اسم المركز الطبي">{inp("center", "مثال: مركز النور الطبي")}</F>
          <F label="السجل التجاري">{inp("cr", "أدخل رقم السجل التجاري")}</F>
          <div className="grid grid-cols-2 gap-2"><F label="المدينة">{sel("city", "اختر المدينة", cities)}</F><F label="نوع المركز">{sel("type", "اختر النوع", centerTypes)}</F></div>
          <F label="العنوان التفصيلي">{inp("address", "أدخل العنوان بالتفصيل")}</F>
          <div className="grid grid-cols-2 gap-2"><F label="البريد الإلكتروني">{inp("email", "example@domain.com", true)}</F><F label="الجوال">{inp("phone", "05xxxxxxxx", true)}</F></div>
        </div>
        <NextBtn onClick={() => check(["center", "cr", "type", "city", "address", "email", "phone"], "تم حفظ بيانات المركز")} />
      </Card>

      <Card n={2} icon={<UserRound className="size-6" />} title="بيانات المسؤول">
        <div className="space-y-3">
          <F label="اسم المسؤول">{inp("manager", "الاسم الكامل")}</F>
          <div className="grid grid-cols-2 gap-2"><F label="الجوال">{inp("mPhone", "05xxxxxxxx", true)}</F><F label="المنصب">{sel("position", "اختر", positions)}</F></div>
          <F label="البريد الإلكتروني">{inp("mEmail", "example@domain.com", true)}</F>
        </div>
        <h3 className="mb-2 mt-4 text-sm font-black text-buy-navy">المستندات المطلوبة</h3>
        {documents.length ? <ul className="space-y-2">{documents.map((d) => <li key={d}><label className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary-soft p-2 text-primary"><FileText className="size-5" /><span className="flex-1"><b className="block text-xs text-buy-navy">{d}</b><small className="text-[10px] text-muted-foreground">{docs[d] || "PDF - JPG - PNG"}</small></span>{docs[d] ? <CheckCircle2 className="size-5 text-success" /> : <Landmark className="size-5" />}<input type="file" className="sr-only" accept=".pdf,.png,.jpg,.jpeg" aria-label={d} onChange={(e) => pickFile(e.target.files?.[0], (n) => setDocs((s) => ({ ...s, [d]: n })))} /></label></li>)}</ul> : <p className="text-xs text-muted-foreground">لا توجد مستندات مطلوبة</p>}
        <NextBtn onClick={() => check(["manager", "mPhone", "position", "mEmail"], "تم حفظ بيانات المسؤول")} />
      </Card>

      <Card n={3} icon={<Wallet className="size-6" />} title="اختيار الباقة والدفع">
        {plan ? <div className="rounded-xl bg-muted/60 p-3">
          <div className="flex items-center justify-between"><b className="text-sm text-buy-navy">{plan.title}</b><span className="rounded bg-buy-violet px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{plan.badge}</span></div>
          <p className="my-1 text-left text-3xl font-black text-primary">{plan.price.toLocaleString("en-US")} ريال</p>
          <ul className="space-y-1">{plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-[11px]"><CheckCircle2 className="size-4 text-primary" />{f}</li>)}</ul>
        </div> : <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">لا توجد باقة متاحة</p>}
        <h3 className="mt-3 text-sm font-black text-buy-navy">طريقة الدفع</h3>
        <p className="mt-1 flex items-center gap-2 text-xs font-bold"><CheckCircle2 className="size-4 text-primary" />تحويل بنكي<Landmark className="ms-auto size-4 text-primary" /></p>
        <div className="mt-2 flex items-center gap-3 rounded-xl border p-3">
          <CreditCard className="size-8 text-primary" />
          <div className="min-w-0 flex-1 text-xs"><small className="text-muted-foreground">حساب المؤسسة</small><p dir="ltr" className="text-right text-sm font-black text-buy-navy">{dash(bank?.iban)}</p><p className="font-bold">{dash(bank?.bankName)}</p><p>{dash(bank?.beneficiary)}</p></div>
          <button aria-label="نسخ الآيبان" disabled={!bank} onClick={() => bank && navigator.clipboard?.writeText(bank.iban).then(() => toast.success("تم النسخ"))}><Copy className="size-4 text-primary" /></button>
        </div>
        <p className="mt-2 flex items-center gap-2 rounded-lg bg-warning-soft p-2 text-[11px]"><CircleAlert className="size-4 text-warning" />يرجى تحويل الرسوم وإرفاق إيصال التحويل لإكمال الطلب</p>
        <NextBtn onClick={submit}>إرسال الطلب</NextBtn>
      </Card>

      <Card n={4} icon={<FileText className="size-6" />} title="إرفاق إثبات التحويل">
        <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files[0], setReceipt); }} className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary-soft/40 p-6 text-center text-xs">
          <CloudUpload className="size-9 text-primary" /><b>{receipt || "اسحب الصورة هنا أو اضغط للرفع"}</b><small className="text-muted-foreground">(JPG - PNG - PDF)</small>
          <input type="file" className="sr-only" accept=".pdf,.png,.jpg,.jpeg" aria-label="إثبات التحويل" onChange={(e) => pickFile(e.target.files?.[0], setReceipt)} />
        </label>
        <label className="mt-4 block text-xs font-bold">ملاحظات إضافية (اختياري)<textarea value={form["notes"] ?? ""} onChange={set("notes")} placeholder="أدخل أي ملاحظات ..." className="mt-1 h-24 w-full rounded-lg border border-input bg-background p-2 text-xs" /></label>
        <NextBtn onClick={submit}>إرسال الطلب</NextBtn>
      </Card>
    </div>

    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <Card icon={<FileCheck2 className="size-6" />} title="مراحل طلب الانضمام">
        {shownStages.length ? <ol className="space-y-2">{shownStages.map((s) => { const [Icon, cls] = stageIcon[s.state]; return <li key={s.title} className="flex items-center gap-3"><span className={`grid size-7 shrink-0 place-items-center rounded-full ${cls}`}><Icon className="size-4" /></span><div className="flex flex-1 items-center justify-between rounded-lg bg-muted/50 p-2"><div><b className="block text-xs">{s.title}</b><small className="text-[10px] text-muted-foreground">{s.description}</small></div><small dir="ltr" className="text-[10px] text-muted-foreground">{s.at ?? ""}</small></div></li>; })}</ol>
          : <p className="py-8 text-center text-xs text-muted-foreground">لا يوجد طلب قيد المتابعة حالياً</p>}
      </Card>

      <div id="track-panel"><Card icon={<Search className="size-6" />} title="متابعة الطلب">
        <div className="grid grid-cols-3 gap-2">{["رقم الطلب", "السجل التجاري", "رقم الجوال"].map((t) => <button key={t} onClick={() => setTrackBy(t)} className={`h-9 rounded-lg text-xs font-bold ${trackBy === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{t}</button>)}</div>
        <input className={`${inputCls} mt-4`} placeholder={`أدخل ${trackBy}`} value={trackValue} onChange={(e) => setTrackValue(e.target.value)} />
        {sampleRequestNo && <p className="mt-2 text-xs text-muted-foreground">مثال: <span dir="ltr">{sampleRequestNo}</span></p>}
        <button onClick={track} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-bold text-primary-foreground"><Search className="size-4" />بحث</button>
      </Card></div>

      <Card n={5} icon={<CheckCircle2 className="size-6 text-success" />} title="تم استلام طلبك بنجاح">
        {submitted ? <>
          <p className="text-center text-xs">شكراً لانضمامك إلى تكامل بلس<br />سيتم مراجعة طلبك وتفعيل حسابك في أقرب وقت</p>
          <div className="mt-3 flex items-center justify-center gap-3 rounded-xl border-2 border-dashed border-buy-violet/40 bg-buy-violet-soft p-3"><div className="text-center"><small className="text-xs">رقم الطلب</small><p dir="ltr" className="text-xl font-black text-buy-violet">#{submitted.requestNo}</p></div><button aria-label="نسخ رقم الطلب" onClick={() => navigator.clipboard?.writeText(submitted.requestNo).then(() => toast.success("تم النسخ"))}><Copy className="size-4 text-buy-violet" /></button></div>
          <div className="mt-3 flex justify-between text-xs"><span className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><span>تاريخ الطلب<br /><b dir="ltr">{submitted.submittedAt}</b></span></span><span className="flex items-center gap-2"><Clock3 className="size-5 text-primary" /><span>المدة المتوقعة للمراجعة<br /><b>{dash(reviewTime)}</b></span></span></div>
          <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => document.getElementById("track-panel")?.scrollIntoView()} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-primary-foreground"><Eye className="size-4" />متابعة الطلب</button><a href="/" className="flex h-10 items-center justify-center rounded-lg border text-xs font-bold text-buy-navy">العودة إلى الرئيسية<ChevronRight className="hidden" /></a></div>
        </> : <p className="py-8 text-center text-xs text-muted-foreground">لم يتم إرسال طلب بعد — سيظهر رقم الطلب هنا بعد الإرسال</p>}
      </Card>
    </div>
    <p className="mt-4 text-center text-xs text-muted-foreground">عرض توضيحي: لا يتم حفظ البيانات أو إرسالها لأي خدمة.</p>
  </main></AppShell>;
}
