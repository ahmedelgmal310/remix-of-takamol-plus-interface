import { useState } from "react";
import { Globe, Mail, MapPin, Phone, Plus, Printer, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Data = {
  ref: string; date: string; hijri: string; name: string; empNo: string; nationalId: string; title: string; dept: string; hireDate: string; status: string;
  items: [string, number][]; managerTitle: string; managerName: string;
};
const initial: Data = {
  ref: "FIN-LTR-2025-0326", date: "2025/09/22", hijri: "1447/04/01", name: "أحمد محمد السبيعي", empNo: "EMP-00125", nationalId: "1012345678",
  title: "أخصائي تقنية المعلومات", dept: "إدارة تقنية المعلومات", hireDate: "2020/01/15", status: "على رأس العمل",
  items: [["الراتب الأساسي", 8000], ["بدل السكن", 2500], ["بدل النقل", 800], ["بدل الاتصالات", 300], ["بدلات أخرى", 400]],
  managerTitle: "مدير إدارة الموارد البشرية", managerName: "سعد بن عبدالله العنزي",
};
const f = (n: number) => n.toLocaleString("en-US");
const inp = "h-9 w-full rounded-md border border-input bg-background px-3 text-xs";

export function Logo({ small }: { small?: boolean }) {
  return <div className="flex items-center gap-3"><div className="text-right"><b className={`block font-extrabold leading-none text-letter-navy ${small ? "text-xl" : "text-4xl"}`}>تكامل بلس</b><span className="mt-1 block text-center text-[10px] font-bold tracking-[0.3em] text-letter-navy" dir="ltr">TAKAMUL PLUS</span>{!small && <span className="mt-1 block text-sm font-bold text-letter-navy">حلول متكاملة لإدارة الأعمال</span>}</div><span className={`relative grid rotate-45 place-items-center rounded-md bg-letter-navy ${small ? "size-7" : "size-14"}`}><span className="h-1/2 w-1 -rotate-45 rounded bg-letter-gold" /></span></div>;
}
export function Qr() {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => { const x = i % 21, y = Math.floor(i / 21); const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && !(x > a && x < a + 6 && y > b && y < b + 6) || (x >= a + 2 && x < a + 5 && y >= b + 2 && y < b + 5); if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true; if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false; return ((x * 7 + y * 13 + x * y) % 5) < 2; });
  return <svg viewBox="0 0 21 21" className="size-20" shapeRendering="crispEdges">{cells.map((c, i) => c && <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="currentColor" />)}</svg>;
}
export function Stamp() {
  return <div className="grid size-40 place-items-center rounded-full border-[3px] border-letter-stamp p-1.5 text-letter-stamp"><div className="relative grid size-full place-items-center rounded-full border border-dashed border-letter-stamp text-center"><div><span className="mx-auto mb-1 block size-7 rotate-45 rounded-sm bg-letter-stamp" /><b className="block text-lg leading-none">تكامل بلس</b><span className="block text-[7px] tracking-widest" dir="ltr">TAKAMUL PLUS</span><span className="block text-[7px]">حلول متكاملة لإدارة الأعمال</span><b className="mt-1 block text-sm">إدارة الموارد البشرية</b></div></div></div>;
}

function Letter({ d }: { d: Data }) {
  const total = d.items.reduce((s, [, v]) => s + (v || 0), 0);
  const emp: [string, string][] = [["الاسم", d.name], ["الرقم الوظيفي", d.empNo], ["رقم الهوية الوطنية", d.nationalId], ["المسمى الوظيفي", d.title], ["الإدارة / القسم", d.dept], ["تاريخ التعيين", `${d.hireDate} م`], ["حالة الموظف", d.status]];
  return <article id="financial-letter" dir="rtl" className="relative mx-auto w-full max-w-[800px] overflow-hidden bg-card text-foreground shadow-lg print:shadow-none">
    <div className="absolute inset-x-0 top-0 h-24 bg-letter-navy [clip-path:polygon(45%_0,100%_0,100%_100%,85%_70%,65%_45%)]" />
    <div className="absolute top-0 right-[35%] h-24 w-[25%] bg-letter-gold [clip-path:polygon(0_0,20%_0,100%_100%,90%_100%)] opacity-70" />
    <p className="absolute right-8 top-5 text-sm text-primary-foreground">معاً لبناء مستقبل أفضل</p>
    <div className="relative flex min-h-[1150px] flex-col px-[6%] pt-6 pb-0">
      <div className="flex items-start justify-between">
        <div className="mt-24 space-y-1 text-[15px]"><p>المملكة العربية السعودية</p><b className="block text-lg text-letter-navy">تكامل بلس</b><p>إدارة الموارد البشرية</p></div>
        <div><Logo /><div className="mt-5 grid grid-cols-[auto_auto_auto] gap-x-4 gap-y-1 text-[13px]"><span>الرقم المرجعي</span><span>:</span><span dir="ltr" className="text-left">{d.ref}</span><span>التـاريخ</span><span>:</span><span>{d.date} م</span><span>الموافق</span><span>:</span><span>{d.hijri} هـ</span></div></div>
      </div>
      <hr className="mt-3 border-brand-deep/40" />
      <h1 className="mt-5 text-center text-3xl font-extrabold text-letter-navy">خطاب تعريف مالي</h1>
      <span className="mx-auto mt-3 block h-1 w-24 rounded bg-letter-gold" />
      <b className="mt-4 block text-lg text-letter-navy">إلى من يهمه الأمر</b>
      <p className="mt-3 text-[15px]">السلام عليكم ورحمة الله وبركاته ،،،</p>
      <p className="mt-3 text-[15px] leading-8">تشهد إدارة الموارد البشرية في شركة <b>تكامل بلس</b> بأن الموظف الموضحة بياناته أدناه يعمل لدينا وذلك حسب البيانات المالية المبينة أدناه، وقد أعطي هذا الخطاب بناءً على طلبه دون أدنى مسؤولية على الشركة.</p>
      <h2 className="mt-4 rounded-t-md bg-letter-soft px-4 py-2 font-extrabold text-letter-navy">بيانات الموظف</h2>
      <table className="w-full border border-border text-[13px]"><tbody>{emp.map(([k, v]) => <tr key={k} className="border-b border-border"><td className="w-[22%] bg-search px-3 py-1.5">{k}</td><td className="px-3 py-1.5">{v}</td></tr>)}</tbody></table>
      <h2 className="mt-4 rounded-t-md bg-letter-soft px-4 py-2 font-extrabold text-letter-navy">البيانات المالية</h2>
      <table className="w-full border border-border text-[13px]"><thead className="bg-letter-navy text-primary-foreground"><tr><th className="px-3 py-2 text-right">البيان</th><th className="px-3 py-2">المبلغ الشهري (ريال سعودي)</th></tr></thead><tbody>{d.items.map(([k, v], i) => <tr key={i} className="border-b border-border"><td className="px-3 py-1.5">{k}</td><td className="px-3 py-1.5 text-center">{f(v || 0)}</td></tr>)}<tr className="bg-letter-soft font-extrabold text-letter-navy"><td className="px-3 py-2 text-base">إجمالي الراتب الشهري</td><td className="px-3 py-2 text-center text-lg">{f(total)}</td></tr></tbody></table>
      <p className="mt-4 text-[15px]">وقد أعطي هذا الخطاب بناءً على طلبه لتقديمه إلى <b>من يهمه الأمر</b>.</p>
      <p className="mt-3 text-center text-[15px]">وتفضلوا بقبول خالص التحية والتقدير ،،،</p>
      <div className="mt-3 grid grid-cols-3 items-center">
        <div className="text-center text-[11px]"><Qr /><p>للتحقق من صحة الخطاب</p><p>يرجى مسح الرمز أو زيارة الرابط</p><p dir="ltr">https://verify.takamul.sa</p><p dir="ltr" className="mt-1 text-xs font-bold">{d.ref}</p></div>
        <div className="grid place-items-center"><Stamp /></div>
        <div className="text-center"><b className="text-sm text-letter-navy">{d.managerTitle}</b><svg viewBox="0 0 200 60" className="mx-auto h-14 w-44 text-letter-stamp"><path d="M10 45 C40 10, 80 5, 70 30 S30 60, 60 40 S120 20, 110 30 S150 25, 190 28 M60 30 L185 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg><b className="text-base text-letter-navy">{d.managerName}</b></div>
      </div>
      <div className="mt-6 -mx-[6.4%] flex flex-wrap items-center justify-between gap-3 bg-letter-navy px-[6%] py-4 text-[12px] text-primary-foreground [clip-path:polygon(0_20%,50%_0,100%_25%,100%_100%,0_100%)] pt-8">
        <div><b className="text-lg">تكامل .. لفرص أكبر</b><span className="mt-1 block h-0.5 w-16 bg-letter-gold" /></div>
        <span className="flex items-center gap-1.5">الرياض - المملكة العربية السعودية<MapPin size={14} /></span>
        <span className="flex items-center gap-1.5" dir="ltr"><Globe size={14} />www.takamul.sa</span>
        <span className="flex items-center gap-1.5" dir="ltr"><Mail size={14} />info@takamul.sa</span>
        <span className="flex items-center gap-1.5" dir="ltr"><Phone size={14} />920000000</span>
      </div>
    </div>
  </article>;
}

export function FinancialLetterPage() {
  const [d, setD] = useState(initial);
  const set = (k: keyof Data, v: string) => setD(p => ({ ...p, [k]: v }));
  const fields: [keyof Data, string][] = [["ref", "الرقم المرجعي"], ["date", "التاريخ (ميلادي)"], ["hijri", "الموافق (هجري)"], ["name", "الاسم"], ["empNo", "الرقم الوظيفي"], ["nationalId", "رقم الهوية الوطنية"], ["title", "المسمى الوظيفي"], ["dept", "الإدارة / القسم"], ["hireDate", "تاريخ التعيين"], ["status", "حالة الموظف"], ["managerTitle", "صفة الموقّع"], ["managerName", "اسم الموقّع"]];
  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4 print:p-0">
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden"><div><h1 className="text-xl font-extrabold text-letter-navy">إنشاء خطاب تعريف مالي</h1><p className="mt-1 text-xs">املأ البيانات وسيظهر الخطاب فوراً بالشكل النهائي</p></div><button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground"><Printer size={16} />طباعة / حفظ PDF</button></header>
    <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <section className="panel h-fit p-4 print:hidden"><h2 className="mb-3 font-extrabold text-letter-navy">بيانات الخطاب</h2><div className="grid gap-2.5">{fields.map(([k, l]) => <label key={k} className="grid gap-1 text-xs font-bold">{l}<input value={d[k] as string} onChange={e => set(k, e.target.value)} className={inp} /></label>)}</div>
        <h2 className="mt-5 mb-2 font-extrabold text-letter-navy">البيانات المالية</h2><div className="grid gap-2">{d.items.map(([k, v], i) => <div key={i} className="grid grid-cols-[minmax(0,1fr)_90px_auto] gap-2"><input value={k} onChange={e => setD(p => ({ ...p, items: p.items.map((it, j) => j === i ? [e.target.value, it[1]] : it) }))} className={inp} /><input value={v} onChange={e => setD(p => ({ ...p, items: p.items.map((it, j) => j === i ? [it[0], Number(e.target.value.replace(/\D/g, "")) || 0] : it) }))} className={inp} /><button onClick={() => setD(p => ({ ...p, items: p.items.filter((_, j) => j !== i) }))} className="text-destructive"><Trash2 size={16} /></button></div>)}</div>
        <button onClick={() => setD(p => ({ ...p, items: [...p.items, ["بند جديد", 0]] }))} className="mt-2 flex items-center gap-1 text-xs font-bold text-primary"><Plus size={14} />إضافة بند</button></section>
      <div className="min-w-0 overflow-x-auto"><div className="min-w-[640px]"><Letter d={d} /></div></div>
    </div>
  </main></AppShell>;
}
