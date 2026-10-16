import { BadgeCheck, CheckCircle2, ClipboardCheck, CreditCard, FileSignature, FileText, MousePointerClick, PenLine, Search, Send, ShieldCheck, UserCheck, Wallet } from "lucide-react";

// لوح تعريفي ثابت بخطوات شراء البرنامج — لا يقرأ بيانات ولا يعرض حالة
const steps = [
  { t: "اختيار الباقات المطلوبة", d: "حدد البرامج المناسبة لمنشأتك", icon: MousePointerClick, dot: "bg-buy-violet", box: "bg-buy-violet-soft text-buy-violet" },
  { t: "إرسال الطلب", d: "تعبئة بيانات المنشأة وإرسال الطلب", icon: Send, dot: "bg-primary", box: "bg-primary-soft text-primary" },
  { t: "دفع قيمة الباقات", d: "تحويل المبلغ على حساب المؤسسة", icon: Wallet, dot: "bg-success", box: "bg-success-soft text-success" },
  { t: "مراجعة الطلب", d: "مراجعة الطلب وتأكيد الدفع", icon: Search, dot: "bg-warning", box: "bg-warning-soft text-warning" },
  { t: "التوقيع على عقد إلكتروني", d: "إرسال العقد للتوقيع من الطرفين", icon: FileSignature, dot: "bg-primary", box: "bg-primary-soft text-primary" },
  { t: "تفعيل الحساب", d: "تفعيل البرامج وإرسال بيانات الدخول", icon: ShieldCheck, dot: "bg-buy-violet", box: "bg-buy-violet-soft text-buy-violet" },
];

export function PurchaseStepsPanel() {
  return (
    <aside className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-black">خطوات شراء البرنامج</h2>
      <ol className="relative space-y-4">
        {/* الخط العمودي الواصل بين الدوائر */}
        <span aria-hidden className="absolute bottom-3 left-3.5 top-3 w-px bg-border" />
        {steps.map((s, i) => (
          <li key={s.t} className="relative flex items-center gap-3">
            <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${s.box}`}><s.icon className="size-5" /></span>
            <div className="min-w-0 flex-1"><p className="text-sm font-extrabold">{s.t}</p><p className="text-xs text-muted-foreground">{s.d}</p></div>
            <span className={`z-10 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-primary-foreground ${s.dot}`}>{i + 1}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

// محطات مراحل الطلب السبع (عناوين ثابتة)
const stages = [
  { t: "تم استلام الطلب", icon: FileText },
  { t: "تم تأكيد الدفع", icon: CreditCard },
  { t: "قيد المراجعة", icon: ClipboardCheck },
  { t: "إرسال العقد الإلكتروني", icon: Send },
  { t: "توقيع العقد", icon: PenLine },
  { t: "تفعيل الحساب", icon: UserCheck },
  { t: "اكتمل التفعيل", icon: BadgeCheck },
];

// المرحلة الحالية تُمرَّر من الخارج (١–٧ أو null)؛ ما قبلها وما يساويها مكتمل والباقي باهت
export function OrderStageBar({ currentStage }: { currentStage: number | null }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm" aria-label="مراحل الطلب">
      <ol className="flex gap-2 overflow-x-auto pb-1">
        {stages.map((s, i) => {
          const done = currentStage !== null && i + 1 <= currentStage;
          return (
            <li key={s.t} className="flex min-w-[110px] flex-1 items-start gap-2">
              <div className={`flex flex-1 flex-col items-center text-center ${done ? "" : "opacity-50"}`}>
                <span className={`grid size-12 place-items-center rounded-xl ${done ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}><s.icon className="size-6" /></span>
                <span className={`-mt-2 grid size-6 place-items-center rounded-full text-[11px] font-bold ${done ? "bg-success text-primary-foreground" : "bg-border text-muted-foreground"}`}>{done ? <CheckCircle2 className="size-4" /> : i + 1}</span>
                <span className="mt-1 text-xs font-bold">{s.t}</span>
              </div>
              {i < stages.length - 1 && <span aria-hidden className="mt-6 w-6 shrink-0 border-t-2 border-dotted border-border" />}
            </li>
          );
        })}
      </ol>
      {currentStage === null && <p className="mt-3 text-center text-xs text-muted-foreground">لا يوجد طلب قيد المتابعة حالياً</p>}
    </section>
  );
}
