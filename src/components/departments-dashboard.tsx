import { useMemo, useRef, useState } from "react";
import { BarChart3, Building2, ChevronDown, ChevronLeft, ChevronRight, CirclePause, Download, Ellipsis, FileUp, Network, Pencil, Plus, Save, Search, Trash2, Users, UserRound, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { departmentRows } from "@/data/mockData";

type Department = (typeof departmentRows)[number];
const empty: Department = { id: 0, name: "", code: "", manager: "", employees: 0, branches: 0, parent: "الإدارة التنفيذية", type: "تشغيلي", status: "نشط", description: "" };
const box = "min-w-0 rounded-md border border-border bg-card shadow-sm";
const input = "h-8 w-full min-w-0 rounded border border-input bg-card px-2 text-[11px] text-foreground outline-none focus:border-primary";
const chartColors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--buy-violet)", "var(--finance-orange)", "var(--finance-teal)", "var(--chart-3)", "var(--chart-4)"];
const csvCell = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;
function downloadCsv(rows: Department[]) {
  const lines = [["الرمز", "اسم القسم", "المدير المسؤول", "عدد الموظفين", "الأقسام الفرعية", "القسم الرئيسي", "نوع القسم", "الحالة", "الوصف"], ...rows.map(r => [r.code, r.name, r.manager, r.employees, r.branches, r.parent, r.type, r.status, r.description])];
  const blob = new Blob(["\ufeff" + lines.map(row => row.map(csvCell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "الأقسام.csv"; a.click(); URL.revokeObjectURL(url);
}
function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], value = "", quoted = false;
  for (let i = 0; i < text.length; i++) { const c = text[i]; if (c === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; } else if (c === "," && !quoted) { row.push(value); value = ""; } else if ((c === "\n" || c === "\r") && !quoted) { if (c === "\r" && text[i + 1] === "\n") i++; row.push(value); if (row.some(Boolean)) rows.push(row); row = []; value = ""; } else value += c; }
  row.push(value); if (row.some(Boolean)) rows.push(row); return rows;
}

export function DepartmentsDashboard() {
  const [rows, setRows] = useState<Department[]>(() => departmentRows.map(r => ({ ...r })));
  const [selected, setSelected] = useState(2);
  const [draft, setDraft] = useState<Department | null>(null);
  const [search, setSearch] = useState(""); const [status, setStatus] = useState("كل الحالات");
  const [page, setPage] = useState(1); const [limit, setLimit] = useState(10);
  const [menu, setMenu] = useState<number | null>(null); const [notice, setNotice] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const current = rows.find(r => r.id === selected);
  const edit = draft ?? current ?? empty;
  const filtered = useMemo(() => rows.filter(r => (status === "كل الحالات" || r.status === status) && `${r.name} ${r.code} ${r.manager}`.toLowerCase().includes(search.trim().toLowerCase())), [rows, status, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / limit)); const activePage = Math.min(page, pages);
  const visible = filtered.slice((activePage - 1) * limit, activePage * limit);
  const totalEmployees = rows.reduce((sum, r) => sum + r.employees, 0);
  const totalBranches = rows.reduce((sum, r) => sum + r.branches, 0);
  const active = rows.filter(r => r.status === "نشط").length;
  const stats = [
    { label: "إجمالي الأقسام", value: rows.length, suffix: "قسم", icon: Network, tone: "text-primary", bg: "bg-primary-soft" },
    { label: "عدد الموظفين", value: totalEmployees, suffix: "موظف", icon: Users, tone: "text-success", bg: "bg-success-soft" },
    { label: "مدراء الأقسام", value: rows.filter(r => r.manager.trim()).length, suffix: "مدير", icon: UserRound, tone: "text-finance-orange", bg: "bg-finance-peach" },
    { label: "الأقسام الفرعية", value: totalBranches, suffix: "قسم فرعي", icon: Network, tone: "text-buy-violet", bg: "bg-buy-violet-soft" },
    { label: "الأقسام النشطة", value: active, suffix: "قسم", icon: BarChart3, tone: "text-destructive", bg: "bg-destructive/10" },
    { label: "الأقسام المتوقفة", value: rows.length - active, suffix: "قسم", icon: CirclePause, tone: "text-muted-foreground", bg: "bg-muted" },
  ];
  const distribution = [...rows].sort((a, b) => b.employees - a.employees).slice(0, 7);
  const other = totalEmployees - distribution.reduce((sum, r) => sum + r.employees, 0);
  const slices = [...distribution.map(r => ({ name: r.name, employees: r.employees })), { name: "أخرى", employees: other }];
  let accumulated = 0;
  const gradient = slices.map((r, i) => { const start = accumulated; accumulated += totalEmployees ? r.employees / totalEmployees * 100 : 0; return `${chartColors[i]} ${start}% ${accumulated}%`; }).join(", ");
  const update = (key: keyof Department, value: string) => setDraft({ ...edit, [key]: key === "employees" || key === "branches" ? Math.max(0, Number(value) || 0) : value });
  const save = () => {
    if (!edit.name.trim() || !edit.code.trim() || !edit.manager.trim()) { setNotice("أكمل اسم القسم ورمزه والمدير المسؤول"); return; }
    if (rows.some(r => r.code.toLowerCase() === edit.code.trim().toLowerCase() && r.id !== edit.id)) { setNotice("رمز القسم مستخدم بالفعل"); return; }
    const next = { ...edit, id: edit.id || Math.max(0, ...rows.map(r => r.id)) + 1, name: edit.name.trim(), code: edit.code.trim(), manager: edit.manager.trim() };
    setRows(prev => edit.id ? prev.map(r => r.id === edit.id ? next : r) : [...prev, next]); setSelected(next.id); setDraft(null); setNotice("تم حفظ بيانات القسم مؤقتًا");
  };
  const remove = (id: number) => { if (!window.confirm("هل تريد حذف هذا القسم؟")) return; setRows(prev => prev.filter(r => r.id !== id)); if (selected === id) { setSelected(rows.find(r => r.id !== id)?.id ?? 0); setDraft(null); } setMenu(null); setNotice("تم حذف القسم مؤقتًا"); };
  const importFile = async (f?: File) => {
    if (!f) return;
    const content = await f.text(); const entries = parseCsv(content.replace(/^\ufeff/, ""));
    const header = entries[0] ?? []; const idx = (name: string) => header.indexOf(name);
    if (idx("اسم القسم") < 0 || idx("الرمز") < 0) { setNotice("ملف غير صالح: يلزم عمودا اسم القسم والرمز"); return; }
    const imported = entries.slice(1).filter(c => c[idx("اسم القسم")]?.trim() && c[idx("الرمز")]?.trim());
    if (!imported.length) { setNotice("لا توجد أقسام صالحة للاستيراد"); return; }
    setRows(prev => { const codes = new Set(prev.map(r => r.code.toLowerCase())); let id = Math.max(0, ...prev.map(r => r.id)); const next = imported.filter(c => { const code = c[idx("الرمز")].trim().toLowerCase(); if (codes.has(code)) return false; codes.add(code); return true; }).map(c => ({ id: ++id, code: c[idx("الرمز")].trim(), name: c[idx("اسم القسم")].trim(), manager: c[idx("المدير المسؤول")] || "—", employees: Math.max(0, Number(c[idx("عدد الموظفين")]) || 0), branches: Math.max(0, Number(c[idx("الأقسام الفرعية")]) || 0), parent: c[idx("القسم الرئيسي")] || "الإدارة التنفيذية", type: c[idx("نوع القسم")] || "تشغيلي", status: c[idx("الحالة")] === "متوقف" ? "متوقف" : "نشط", description: c[idx("الوصف")] || "" })); setNotice(`تم استيراد ${next.length} قسم مؤقتًا`); return [...prev, ...next]; });
    if (file.current) file.current.value = "";
  };
  return <AppShell title="الأقسام"><div dir="rtl" className="mx-auto w-full max-w-[1600px] space-y-2.5 pb-6 text-foreground">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-xl font-extrabold">الأقسام</h1><p className="text-[11px] text-muted-foreground">الرئيسية / الموارد البشرية / الأقسام</p></div><div className="flex flex-wrap gap-2">
      <Button className="bg-brand-deep text-primary-foreground hover:bg-brand-deep/90" onClick={() => { setDraft({ ...empty }); setNotice(""); }}><Plus /> إضافة قسم جديد</Button>
      <Button variant="outline" onClick={() => file.current?.click()}><FileUp /> استيراد الأقسام</Button><input ref={file} type="file" accept=".csv,text/csv" className="hidden" aria-label="ملف الأقسام CSV" onChange={e => void importFile(e.target.files?.[0])} />
      <Button variant="outline" onClick={() => downloadCsv(filtered)}><Download /> تصدير</Button>
    </div></header>
    {notice && <div role="status" className="flex items-center justify-between rounded border border-primary/20 bg-primary-soft px-3 py-1 text-xs text-foreground">{notice}<Button variant="ghost" size="icon" aria-label="إغلاق الرسالة" onClick={() => setNotice("")}><X /></Button></div>}
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{stats.map(s => <div key={s.label} className={`${box} flex min-h-18 items-center justify-between gap-1 bg-card px-2.5 py-2`}><div className="text-right"><div className="text-[10px] font-bold leading-tight">{s.label}</div><div className={`text-lg font-extrabold ${s.tone}`}>{s.value}</div><div className="text-[10px] text-muted-foreground">{s.suffix}</div></div><span className={`grid size-10 shrink-0 place-items-center rounded-full ${s.bg} ${s.tone}`}><s.icon size={19} /></span></div>)}</div>
    <div className="grid min-w-0 gap-2.5 xl:grid-cols-[minmax(280px,35%)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-2.5">
        <section className={box}><h2 className="flex items-center gap-2 border-b border-border bg-primary-soft/40 px-3 py-2 text-xs font-bold"><Network size={16} /> الهيكل التنظيمي للأقسام</h2><div className="overflow-x-auto p-3"><div className="mx-auto min-w-[300px] text-center text-[10px] font-bold"><Button size="sm" className="mx-auto bg-brand-deep" onClick={() => { setSelected(1); setDraft(null); }}>♟ &nbsp; الإدارة التنفيذية</Button><div className="mx-auto h-5 w-px bg-primary/50" /><div className="grid grid-cols-4 gap-2 border-t border-primary/50 pt-4">{[
          { title: "الموارد البشرية", color: "bg-buy-violet", children: ["التوظيف", "التدريب والتطوير", "شؤون الموظفين"] },
          { title: "الإدارة المالية", color: "bg-success", children: ["الحسابات", "الميزانيات", "المشتريات"] },
          { title: "الخدمات الطبية", color: "bg-primary", children: ["الطب", "التمريض", "الصيدلة"] },
          { title: "تقنية المعلومات", color: "bg-warning", children: ["البنية التحتية", "الدعم الفني", "أنظمة المعلومات"] },
        ].map(group => <div key={group.title} className="min-w-0 space-y-1.5"><Button size="sm" className={`h-auto min-h-8 w-full whitespace-normal px-1 py-1 text-[9px] leading-tight text-primary-foreground ${group.color}`} onClick={() => { const r = rows.find(x => x.name === group.title); if (r) { setSelected(r.id); setDraft(null); } }}>{group.title}</Button>{group.children.map(child => <Button key={child} variant="outline" size="sm" className="h-8 w-full whitespace-normal px-0.5 text-[9px] leading-tight" onClick={() => { const r = rows.find(x => x.name === child); if (r) { setSelected(r.id); setDraft(null); } }}>{child}</Button>)}</div>)}</div></div></div></section>
        <section className={box}><h2 className="flex items-center gap-2 border-b border-border bg-primary-soft/40 px-3 py-2 text-xs font-bold"><Pencil size={14} /> تفاصيل القسم</h2><form onSubmit={e => { e.preventDefault(); save(); }} className="grid grid-cols-2 gap-x-3 gap-y-2 p-3 text-[10px] font-semibold">
          <label>اسم القسم <b className="text-destructive">*</b><input className={input} aria-label="اسم القسم" value={edit.name} onChange={e => update("name", e.target.value)} required /></label>
          <label>رمز القسم <b className="text-destructive">*</b><input className={input} aria-label="رمز القسم" value={edit.code} onChange={e => update("code", e.target.value)} required /></label>
          <label>القسم الرئيسي <b className="text-destructive">*</b><select className={input} aria-label="القسم الرئيسي" value={edit.parent} onChange={e => update("parent", e.target.value)}>{[...new Set([edit.parent, "الإدارة التنفيذية", ...rows.map(r => r.name)])].filter(Boolean).map(x => <option key={x}>{x}</option>)}</select></label>
          <label>نوع القسم <b className="text-destructive">*</b><select className={input} aria-label="نوع القسم" value={edit.type} onChange={e => update("type", e.target.value)}>{[...new Set([edit.type, "تشغيلي", "إداري", "تقني"])].map(x => <option key={x}>{x}</option>)}</select></label>
          <label>المدير المسؤول <b className="text-destructive">*</b><input className={input} aria-label="المدير المسؤول" value={edit.manager} onChange={e => update("manager", e.target.value)} required /></label>
          <label>الحالة <b className="text-destructive">*</b><select className={`${input} ${edit.status === "نشط" ? "bg-success-soft text-success" : "bg-muted"}`} aria-label="الحالة" value={edit.status} onChange={e => update("status", e.target.value)}><option>نشط</option><option>متوقف</option></select></label>
          <label>عدد الموظفين<input type="number" min="0" className={input} aria-label="عدد الموظفين" value={edit.employees} onChange={e => update("employees", e.target.value)} /></label>
          <label>الأقسام الفرعية<input type="number" min="0" className={input} aria-label="الأقسام الفرعية" value={edit.branches} onChange={e => update("branches", e.target.value)} /></label>
          <label className="col-span-2">الوصف<textarea className={`${input} h-12 resize-none py-1`} aria-label="الوصف" value={edit.description} onChange={e => update("description", e.target.value)} /></label>
          <div className="col-span-2 flex gap-2"><Button type="submit" className="flex-1 bg-brand-deep"><Save /> حفظ التعديلات</Button><Button type="button" variant="outline" className="flex-1" onClick={() => { setDraft(null); setNotice(""); }}><X /> إلغاء</Button></div>
        </form></section>
      </div>
      <div className="min-w-0 space-y-2.5"><section className={box}><div className="flex flex-wrap justify-between gap-2 border-b border-border p-2"><label className="relative block min-w-44 flex-1"><Search size={15} className="absolute left-2 top-2 text-primary" /><input className={`${input} pl-8`} aria-label="البحث في الأقسام" placeholder="البحث في الأقسام ..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></label><label className="relative min-w-28"><select className={input} aria-label="تصفية الحالة" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option>كل الحالات</option><option>نشط</option><option>متوقف</option></select><ChevronDown size={12} className="pointer-events-none absolute left-2 top-2" /></label></div>
        <div className="w-full overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-center text-[10px]"><thead className="bg-primary-soft/75 text-foreground"><tr>{["م", "اسم القسم", "المدير المسؤول", "عدد الموظفين", "الأقسام الفرعية", "الحالة", "الإجراءات"].map(h => <th key={h} className="border border-border px-2 py-2 font-bold whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{visible.map(r => <tr key={r.id} className={`cursor-pointer hover:bg-primary-soft/30 ${selected === r.id && !draft ? "bg-primary-soft/25" : ""}`} onClick={() => { setSelected(r.id); setDraft(null); }}><td className="border border-border py-1.5">{r.id}</td><td className="border border-border px-1.5 text-right font-bold whitespace-nowrap">{r.name}</td><td className="border border-border px-1.5 whitespace-nowrap">{r.manager}</td><td className="border border-border">{r.employees}</td><td className="border border-border">{r.branches}</td><td className="border border-border"><span className={`inline-block min-w-12 rounded px-1 py-0.5 ${r.status === "نشط" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{r.status}</span></td><td className="border border-border"><div className="flex justify-center gap-0.5"><Button variant="ghost" size="icon" className="size-6" aria-label={`تعديل ${r.name}`} title="تعديل" onClick={e => { e.stopPropagation(); setSelected(r.id); setDraft({ ...r }); }}><Pencil className="text-primary" /></Button><Button variant="ghost" size="icon" className="size-6" aria-label={`حذف ${r.name}`} title="حذف" onClick={e => { e.stopPropagation(); remove(r.id); }}><Trash2 className="text-destructive" /></Button><div className="relative"><Button variant="ghost" size="icon" className="size-6" aria-label={`المزيد ${r.name}`} title="المزيد" onClick={e => { e.stopPropagation(); setMenu(menu === r.id ? null : r.id); }}><Ellipsis /></Button>{menu === r.id && <div className="absolute left-0 z-20 w-28 rounded border border-border bg-card p-1 shadow-lg"><Button variant="ghost" size="sm" className="w-full text-[10px]" onClick={e => { e.stopPropagation(); setRows(prev => prev.map(x => x.id === r.id ? { ...x, status: x.status === "نشط" ? "متوقف" : "نشط" } : x)); setMenu(null); }}>{r.status === "نشط" ? "إيقاف القسم" : "تنشيط القسم"}</Button></div>}</div></div></td></tr>)}{!visible.length && <tr><td colSpan={7} className="p-8 text-muted-foreground">لا توجد أقسام مطابقة</td></tr>}</tbody></table></div>
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 text-[10px]"><div className="flex items-center gap-2"><label><span className="sr-only">عدد النتائج في الصفحة</span><select className="rounded border border-input bg-card px-1 py-1" value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select></label><span>عرض {filtered.length ? (activePage - 1) * limit + 1 : 0} إلى {Math.min(activePage * limit, filtered.length)} من أصل {filtered.length} نتيجة</span></div><div className="flex gap-1"><Button variant="outline" size="icon" className="size-7" aria-label="الصفحة السابقة" disabled={activePage <= 1} onClick={() => setPage(p => p - 1)}><ChevronRight /></Button>{Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(p => <Button key={p} variant={p === activePage ? "default" : "outline"} size="icon" className={`size-7 ${p === activePage ? "bg-brand-deep" : ""}`} onClick={() => setPage(p)}>{p}</Button>)}<Button variant="outline" size="icon" className="size-7" aria-label="الصفحة التالية" disabled={activePage >= pages} onClick={() => setPage(p => p + 1)}><ChevronLeft /></Button></div></div>
      </section>
      <div className="grid gap-2.5 lg:grid-cols-2"><section className={box}><h2 className="border-b border-border px-3 py-2 text-xs font-bold">توزيع الموظفين حسب الأقسام</h2><div className="flex flex-wrap items-center gap-4 p-3"><div role="img" aria-label="توزيع الموظفين حسب الأقسام" className="relative grid size-28 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${gradient})` }}><div className="grid size-16 place-content-center rounded-full bg-card text-center text-[10px]"> <strong className="text-base">{totalEmployees}</strong> موظف</div></div><div className="min-w-28 flex-1 space-y-1">{slices.map((r, i) => <div key={r.name} className="flex justify-between gap-2 text-[9px]"><span className="flex items-center gap-1"><i className="size-1.5 rounded-full" style={{ background: chartColors[i] }} />{r.name}</span><b>{r.employees}</b><span>{totalEmployees ? Math.round(r.employees / totalEmployees * 100) : 0}%</span></div>)}</div></div></section>
      <section className={box}><h2 className="flex items-center gap-1 border-b border-border px-3 py-2 text-xs font-bold"><BarChart3 size={14} /> إحصائيات سريعة</h2><div className="space-y-2 p-3 text-[10px]">{[["متوسط عدد الموظفين لكل قسم", Math.round(totalEmployees / (rows.length || 1)), Building2, "text-primary", "bg-primary-soft"], ["الأقسام النشطة", active, Users, "text-success", "bg-success-soft"], ["الأقسام المتوقفة", rows.length - active, UserRound, "text-destructive", "bg-destructive/10"], ["عدد الأقسام التي لديها أقسام فرعية", rows.filter(r => r.branches > 0).length, Network, "text-buy-violet", "bg-buy-violet-soft"]] .map(([label, value, Icon, tone, bg]) => { const IconComponent = Icon as typeof Building2; return <div key={String(label)} className="flex items-center gap-2"><span className={`grid size-6 shrink-0 place-items-center rounded ${bg}`}><IconComponent size={13} className={String(tone)} /></span><span className="flex-1">{String(label)}</span><b>{String(value)}</b></div>; })}</div></section></div></div>
    </div>
  </div></AppShell>;
}
