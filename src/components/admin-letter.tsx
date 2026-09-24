import { useState } from "react";
import { Globe, Mail, MapPin, Phone, Printer } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Logo, Qr, Stamp } from "@/components/financial-letter";

const initial = { date: "2025/09/22", hijri: "1447/04/01", ref: "HR-LTR-2025-0145", name: "أحمد محمد السبيعي", nationalId: "1012345678", empNo: "EMP-00125", title: "أخصائي نظم معلومات", dept: "إدارة تقنية المعلومات", hireDate: "2020/01/15", to: "من يهمه الأمر", managerTitle: "مدير إدارة الموارد البشرية", managerName: "سعد بن عبدالله العنزي" };
type Data = typeof initial;
const fields: [keyof Data, string][] = [["date","التاريخ الميلادي"],["hijri","التاريخ الهجري"],["ref","الرقم المرجعي"],["name","اسم الموظف"],["nationalId","رقم الهوية الوطنية"],["empNo","الرقم الوظيفي"],["title","الوظيفة"],["dept","الإدارة"],["hireDate","تاريخ الالتحاق"],["to","الجهة الموجّه لها الخطاب"],["managerTitle","منصب الموقّع"],["managerName","اسم الموقّع"]];

function Diamond({ className }: { className: string }) { return <span className={`absolute rotate-45 bg-letter-soft ${className}`} />; }

function Letter({ d }: { d: Data }) {
  return <article id="admin-letter" dir="rtl" className="relative mx-auto aspect-[1024/1536] w-full max-w-[800px] overflow-hidden bg-card text-foreground shadow-lg">
    <Diamond className="top-[14%] -left-[3%] hidden" />
    <span className="absolute top-[12%] left-[82%] h-[16%] w-[16%] rotate-45 bg-letter-soft/70 [transform:rotate(0)] [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" style={{ left: "80%", width: "20%", height: "22%" }} />
    <span className="absolute bottom-[14%] -left-[4%] size-[22%] border border-letter-soft [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)] bg-letter-soft/40" />
    <div className="relative flex h-full flex-col px-[5.5%] pt-[3.5%]">
      <div className="flex items-start justify-between border-b-2 border-letter-navy pb-3">
        <div className="space-y-1 text-[15px]"><p>المملكة العربية السعودية</p><b className="block text-lg text-letter-navy">تكامل بلس</b><p>إدارة الموارد البشرية</p></div>
        <Logo />
      </div>
      <dl className="mt-4 grid w-fit grid-cols-[auto_auto_auto] gap-x-3 gap-y-2 text-[14px]">
        <dt>التـاريـخ</dt><span>:</span><dd>{d.date} م</dd>
        <dt>الموافق</dt><span>:</span><dd>{d.hijri} هـ</dd>
        <dt>الرقم المرجعي</dt><span>:</span><dd>{d.ref}</dd>
      </dl>
      <h1 className="mt-10 text-center text-4xl font-extrabold text-letter-navy">خطاب تعريف إداري</h1>
      <span className="mx-auto mt-4 block h-0.5 w-24 bg-letter-navy" />
      <b className="mt-8 block text-xl text-letter-navy">إلى {d.to}</b>
      <div className="mt-5 space-y-3 text-[16.5px] leading-9">
        <p>السلام عليكم ورحمة الله وبركاته، وبعد:</p>
        <p className="pt-2">تشهد شركة <b className="text-letter-navy">تكامل بلس</b> بأن الموظف/ <b className="text-letter-navy">{d.name}</b><br />
          رقم الهوية الوطنية : {d.nationalId}<span className="mx-10">|</span>الرقم الوظيفي : {d.empNo}<br />
          يعمل لدينا بوظيفة <b className="text-letter-navy">{d.title}</b> ضمن <b className="text-letter-navy">{d.dept}</b><br />
          وذلك منذ تاريخ {d.hireDate} م، ولا يزال على رأس العمل حتى تاريخ إصدار هذا الخطاب.</p>
        <p className="pt-3">وقد أعطي هذا الخطاب بناءً على طلبه لتقديمه إلى <b className="text-letter-navy">{d.to}</b><br />دون أدنى مسؤولية على الشركة.</p>
        <p className="pt-5 text-center">وتفضلوا بقبول خالص التحية والتقدير ،،،</p>
      </div>
      <div className="mt-auto grid grid-cols-3 items-center gap-4 pb-4">
        <div className="text-[13px]"><Qr /><p className="mt-2">للتحقق من صحة الخطاب</p><p>يرجى مسح الباركود أو زيارة الرابط</p><p className="text-letter-stamp" dir="ltr">https://verify.takamul.sa</p><p className="mt-2 text-base">{d.ref}</p></div>
        <div className="grid place-items-center"><Stamp /></div>
        <div className="text-center"><b className="text-base text-letter-navy">{d.managerTitle}</b><svg viewBox="0 0 200 60" className="mx-auto h-16 w-48 text-letter-stamp"><path d="M10 45 C40 10, 80 5, 70 30 S30 60, 60 40 S120 20, 110 30 S150 25, 190 28 M60 30 L185 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg><b className="text-lg text-letter-navy">{d.managerName}</b></div>
      </div>
      <div className="-mx-[6%] flex items-end justify-between bg-letter-navy px-[6%] pb-6 pt-20 text-[13px] text-primary-foreground [clip-path:ellipse(120%_100%_at_70%_100%)]">
        <div><b className="text-xl font-normal">شركاء في مستقبل أفضل</b><span className="mt-3 block h-0.5 w-16 bg-primary-foreground" /></div>
        <div className="grid grid-cols-2 gap-x-14 gap-y-3" dir="rtl">
          <span className="flex items-center gap-2"><Mail size={17} />info@takamul.sa</span><span className="flex items-center gap-2"><Phone size={17} />920000000</span>
          <span className="flex items-center gap-2"><MapPin size={17} />الرياض - المملكة العربية السعودية</span><span className="flex items-center gap-2"><Globe size={17} />www.takamul.sa</span>
        </div>
      </div>
    </div>
  </article>;
}

export function AdminLetterPage() {
  const [d, setD] = useState(initial);
  const inp = "h-9 w-full rounded-md border border-input bg-background px-3 text-xs";
  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4">
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden"><div><h1 className="text-xl font-extrabold text-letter-navy">إنشاء خطاب تعريف إداري</h1><p className="mt-1 text-xs">املأ البيانات وسيظهر الخطاب فوراً بالشكل النهائي</p></div><button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground"><Printer size={16} />طباعة / حفظ PDF</button></header>
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <section className="panel h-fit p-4 print:hidden"><h2 className="mb-3 font-extrabold text-letter-navy">بيانات الخطاب</h2><div className="grid gap-2.5">{fields.map(([k, l]) => <label key={k} className="grid gap-1 text-xs font-bold">{l}<input value={d[k]} onChange={e => setD(p => ({ ...p, [k]: e.target.value }))} className={inp} /></label>)}</div></section>
      <div className="min-w-0"><Letter d={d} /></div>
    </div>
  </main></AppShell>;
}
