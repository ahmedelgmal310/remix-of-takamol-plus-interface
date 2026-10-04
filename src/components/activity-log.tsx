import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleX, Clock3, Download, Ellipsis, LockKeyhole, RefreshCw, Search, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { activityRows } from "@/data/mockData";

type Activity = (typeof activityRows)[number] & { id: number };
const allRows: Activity[] = Array.from({ length: 12486 }, (_, i) => {
  const source = activityRows[i % activityRows.length];
  const dayOffset = i < 10 ? 0 : Math.floor(i / 10) % 31;
  const day = new Date(Date.UTC(2026, 9, 4 - dayOffset));
  return { ...source, id: i + 1, date: i < 10 ? source.date : day.toISOString().slice(0, 10).replaceAll("-", "/") };
});
const options = (field: "user" | "type" | "unit" | "program") => [...new Set(activityRows.map((row) => row[field]))];
const tone: Record<string, string> = {
  "إضافة": "bg-success-soft text-success", "تعديل": "bg-primary-soft text-primary", "اعتماد": "bg-finance-violet text-violet-strong",
  "تحديث": "bg-primary-soft text-primary", "عرض": "bg-muted text-muted-foreground", "حذف": "bg-destructive/10 text-destructive",
};
const stats = [
  { title: "المستخدمون النشطون", number: "42", note: "مستخدم", icon: Users, color: "text-primary", background: "bg-primary-soft" },
  { title: "محاولات دخول", number: "1,208", note: "محاولة", icon: LockKeyhole, color: "text-warning", background: "bg-warning-soft" },
  { title: "عمليات فاشلة", number: "554", note: "94%", icon: CircleX, color: "text-destructive", background: "bg-destructive/10" },
  { title: "عمليات ناجحة", number: "11,932", note: "95%", icon: Check, color: "text-success", background: "bg-success-soft" },
  { title: "إجمالي العمليات", number: "12,486", note: "عملية", icon: Users, color: "text-violet-strong", background: "bg-finance-violet" },
];

export function ActivityLog() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ user: "", type: "", unit: "", program: "", from: "2026-09-04", to: "2026-10-04" });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState<Activity | null>(null);
  const filtered = useMemo(() => allRows.filter((row) => {
    const term = query.trim().toLocaleLowerCase("ar");
    return (!term || [row.user, row.role, row.program, row.unit, row.type, row.detail, row.ip].some((value) => value.toLocaleLowerCase("ar").includes(term)))
      && (!filters.user || row.user === filters.user) && (!filters.type || row.type === filters.type)
      && (!filters.unit || row.unit === filters.unit) && (!filters.program || row.program === filters.program)
      && (!filters.from || row.date >= filters.from.replaceAll("-", "/")) && (!filters.to || row.date <= filters.to.replaceAll("-", "/"));
  }), [query, filters]);
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * size, current * size);
  const update = (key: keyof typeof filters, value: string) => { setFilters((prev) => ({ ...prev, [key]: value })); setPage(1); };
  const reset = () => { setQuery(""); setFilters({ user: "", type: "", unit: "", program: "", from: "2026-09-04", to: "2026-10-04" }); setPage(1); };
  const exportCsv = () => {
    const headers = ["التاريخ والوقت", "المستخدم", "الدور", "البرنامج", "الوحدة", "نوع العملية", "تفاصيل العملية", "عنوان IP", "الحالة"];
    const csv = "\uFEFF" + [headers, ...filtered.map((r) => [`${r.date} ${r.time}`, r.user, r.role, r.program, r.unit, r.type, r.detail, r.ip, r.status])]
      .map((line) => line.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "سجل-النشاطات.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  const SelectFilter = ({ label, field }: { label: string; field: "user" | "type" | "unit" | "program" }) => (
    <select aria-label={label} value={filters[field]} onChange={(e) => update(field, e.target.value)} className="h-9 min-w-0 rounded border border-border bg-card px-2 text-[11px] text-foreground outline-none focus:border-primary">
      <option value="">جميع {label}</option>{options(field).map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
  return <AppShell><main dir="rtl" className="min-w-0 px-4 py-4 md:px-5">
    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
      <div><h1 className="flex items-center gap-2 text-lg font-extrabold text-foreground"><Clock3 className="size-5 text-brand-deep" />سجل النشاطات</h1><p className="mt-0.5 text-[11px] text-muted-foreground">عرض جميع العمليات والإجراءات التي تمت في النظام</p></div>
      <nav aria-label="مسار الصفحة" className="text-[11px] text-muted-foreground"><Link to="/" className="hover:text-primary">الرئيسية</Link> / <Link to="/settings" className="hover:text-primary">الإعدادات</Link> / سجل النشاطات</nav>
    </div>
    <section aria-label="ملخص النشاطات" className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
      {stats.map((item) => <div key={item.title} className="flex min-h-[76px] min-w-0 items-center justify-between gap-2 rounded border border-border bg-card px-3 py-2 shadow-sm">
        <div className="min-w-0"><p className="text-[10px] font-bold text-foreground">{item.title}</p><p className={`text-xl font-extrabold leading-tight ${item.color}`}>{item.number}</p><p className={`text-[10px] ${item.color}`}>{item.note}</p></div>
        <span className={`grid size-11 shrink-0 place-items-center rounded-full ${item.background} ${item.color}`}><item.icon size={22} strokeWidth={2.6} /></span>
      </div>)}
    </section>
    <section aria-label="جدول النشاطات" className="min-w-0 rounded border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-end gap-2 border-b border-border p-2.5">
        <div className="grid min-w-0 flex-1 gap-2">
          <label className="relative block"><span className="sr-only">البحث في النشاطات</span><Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary" /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="البحث في النشاطات ..." className="h-9 w-full rounded border border-border bg-card pr-3 pl-9 text-xs outline-none focus:border-primary" /></label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <SelectFilter label="المستخدمين" field="user" /><SelectFilter label="العمليات" field="type" /><SelectFilter label="الوحدات" field="unit" /><SelectFilter label="البرامج" field="program" />
            <label className="min-w-0 text-[10px] text-muted-foreground">من تاريخ<input aria-label="من تاريخ" type="date" value={filters.from} onChange={(e) => update("from", e.target.value)} className="mt-0.5 h-9 w-full min-w-0 rounded border border-border bg-card px-1 text-[11px] text-foreground" /></label>
            <label className="min-w-0 text-[10px] text-muted-foreground">إلى تاريخ<input aria-label="إلى تاريخ" type="date" value={filters.to} onChange={(e) => update("to", e.target.value)} className="mt-0.5 h-9 w-full min-w-0 rounded border border-border bg-card px-1 text-[11px] text-foreground" /></label>
          </div>
        </div>
        <div className="flex gap-2 pb-0.5"><Button variant="outline" size="sm" onClick={reset} title="تحديث السجل"><RefreshCw />تحديث</Button><Button variant="outline" size="sm" onClick={exportCsv} title="تصدير التقرير"><Download />تصدير التقرير</Button></div>
      </div>
      <div className="w-full overflow-x-auto"><table className="w-full min-w-[940px] border-collapse text-right text-[11px]"><thead className="bg-primary-soft/50 text-[10px] text-foreground"><tr>{["#", "التاريخ والوقت", "المستخدم", "الدور", "البرنامج", "الوحدة", "نوع العملية", "تفاصيل العملية", "عنوان IP", "الحالة", "الإجراءات"].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-2 py-2 font-extrabold">{heading}</th>)}</tr></thead>
        <tbody>{visible.map((row) => <tr key={row.id} className="border-t border-border hover:bg-primary-soft/25"><td className="px-2 py-1.5">{row.id}</td><td dir="ltr" className="whitespace-nowrap px-2 py-1.5 text-right">{row.date} {row.time}</td><td className="whitespace-nowrap px-2 py-1.5 font-bold"><span className="ml-1.5 inline-grid size-6 place-items-center rounded-full bg-primary-soft text-[10px] text-primary">{row.user.slice(0, 1)}</span>{row.user}</td><td className="whitespace-nowrap px-2 py-1.5">{row.role}</td><td className="px-2 py-1.5"><span className={`whitespace-nowrap rounded px-2 py-1 ${row.program === "الموارد البشرية" ? "bg-success-soft text-success" : row.program === "خدمة العملاء" ? "bg-finance-violet text-violet-strong" : "bg-primary-soft text-primary"}`}>{row.program}</span></td><td className="whitespace-nowrap px-2 py-1.5">{row.unit}</td><td className="px-2 py-1.5"><span className={`rounded px-2 py-1 font-bold ${tone[row.type] ?? "bg-muted text-foreground"}`}>{row.type}</span></td><td className="whitespace-nowrap px-2 py-1.5">{row.detail}</td><td dir="ltr" className="px-2 py-1.5 text-right">{row.ip}</td><td className="px-2 py-1.5"><span className={`inline-flex items-center gap-1 rounded px-2 py-1 font-bold ${row.status === "نجح" ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive"}`}><span className={`size-1.5 rounded-full ${row.status === "نجح" ? "bg-success" : "bg-destructive"}`} />{row.status}</span></td><td className="px-2 py-1.5"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon" className="size-6" aria-label={`إجراءات النشاط ${row.id}`}><Ellipsis /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setSelected(row)}>عرض التفاصيل</DropdownMenuItem></DropdownMenuContent></DropdownMenu></td></tr>)}
          {visible.length === 0 && <tr><td colSpan={11} className="py-10 text-center text-muted-foreground">لا توجد نتائج مطابقة</td></tr>}</tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-2.5 py-3 text-[11px]">
        <div className="flex items-center gap-3"><label className="sr-only" htmlFor="activity-page-size">عدد السجلات في الصفحة</label><select id="activity-page-size" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }} className="h-8 rounded border border-border bg-card px-2 font-bold"><option value="10">10</option><option value="25">25</option><option value="50">50</option></select><span>عرض {filtered.length ? (current - 1) * size + 1 : 0} - {Math.min(current * size, filtered.length)} من أصل {filtered.length.toLocaleString("en-US")} نتيجة</span></div>
        <nav aria-label="صفحات النشاطات" className="flex items-center gap-1"><Button variant="outline" size="icon" className="size-8" aria-label="أول صفحة" disabled={current === 1} onClick={() => setPage(1)}><ChevronsRight /></Button><Button variant="outline" size="icon" className="size-8" aria-label="الصفحة السابقة" disabled={current === 1} onClick={() => setPage(current - 1)}><ChevronRight /></Button>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => Math.min(Math.max(1, current - 2), Math.max(1, pages - 4)) + i).map((n) => <Button key={n} variant={current === n ? "default" : "outline"} size="icon" className="size-8" onClick={() => setPage(n)} aria-label={`صفحة ${n}`}>{n}</Button>)}
          {pages > 5 && <span className="px-1">… {pages}</span>}<Button variant="outline" size="icon" className="size-8" aria-label="الصفحة التالية" disabled={current === pages} onClick={() => setPage(current + 1)}><ChevronLeft /></Button><Button variant="outline" size="icon" className="size-8" aria-label="آخر صفحة" disabled={current === pages} onClick={() => setPage(pages)}><ChevronsLeft /></Button></nav>
      </div>
    </section>
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent dir="rtl"><DialogHeader><DialogTitle>تفاصيل النشاط</DialogTitle></DialogHeader><dl className="grid grid-cols-2 gap-3 text-sm">{selected && Object.entries({ "التاريخ والوقت": `${selected.date} ${selected.time}`, "المستخدم": selected.user, "الدور": selected.role, "البرنامج": selected.program, "الوحدة": selected.unit, "نوع العملية": selected.type, "تفاصيل العملية": selected.detail, "عنوان IP": selected.ip, "الحالة": selected.status }).map(([key, value]) => <div key={key}><dt className="text-xs text-muted-foreground">{key}</dt><dd className="font-bold">{value}</dd></div>)}</dl></DialogContent></Dialog>
  </main></AppShell>;
}