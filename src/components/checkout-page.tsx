import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  BarChart3, Building2, Check, ChevronLeft, ChevronRight, Copy, Download, FileText, Headphones, Landmark, Maximize, Minus, Pencil, Plus, Printer, UserRound, UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SignaturePad } from "@/components/signature-pad";

// أنواع البيانات التي تُمرَّر للصفحة — لا شيء مكتوب داخل الشيفرة
export interface CheckoutItem { id: string; title: string; description: string; price: number; tone: "success" | "primary" | "violet" }
export interface CheckoutBank { beneficiary: string; iban: string; bankName: string }
export interface CheckoutContract { title: string; pages: number; firstParty: string; clauses: { heading: string; body: string }[] }
export interface CheckoutProps {
  items?: CheckoutItem[];
  vatRate?: number;
  activityTypes?: string[];
  bank?: CheckoutBank;
  contract?: CheckoutContract;
  onNext?: (data: Record<string, string>) => void;
  onBack?: () => void;
  onEditSummary?: () => void;
}

const dash = (v?: string | number) => (v === undefined || v === "" ? "—" : v);
const money = (n: number) => n.toLocaleString("en-US");

// محطات المعالج الست — عناوين ثابتة
const steps = [
  ["اختيار الباقات", "تم اختيار الباقات"], ["إدخال بيانات العميل", "أكمل بيانات منشأتك"], ["رفع إثبات التحويل", "إرفاق صورة الإيصال"],
  ["مراجعة العقد", "الاطلاع على العقد"], ["التوقيع الإلكتروني", "توقيع العقد من الطرفين"], ["إرسال الطلب", "استلام رقم الطلب"],
];
const toneIcon = { success: [UsersRound, "text-success bg-success-soft border-success/20"], primary: [BarChart3, "text-primary bg-primary-soft border-primary/20"], violet: [Headphones, "text-buy-violet bg-buy-violet-soft border-buy-violet/20"] } as const;

function Panel({ icon, title, action, children, className = "" }: { icon?: ReactNode; title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border bg-card p-4 shadow-sm ${className}`}>
    <header className="mb-4 flex items-center gap-2">{icon && <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">{icon}</span>}<h2 className="flex-1 text-lg font-black text-buy-navy">{title}</h2>{action}</header>
    {children}
  </section>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-xs font-bold"><span>{label} <b className="text-destructive">*</b></span><div className="mt-1.5">{children}</div></label>;
}
const inputCls = "h-10 w-full rounded-lg border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring";

export function CheckoutPage({ items = [], vatRate = 0, activityTypes = [], bank, contract, onNext, onBack, onEditSummary }: CheckoutProps) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [copyMail, setCopyMail] = useState(true);
  const [signed, setSigned] = useState({ a: false, b: false });
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const input = (k: string, ph: string, type = "text") => <input className={inputCls} type={type} placeholder={ph} value={form[k] ?? ""} onChange={set(k)} dir={type === "email" || type === "tel" ? "ltr" : undefined} />;
  // المجاميع تُحسب من الأسعار الممرَّرة
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const vat = Math.round(subtotal * vatRate);
  const required = ["orgName", "cr", "activity", "email", "phone", "delegate", "position", "nationalId", "dPhone", "dEmail"];
  const next = () => {
    if (required.some((k) => !form[k])) return toast.error("أكمل جميع الحقول الإلزامية");
    if (!agree) return toast.error("يجب الموافقة على شروط العقد");
    if (!signed.a || !signed.b) return toast.error("يجب توقيع الطرفين");
    if (onNext) onNext({ ...form, copyMail: String(copyMail) }); else toast.info("عرض توضيحي: لا توجد خدمة طلبات متصلة بعد");
  };

  return <AppShell><main dir="rtl" className="mx-auto max-w-[1500px] px-4 pb-10 pt-6 lg:px-7">
    <div className="text-center"><h1 className="text-2xl font-black text-buy-navy sm:text-3xl">إكمال الطلب والتوقيع على العقد الإلكتروني</h1><p className="mt-2 text-sm text-muted-foreground">أنت على بعد خطوات بسيطة لتفعيل برنامج تكامل بلس</p></div>

    <ol className="mt-6 flex overflow-x-auto pb-2">{steps.map(([t, d], i) => {
      const done = i === 0, cur = i === 1;
      return <li key={t} className="relative flex min-w-[130px] flex-1 flex-col items-center text-center">
        {i < steps.length - 1 && <span aria-hidden className={`absolute left-0 top-6 h-0.5 w-1/2 -translate-x-1/2 ${done ? "bg-primary" : "bg-border"}`} style={{ left: 0, right: "50%", width: "100%", transform: "translateX(-50%)" }} />}
        <span className={`relative z-10 grid size-12 place-items-center rounded-full text-xl font-black ${done || cur ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}>{done ? <Check /> : i + 1}</span>
        <b className={`mt-2 text-sm ${done || cur ? "text-buy-navy" : "text-muted-foreground"}`}>{t}</b><small className="text-xs text-muted-foreground">{d}</small>
      </li>;
    })}</ol>

    <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_1.3fr_1fr]">
      {/* مراجعة العقد والتوقيع */}
      <Panel icon={<FileText className="size-4" />} title="مراجعة العقد الإلكتروني" className="xl:row-span-2">
        <div className="overflow-hidden rounded-lg border">
          <div dir="ltr" className="flex items-center gap-3 bg-buy-navy px-3 py-2 text-primary-foreground">
            <button aria-label="الصفحة السابقة" onClick={() => setPage((p) => Math.max(1, p - 1))}><Minus className="size-4" /></button>
            <span className="text-xs">{contract ? `${page} / ${contract.pages}` : "—"}</span>
            <button aria-label="الصفحة التالية" onClick={() => setPage((p) => Math.min(contract?.pages ?? 1, p + 1))}><Plus className="size-4" /></button>
            <span className="text-xs">{zoom}%</span><button aria-label="تكبير" onClick={() => setZoom((z) => (z >= 150 ? 100 : z + 25))}><Maximize className="size-4" /></button>
            <span className="flex-1" /><button aria-label="تحميل" onClick={() => toast.info("عرض توضيحي: لا يوجد ملف عقد متصل")}><Download className="size-4" /></button><button aria-label="طباعة" onClick={() => window.print()}><Printer className="size-4" /></button>
          </div>
          <div className="h-[300px] overflow-y-auto bg-background p-5 text-xs leading-6" style={{ fontSize: `${zoom * 0.12}px` }}>
            {contract ? <>
              <p className="text-center text-3xl font-black text-buy-navy">تكامل <span className="text-buy-gold">بلس</span></p>
              <h3 className="my-3 text-center text-base font-black">{contract.title}</h3>
              <p>هذا العقد مبرم بين:</p><p><b>الطرف الأول:</b> {contract.firstParty}</p><p><b>الطرف الثاني:</b> {dash(form.orgName)} (المنشأة)</p>
              {contract.clauses.map((c) => <div key={c.heading} className="mt-3"><b className="text-buy-navy">{c.heading}</b><p>{c.body}</p></div>)}
            </> : <p className="py-20 text-center text-muted-foreground">لا يوجد عقد للعرض</p>}
          </div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" className="size-4 accent-primary" checked={agree} onChange={(e) => setAgree(e.target.checked)} />أقر بأنني قد قرأت عقد الترخيص واستخدام المنصة وأوافق على جميع الشروط والأحكام</label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <SignaturePad label="توقيع الطرف الأول" sub={contract?.firstParty} onChange={(v) => setSigned((s) => ({ ...s, a: v }))} />
          <SignaturePad label="توقيع الطرف الثاني (المنشأة)" onChange={(v) => setSigned((s) => ({ ...s, b: v }))} />
        </div>
      </Panel>

      {/* بيانات المنشأة والمفوض */}
      <div className="space-y-4">
        <Panel icon={<Building2 className="size-4" />} title="بيانات المنشأة">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="اسم المنشأة">{input("orgName", "أدخل اسم المنشأة")}</Field>
            <Field label="السجل التجاري">{input("cr", "أدخل رقم السجل التجاري")}</Field>
            <label className="block text-xs font-bold">الرقم الضريبي<div className="mt-1.5">{input("vat", "أدخل الرقم الضريبي")}</div></label>
            <Field label="نوع النشاط"><select className={inputCls} value={form.activity ?? ""} onChange={set("activity")}><option value="">اختر نوع النشاط</option>{activityTypes.map((a) => <option key={a}>{a}</option>)}</select></Field>
            <Field label="البريد الإلكتروني">{input("email", "example@company.com", "email")}</Field>
            <Field label="رقم الجوال">{input("phone", "05xxxxxxxx", "tel")}</Field>
          </div>
        </Panel>
        <Panel icon={<UserRound className="size-4" />} title="بيانات المفوض بالتوقيع">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="اسم المفوض">{input("delegate", "أدخل الاسم الكامل")}</Field>
            <Field label="المنصب الوظيفي">{input("position", "أدخل المسمى الوظيفي")}</Field>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="رقم الهوية">{input("nationalId", "أدخل رقم الهوية")}</Field>
            <Field label="رقم الجوال">{input("dPhone", "05xxxxxxxx", "tel")}</Field>
            <Field label="البريد الإلكتروني">{input("dEmail", "example@company.com", "email")}</Field>
          </div>
        </Panel>
      </div>

      {/* ملخص الطلب */}
      <Panel title="ملخص الطلب" action={<button onClick={onEditSummary ?? (() => toast.info("عرض توضيحي"))} className="flex items-center gap-1 rounded-md border px-3 py-1 text-xs text-primary"><Pencil className="size-3.5" />تعديل</button>}>
        {items.length ? <div className="space-y-3">{items.map((it) => {
          const [Icon, cls] = toneIcon[it.tone];
          return <div key={it.id} className={`flex items-center gap-3 rounded-xl border p-3 ${cls}`}><Icon className="size-9 shrink-0" /><div className="min-w-0 flex-1"><b className="block text-sm text-buy-navy">{it.title}</b><small className="text-[11px] text-muted-foreground">{it.description}</small></div><div className="text-center text-buy-navy"><b className="block text-lg">{money(it.price)}</b><small>ريال</small></div></div>;
        })}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">لا توجد باقات مختارة</p>}
        <dl className="mt-3 space-y-3 rounded-xl border p-3 text-sm">
          <div className="flex justify-between"><dt>الإجمالي قبل الضريبة</dt><dd className="font-bold">{money(subtotal)} ريال</dd></div>
          <div className="flex justify-between"><dt>ضريبة القيمة المضافة ({Math.round(vatRate * 100)}%)</dt><dd>{money(vat)} ريال</dd></div>
          <div className="flex justify-between rounded-lg bg-primary-soft p-2 font-black text-primary"><dt>الإجمالي شامل الضريبة</dt><dd className="text-lg">{money(subtotal + vat)} ريال</dd></div>
        </dl>
      </Panel>

      {/* بيانات الحساب البنكي */}
      <section className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm xl:col-span-2">
        <div className="flex items-center gap-3"><Landmark className="size-10 text-buy-navy" /><div><b className="text-sm text-buy-navy">بيانات حساب المؤسسة للتحويل</b><p className="text-xs text-primary">{dash(bank?.bankName)}</p></div></div>
        <span className="hidden h-10 w-px bg-border sm:block" />
        <div className="min-w-0 flex-1 text-center"><small className="text-xs text-muted-foreground">اسم المستفيد</small><p className="font-bold">{dash(bank?.beneficiary)}</p></div>
        <span className="hidden h-10 w-px bg-border sm:block" />
        <div className="min-w-0 flex-1 text-center"><small className="text-xs text-muted-foreground">رقم الآيبان (IBAN)</small><p dir="ltr" className="font-black text-buy-navy">{dash(bank?.iban)}</p></div>
        <button aria-label="نسخ الآيبان" disabled={!bank} onClick={() => bank && navigator.clipboard?.writeText(bank.iban).then(() => toast.success("تم نسخ رقم الآيبان"))} className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><Copy className="size-4" /></button>
      </section>
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-4">
      <button onClick={next} className="flex h-14 min-w-[280px] items-center justify-center gap-3 rounded-xl bg-gradient-to-l from-primary to-buy-violet px-6 text-lg font-black text-primary-foreground shadow-lg"><ChevronRight className="size-5" />التالي: رفع إثبات التحويل</button>
      <label className="flex flex-1 items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-primary" checked={copyMail} onChange={(e) => setCopyMail(e.target.checked)} />أرغب باستلام نسخة من العقد على بريدي الإلكتروني</label>
      <button onClick={onBack ?? (() => history.back())} className="flex h-12 min-w-[160px] items-center justify-center gap-6 rounded-xl border bg-card font-bold text-buy-navy">السابق<ChevronLeft className="size-5" /></button>
    </div>
    <p className="mt-4 text-center text-xs text-muted-foreground">عرض توضيحي: لا يتم حفظ البيانات أو إرسالها لأي خدمة.</p>
  </main></AppShell>;
}
