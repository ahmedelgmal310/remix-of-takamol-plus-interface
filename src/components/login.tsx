import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRoundPlus } from "lucide-react";
import { AuthScene, BrandLogo, SecurityNote } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";

export function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 4) { setError("أدخل البريد الإلكتروني وكلمة المرور بشكل صحيح"); return; }
    void navigate({ to: "/" });
  };
  return <AuthScene page="login"><div className="w-full max-w-[480px]">
    <BrandLogo compact />
    <div className="mt-7 text-center"><h1 className="text-3xl font-black text-buy-navy">تسجيل الدخول</h1><p className="mt-1 text-sm text-muted-foreground">مرحباً بك في منصة تكامل بلس</p></div>
    <form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <label className="auth-field"><Mail/><span><b>البريد الإلكتروني</b><input dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" aria-label="البريد الإلكتروني" /></span></label>
      <label className="auth-field"><LockKeyhole/><span><b>كلمة المرور</b><input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} aria-label="كلمة المرور" /></span><button type="button" onClick={() => setShow(!show)} aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{show ? <EyeOff/> : <Eye/>}</button></label>
      <div className="flex items-center justify-between text-xs"><Link to="/forgot-password" className="font-bold text-primary underline">نسيت كلمة المرور؟</Link><label className="flex items-center gap-2 font-semibold text-buy-navy"><input type="checkbox" className="size-5 accent-primary"/>تذكرني</label></div>
      {error && <p role="alert" className="text-xs font-bold text-destructive">{error}</p>}
      <Button type="submit" className="h-12 w-full justify-between rounded-lg px-4 text-base font-bold"><span className="grid size-8 place-items-center rounded-full border border-primary-foreground/60"><ArrowLeft/></span><span>تسجيل الدخول</span><span className="size-8"/></Button>
    </form>
    <div className="my-4 flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border"/>أو<span className="h-px flex-1 bg-border"/></div>
    <Button asChild variant="outline" className="h-12 w-full rounded-lg border-primary text-sm font-extrabold text-primary"><Link to="/register"><UserRoundPlus/>تسجيل مستخدم جديد</Link></Button>
    <SecurityNote />
    <p className="mt-4 text-center text-[10px] text-muted-foreground">نسخة توضيحية — لا يتم حفظ بيانات الدخول</p>
  </div></AuthScene>;
}