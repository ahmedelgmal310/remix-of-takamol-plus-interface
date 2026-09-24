import { useState } from "react";
import {
  Building2, CalendarDays, Check, Clock3, Download, FileCheck2, IdCard,
  LockKeyhole, Printer, RefreshCw, Search, ShieldCheck, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { certificateVerificationData as certificate } from "@/data/mockData";

function CertificatePreview() {
  return <section className="panel p-3">
    <h2 className="mb-2 text-xs font-extrabold">مثال على شهادة التعريف</h2>
    <div className="relative min-h-[330px] overflow-hidden border-[5px] border-double border-border bg-card p-5 text-center">
      <div className="absolute left-2 top-2 h-12 w-12 border-l-2 border-t-2 border-border"/><div className="absolute bottom-2 right-2 h-12 w-12 border-b-2 border-r-2 border-border"/>
      <div className="mx-auto flex w-fit items-center gap-2"><span className="brand-mark h-10 w-9">t</span><div className="text-right"><b className="block text-lg">تكامل بلس</b><span className="text-[8px] tracking-[.25em] text-muted-foreground">TAKAMUL PLUS</span></div></div>
      <h3 className="mt-3 text-sm font-extrabold">شهادة تعريف بالراتب</h3>
      <p className="mx-auto mt-3 max-w-md text-[9px] leading-6">تشهد إدارة الموارد البشرية بأن السيد/ {certificate.employeeName}<br/>يعمل لدينا في وظيفة أخصائي موارد بشرية<br/>وذلك حسب البيانات المبينة أدناه:</p>
      <dl className="mx-auto mt-2 grid max-w-[240px] grid-cols-[90px_1fr] gap-y-1 text-right text-[8px] font-bold">
        <dt>رقم الموظف</dt><dd>{certificate.employeeNumber}</dd><dt>رقم الهوية</dt><dd>{certificate.nationalId}</dd><dt>الإدارة</dt><dd>إدارة الموارد البشرية</dd><dt>تاريخ المباشرة</dt><dd>2023/06/01</dd><dt>تاريخ الإصدار</dt><dd>{certificate.issueDate}</dd>
      </dl>
      <div className="mt-5 grid grid-cols-[70px_1fr] items-end gap-8 text-[7px]"><div className="grid h-16 w-16 place-items-center border-2 border-foreground font-extrabold">QR</div><div><p className="font-extrabold text-primary">إدارة الموارد البشرية</p><p className="mt-3 text-muted-foreground">يمكن التحقق من صحة الشهادة عبر منصة تكامل بلس</p></div></div>
    </div>
  </section>;
}

function VerificationForm({ onVerify }: { onVerify: (valid: boolean) => void }) {
  const [number,setNumber]=useState<string>(certificate.certificateNumber); const [id,setId]=useState<string>(certificate.nationalId); const [date,setDate]=useState("");
  return <section className="panel p-5"><h2 className="text-base font-extrabold">بيانات التحقق</h2><p className="mt-1 text-[9px] text-muted-foreground">يرجى إدخال بيانات الشهادة كما هي في المستند</p><div className="mt-5 grid gap-4">
    <Field label="رقم الوثيقة / الشهادة *" icon={<FileCheck2/>}><input value={number} onChange={e=>setNumber(e.target.value)} placeholder="مثال: REF-2025-001"/></Field>
    <Field label="رقم الهوية الوطنية للموظف *" icon={<IdCard/>}><input value={id} onChange={e=>setId(e.target.value)} placeholder="مثال: 1012345678"/></Field>
    <Field label="تاريخ إصدار الشهادة *" icon={<CalendarDays/>}><input value={date} onChange={e=>setDate(e.target.value)} placeholder="اختر التاريخ"/></Field>
    <div className="flex h-14 items-center justify-center gap-3 rounded-md border border-input bg-search text-[9px]"><span className="grid h-8 w-8 place-items-center text-primary"><RefreshCw/></span><span>أنا لست برنامج روبوت</span><input type="checkbox" aria-label="أنا لست برنامج روبوت"/></div>
    <Button className="w-full" onClick={()=>onVerify(number===certificate.certificateNumber && id===certificate.nationalId)}><Search/>تحقق من الشهادة</Button>
  </div></section>;
}

function Field({label,icon,children}:{label:string;icon:React.ReactNode;children:React.ReactNode}){return <label className="grid gap-1 text-[9px] font-bold"><span>{label}</span><span className="grid h-10 grid-cols-[minmax(0,1fr)_auto] items-center rounded-md border border-input bg-background px-3 text-muted-foreground [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:text-[10px] [&_input]:text-foreground [&_input]:outline-none [&_svg]:size-4">{children}{icon}</span></label>}

function ValidResult() {
  return <section className="panel border-success/30 bg-success-soft p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success text-primary-foreground"><Check/></span><div><h2 className="text-base font-extrabold text-success">الشهادة صحيحة</h2><p className="text-[8px] text-muted-foreground">تم التحقق من صحة الشهادة وهي صادرة من منصة تكامل بلس</p></div></div><div className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">{[["رقم الوثيقة",certificate.certificateNumber],["اسم الموظف",certificate.employeeName],["رقم الهوية",certificate.nationalId],["نوع الشهادة",certificate.certificateType],["تاريخ الإصدار",certificate.issueDate],["الجهة المصدرة",certificate.issuer]].map(([k,v])=><div key={k} className="grid grid-cols-[90px_1fr] border-b border-success/20 py-1 text-[8px]"><span className="text-muted-foreground">{k}</span><b>{v}</b></div>)}</div><div className="mt-3 grid gap-2 sm:grid-cols-2"><Button variant="outline"><Printer/>طباعة النتيجة</Button><Button variant="outline"><Download/>تنزيل نسخة الشهادة</Button></div></section>;
}

function InvalidResult({retry}:{retry:()=>void}) {
  return <section className="panel border-destructive/30 bg-destructive/5 p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive text-destructive-foreground"><X/></span><div><h2 className="text-base font-extrabold text-destructive">الشهادة غير صحيحة</h2><p className="text-[8px] text-muted-foreground">تعذر التحقق من صحة الشهادة، يرجى التأكد من البيانات المدخلة</p></div></div><div className="mt-3 rounded-md border border-destructive/20 bg-card/50 p-3"><b className="text-[9px] text-destructive">أسباب محتملة:</b><ul className="mt-2 list-inside list-disc space-y-1 text-[8px]"><li>رقم الوثيقة غير صحيح</li><li>البيانات المدخلة لا تطابق السجلات</li><li>الشهادة منتهية أو ملغاة</li><li>يرجى التواصل مع جهة الإصدار في حال استمرار المشكلة</li></ul></div><Button variant="outline" className="mt-3 w-full" onClick={retry}><RefreshCw/>إعادة المحاولة</Button></section>;
}

export function CertificateVerificationPage(){const [result,setResult]=useState<"valid"|"invalid"|null>(null);const features=[{Icon:Clock3,title:"تحقق فوري",text:"احصل على النتيجة خلال ثوان"},{Icon:ShieldCheck,title:"مستندات معتمدة",text:"صادرة من منصة تكامل بلس"},{Icon:LockKeyhole,title:"بيانات آمنة ومشفرة",text:"جميع عمليات التحقق مؤمنة"}];return <main className="min-h-screen bg-background" dir="rtl"><header className="border-b border-border bg-card"><div className="mx-auto grid min-h-[150px] max-w-[1100px] grid-cols-[minmax(0,1fr)_auto] items-center gap-5 px-4 py-6"><div className="text-center"><h1 className="text-2xl font-extrabold sm:text-3xl">التحقق من شهادة تعريف موظف</h1><p className="mt-2 text-xs text-muted-foreground">تحقق من صحة شهادة التعريف الصادرة إلكترونياً من خلال إدخال البيانات التالية</p></div><span className="grid h-20 w-16 place-items-center rounded-md bg-primary text-primary-foreground"><ShieldCheck size={46}/></span></div></header><div className="mx-auto max-w-[1000px] px-3 py-4"><div className="grid gap-3 lg:grid-cols-2"><CertificatePreview/><VerificationForm onVerify={(valid)=>setResult(valid?"valid":"invalid")}/></div><div className="mt-3 grid gap-3 lg:grid-cols-2"><ValidResult/>{result === "invalid" ? <InvalidResult retry={()=>setResult(null)}/> : <InvalidResult retry={()=>setResult("invalid")}/>}</div><footer className="mt-4 grid gap-3 border-t border-border py-4 text-center sm:grid-cols-3">{features.map(({Icon,title,text})=><div key={title} className="flex items-center justify-center gap-3"><Icon className="text-foreground" size={20}/><div className="text-right"><b className="text-[9px]">{title}</b><p className="text-[8px] text-muted-foreground">{text}</p></div></div>)}</footer></div></main>}