import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Info, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import lock from "@/assets/lock.png";

const steps = ["إدخال البيانات", "التحقق", "إعادة تعيين كلمة المرور"];

export function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const sendCode = (via: string) => {
    if (via === "email" && !/^\S+@\S+\.\S+$/.test(email)) return toast.error("أدخل بريدًا إلكترونيًا صحيحًا");
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setSent(c); setStep(1);
    toast.success(`تم الإرسال ${via === "email" ? "إلى بريدك" : "إلى جوالك"} — الرمز التجريبي: ${c}`, { duration: 8000 });
  };
  const verify = () => (code === sent ? setStep(2) : toast.error("رمز التحقق غير صحيح"));
  const strength = [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^\w]/.test(pw)].filter(Boolean).length;
  const reset = () => {
    if (pw.length < 8) return toast.error("كلمة المرور 8 أحرف على الأقل");
    if (pw !== pw2) return toast.error("كلمتا المرور غير متطابقتين");
    setDone(true);
  };
  const input = "w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  const btn = "w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground hover:opacity-90";

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-5">
        <div className="leading-tight"><p className="text-xl font-extrabold">تكامل بلس</p><p className="text-[10px] tracking-[0.2em] text-muted-foreground">TAKAMUL PLUS</p></div>
        <Link to="/" className="flex items-center gap-2 text-sm text-primary">العودة إلى تسجيل الدخول <ArrowRight className="size-4 rotate-180" /></Link>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-10">
        <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
          <img src={lock} alt="استعادة كلمة المرور" width={816} height={816} className="mx-auto size-36" />
          {done ? (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="mx-auto size-14 text-success" />
              <h1 className="text-2xl font-extrabold">تم تغيير كلمة المرور</h1>
              <p className="text-muted-foreground">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
              <Link to="/" className={`${btn} block`}>العودة إلى تسجيل الدخول</Link>
            </div>
          ) : (<>
            <h1 className="text-center text-2xl font-extrabold">نسيت كلمة المرور؟</h1>
            <p className="mt-1 text-center text-muted-foreground">لا تقلق. سنساعدك في استعادة حسابك</p>

            <div className="my-6 flex items-start">
              {steps.map((s, i) => (
                <div key={s} className="relative flex-1 text-center">
                  {i > 0 && <span className={`absolute left-1/2 top-4 h-0.5 w-full ${i <= step ? "bg-primary" : "bg-border"}`} style={{ right: "50%", left: "auto" }} />}
                  <span className={`relative mx-auto grid size-8 place-items-center rounded-full text-sm font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <p className={`mt-2 text-xs ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
                </div>
              ))}
            </div>

            {step === 0 && <div className="space-y-4">
              <div className="text-center"><h2 className="font-bold">أدخل البريد الإلكتروني المرتبط بحسابك</h2><p className="text-sm text-muted-foreground">سنرسل لك رابط إعادة تعيين كلمة المرور</p></div>
              <div className="relative"><Mail className="absolute right-3 top-3.5 size-5 text-muted-foreground" /><input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={`${input} pr-10 text-right`} /></div>
              <button onClick={() => sendCode("email")} className={btn}>إرسال رابط التذكر</button>
              <div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="h-px flex-1 bg-border" />أو<span className="h-px flex-1 bg-border" /></div>
              <button onClick={() => sendCode("phone")} className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-3 font-bold text-primary"><Phone className="size-4" />إرسال رمز التحقق على الجوال</button>
            </div>}

            {step === 1 && <div className="space-y-4">
              <div className="text-center"><h2 className="font-bold">أدخل رمز التحقق</h2><p className="text-sm text-muted-foreground">أدخل الرمز المكوّن من 6 أرقام</p></div>
              <input dir="ltr" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" className={`${input} text-center text-2xl tracking-[0.5em]`} />
              <button onClick={verify} className={btn}>تحقق</button>
              <div className="flex justify-between text-sm"><button onClick={() => setStep(0)} className="text-muted-foreground">رجوع</button><button onClick={() => sendCode("phone")} className="text-primary">إعادة إرسال الرمز</button></div>
            </div>}

            {step === 2 && <div className="space-y-4">
              <h2 className="text-center font-bold">أدخل كلمة المرور الجديدة</h2>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="كلمة المرور الجديدة" className={input} />
              <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded ${i < strength ? (strength < 3 ? "bg-warning" : "bg-success") : "bg-muted"}`} />)}</div>
              <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="تأكيد كلمة المرور" className={input} />
              <button onClick={reset} className={btn}>حفظ كلمة المرور</button>
            </div>}

            <div className="mt-6 rounded-xl bg-primary/5 p-4 text-sm">
              <p className="mb-2 flex items-center gap-2 font-bold"><Info className="size-4 text-primary" />ملاحظات مهمة:</p>
              <ul className="list-disc space-y-1 pr-6 text-muted-foreground">
                <li>تأكد من إدخال البريد الإلكتروني الصحيح.</li>
                <li>تحقق من مجلد الرسائل غير المرغوب فيها (Spam).</li>
                <li>في حال عدم استلام الرسالة، تواصل مع <Link to="/support" className="text-primary">الدعم الفني</Link>.</li>
              </ul>
            </div>
          </>)}
        </div>
        <p className="mt-10 text-center font-bold">معًا لبيئة عمل أكثر كفاءة</p>
        <span className="mx-auto mt-2 block h-1 w-10 rounded bg-primary" />
      </main>
    </div>
  );
}
