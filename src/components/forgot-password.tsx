import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, Mail } from "lucide-react";
import { AuthScene, SecurityNote } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import resetImage from "@/assets/auth-reset.png";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("أدخل بريدًا إلكترونيًا صحيحًا"); return; }
    setError(""); setSent(true);
  };
  return <AuthScene page="forgot"><section className="auth-card w-full max-w-[520px] px-5 py-7 sm:px-8">
    <h1 className="text-center text-2xl font-black text-buy-navy">نسيت كلمة المرور؟</h1>
    <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-7 text-muted-foreground">لا تقلق. أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.</p>
    <img src={resetImage} alt="استعادة كلمة المرور" width={1024} height={768} className="mx-auto my-3 h-48 w-auto object-contain"/>
    {sent ? <div className="rounded-lg bg-success-soft px-5 py-5 text-center"><h2 className="font-extrabold text-success">تم إرسال الرابط</h2><p className="mt-1 text-xs text-muted-foreground">تحقق من بريدك الإلكتروني للمتابعة. هذه رسالة توضيحية ولم يتم إرسال بريد حقيقي.</p><Button variant="outline" className="mt-4" onClick={() => setSent(false)}>إرسال مرة أخرى</Button></div> : <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <label className="auth-simple"><Mail/><input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني"/></label>
      {error && <p role="alert" className="text-xs font-bold text-destructive">{error}</p>}
      <Button type="submit" className="h-12 w-full justify-between rounded-lg px-4 text-base"><span className="grid size-8 place-items-center rounded-full border border-primary-foreground/60"><ArrowLeft/></span><span>إرسال رابط إعادة التعيين</span><span className="size-8"/></Button>
    </form>}
    <div className="my-5 flex items-center gap-4"><span className="h-px flex-1 bg-border"/><Link to="/login" className="flex items-center gap-1 text-xs font-bold text-primary"><ChevronLeft/>العودة إلى تسجيل الدخول</Link><span className="h-px flex-1 bg-border"/></div>
    <SecurityNote forgot />
  </section></AuthScene>;
}