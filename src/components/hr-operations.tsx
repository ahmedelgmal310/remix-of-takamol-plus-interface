import { useState, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown,
  CircleUserRound, Clock3, FileText, Fingerprint, IdCard, Mail, MapPin,
  Paperclip, Search, Send, ShieldCheck, UserRoundPlus, Users, WalletCards,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { attendanceLog, employeeProfileFields, requestTrackingRows } from "@/data/mockData";
import employeeImage from "@/assets/candidate-ahmed.jpg";

export type HrOperation = "attendance" | "permission" | "leave" | "new-employee" | "requests" | "profile";

const pages = {
  attendance: ["البصمة وتسجيل الحضور والانصراف", "تسجيل الحضور والانصراف عبر جهاز البصمة أو من خلال التطبيق."],
  permission: ["الاستئذان", "يمكن للموظف تسجيل استئذان سريع لوقت قصير مع تحديد الوقت والسبب."],
  leave: ["طلب إجازة", "يمكن للموظف تقديم طلب إجازة بسهولة مع تحديد التاريخ ونوع الإجازة والسبب."],
  "new-employee": ["تسجيل موظف جديد", "إدخال جميع بيانات الموظف وتحديد القسم والوظيفة والمسمى الوظيفي."],
  requests: ["متابعة الطلبات والموافقات", "يمكن متابعة جميع الطلبات من مكان واحد ومعرفة حالتها وإجراءاتها."],
  profile: ["ملف الموظف الشامل", "جميع بيانات الموظف في صفحة واحدة (شخصية - وظيفية - مالية - اجتماعية)."],
} as const;

export function HrOperationsPage({ page }: { page: HrOperation }) {
  const [title, description] = pages[page];
  return <AppShell><main className="p-3 sm:p-5 lg:px-6 lg:py-4" dir="rtl"><div className="mx-auto max-w-[1120px]">
    {page !== "profile" && <><div className="mb-2 flex items-center gap-2 text-[9px] text-muted-foreground"><span>الموارد البشرية</span><span>/</span><span>{title}</span></div><header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"><div className="min-w-0"><h1 className="truncate text-lg font-extrabold">{title}</h1><p className="mt-1 text-[9px] text-muted-foreground">{description}</p></div><Button variant="outline" size="sm"><ArrowRight/>رجوع</Button></header></>}
    <div className={page === "profile" ? "" : "mt-4"}>{page === "attendance" ? <Attendance/> : page === "permission" ? <Permission/> : page === "leave" ? <Leave/> : page === "new-employee" ? <NewEmployee/> : page === "requests" ? <Requests/> : <Profile/>}</div>
  </div></main></AppShell>;
}

function Attendance() {
  const [checked, setChecked] = useState(false);
  const metrics = [
    { label: "إجمالي أيام هذا الشهر", value: "22", tone: "success" },
    { label: "أيام الغياب", value: "0", tone: "destructive" },
    { label: "أيام التأخير", value: "2", tone: "warning" },
    { label: "أيام الاستئذان", value: "1", tone: "warning" },
  ] as const;
  return <><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_310px]"><section className="panel overflow-hidden"><PanelTitle>سجل الحضور والانصراف</PanelTitle><div className="divide-y divide-border">{attendanceLog.map(([kind,date,time]) => <div key={`${kind}-${date}`} className="grid grid-cols-[100px_minmax(0,1fr)_auto] items-center gap-3 p-3 text-[9px]"><span className={`grid h-7 w-7 place-items-center rounded-full ${kind === "الحضور" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{kind === "الحضور" ? <Check size={14}/> : <ArrowLeft size={14}/>}</span><div><b className="block">{kind}</b><span className="text-muted-foreground">{date}</span></div><b>{time}</b></div>)}</div></section><section className="panel grid min-h-[330px] place-content-center p-5 text-center"><span className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-success-soft text-success ring-8 ring-success/10"><Fingerprint size={72}/></span><h2 className="mt-5 text-lg font-extrabold">مرحباً أحمد</h2><p className="mt-1 text-[9px] text-muted-foreground">سجل بصمتك الآن</p><Button className="mx-auto mt-5 bg-success" onClick={() => setChecked(true)}><Check/>{checked ? "تم تسجيل الحضور" : "تسجيل الحضور"}</Button><p className="mt-4 text-2xl font-extrabold">08:13 ص</p><p className="text-[9px] text-muted-foreground">الأحد 20 سبتمبر 2025</p></section></div><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((item)=><Metric key={item.label} {...item}/>)}</div></>;
}

function Permission() {
  return <section className="panel mx-auto max-w-3xl overflow-hidden"><PanelTitle>طلب استئذان جديد</PanelTitle><div className="grid gap-4 p-4 md:grid-cols-[220px_minmax(0,1fr)]"><aside className="grid min-h-[250px] place-content-center rounded-md bg-search p-4 text-center"><Clock3 className="mx-auto text-primary" size={64}/><b className="mt-4">استئذان سريع</b><p className="mt-2 text-[9px] text-muted-foreground">إذن قصير بخطوات بسيطة</p></aside><div className="grid gap-3"><Field label="الوقت"><div className="grid grid-cols-2 gap-2"><Input value="من 09:30 ص" icon={<Clock3/>}/><Input value="إلى 10:00 ص" icon={<Clock3/>}/></div></Field><Field label="السبب"><Select value="مراجعة شخصية"/></Field><Field label="ملاحظات (اختياري)"><textarea className="h-24 resize-none rounded-md border border-input bg-background p-3 text-[10px] outline-none" placeholder="يرجى التوضيح"/></Field><div className="flex justify-end gap-2"><Button variant="outline">إلغاء</Button><Button><Send/>إرسال الطلب</Button></div></div></div></section>;
}

function Leave() {
  const days = Array.from({length:35},(_,i)=>i<2||i>31?"":String(i-1));
  return <section className="panel overflow-hidden"><PanelTitle>طلب إجازة جديد</PanelTitle><div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_330px]"><div className="grid content-start gap-3 sm:grid-cols-2"><Field label="نوع الإجازة"><Select value="إجازة سنوية"/></Field><Field label="تاريخ البداية"><Input value="2025/09/20" icon={<CalendarDays/>}/></Field><Field label="تاريخ النهاية"><Input value="2025/09/24" icon={<CalendarDays/>}/></Field><Field label="عدد الأيام"><Select value="5 أيام"/></Field><div className="sm:col-span-2"><Field label="سبب الإجازة"><Input value="زيارة عائلية"/></Field></div><div className="sm:col-span-2"><Field label="إرفاق مستند (اختياري)"><Button variant="outline" className="w-full"><Paperclip/>إرفاق ملف</Button></Field></div><div className="sm:col-span-2 flex justify-end gap-2"><Button variant="outline">إلغاء</Button><Button><Send/>إرسال الطلب</Button></div></div><aside><div className="rounded-md border border-border p-3"><div className="flex items-center justify-between"><Button variant="ghost" size="icon"><ArrowRight/></Button><b className="text-xs">سبتمبر 2025</b><Button variant="ghost" size="icon"><ArrowLeft/></Button></div><div className="mt-3 grid grid-cols-7 text-center text-[8px] text-muted-foreground">{["ح","ن","ث","ر","خ","ج","س"].map(x=><span key={x}>{x}</span>)}{days.map((d,i)=><span key={i} className={`mt-2 grid h-7 place-items-center rounded ${[20,21,22,23,24].includes(Number(d))?"bg-primary text-primary-foreground":""}`}>{d}</span>)}</div></div><div className="mt-3 rounded-md bg-search p-4 text-[9px]"><CalendarDays className="mb-2 text-primary"/><p>رصيدك المتبقي من الإجازات</p><b className="mt-1 block text-primary">15 يوم عمل</b></div></aside></div></section>;
}

function NewEmployee() {
  return <><Steps/><section className="panel mt-3 overflow-hidden"><PanelTitle>البيانات الأساسية</PanelTitle><div className="grid gap-5 p-4 md:grid-cols-[200px_minmax(0,1fr)]"><aside className="grid min-h-[260px] place-content-center rounded-md bg-search text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary"><UserRoundPlus size={44}/></span><b className="mt-4">موظف جديد</b><p className="mt-2 text-[8px] text-muted-foreground">أدخل بيانات الموظف للمتابعة</p></aside><div className="grid gap-3 sm:grid-cols-2"><Field label="رقم الموظف"><Input value="EMP-1025"/></Field><Field label="الاسم الكامل"><Input value="محمد عبدالله الحربي"/></Field><Field label="البريد الإلكتروني"><Input value="m.alharbi@company.com"/></Field><Field label="رقم الجوال"><Input value="0501234567"/></Field><Field label="الهوية الوطنية"><Input value="1122334455"/></Field><Field label="الجنسية"><Select value="سعودي"/></Field><Field label="المدينة"><Select value="الرياض"/></Field><Field label="تاريخ الميلاد"><Input value="1995/05/15" icon={<CalendarDays/>}/></Field><div className="sm:col-span-2 flex justify-between"><Button variant="outline"><SaveIcon/>حفظ كمسودة</Button><Button>التالي<ArrowLeft/></Button></div></div></div></section></>;
}

function Requests() {
  const [filter,setFilter]=useState("الكل");
  const filters=["الكل","الإجازات","الاستئذان","طلبات أخرى"];
  return <section className="panel overflow-hidden"><div className="border-b border-border p-3"><div className="flex gap-4 overflow-x-auto">{filters.map(x=><Button key={x} variant="ghost" size="sm" onClick={()=>setFilter(x)} className={filter===x?"border-b-2 border-primary text-primary":""}>{x}</Button>)}</div></div><div className="grid gap-2 border-b border-border p-3 sm:grid-cols-[minmax(0,1fr)_150px]"><label className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14}/><input className="h-9 w-full rounded-md border border-input bg-background pr-9 text-[10px]" placeholder="ابحث في الطلبات"/></label><Select value="جميع الحالات"/></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-[9px]"><thead className="bg-search"><tr>{["النوع","التاريخ","الموظف","الحالة","الإجراء"].map(x=><th key={x} className="p-3 text-right">{x}</th>)}</tr></thead><tbody className="divide-y divide-border">{requestTrackingRows.map(row=><tr key={`${row[0]}-${row[1]}`}>{row.map((x,i)=><td key={i} className="p-3">{i===3?<Status value={x}/>:i===4?<Button size="sm">{x}</Button>:x}</td>)}</tr>)}</tbody></table></div></section>;
}

function Profile() {
  return <><section className="panel overflow-hidden"><div className="flex flex-col items-center border-b border-border bg-search p-5 text-center sm:flex-row sm:text-right"><img src={employeeImage} alt="محمد عبدالله الحربي" className="h-20 w-20 rounded-full border-2 border-card object-cover shadow"/><div className="mt-3 min-w-0 flex-1 sm:mr-4 sm:mt-0"><h1 className="text-lg font-extrabold">محمد عبدالله الحربي</h1><p className="text-[9px] text-muted-foreground">موظف موارد بشرية · رقم الموظف 1025</p><Status value="فعال"/></div><Button variant="outline" size="sm">تعديل البيانات</Button></div><div className="flex gap-5 overflow-x-auto border-b border-border px-4 text-[9px] font-bold">{["البيانات الشخصية","البيانات الوظيفية","البيانات المالية","الاجتماعية"].map((x,i)=><span key={x} className={`shrink-0 py-3 ${i===1?"border-b-2 border-primary text-primary":""}`}>{x}</span>)}</div><div className="grid gap-x-10 gap-y-1 p-5 sm:grid-cols-2">{employeeProfileFields.map(([k,v],i)=><div key={k} className="grid grid-cols-[120px_minmax(0,1fr)] items-center border-b border-border py-3 text-[9px]"><span className="flex items-center gap-2 text-muted-foreground">{i%4===0?<IdCard size={14}/>:i%4===1?<BriefcaseBusiness size={14}/>:i%4===2?<Users size={14}/>:<CalendarDays size={14}/>} {k}</span><b>{v}</b></div>)}</div></section></>;
}

function Steps(){return <div className="panel px-4 py-3"><div className="grid grid-cols-4">{["البيانات الأساسية","بيانات وظيفية","بيانات مالية","المرفقات"].map((x,i)=><div key={x} className="relative flex flex-col items-center after:absolute after:right-1/2 after:top-3 after:-z-0 after:h-px after:w-full after:bg-border last:after:hidden"><span className={`z-10 grid h-6 w-6 place-items-center rounded-full text-[9px] ${i===0?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{i+1}</span><b className={`z-10 mt-2 bg-card px-2 text-[8px] ${i===0?"text-primary":"text-muted-foreground"}`}>{x}</b></div>)}</div></div>}
function PanelTitle({children}:{children:ReactNode}){return <h2 className="border-b border-border px-4 py-3 text-xs font-extrabold">{children}</h2>}
function Field({label,children}:{label:string;children:ReactNode}){return <label className="grid gap-1 text-[9px] font-bold text-muted-foreground"><span>{label}</span>{children}</label>}
function Input({value,icon}:{value:string;icon?:ReactNode}){return <div className="grid h-9 grid-cols-[minmax(0,1fr)_auto] items-center rounded-md border border-input bg-background px-3 text-[10px] font-bold text-foreground"><span className="truncate">{value}</span><span className="text-muted-foreground [&_svg]:size-4">{icon}</span></div>}
function Select({value}:{value:string}){return <div className="grid h-9 grid-cols-[minmax(0,1fr)_auto] items-center rounded-md border border-input bg-background px-3 text-[10px] font-bold text-foreground"><span>{value}</span><ChevronDown size={14}/></div>}
function Status({value}:{value:string}){const bad=value.includes("مرفوض");const wait=value.includes("بانتظار");return <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-bold ${bad?"bg-destructive/10 text-destructive":wait?"bg-warning-soft text-warning":"bg-success-soft text-success"}`}>{value}</span>}
function Metric({label,value,tone}:{label:string;value:string;tone:string}){return <div className="panel p-4 text-center"><p className="text-[9px] text-muted-foreground">{label}</p><b className={`mt-2 block text-xl ${tone==="success"?"text-success":tone==="destructive"?"text-destructive":"text-warning"}`}>{value}</b></div>}
function SaveIcon(){return <FileText/>}