import { Fragment, useState, type ReactNode } from "react";
import { ArrowLeftRight, ArrowRight, BarChart3, Calculator, CalendarDays, Check, ChevronDown, ChevronLeft, Clock, FileText, Home, Info, Paperclip, Save, Send, UserRound, CalendarRange } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import ahmed from "@/assets/candidate-ahmed.jpg";

const steps = [["طلب جديد","إدخال البيانات"],["اعتماد المدير"],["اعتماد الرئيس"],["مراجعة الموارد البشرية"],["احتساب المستحقات"],["إخلاء الطرف"],["اعتماد المالية"],["صرف المستحقات"],["مكتمل"]];
const earnings: [string, number][] = [["مكافأة نهاية الخدمة",32500],["رصيد الإجازات",5200],["الراتب المستحق",8750],["مكافآت / بدلات أخرى",2000]];
const deductions: [string, number][] = [["السلف",6000],["غياب",1250],["عهد مستحقة",0],["خصومات أخرى",500]];
const clearance = [["العهد والأصول","تم التسليم"],["سلف الموظف","لا توجد مستحقة"],["إدارة تقنية المعلومات","تم التسليم"],["إدارة المرافق","تم التسليم"],["البطاقات والسجلات","تم التسليم"],["المكتبة","لا يوجد"],["أخرى","قيد الإجراء"]];
const fmt = (n:number)=>n.toLocaleString("en-US",{minimumFractionDigits:2});

function Card({title,icon,children,className=""}:{title:string;icon:ReactNode;children:ReactNode;className?:string}){return <section className={`panel p-4 ${className}`}><h2 className="mb-3 flex items-center gap-2 border-b border-border pb-3 text-base font-extrabold text-brand-deep"><span className="text-primary [&_svg]:size-5">{icon}</span>{title}</h2>{children}</section>}
const input = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none";

export function EndOfServicePage() {
  const [stage,setStage]=useState(0); const [msg,setMsg]=useState(""); const [notes,setNotes]=useState(""); const [files,setFiles]=useState<string[]>([]);
  const [docs,setDocs]=useState([true,true,true,false]);
  const totE = earnings.reduce((a,b)=>a+b[1],0), totD = deductions.reduce((a,b)=>a+b[1],0);
  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <div className="flex items-start justify-between gap-3"><div><nav className="flex items-center gap-2 text-xs text-primary"><Home size={14}/>الموارد البشرية<ChevronLeft size={12}/>الموظفون<ChevronLeft size={12}/>طلب نهاية خدمة</nav><h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><FileText className="text-primary"/>طلب نهاية خدمة موظف</h1><p className="mt-1 text-sm">إدارة طلبات نهاية الخدمة وتسوية المستحقات</p></div><Link to="/" className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-border bg-card px-6 text-sm font-bold">رجوع<ArrowRight className="rotate-180" size={17}/></Link></div>

    <section className="panel mt-3 overflow-x-auto p-4"><ol className="flex min-w-[860px]">{steps.map(([t,s],i)=>{const done=i<stage||i===8&&stage>=8, act=i===stage;return <li key={t} className="relative flex flex-1 flex-col items-center text-center">{i<8&&<span className="absolute top-4 left-0 right-1/2 -translate-x-[-0px] border-t border-dashed border-border" style={{left:"-50%",right:"50%"}}/>}<span className={`relative z-10 grid size-8 place-items-center rounded-full text-sm font-bold ${act?"bg-primary text-primary-foreground":done||i===8?"bg-muted-foreground/60 text-primary-foreground":"bg-muted-foreground/50 text-primary-foreground"}`}>{i===8?<Check size={16}/>:i+1}</span><b className={`mt-2 text-xs ${act?"text-primary":""}`}>{t}</b><small className="mt-1 text-[10px] text-muted-foreground">{act?(s??"قيد الإجراء"):i<stage?"مكتمل":"في الانتظار"}</small></li>})}</ol></section>
    {msg&&<p className="mt-3 rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <div className="mt-3 grid gap-3 xl:grid-cols-[230px_minmax(0,1fr)_350px]">
      <div className="grid content-start gap-3">
        <Card title="الطلبات ذات الصلة" icon={<FileText/>}><div className="grid gap-2">{[["طلب إجازة",<CalendarRange key="a"/>],["طلب نقل",<ArrowLeftRight key="b"/>],["طلب ترقية",<BarChart3 key="c"/>],["طلب نهاية خدمة",<FileText key="d"/>]].map(([t,ic],i)=><button key={t as string} className={`flex h-10 items-center justify-between rounded-md border px-3 text-sm font-bold ${i===3?"border-primary/20 bg-primary-soft text-brand-deep":"border-border"}`}>{t}<span className="text-primary [&_svg]:size-4">{ic}</span></button>)}</div></Card>
        <Card title="مستندات مطلوبة" icon={<Calculator/>}><div className="grid gap-2">{["خطاب الاستقالة","إخلاء طرف من جميع الإدارات","تسليم العهد والأصول","إثباتات أخرى إن وجدت"].map((t,i)=><label key={t} className="flex h-10 cursor-pointer items-center justify-between rounded-md border border-border px-3 text-xs">{t}<input type="checkbox" checked={docs[i]} onChange={()=>setDocs(d=>d.map((v,j)=>j===i?!v:v))} className="size-4 accent-[var(--success)]"/></label>)}</div></Card>
        <section className="rounded-lg bg-primary-soft p-4"><h2 className="mb-3 flex items-center gap-2 font-extrabold text-brand-deep"><Info className="text-primary" size={18}/>ملاحظات هامة</h2><ul className="grid list-disc gap-2 pr-4 text-[11px] leading-5 marker:text-primary">{["يتم احتساب مكافأة نهاية الخدمة حسب نظام العمل السعودي.","يجب إكمال إجراءات إخلاء الطرف قبل الصرف.","بعد اعتماد الطلب لا يمكن التعديل.","سيتم إشعار الموظف بكل خطوة عبر البريد الإلكتروني."].map(t=><li key={t}>{t}</li>)}</ul></section>
      </div>

      <div className="grid min-w-0 content-start gap-3">
        <Card title="بيانات الموظف" icon={<UserRound/>}><div className="grid gap-4 md:grid-cols-[1fr_1fr_170px] md:items-center">
          <dl className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-2 text-xs">{[["الرقم الوظيفي","EMP-00125"],["تاريخ التعيين","2020/01/15"],["مدة الخدمة","5 سنوات 8 أشهر"],["الراتب الأساسي","8,000 ريال"],["الراتب الإجمالي","9,500 ريال"]].map(([k,v])=><Fragment key={k}><dt>{k}</dt><span>:</span><dd className="font-bold">{v}</dd></Fragment>)}</dl>
          <dl className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-2 text-xs md:border-r md:border-border md:pr-4">{[["القسم","تقنية المعلومات"],["الوظيفة","أخصائي نظم"],["المدير المباشر","فهد العتيبي"]].map(([k,v])=><Fragment key={k}><dt>{k}</dt><span>:</span><dd>{v}</dd></Fragment>)}</dl>
          <div className="text-center"><img src={ahmed} alt="أحمد محمد السبيعي" className="mx-auto size-20 rounded-full object-cover"/><b className="mt-2 block text-lg text-brand-deep">أحمد محمد السبيعي</b><small>EMP-00125</small></div>
        </div></Card>
        <Card title="بيانات نهاية الخدمة" icon={<FileText/>}><div className="grid gap-3 md:grid-cols-3">
          {[["نوع انتهاء الخدمة",["الاستقالة","إنهاء عقد","تقاعد"]],["سبب إنهاء الخدمة",["ظروف خاصة","فرصة أفضل","أخرى"]]].map(([l,o])=><label key={l as string} className="grid gap-1.5 text-xs font-bold"><span><span className="text-destructive">* </span>{l as string}</span><div className="relative"><select className={`${input} appearance-none`}>{(o as string[]).map(x=><option key={x}>{x}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute left-3 top-3"/></div></label>)}
          <label className="grid gap-1.5 text-xs font-bold"><span><span className="text-destructive">* </span>تاريخ تقديم الطلب</span><input type="date" defaultValue="2025-09-01" className={input}/></label>
          <label className="grid gap-1.5 text-xs font-bold"><span><span className="text-destructive">* </span>آخر يوم عمل</span><input type="date" defaultValue="2025-09-30" className={input}/></label>
          <label className="grid gap-1.5 text-xs font-bold md:col-span-3">ملاحظات<textarea maxLength={500} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="أدخل أي ملاحظات إضافية ..." className="h-14 resize-none rounded-md border border-input bg-background p-3 text-sm outline-none"/><small className="text-left font-normal text-muted-foreground">{notes.length}/500</small></label>
          <div className="md:col-span-3"><b className="mb-2 flex items-center gap-2 text-xs">المرفقات<Paperclip size={15} className="text-primary"/></b><label className="grid cursor-pointer place-items-center rounded-md border border-dashed border-primary/40 bg-primary-soft/40 p-4 text-center text-sm text-muted-foreground"><input type="file" multiple accept=".pdf,.jpg,.png" className="hidden" onChange={e=>setFiles(Array.from(e.target.files??[]).map(f=>f.name))}/>اسحب الملفات هنا أو اضغط للاختيار<small className="mt-1 text-[10px]">(PDF, JPG, PNG) الحد الأقصى 10 ميجابايت</small>{files.length>0&&<small className="mt-2 font-bold text-primary">{files.join("، ")}</small>}</label></div>
        </div></Card>
        <Card title="ملاحظات الموارد البشرية" icon={<FileText/>}><input placeholder="أدخل ملاحظات الموارد البشرية ..." className={input}/><div className="mt-3 grid grid-cols-[2fr_1.5fr_1fr] gap-2"><button onClick={()=>{setStage(1);setMsg("تم إرسال الطلب بنجاح وانتقل إلى مرحلة اعتماد المدير.")}} className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-primary-foreground">إرسال الطلب<Send size={17}/></button><button onClick={()=>setMsg("تم حفظ الطلب كمسودة.")} className="flex h-11 items-center justify-center gap-2 rounded-md border border-border text-sm">حفظ كمسودة<Save size={17}/></button><button onClick={()=>{setStage(0);setMsg("")}} className="h-11 rounded-md border border-border text-sm font-bold">إلغاء</button></div></Card>
      </div>

      <div className="grid content-start gap-3">
        <Card title="ملخص المستحقات" icon={<Calculator/>}><div className="text-sm">
          {earnings.map(([k,v])=><div key={k} className="flex justify-between border-b border-border py-2"><span>{k}</span><b>{fmt(v)} <small className="font-normal">ريال</small></b></div>)}
          <div className="my-1 flex justify-between rounded-md bg-success-soft p-2 font-extrabold text-success"><span>إجمالي المستحقات</span><span>{fmt(totE)} ريال</span></div>
          {deductions.map(([k,v])=><div key={k} className="flex justify-between border-b border-border py-2"><span>{k}</span><b className="text-destructive">{fmt(v)} <small className="font-normal">ريال</small></b></div>)}
          <div className="my-1 flex justify-between rounded-md bg-destructive/10 p-2 font-extrabold text-destructive"><span>إجمالي الخصومات</span><span>{fmt(totD)} ريال</span></div>
          <div className="mt-2 flex justify-between rounded-md bg-success-soft p-3 text-lg font-extrabold"><span className="text-sm">صافي المستحق للموظف</span><span className="text-success">{fmt(totE-totD)} ريال</span></div>
        </div></Card>
        <Card title="حالة إخلاء الطرف" icon={<FileText/>}><div className="text-xs">{clearance.map(([k,v])=>{const pending=v==="قيد الإجراء";return <div key={k} className="flex items-center justify-between border-b border-border py-2"><span className="flex items-center gap-2">{pending?<Clock size={16} className="text-muted-foreground"/>:<Check size={16} className="rounded-full bg-success p-0.5 text-primary-foreground"/>}{k}</span><span className={pending?"text-muted-foreground":"text-success"}>{v}</span></div>})}</div></Card>
      </div>
    </div>
  </div></main></AppShell>;
}
