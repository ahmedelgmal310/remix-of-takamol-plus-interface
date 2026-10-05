import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BriefcaseBusiness, Building2, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound, UsersRound } from "lucide-react";
import { AuthScene } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";

export function Register() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const required = ["first", "last", "email", "phone", "password", "confirm", "company", "job"];
    if (required.some((key) => !String(data.get(key) ?? "").trim())) { setError("أكمل جميع البيانات المطلوبة"); return; }
    if (data.get("password") !== data.get("confirm")) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (!agree) { setError("يجب الموافقة على الشروط والأحكام"); return; }
    void navigate({ to: "/login" });
  };
  return <AuthScene page="register"><section className="auth-card w-full max-w-[560px] px-5 py-6 sm:px-8">
    <h1 className="text-center text-2xl font-black text-buy-navy">تسجيل مستخدم جديد</h1><p className="mt-1 text-center text-xs text-muted-foreground">أنشئ حسابك للانضمام إلى منصة تكامل بلس</p>
    <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }}>
      <div className="grid gap-3 sm:grid-cols-2"><SimpleField name="first" placeholder="الاسم الأول" icon={<UserRound/>}/><SimpleField name="last" placeholder="الاسم الأخير" icon={<UserRound/>}/></div>
      <SimpleField name="email" type="email" placeholder="البريد الإلكتروني" icon={<Mail/>}/>
      <label className="auth-simple"><Phone/><input name="phone" inputMode="tel" placeholder="رقم الجوال"/><span dir="ltr" className="border-r border-border pr-3 text-xs font-bold">+966⌄</span></label>
      <PasswordField name="password" placeholder="كلمة المرور" show={show} toggle={() => setShow(!show)}/>
      <PasswordField name="confirm" placeholder="تأكيد كلمة المرور" show={show} toggle={() => setShow(!show)}/>
      <label className="auth-simple"><Building2/><select name="company" defaultValue=""><option value="" disabled>الجهة / المنشأة</option><option>شركة تكامل الأعمال</option><option>مؤسسة خاصة</option><option>جهة حكومية</option></select></label>
      <SimpleField name="job" placeholder="الوظيفة" icon={<BriefcaseBusiness/>}/>
      <label className="flex items-start gap-2 text-[11px] leading-5 text-buy-navy"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-primary"/><span>أوافق على <a href="#terms" className="font-bold text-primary underline">الشروط والأحكام</a> و<a href="#privacy" className="font-bold text-primary underline">سياسة الخصوصية</a></span></label>
      {error && <p role="alert" className="text-xs font-bold text-destructive">{error}</p>}
      <Button type="submit" className="h-12 w-full justify-between rounded-lg px-4 text-base"><span className="grid size-8 place-items-center rounded-full border border-primary-foreground/60"><ArrowLeft/></span><span>إنشاء الحساب</span><span className="size-8"/></Button>
    </form>
    <p className="mt-4 text-center text-xs text-muted-foreground">لديك حساب بالفعل؟ <Link to="/login" className="font-bold text-primary underline">تسجيل الدخول</Link></p>
    <p className="mt-3 text-center text-[10px] text-muted-foreground"><UsersRound className="ml-1 inline size-3"/>نسخة توضيحية — لا يتم إنشاء حساب فعلي</p>
  </section></AuthScene>;
}

function SimpleField({ name, placeholder, type = "text", icon }: { name: string; placeholder: string; type?: string; icon: React.ReactNode }) { return <label className="auth-simple">{icon}<input name={name} type={type} placeholder={placeholder}/></label>; }
function PasswordField({ name, placeholder, show, toggle }: { name: string; placeholder: string; show: boolean; toggle: () => void }) { return <label className="auth-simple"><LockKeyhole/><input name={name} type={show ? "text" : "password"} placeholder={placeholder}/><button type="button" onClick={toggle} aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{show ? <EyeOff/> : <Eye/>}</button></label>; }