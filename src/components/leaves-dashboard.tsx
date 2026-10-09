import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlarmClock, CalendarDays, Check, ChevronDown, Eye, FileText, MoreVertical, Palmtree, Plus, Search, Stethoscope, Trash2, Wallet, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { leaveReferenceRows } from "@/data/mockData";

const panel="rounded-lg border border-border bg-card shadow-sm";
const months=[18,22,16,20,14,11,10,6,8,12,20,10];
const monthNames=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const statusClass=(s:string)=>s.includes("موافق")?"bg-success-soft text-success":s.includes("مرفوض")?"bg-destructive/10 text-destructive":s.includes("ملغاة")?"bg-muted text-muted-foreground":"bg-warning-soft text-warning";
const field="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs";

export function LeavesDashboard(){
 const [q,setQ]=useState(""); const [status,setStatus]=useState(""); const [type,setType]=useState("");
 const rows=useMemo(()=>leaveReferenceRows.filter(r=>(!q||r[1].includes(q)||r[0].includes(q))&&(!status||r[7]===status)&&(!type||r[3]===type)),[q,status,type]);
 const stats=[["إجمالي أيام الإجازات","210","هذا العام",CalendarDays,"bg-primary-soft text-primary","text-muted-foreground"],["مرفوضة","5","هذا العام",X,"bg-destructive/10 text-destructive","text-destructive"],["موافق عليها","48","هذا العام",Check,"bg-success-soft text-success","text-success"],["طلبات الإجازة","12","بانتظار الموافقة",FileText,"bg-warning-soft text-warning","text-warning"]] as const;
 return <AppShell><main dir="rtl" className="min-w-0 p-3 sm:p-5"><div className="mx-auto max-w-[1450px]">
  <p className="text-xs text-muted-foreground">الرئيسية　›　الموظفين　›　<b className="text-foreground">الإجازات</b></p>
  <h1 className="mt-2 flex items-center gap-2 text-xl font-black text-buy-navy"><CalendarDays className="text-primary"/>الإجازات</h1>
  <section className="mt-3 grid items-center gap-3 sm:grid-cols-2 xl:grid-cols-[230px_repeat(4,1fr)]">
   <Link to="/leaves/new" className="flex h-12 items-center justify-center gap-2 rounded-md bg-buy-navy text-sm font-bold text-primary-foreground"><Plus className="size-4"/>طلب إجازة جديدة</Link>
   {stats.map(([l,v,s,Icon,t,st])=><div key={l} className={`${panel} flex items-center justify-between p-4`}><div><b className="text-2xl font-black">{v}</b><p className="mt-1 text-sm font-bold">{l}</p><span className={`text-xs ${st}`}>{s}</span></div><span className={`grid size-14 place-items-center rounded-full ${t}`}><Icon/></span></div>)}
  </section>
  <section className="mt-4 grid gap-3 xl:grid-cols-[1fr_1.2fr_1fr]">
   <div className={`${panel} p-4`}><div className="flex items-center justify-between"><h2 className="font-black">أرصدة الإجازات للموظف</h2><span className={field}>2026<ChevronDown className="size-4"/></span></div>{[[Palmtree,"الإجازة السنوية","20 من 30 يوم",67,"bg-primary"],[Stethoscope,"إجازة مرضية","5 من 10 يوم",50,"bg-success"],[AlarmClock,"إجازة طارئة","3 من 5 يوم",60,"bg-warning"],[Wallet,"إجازة بدون راتب","0 من 90 يوم",0,"bg-muted-foreground"]].map(([I,a,b,n,c])=>{const Icon=I as typeof Palmtree;return <div className="mt-5 grid grid-cols-[24px_100px_1fr_80px] items-center gap-3 text-xs" key={String(a)}><Icon className="size-5 text-buy-navy"/><b>{String(a)}</b><div className="h-1.5 rounded bg-muted"><i className={`block h-full rounded ${c}`} style={{width:`${n}%`}}/></div><span className="text-muted-foreground">{String(b)}</span></div>})}</div>
   <div className={`${panel} p-4`}><div className="flex items-center justify-between"><h2 className="font-black">عدد الإجازات حسب الأشهر</h2><span className={field}>2026<ChevronDown className="size-4"/></span></div><div className="mt-6 flex h-36 items-end justify-between gap-2 border-b border-border">{months.map((v,i)=><div key={monthNames[i]} className="flex flex-1 flex-col items-center justify-end"><b className="mb-1 text-[10px]">{v}</b><i className="w-full max-w-6 rounded-t bg-primary/60" style={{height:`${v*4}px`}}/></div>)}</div><div className="mt-1 flex justify-between gap-2">{monthNames.map(m=><span key={m} className="flex-1 text-center text-[9px] text-muted-foreground">{m}</span>)}</div></div>
   <div className={`${panel} p-4`}><h2 className="font-black">حالات الإجازات</h2><div className="mt-5 flex items-center justify-between gap-4"><ul className="flex-1 space-y-4 text-xs">{[["موافق عليها","48","bg-success"],["بانتظار الموافقة","12","bg-warning"],["مرفوضة","5","bg-destructive"],["ملغاة","3","bg-muted-foreground"]].map(([a,b,c])=><li key={a} className="grid grid-cols-[10px_1fr_auto] items-center gap-2"><i className={`size-2.5 rounded-full ${c}`}/><span>{a}</span><b>{b}</b></li>)}</ul><div className="grid size-40 shrink-0 place-items-center rounded-full" style={{background:"conic-gradient(var(--success) 0 70%,var(--warning) 70% 88%,var(--destructive) 88% 95%,var(--muted-foreground) 95%)"}}><div className="grid size-28 place-items-center rounded-full bg-card text-center"><div><b className="block text-3xl text-buy-navy">68</b><span className="text-[10px]">إجمالي الطلبات</span></div></div></div></div></div>
  </section>
  <section className={`${panel} mt-4 overflow-hidden`}>
   <div className="grid gap-2 p-4 lg:grid-cols-[auto_1.4fr_1fr_1fr_1fr_1fr] lg:items-center">
    <h2 className="text-base font-black lg:ml-6">طلبات الإجازات</h2>
    <label className={field}><Search className="size-4 text-muted-foreground"/><input value={q} onChange={e=>setQ(e.target.value)} className="w-full bg-transparent outline-none" placeholder="البحث عن موظف ..."/></label>
    <label className={field}><CalendarDays className="size-4"/><input className="w-full bg-transparent outline-none" placeholder="من تاريخ"/></label>
    <label className={field}><CalendarDays className="size-4"/><input className="w-full bg-transparent outline-none" placeholder="إلى تاريخ"/></label>
    <select value={type} onChange={e=>setType(e.target.value)} className={field}><option value="">جميع أنواع الإجازات</option><option>إجازة سنوية</option><option>إجازة مرضية</option><option>إجازة طارئة</option><option>إجازة بدون راتب</option></select>
    <select value={status} onChange={e=>setStatus(e.target.value)} className={field}><option value="">جميع الحالات</option><option>موافق عليها</option><option>بانتظار الموافقة</option><option>مرفوضة</option><option>ملغاة</option></select>
   </div>
   <div className="overflow-x-auto px-2 pb-2"><table className="w-full min-w-[960px] rounded-md border border-border text-center text-xs [&_td]:px-3 [&_td]:py-2.5 [&_th]:px-3 [&_th]:py-3"><thead className="bg-primary-soft/60"><tr>{["رقم الطلب","اسم الموظف","القسم","نوع الإجازة","تاريخ البداية","تاريخ النهاية","عدد الأيام","الحالة","الإجراءات"].map(h=><th key={h} className="font-bold">{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr className="border-t border-border" key={r[0]}>{r.map((c,i)=><td key={i}>{i===7?<span className={`inline-block min-w-28 rounded px-3 py-1 font-bold ${statusClass(c)}`}>{c}</span>:c}</td>)}<td><span className="inline-flex gap-4"><Eye className="size-4"/><Trash2 className="size-4 text-destructive"/><MoreVertical className="size-4"/></span></td></tr>)}</tbody></table></div>
  </section>
 </div></main></AppShell>
}
