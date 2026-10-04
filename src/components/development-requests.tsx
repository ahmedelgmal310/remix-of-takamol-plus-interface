import { useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, CircleX, Clock3, Code2, Download, Ellipsis, Eye, FileText, List, Paperclip, Pencil, PlusCircle, Rocket, Search, Send, Settings2, ShieldCheck, UploadCloud, Users, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { developmentRequests } from "@/data/mockData";

type Request = (typeof developmentRequests)[number];
type Form = { program: string; type: string; title: string; description: string; priority: string };
const blank: Form = { program: "الموارد البشرية", type: "تطوير ميزة جديدة", title: "", description: "", priority: "متوسطة" };
const initialStatus = { "مكتملة": 8, "قيد التنفيذ": 10, "مرفوضة": 2, "بانتظار الاعتماد": 4 };
const statusTone: Record<string, string> = { "مكتملة": "bg-success-soft text-success", "قيد التنفيذ": "bg-warning-soft text-warning", "مرفوضة": "bg-destructive/10 text-destructive", "بانتظار الاعتماد": "bg-buy-violet-soft text-buy-violet" };
const priorityTone: Record<string, string> = { "منخفضة": "bg-success-soft text-success", "متوسطة": "bg-primary-soft text-primary", "عالية": "bg-warning-soft text-warning", "عاجلة": "bg-destructive/10 text-destructive" };
const stages = [
  { title: "إرسال الطلب", subtitle: "تم الإرسال", icon: Check, color: "bg-success text-primary-foreground" },
  { title: "مراجعة الإدارة", subtitle: "قيد المراجعة", icon: Settings2, color: "bg-primary text-primary-foreground" },
  { title: "التحليل والتطوير", subtitle: "بانتظار التنفيذ", icon: Code2, color: "bg-muted text-muted-foreground" },
  { title: "الاختبار", subtitle: "بانتظار الاختبار", icon: ShieldCheck, color: "bg-muted text-muted-foreground" },
  { title: "الإطلاق", subtitle: "بانتظار الإطلاق", icon: Rocket, color: "bg-muted text-muted-foreground" },
];
const notes = [
  ["أحمد العتيبي - مدير النظام", "تمت مراجعة الطلب ويحتاج إلى تفاصيل إضافية", "2026/09/29 10:25"],
  ["أحمد العتيبي - قسم التقنية", "تم البدء في تحليل الطلب", "2026/09/28 15:40"],
  ["نورة المطيري - الإدارة المالية", "تم اعتماد الطلب من الإدارة", "2026/09/27 11:10"],
];
const sampleFiles = [{ name: "متطلبات التقرير.pdf", size: "2.4 MB", kind: "PDF" }, { name: "نماذج التقرير.xlsx", size: "1.1 MB", kind: "XLS" }, { name: "تصميم مقترح.png", size: "780 KB", kind: "PNG" }];
const panel = "min-w-0 rounded border border-border bg-card shadow-sm";
const field = "h-8 w-full min-w-0 rounded border border-input bg-card px-2 text-[11px] text-foreground outline-none focus:border-primary";

export function DevelopmentRequests() {
  const [rows, setRows] = useState<Request[]>(developmentRequests);
  const [selectedId, setSelectedId] = useState("DEV-001");
  const [form, setForm] = useState<Form>(blank);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [uploads, setUploads] = useState<Record<string, File[]>>({});
  const [menuNotice, setMenuNotice] = useState("");
  const selected = rows.find((r) => r.id === selectedId) ?? rows[0];
  const filtered = useMemo(() => rows.filter((r) => (!filter || r.status === filter) && (!query.trim() || [r.id, r.title, r.program, r.type].some((v) => v.toLowerCase().includes(query.trim().toLowerCase())))), [rows, filter, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const displayed = filtered.slice((current - 1) * pageSize, current * pageSize);
  const counts = { ...initialStatus };
  rows.slice(developmentRequests.length).forEach((r) => { if (r.status in counts) counts[r.status as keyof typeof counts]++; });
  const reset = () => { setEditing(null); setForm(blank); setFiles([]); setError(""); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { setError("يرجى إدخال عنوان الطلب وتفاصيله."); return; }
    if (editing) {
      setRows((prev) => prev.map((r) => r.id === editing ? { ...r, ...form } : r));
      if (files.length) setUploads((prev) => ({ ...prev, [editing]: [...(prev[editing] ?? []), ...files] }));
      setSelectedId(editing); setMenuNotice("تم تعديل الطلب في هذه الجلسة.");
    } else {
      const id = `DEV-${String(Math.max(8, ...rows.map((r) => Number(r.id.split("-")[1]) || 0)) + 1).padStart(3, "0")}`;
      const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).replaceAll("-", "/");
      const newRow: Request = { id, ...form, status: "بانتظار الاعتماد", date, requester: "مدير النظام" };
      setRows((prev) => [newRow, ...prev]); setSelectedId(id); setUploads((prev) => ({ ...prev, [id]: files })); setPage(1); setFilter(""); setQuery(""); setMenuNotice(`تم إرسال الطلب ${id} في هذه الجلسة.`);
    }
    reset();
  };
  const addFiles = (input: FileList | null) => {
    if (!input) return;
    const accepted = Array.from(input);
    const invalid = accepted.find((f) => f.size > 10 * 1024 * 1024 || !/\.(pdf|doc|docx|xls|xlsx|png|jpg|jpeg)$/i.test(f.name));
    if (invalid) { setError("الملفات المسموحة PDF وWord وExcel والصور، بحد 10 MB لكل ملف."); return; }
    setFiles((prev) => [...prev, ...accepted]); setError("");
  };
  const download = (file: File) => { const url = URL.createObjectURL(file); const link = document.createElement("a"); link.href = url; link.download = file.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  const startEdit = (row: Request) => { setEditing(row.id); setForm({ program: row.program, type: row.type, title: row.title, description: row.description, priority: row.priority }); setFiles([]); setSelectedId(row.id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const stats = [
    { title: "بانتظار الاعتماد", value: counts["بانتظار الاعتماد"], icon: Clock3, text: "text-buy-violet", bg: "bg-buy-violet-soft" },
    { title: "مرفوضة", value: counts["مرفوضة"], icon: CircleX, text: "text-destructive", bg: "bg-destructive/10" },
    { title: "قيد التنفيذ", value: counts["قيد التنفيذ"], icon: Clock3, text: "text-warning", bg: "bg-warning-soft" },
    { title: "مكتملة", value: counts["مكتملة"], icon: CheckCircle2, text: "text-success", bg: "bg-success-soft" },
    { title: "إجمالي الطلبات", value: 24 + rows.length - developmentRequests.length, icon: FileText, text: "text-primary", bg: "bg-primary-soft" },
  ];
  return <AppShell><main dir="rtl" className="min-w-0 space-y-2 px-3 py-3 md:px-5">
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2"><div className="min-w-0"><h1 className="truncate text-xl font-extrabold text-buy-navy">طلب تطوير برمجي</h1><nav className="text-[10px] text-muted-foreground"><Link to="/">الرئيسية</Link> / طلبات التطوير / طلب تطوير برمجي</nav></div></div>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">{stats.map((s) => <div key={s.title} className={`${panel} flex min-h-16 items-center justify-between gap-2 px-3 py-2`}><div><p className={`text-[10px] font-bold ${s.text}`}>{s.title}</p><p className={`text-xl font-extrabold leading-tight ${s.text}`}>{s.value}</p><p className="text-[10px] text-muted-foreground">طلب</p></div><span className={`grid size-10 shrink-0 place-items-center rounded-full ${s.bg} ${s.text}`}><s.icon size={21}/></span></div>)}</div>
    <div className="grid min-w-0 gap-2 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
      <div className="min-w-0 space-y-2">
        <section className={`${panel} p-3`}><h2 className="mb-3 flex items-center gap-1.5 text-xs font-extrabold text-buy-navy"><PlusCircle size={15}/>مسار معالجة الطلب</h2><div className="grid grid-cols-5 gap-1 text-center">{stages.map((stage) => <div key={stage.title} className="relative min-w-0"><span className={`mx-auto grid size-7 place-items-center rounded-full ${stage.color}`}><stage.icon size={14}/></span><p className="mt-1 text-[9px] font-bold leading-tight sm:text-[10px]">{stage.title}</p><p className="text-[8px] text-muted-foreground sm:text-[9px]">{stage.subtitle}</p></div>)}</div></section>
        <section className={`${panel} p-2.5`}><h2 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-buy-navy"><List size={15}/>قائمة طلبات التطوير</h2>
          <div className="mb-1.5 grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_150px]"><label className="relative"><Search size={14} className="absolute right-2 top-2 text-primary"/><input aria-label="البحث في الطلبات" className={`${field} pr-8`} placeholder="البحث في الطلبات ..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}/></label><select aria-label="حالة الطلب" className={field} value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}><option value="">جميع الحالات</option>{Object.keys(initialStatus).map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="max-w-full overflow-x-auto"><table className="w-full min-w-[710px] border-collapse text-right text-[10px]"><thead className="bg-primary-soft/70"><tr>{["#", "رقم الطلب", "عنوان الطلب", "البرنامج", "نوع الطلب", "الأهمية", "الحالة", "تاريخ الطلب", "الإجراءات"].map((h) => <th key={h} className="whitespace-nowrap px-1.5 py-2 font-extrabold">{h}</th>)}</tr></thead><tbody>{displayed.map((r, i) => <tr key={r.id} className={`border-b border-border ${selectedId === r.id ? "bg-primary-soft/25" : ""}`}><td className="px-1.5 py-1">{(current-1)*pageSize+i+1}</td><td className="whitespace-nowrap px-1.5 py-1">{r.id}</td><td className="max-w-44 truncate px-1.5 py-1 font-bold" title={r.title}>{r.title}</td><td className="whitespace-nowrap px-1.5 py-1">{r.program}</td><td className="whitespace-nowrap px-1.5 py-1">{r.type}</td><td className="px-1.5 py-1"><span className={`rounded px-1.5 py-0.5 ${priorityTone[r.priority] ?? "bg-muted"}`}>{r.priority}</span></td><td className="px-1.5 py-1"><span className={`whitespace-nowrap rounded px-1.5 py-0.5 ${statusTone[r.status]}`}>{r.status}</span></td><td className="whitespace-nowrap px-1.5 py-1" dir="ltr">{r.date}</td><td className="px-1 py-1"><div className="flex items-center"><Button variant="ghost" size="icon" className="size-6" aria-label={`تعديل ${r.id}`} title="تعديل" onClick={() => startEdit(r)}><Pencil size={13}/></Button><Button variant="ghost" size="icon" className="size-6" aria-label={`عرض ${r.id}`} title="عرض التفاصيل" onClick={() => setSelectedId(r.id)}><Eye size={13}/></Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-6" aria-label={`المزيد ${r.id}`}><Ellipsis size={14}/></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setSelectedId(r.id)}>عرض التفاصيل</DropdownMenuItem><DropdownMenuItem onClick={() => startEdit(r)}>تعديل الطلب</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></td></tr>)}{!displayed.length && <tr><td colSpan={9} className="py-7 text-center text-muted-foreground">لا توجد طلبات مطابقة</td></tr>}</tbody></table></div>
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-[10px]"><div className="flex items-center gap-2"><span>عرض {filtered.length ? (current-1)*pageSize+1 : 0} إلى {Math.min(current*pageSize, filtered.length)} من أصل {filtered.length} نتيجة</span><select aria-label="عدد الطلبات في الصفحة" className="rounded border border-input px-1" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}><option>10</option><option>5</option></select></div><div className="flex items-center gap-1"><Button variant="outline" size="icon" className="size-7" disabled={current === 1} onClick={() => setPage(current-1)} aria-label="السابق"><ChevronRight/></Button><span className="px-2">{current} / {pages}</span><Button variant="outline" size="icon" className="size-7" disabled={current === pages} onClick={() => setPage(current+1)} aria-label="التالي"><ChevronLeft/></Button></div></div>
        </section>
      </div>
      <section className={`${panel} p-3`}><h2 className="mb-3 flex items-center gap-1.5 border-b border-border pb-2 text-xs font-extrabold text-buy-navy"><PlusCircle size={15}/>{editing ? `تعديل الطلب ${editing}` : "إضافة طلب تطوير برمجي جديد"}</h2><form onSubmit={submit} className="space-y-2 text-[10px] font-bold"><div className="grid grid-cols-2 gap-2"><label className="min-w-0">البرنامج / النظام <span className="text-destructive">*</span><select className={`${field} mt-1`} value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })}>{["الموارد البشرية", "المالية", "خدمة العملاء"].map((v) => <option key={v}>{v}</option>)}</select></label><label className="min-w-0">نوع الطلب <span className="text-destructive">*</span><select className={`${field} mt-1`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["تطوير ميزة جديدة", "تقرير", "تكامل", "تحسين أداء", "واجهة مستخدم", "صلاحيات"].map((v) => <option key={v}>{v}</option>)}</select></label></div><label className="block">عنوان الطلب <span className="text-destructive">*</span><input className={`${field} mt-1`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="أدخل عنوان مختصر للطلب"/></label><label className="block">تفاصيل الطلب <span className="text-destructive">*</span><textarea className="mt-1 h-16 w-full rounded border border-input bg-card p-2 text-[11px] outline-none focus:border-primary" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وضح تفاصيل الطلب بشكل دقيق..."/></label><fieldset><legend className="mb-1">الأهمية <span className="text-destructive">*</span></legend><div className="grid grid-cols-4 gap-1">{["منخفضة", "متوسطة", "عالية", "عاجلة"].map((v) => <label key={v} className={`flex min-w-0 cursor-pointer items-center justify-center gap-1 rounded border px-1 py-1.5 text-[9px] ${form.priority === v ? priorityTone[v] : "bg-card text-muted-foreground"}`}><input type="radio" className="accent-current" name="priority" checked={form.priority === v} onChange={() => setForm({ ...form, priority: v })}/>{v}</label>)}</div></fieldset><div><p className="mb-1">المرفقات</p><label className="flex min-h-16 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-primary/40 bg-primary-soft/20 p-2 text-center text-[10px] text-primary"><UploadCloud size={19}/><span>اسحب الملفات هنا أو اضغط للاختيار</span><span className="text-[8px] text-muted-foreground">PDF · Word · Excel · الصور — حتى 10 MB</span><input className="sr-only" aria-label="إرفاق ملفات" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}/></label>{files.map((f, i) => <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-1 py-1 text-[10px]"><span className="truncate">{f.name}</span><Button type="button" variant="ghost" size="icon" className="size-5" aria-label={`إزالة ${f.name}`} onClick={() => setFiles(files.filter((_, n) => n !== i))}><X/></Button></div>)}</div>{error && <p role="alert" className="text-destructive">{error}</p>}{menuNotice && <p role="status" className="text-success">{menuNotice}</p>}<div className="grid grid-cols-2 gap-2"><Button type="submit" size="sm" className="bg-buy-navy text-primary-foreground hover:bg-buy-navy/90"><Send/> {editing ? "حفظ التعديل" : "إرسال الطلب"}</Button><Button type="button" variant="outline" size="sm" onClick={reset}><CircleX/>إلغاء</Button></div></form></section>
    </div>
    <div className="grid min-w-0 gap-2 lg:grid-cols-3"><section className={`${panel} p-3`}><h2 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold"><Users size={15}/>ملاحظات الإدارة</h2><div className="space-y-1.5">{(selected?.id === "DEV-001" ? notes : []).map(([who, text, date]) => <div key={date} className="border-r-2 border-primary bg-primary-soft/30 px-2 py-1 text-[9px]"><strong>{who}</strong><p>{text}</p><span className="text-muted-foreground" dir="ltr">{date}</span></div>)}{selected?.id !== "DEV-001" && <p className="py-5 text-center text-xs text-muted-foreground">لا توجد ملاحظات لهذا الطلب</p>}</div></section><section className={`${panel} p-3`}><h2 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold"><FileText size={15}/>تفاصيل الطلب</h2>{selected ? <dl className="text-[10px]">{[["رقم الطلب", selected.id], ["تاريخ الطلب", selected.date], ["مقدم الطلب", selected.requester], ["البرنامج", selected.program], ["نوع الطلب", selected.type], ["الأهمية", selected.priority], ["الحالة", selected.status], ["التفاصيل", selected.description]].map(([key, value]) => <div key={key} className="grid grid-cols-[90px_minmax(0,1fr)] gap-2 border-b border-border py-1"><dt className="font-bold">{key}</dt><dd className="min-w-0 break-words text-muted-foreground">{value}</dd></div>)}</dl> : <p>لا يوجد طلب محدد</p>}</section><section className={`${panel} p-3`}><h2 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold"><Paperclip size={15}/>الملفات والمرفقات</h2>{selected?.id === "DEV-001" && sampleFiles.map((f) => <div key={f.name} className="flex items-center justify-between gap-2 border-b border-border py-1.5 text-[10px]"><span className="flex min-w-0 items-center gap-2"><FileText size={16} className="shrink-0 text-primary"/><span className="truncate"><strong>{f.name}</strong><small className="block text-muted-foreground">{f.size}</small></span></span><span title="ملف توضيحي غير متاح للتنزيل" className="text-[9px] text-muted-foreground">توضيحي</span></div>)}{selected && (uploads[selected.id] ?? []).map((f, i) => <div key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 border-b border-border py-1.5 text-[10px]"><span className="truncate">{f.name} · {(f.size/1024/1024).toFixed(1)} MB</span><Button variant="ghost" size="icon" className="size-7" aria-label={`تنزيل ${f.name}`} title="تنزيل" onClick={() => download(f)}><Download/></Button></div>)}{selected?.id !== "DEV-001" && !(uploads[selected?.id ?? ""]?.length) && <p className="py-5 text-center text-xs text-muted-foreground">لا توجد مرفقات لهذا الطلب</p>}</section></div>
  </main></AppShell>;
}
