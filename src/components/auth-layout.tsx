import type { ReactNode } from "react";
import { BarChart3, Cloud, Headphones, Settings, ShieldCheck, UsersRound, WalletCards } from "lucide-react";
import authOffice from "@/assets/auth-office.jpg";
import loginOffice from "@/assets/login-reference-office.jpg";

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <div className="auth-brand" aria-label="تكامل بلس">
    <span className={`${compact ? "text-3xl" : "text-4xl sm:text-5xl"} font-black leading-none text-buy-navy`}>تكامل</span>
    <span className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} font-black leading-none text-buy-gold`}>بلس</span>
    <span className="relative grid h-14 w-8 place-items-end rounded-md bg-buy-navy pb-1 text-2xl font-black text-buy-gold before:absolute before:-top-2 before:right-0 before:h-3 before:w-10 before:rounded-sm before:bg-buy-navy">+</span>
    <b className="auth-brand-english" dir="ltr">Takamul Plus</b>
  </div>;
}

const benefits = [
  { label: "تقارير فورية", icon: BarChart3 },
  { label: "يعمل من أي مكان", icon: Cloud },
  { label: "سهل الاستخدام", icon: Settings },
  { label: "آمن وموثوق", icon: ShieldCheck },
];

function Benefits({ light = false }: { light?: boolean }) {
  return <div className={`grid grid-cols-4 ${light ? "text-buy-navy" : "text-primary-foreground"}`}>
    {benefits.map(({ label, icon: Icon }, index) => <div key={label} className={`flex min-w-0 flex-col items-center gap-2 px-1 text-center ${index ? "border-r border-current/20" : ""}`}><Icon className="size-6 text-buy-gold"/><span className="text-[9px] font-semibold sm:text-xs">{label}</span></div>)}
  </div>;
}

export function AuthScene({ children, page }: { children: ReactNode; page: "login" | "register" | "forgot" }) {
  if (page !== "login") return <div dir="rtl" className="relative min-h-screen overflow-hidden bg-auth-wash">
    <img src={authOffice} width={1600} height={1200} alt="مكتب أعمال حديث" className="absolute inset-0 h-full w-full object-cover opacity-85" />
    <div className="absolute inset-0 bg-auth-overlay" />
    <div className="absolute -right-24 -top-20 size-64 rounded-full border-[42px] border-buy-gold/75" />
    <main className="relative z-10 mx-auto flex min-h-screen max-w-[1360px] flex-col px-4 py-6 sm:px-8">
      <div className="mx-auto mb-5 mt-2"><BrandLogo compact /></div>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </main>
  </div>;

  return <main dir="rtl" className="login-scene">
    <section className="login-form-side">
      {children}
    </section>
    <section className="login-photo-side">
      <img src={loginOffice} width={960} height={1200} alt="مكتب تكامل بلس" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-auth-photo" />
      <div className="login-photo-content">
        <BrandLogo />
        <h2 className="mt-5 max-w-lg text-xl font-bold leading-8">منصة متكاملة لإدارة الموارد البشرية<br/>والشؤون المالية وخدمة العملاء</h2>
        <div className="login-system-cards">
          {[
            { title: "الموارد البشرية", text: "إدارة الموظفين\nوالرواتب والتقارير", icon: UsersRound },
            { title: "الشؤون المالية", text: "الميزانيات والمصروفات\nوالتقارير المالية", icon: BarChart3 },
            { title: "خدمة العملاء", text: "إدارة الطلبات\nوالمتابعة والدعم", icon: Headphones },
          ].map(({ title, text, icon: Icon }, i) => <div key={title} className="rounded-lg bg-card/90 px-3 py-5 shadow-lg backdrop-blur-sm"><span className={`mx-auto grid size-12 place-items-center rounded-full ${i === 1 ? "bg-warning-soft text-warning" : "bg-primary-soft text-primary"}`}><Icon className="size-7"/></span><h3 className="mt-3 text-sm font-extrabold">{title}</h3><p className="mt-1 whitespace-pre-line text-[10px] leading-5">{text}</p></div>)}
        </div>
        <div className="login-benefits"><Benefits /></div>
      </div>
    </section>
  </main>;
}

export function SecurityNote({ forgot = false }: { forgot?: boolean }) {
  return <div className="mt-5 flex items-center gap-4 rounded-lg bg-primary-soft px-5 py-4 text-buy-navy"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-buy-navy"><ShieldCheck className="size-6" /></span><div><p className="text-xs font-extrabold">{forgot ? "حسابك آمن" : "بياناتك محمية وآمنة"}</p><p className="mt-1 text-[10px] text-muted-foreground">نستخدم أعلى معايير الأمان لحماية بياناتك</p></div></div>;
}

export { Benefits };