import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Barcode, Box, Building2, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock, CloudUpload, Download, Eye, FileText, Home, ListChecks, Package, PencilLine, Plus, Save, Search, Undo2, UserRound, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Status = "active" | "returned" | "late";
type Item = { no: string; emp: string; dept: string; asset: string; type: string; qty: number; date: string; status: Status };
const seed: Item[] = [
  ["AST-2025-0045","أحمد السبيعي","تقنية المعلومات","لابتوب Dell","أجهزة","2025/09/10","active"],
  ["AST-2025-0044","سارة العنزي","الموارد البشرية","هاتف iPhone","أجهزة","2025/09/08","active"],
  ["AST-2025-0043","محمد الشهري","المبيعات","جهاز لوحي iPad","أجهزة","2025/09/05","active"],
  ["AST-2025-0042","نورة القحطاني","المالية","بطاقة دخول","بطاقات","2025/08/28","returned"],
  ["AST-2025-0041","خالد المطيري","الإدارة التنفيذية","لابتوب HP","أجهزة","2025/08/20","active"],
  ["AST-2025-0040","ريم الحربي","خدمة العملاء","سماعة رأس","ملحقات","2025/08/15","late"],
  ["AST-2025-0039","عبدالله العتيبي","تقنية المعلومات","شاشة عرض","أجهزة","2025/08/12","active"],
  ["AST-2025-0038","منى السالم","الموارد البشرية","كرسي مكتب","أثاث","2025/08/10","returned"],
  ["AST-2025-0037","فيصل الرويلي","المشتريات","جهاز طابعة","أجهزة","2025/08/05","active"],
  ["AST-2025-0036","لطيفة الزهراني","المالية","حاسب مكتبي","أجهزة","2025/08/01","late"],
].map(([no,emp,dept,asset,type,date,status])=>({no,emp,dept,asset,type,qty:1,date,status:status as Status}));
const st = { active:["سارية","bg-success-soft text-success"], returned:["مرجعة","bg-primary-soft text-primary"], late:["متأخرة","bg-destructive/10 text-destructive"] } as const;
const employees = [["أحمد السبيعي","تقنية المعلومات"],["سارة العنزي","الموارد البشرية"],["محمد الشهري","المبيعات"],["نورة القحطاني","المالية"],["خالد المطيري","الإدارة التنفيذية"]];
const assetsByType: Record<string,string[]> = { "أجهزة":["لابتوب Dell","لابتوب HP","هاتف iPhone","جهاز لوحي iPad","شاشة عرض"], "ملحقات":["سماعة رأس","لوحة مفاتيح"], "أثاث":["كرسي مكتب","مكتب"], "بطاقات":["بطاقة دخول"] };
const box = "flex h-10 w-full items-center rounded-md border border-input bg-background text-xs";

function Stats() {
  const c = [
    { t:"عهد متأخرة الإرجاع", v:"12", p:"20%", up:true, bad:true, icon:<AlertTriangle/>, card:"bg-destructive/5 border-destructive/20", ic:"bg-destructive/10 text-destructive" },
    { t:"عهد مؤقتة", v:"28", p:"5%", up:false, bad:true, icon:<Clock/>, card:"bg-warning-soft/60 border-warning/20", ic:"bg-warning-soft text-warning" },
    { t:"الموظفين المستلمين", v:"312", p:"8%", up:true, icon:<Users/>, card:"bg-card", ic:"bg-primary-soft text-primary" },
    { t:"إجمالي العهد", v:"428", p:"12%", up:true, icon:<Package/>, card:"bg-card", ic:"bg-success-soft text-success" },
  ];
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{c.map(x=><div key={x.t} className={`panel border p-4 ${x.card}`}><div className="flex items-start justify-between"><div><p className="text-xs font-bold">{x.t}</p><b className="mt-2 block text-2xl text-brand-deep">{x.v}</b></div><span className={`grid size-11 place-items-center rounded-lg [&_svg]:size-6 ${x.ic}`}>{x.icon}</span></div><div className="mt-2 flex items-center justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر الماضي</span><b className={`flex items-center ${x.bad?"text-destructive":"text-success"}`}>{x.up?<ArrowUp size={14}/>:<ArrowDown size={14}/>}{x.p}</b></div></div>)}</div>;
}

function Field({label,req,icon,children}:{label:string;req?:boolean;icon:ReactNode;children:ReactNode}){return <label className="grid gap-1.5 text-xs font-bold"><span>{req&&<span className="text-destructive">* </span>}{label}</span><div className={box}><span className="grid h-full w-10 shrink-0 place-items-center border-l border-input text-brand-deep [&_svg]:size-4">{icon}</span>{children}</div></label>}
const sel = "h-full w-full bg-transparent px-2 outline-none";

function NewCustody({onSave}:{onSave:(i:Item)=>void}) {
  const [emp,setEmp]=useState(""); const [type,setType]=useState(""); const [asset,setAsset]=useState(""); const [qty,setQty]=useState(1); const [serial,setSerial]=useState(""); const [date,setDate]=useState("2025-09-30"); const [temp,setTemp]=useState(false); const [notes,setNotes]=useState("");
  const dept = employees.find(e=>e[0]===emp)?.[1] ?? "";
  const reset=()=>{setEmp("");setType("");setAsset("");setQty(1);setSerial("");setNotes("");setTemp(false)};
  const ok = emp && type && asset && qty>0;
  return <section className="panel p-4"><h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-brand-deep"><Box className="text-primary"/>تسجيل عهدة جديدة</h2><div className="grid gap-3">
    <Field label="الموظف" req icon={<UserRound/>}><select value={emp} onChange={e=>setEmp(e.target.value)} className={sel}><option value="">اختر الموظف</option>{employees.map(e=><option key={e[0]}>{e[0]}</option>)}</select></Field>
    <Field label="القسم" icon={<Building2/>}><input readOnly value={dept} placeholder="اختر القسم" className={sel}/></Field>
    <Field label="نوع الأصل" req icon={<Box/>}><select value={type} onChange={e=>{setType(e.target.value);setAsset("")}} className={sel}><option value="">اختر نوع الأصل</option>{Object.keys(assetsByType).map(t=><option key={t}>{t}</option>)}</select></Field>
    <Field label="العهدة / الأصل" req icon={<ListChecks/>}><select value={asset} onChange={e=>setAsset(e.target.value)} className={sel}><option value="">اختر الأصل</option>{(assetsByType[type]??[]).map(a=><option key={a}>{a}</option>)}</select></Field>
    <Field label="الكمية" req icon={<Package/>}><input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} className={sel}/></Field>
    <Field label="الرقم التسلسلي" icon={<Barcode/>}><input value={serial} onChange={e=>setSerial(e.target.value)} placeholder="أدخل الرقم التسلسلي (إن وجد)" className={sel}/></Field>
    <div className="grid gap-1.5 text-xs font-bold"><span><span className="text-destructive">* </span>تاريخ التسليم</span><div className="grid grid-cols-2 gap-2"><button type="button" onClick={()=>setTemp(!temp)} className={`flex h-10 items-center justify-center gap-2 rounded-md border ${temp?"border-primary bg-primary-soft text-primary":"border-input"}`}><CalendarDays size={16}/>بتاريخ مؤقت</button><div className={box}><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={sel}/></div></div></div>
    <label className="grid gap-1.5 text-xs font-bold">ملاحظات<div className="flex rounded-md border border-input bg-background"><span className="grid w-10 shrink-0 place-items-start justify-center border-l border-input pt-3 text-brand-deep"><FileText size={16}/></span><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="أدخل أي ملاحظات إضافية ..." className="h-20 w-full resize-none bg-transparent p-2 text-xs outline-none"/></div></label>
    <div className="mt-2 grid grid-cols-2 gap-3"><button disabled={!ok} onClick={()=>{onSave({no:"",emp,dept,asset,type,qty,date:date.replaceAll("-","/"),status:"active"});reset()}} className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50"><Save size={17}/>حفظ العهدة</button><button onClick={reset} className="h-11 rounded-md border border-border text-sm font-bold">إلغاء</button></div>
  </div></section>;
}

export function CustodyPage() {
  const [items,setItems]=useState(seed); const [q,setQ]=useState(""); const [dept,setDept]=useState(""); const [status,setStatus]=useState(""); const [type,setType]=useState(""); const [page,setPage]=useState(1);
  const list = useMemo(()=>items.filter(i=>(!q||i.emp.includes(q)||i.no.includes(q)||i.asset.includes(q))&&(!dept||i.dept===dept)&&(!status||i.status===status)&&(!type||i.type===type)),[items,q,dept,status,type]);
  const add=(i:Item)=>setItems(p=>[{...i,no:`AST-2025-${String(46+p.length-seed.length).padStart(4,"0")}`},...p]);
  const filt = "relative h-10 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm font-bold";
  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1300px]">
    <nav className="flex items-center gap-2 text-xs text-primary"><Home size={14}/>الموارد الإدارية<ChevronLeft size={12}/>العهد<ChevronLeft size={12}/>العهد للموظفين</nav>
    <header className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div><h1 className="flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><Box className="text-primary"/>العهد للموظفين</h1><p className="mt-1 text-sm">إدارة جميع العهد والأصول المسلمة للموظفين ومتابعة حالتها</p></div><div className="grid grid-cols-3 gap-2"><a href="#new-custody" className="flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground"><Plus size={18}/>تسجيل عهدة جديدة</a><button className="flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-bold">تصدير<Download size={18}/></button><button className="flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-bold">استيراد<CloudUpload size={18}/></button></div></header>
    <div className="mt-4 grid gap-3 xl:grid-cols-[310px_minmax(0,1fr)]">
      <div id="new-custody"><NewCustody onSave={add}/></div>
      <div className="grid min-w-0 content-start gap-3">
        <Stats/>
        <section className="panel grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
          <div className="relative"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="البحث ..." className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm"/><Search size={17} className="absolute left-3 top-2.5 text-brand-deep"/></div>
          {[["القسم",dept,setDept,[...new Set(seed.map(i=>i.dept))].map(d=>[d,d])],["حالة العهدة",status,setStatus,Object.entries(st).map(([k,v])=>[k,v[0]])],["نوع الأصل",type,setType,Object.keys(assetsByType).map(t=>[t,t])]].map(([l,v,s,opts])=><label key={l as string} className="grid gap-1 text-xs"><span>{l as string}</span><div className="relative"><select value={v as string} onChange={e=>{(s as (x:string)=>void)(e.target.value);setPage(1)}} className={filt}><option value="">الكل</option>{(opts as string[][]).map(([k,t])=><option key={k} value={k}>{t}</option>)}</select><ChevronDown size={15} className="pointer-events-none absolute left-3 top-3"/></div></label>)}
          <label className="grid gap-1 text-xs"><span>تاريخ التسليم</span><div className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-2 text-[10px]"><CalendarDays size={15} className="text-brand-deep"/>من 2025/09/01 إلى 2025/09/30</div></label>
        </section>
        <section className="panel p-4"><h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-brand-deep"><FileText className="text-primary"/>قائمة العهد</h2>
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-xs"><thead className="bg-search"><tr><th className="p-2"><input type="checkbox"/></th>{["#","رقم العهدة","اسم الموظف","القسم","العهدة / الأصل","الكمية","تاريخ التسليم","حالة العهدة","إجراء"].map(h=><th key={h} className="p-2 text-center font-bold">{h}</th>)}</tr></thead>
            <tbody>{list.slice(0,10).map((i,n)=><tr key={i.no} className="border-b border-border text-center"><td className="p-2"><input type="checkbox"/></td><td className="p-2">{n+1}</td><td className="p-2">{i.no}</td><td className="p-2">{i.emp}</td><td className="p-2">{i.dept}</td><td className="p-2">{i.asset}</td><td className="p-2">{i.qty}</td><td className="p-2">{i.date}</td><td className="p-2"><span className={`inline-block min-w-16 rounded px-3 py-1 ${st[i.status][1]}`}>{st[i.status][0]}</span></td><td className="p-2"><div className="flex justify-center gap-2 text-primary"><button aria-label="إرجاع" onClick={()=>setItems(p=>p.map(x=>x.no===i.no?{...x,status:"returned"}:x))}><Undo2 size={15}/></button><button aria-label="تعديل"><PencilLine size={15}/></button><button aria-label="عرض"><Eye size={15}/></button></div></td></tr>)}{!list.length&&<tr><td colSpan={10} className="p-8 text-center text-muted-foreground">لا توجد عهد مطابقة للبحث</td></tr>}</tbody></table></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><span>عرض <b className="mx-2">10</b> من {428 + items.length - seed.length} سجل</span><div className="flex gap-2"><button onClick={()=>setPage(Math.max(1,page-1))} className="grid size-9 place-items-center rounded-md border border-border"><ChevronRight size={16}/></button>{[1,2,3,4,5].map(p=><button key={p} onClick={()=>setPage(p)} className={`size-9 rounded-md border ${p===page?"border-primary bg-primary text-primary-foreground":"border-border"}`}>{p}</button>)}<span className="px-1">...</span><button onClick={()=>setPage(page+1)} className="grid size-9 place-items-center rounded-md border border-border"><ChevronLeft size={16}/></button></div></div>
        </section>
      </div>
    </div>
  </div></main></AppShell>;
}
