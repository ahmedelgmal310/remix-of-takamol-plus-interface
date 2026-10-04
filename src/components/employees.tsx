import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarDays, ChevronLeft, ChevronRight, Clock3, Copy, Ellipsis, Eye, FileText, Pencil, Plus, Search, UserRoundCheck, UserRoundX, Users, WalletCards, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { directoryEmployees, type DirectoryEmployee } from "@/data/mockData";
import ahmedPhoto from "@/assets/candidate-ahmed.jpg";
import saraPhoto from "@/assets/candidate-sara.jpg";
import khaledPhoto from "@/assets/candidate-khaled.jpg";
import nouraPhoto from "@/assets/candidate-noura.jpg";
import reemPhoto from "@/assets/candidate-reem.jpg";

const photos = [ahmedPhoto, saraPhoto, khaledPhoto, nouraPhoto, ahmedPhoto, saraPhoto, khaledPhoto, reemPhoto];
const stats = [
  { label: "إجمالي الموظفين", count: "312", trend: "12%", icon: Users, tone: "text-primary", pale: "bg-primary-soft", down: false },
  { label: "على رأس العمل", count: "248", trend: "8%", icon: UserRoundCheck, tone: "text-success", pale: "bg-success-soft", down: false },
  { label: "في إجازة", count: "14", trend: "6%", icon: Clock3, tone: "text-warning", pale: "bg-warning-soft", down: true },
  { label: "منتهي خدمة", count: "28", trend: "4%", icon: UserRoundX, tone: "text-destructive", pale: "bg-destructive/10", down: true },
  { label: "جدد هذا الشهر", count: "22", trend: "15%", icon: Users, tone: "text-buy-violet", pale: "bg-buy-violet/10", down: false },
];
const tabs = ["البيانات الأساسية", "الوظيفة", "الرواتب", "الإجازات", "المستندات"] as const;
const tabIcons = { "البيانات الأساسية": Users, "الوظيفة": BriefcaseBusiness, "الرواتب": WalletCards, "الإجازات": CalendarDays, "المستندات": FileText };
const inputClass = "h-9 min-w-0 rounded border border-input bg-card px-3 text-xs text-foreground outline-none focus:border-primary";
const getPhoto = (id: string) => photos[(Number(id.split("-")[1]) - 1) % photos.length] ?? ahmedPhoto;
const badge = (status: DirectoryEmployee["status"]) => status === "على رأس العمل" ? "bg-success-soft text-success" : status === "في إجازة" ? "bg-warning-soft text-warning" : "bg-destructive/10 text-destructive";

export function EmployeesPage() {
  const [employees, setEmployees] = useState(directoryEmployees);
  const [selectedId, setSelectedId] = useState("EMP-001");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [job, setJob] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editJob, setEditJob] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const selected = employees.find(row => row.id === selectedId) ?? employees[0];
  const departments = [...new Set(employees.map(row => row.department))];
  const jobs = [...new Set(employees.map(row => row.job))];
  const filtered = useMemo(() => employees.filter(row =>
    (!query || [row.name, row.id, row.job, row.identity].some(value => value.toLowerCase().includes(query.trim().toLowerCase()))) &&
    (!department || row.department === department) && (!job || row.job === job) &&
    (!status || row.status === status) && (!gender || row.gender === gender)
  ), [employees, query, department, job, status, gender]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value); setPage(1); };
  const startEdit = (row: DirectoryEmployee) => { setSelectedId(row.id); setEditName(row.name); setEditJob(row.job); setEditDepartment(row.department); setEditing(true); setMenuId(null); };
  const saveEdit = () => {
    if (!editName.trim() || !editJob.trim() || !editDepartment.trim()) return;
    setEmployees(previous => previous.map(row => row.id === selectedId ? { ...row, name: editName.trim(), job: editJob.trim(), department: editDepartment.trim() } : row));
    setEditing(false);
    setNotice("تم تعديل البيانات في العرض التجريبي فقط، ولن تُحفظ بعد تحديث الصفحة.");
  };
  return <AppShell><main dir="rtl" className="min-w-0 bg-background px-3 py-4 text-foreground md:px-4">
    <header className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><h1 className="text-xl font-black text-buy-navy">الموظفين</h1><nav aria-label="مسار الصفحة" className="flex items-center gap-1 text-[11px] text-muted-foreground"><Link to="/" className="hover:text-primary">الرئيسية</Link><ChevronLeft size={11}/><Link to="/hr" className="hover:text-primary">الموارد البشرية</Link><ChevronLeft size={11}/><span>الموظفين</span></nav></div></header>
    <section aria-label="مؤشرات الموظفين" className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-5">{stats.map(s => <div key={s.label} className="min-w-0 rounded border border-border bg-card px-3 py-3 shadow-sm"><div className="flex items-center justify-between gap-1"><div className="min-w-0"><strong className={`block text-xl font-black ${s.tone}`}>{s.count}</strong><span className="text-[11px] font-bold text-buy-navy">{s.label}</span></div><span className={`grid size-10 shrink-0 place-items-center rounded-full ${s.pale} ${s.tone}`}><s.icon size={20}/></span></div><div className="mt-1 flex items-center justify-between gap-1 text-[10px]"><span className="text-muted-foreground">مقارنة بالشهر السابق</span><span className={`font-bold ${s.down ? "text-destructive" : "text-success"}`}><span aria-hidden="true">{s.down ? "↓" : "↑"}</span> {s.trend}</span></div></div>)}</section>
    <section aria-label="البحث والتصفية" className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(130px,1fr)_repeat(4,minmax(105px,0.7fr))_auto]">
      <label className="relative min-w-0"><span className="sr-only">ابحث عن موظف</span><Search size={16} className="absolute right-3 top-2.5 text-buy-navy"/><input aria-label="ابحث عن موظف" value={query} onChange={event => changeFilter(setQuery, event.target.value)} placeholder="ابحث عن موظف ..." className={`${inputClass} w-full pr-9`}/></label>
      <select aria-label="جميع الأقسام" value={department} onChange={event => changeFilter(setDepartment, event.target.value)} className={inputClass}><option value="">جميع الأقسام</option>{departments.map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="جميع الوظائف" value={job} onChange={event => changeFilter(setJob, event.target.value)} className={inputClass}><option value="">جميع الوظائف</option>{jobs.map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="جميع الحالات" value={status} onChange={event => changeFilter(setStatus, event.target.value)} className={inputClass}><option value="">جميع الحالات</option>{["على رأس العمل", "في إجازة", "منتهي خدمة"].map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="الكل" value={gender} onChange={event => changeFilter(setGender, event.target.value)} className={inputClass}><option value="">الكل</option><option>ذكر</option><option>أنثى</option></select>
      <Button asChild className="h-9 bg-buy-navy text-primary-foreground hover:bg-buy-navy/90 sm:col-span-2 lg:col-span-1"><Link to="/employees/new"><Plus size={15}/>إضافة موظف جديد</Link></Button>
    </section>
    {notice && <div role="status" className="mb-2 flex items-center justify-between rounded border border-success bg-success-soft px-3 py-2 text-xs text-success"><span>{notice}</span><Button variant="ghost" size="icon" className="size-6" aria-label="إغلاق التنبيه" onClick={() => setNotice("")}><X size={13}/></Button></div>}
    <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[minmax(240px,0.34fr)_minmax(0,1fr)]">
      <aside className="min-w-0 rounded border border-border bg-card p-3 shadow-sm xl:row-start-1">{selected && <><div className="relative flex flex-col items-center border-b border-border pb-3 text-center"><span className={`absolute right-0 top-0 rounded-full px-2 py-1 text-[10px] font-semibold ${badge(selected.status)}`}>{selected.status}</span><img src={getPhoto(selected.id)} alt={`صورة توضيحية لـ ${selected.name}`} className="size-24 rounded-full object-cover"/><h2 className="mt-2 text-sm font-extrabold text-buy-navy">{selected.name}</h2><span className="text-xs text-muted-foreground">{selected.job}</span><span className="mt-1 rounded bg-primary-soft px-3 py-1 text-[10px] font-bold text-buy-navy" dir="ltr">{selected.id}</span></div>
        <div className="mt-2 flex overflow-x-auto border-b border-border" role="tablist" aria-label="تفاصيل الموظف">{tabs.map(item => {const Icon = tabIcons[item]; return <Button key={item} role="tab" aria-selected={tab === item} variant="ghost" onClick={() => setTab(item)} className={`h-10 min-w-0 flex-1 flex-col gap-0.5 rounded-none px-1 text-[9px] ${tab === item ? "border-b-2 border-warning text-buy-navy" : "text-muted-foreground"}`}><Icon size={14}/><span className="whitespace-nowrap">{item}</span></Button>})}</div>
        <dl className="min-h-44 divide-y divide-border text-[10px]" role="tabpanel">{(tab === "البيانات الأساسية" ? [["رقم الهوية", selected.identity], ["الجنسية", selected.nationality], ["تاريخ الميلاد", selected.birth], ["الجنس", selected.gender], ["رقم الجوال", selected.phone], ["البريد الإلكتروني", selected.email], ["العنوان", selected.address]] : tab === "الوظيفة" ? [["رقم الموظف", selected.id], ["المسمى الوظيفي", selected.job], ["القسم", selected.department], ["تاريخ التعيين", selected.joined], ["الحالة", selected.status]] : tab === "الرواتب" ? [["حالة البيانات", "بيانات الرواتب غير متاحة في العرض التجريبي"]] : tab === "الإجازات" ? [["الحالة الحالية", selected.status], ["رصيد الإجازات", "غير متاح في العرض التجريبي"]] : [["المستندات", "لا توجد مستندات مرفوعة في العرض التجريبي"]]).map(([key, value]) => <div key={key} className="flex min-w-0 justify-between gap-2 py-2"><dt className="shrink-0 text-muted-foreground">{key}</dt><dd className="min-w-0 break-all text-left font-bold text-buy-navy" dir={key === "البريد الإلكتروني" ? "ltr" : undefined}>{value}</dd></div>)}</dl>
        <div className="mt-2 space-y-1.5"><Button variant="outline" className="w-full border-warning bg-warning-soft text-buy-navy hover:bg-warning-soft/80" onClick={() => startEdit(selected)}><Pencil size={14}/>تعديل بيانات الموظف</Button><Button asChild variant="outline" className="w-full border-primary text-buy-navy"><Link to="/employees/profile"><Eye size={14}/>عرض الملف كامل</Link></Button></div></>}</aside>
      <section className="min-w-0 rounded border border-border bg-card shadow-sm xl:col-start-2 xl:row-start-1"><div className="overflow-x-auto"><table className="w-full min-w-[820px] border-collapse text-right text-[10px] text-buy-navy"><thead className="bg-primary-soft"><tr>{["م", "رقم الموظف", "الاسم", "الوظيفة", "القسم", "رقم الهوية", "الجنس", "تاريخ التعيين", "الحالة", "الإجراءات"].map(title => <th key={title} className="whitespace-nowrap border border-border px-2 py-3 font-bold">{title}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={row.id} className={`cursor-pointer hover:bg-primary-soft/50 ${selectedId === row.id ? "bg-primary-soft/30" : ""}`} onClick={() => { setSelectedId(row.id); setTab(tabs[0]); setMenuId(null); }}><td className="border border-border px-2 py-2">{(currentPage - 1) * pageSize + index + 1}</td><td className="whitespace-nowrap border border-border px-2 py-2" dir="ltr">{row.id}</td><td className="whitespace-nowrap border border-border px-2 py-2 font-bold">{row.name}</td><td className="whitespace-nowrap border border-border px-2 py-2">{row.job}</td><td className="whitespace-nowrap border border-border px-2 py-2">{row.department}</td><td className="whitespace-nowrap border border-border px-2 py-2" dir="ltr">{row.identity.slice(0, 2)}******{row.identity.slice(-2)}</td><td className="border border-border px-2 py-2">{row.gender}</td><td className="whitespace-nowrap border border-border px-2 py-2" dir="ltr">{row.joined}</td><td className="whitespace-nowrap border border-border px-2 py-2"><span className={`rounded px-2 py-1 font-semibold ${badge(row.status)}`}>{row.status}</span></td><td className="border border-border px-1 py-1"><div className="flex items-center justify-center gap-0.5"><Button variant="ghost" size="icon" className="size-6" title="عرض التفاصيل" aria-label={`عرض تفاصيل ${row.name}`} onClick={event => { event.stopPropagation(); setSelectedId(row.id); setTab(tabs[0]); }}><Eye size={13}/></Button><Button variant="ghost" size="icon" className="size-6" title="تعديل" aria-label={`تعديل ${row.name}`} onClick={event => { event.stopPropagation(); startEdit(row); }}><Pencil size={13}/></Button><div className="relative"><Button variant="outline" size="icon" className="size-6" title="المزيد" aria-label={`المزيد لـ ${row.name}`} aria-expanded={menuId === row.id} onClick={event => { event.stopPropagation(); setMenuId(menuId === row.id ? null : row.id); }}><Ellipsis size={13}/></Button>{menuId === row.id && <div className="absolute left-0 top-full z-20 mt-1 w-32 rounded border border-border bg-card p-1 shadow-md"><Button variant="ghost" className="h-8 w-full justify-start text-[10px]" onClick={event => { event.stopPropagation(); void navigator.clipboard?.writeText(row.id).then(() => setNotice(`تم نسخ رقم الموظف ${row.id}.`)).catch(() => setNotice(`رقم الموظف: ${row.id}`)); setMenuId(null); }}><Copy size={12}/>نسخ الرقم</Button></div>}</div></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="p-8 text-center text-sm text-muted-foreground">لا توجد نتائج تطابق البحث والفلاتر.</p>}</div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 text-[11px] text-buy-navy"><div className="flex items-center gap-2"><span>عرض {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} إلى {Math.min(currentPage * pageSize, filtered.length)} من {filtered.length} نتيجة تجريبية</span></div><div className="flex items-center gap-1"><Button variant="outline" size="icon" className="size-7" aria-label="الصفحة السابقة" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronRight size={13}/></Button>{Array.from({length: pageCount}, (_, i) => i + 1).map(number => <Button key={number} variant={number === currentPage ? "default" : "outline"} size="icon" className="size-7" aria-label={`صفحة ${number}`} onClick={() => setPage(number)}>{number}</Button>)}<Button variant="outline" size="icon" className="size-7" aria-label="الصفحة التالية" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}><ChevronLeft size={13}/></Button></div><label className="flex items-center gap-2">إظهار <select aria-label="عدد النتائج في الصفحة" value={pageSize} onChange={event => {setPageSize(Number(event.target.value)); setPage(1);}} className="rounded border border-input bg-card px-2 py-1"><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select></label></div>
      </section>
    </div><p className="mt-2 text-[10px] text-muted-foreground">الأرقام الإجمالية في البطاقات من الصورة المرجعية؛ السجلات المعروضة للتجربة فقط والتعديلات لا تُحفظ بعد تحديث الصفحة.</p>
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-buy-navy/50 p-4" onClick={() => setEditing(false)}><div role="dialog" aria-modal="true" aria-label="تعديل بيانات الموظف" className="w-full max-w-md rounded border border-border bg-card p-5 shadow-lg" onClick={event => event.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="text-base font-bold text-buy-navy">تعديل بيانات الموظف</h2><Button variant="ghost" size="icon" aria-label="إغلاق" onClick={() => setEditing(false)}><X size={18}/></Button></div><div className="space-y-3">{[["الاسم", editName, setEditName], ["الوظيفة", editJob, setEditJob], ["القسم", editDepartment, setEditDepartment]] .map(([label, value, setter]) => <label key={label as string} className="block text-xs font-semibold text-buy-navy">{label as string}<input aria-label={label as string} value={value as string} onChange={event => (setter as (value: string) => void)(event.target.value)} className={`${inputClass} mt-1 w-full`}/></label>)}</div><div className="mt-5 flex gap-2"><Button onClick={saveEdit} disabled={!editName.trim() || !editJob.trim() || !editDepartment.trim()}>حفظ التعديل</Button><Button variant="outline" onClick={() => setEditing(false)}>إلغاء</Button></div><p className="mt-3 text-[10px] text-muted-foreground">التعديل تجريبي ولا يُحفظ بعد تحديث الصفحة.</p></div></div>}
  </main></AppShell>;
}
