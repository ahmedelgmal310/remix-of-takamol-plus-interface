import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Copy, Download, Eye, FileSearch, FileText, History, Home, MoreVertical, Paperclip, Pencil, Plus, Repeat2, RotateCcw, Search, Trash2, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { examRequests, type ExamRequest, type ExamStatus } from "@/data/mockData";

const tone: Record<ExamStatus, string> = { "منتهية": "bg-success-soft text-success", "بالانتظار": "bg-warning-soft text-warning", "تم إعادتها": "bg-destructive/10 text-destructive" };
const sel = "h-10 w-full appearance-none rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const toIso = (d: string) => d.replaceAll("/", "-");

function Select({ value, onChange, opts, all }: { value: string; onChange: (v: string) => void; opts: string[]; all: string }) {
  return <div className="relative"><select value={value} onChange={e => onChange(e.target.value)} className={sel}><option value="">{all}</option>{opts.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>;
}

export function ExamRequestsPage() {
  const [rows, setRows] = useState<ExamRequest[]>(examRequests);
  const [q, setQ] = useState(""), [status, setStatus] = useState(""), [type, setType] = useState(""), [dept, setDept] = useState("");
  const [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [page, setPage] = useState(1), [per, setPer] = useState(10);
  const [selected, setSelected] = useState<string | null>(rows[0]?.id ?? null);
  const [menu, setMenu] = useState<string | null>(null);
  const [edit, setEdit] = useState<ExamRequest | null>(null);
  const [msg, setMsg] = useState("");

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const filtered = useMemo(() => rows.filter(r => (!q || (r.id + r.title + r.by + r.dept).includes(q)) && (!status || r.status === status) && (!type || r.type === type) && (!dept || r.dept === dept) && (!from || toIso(r.date) >= from) && (!to || toIso(r.date) <= to)), [rows, q, status, type, dept, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const count = (s?: ExamStatus) => rows.filter(r => !s || r.status === s).length;
  const detail = rows.find(r => r.id === selected);
  const f = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1); };
  const resend = (id: string) => { setRows(p => p.map(r => r.id === id ? { ...r, status: "بالانتظار", reason: "-" } : r)); flash(`تمت إعادة إرسال الطلب ${id}.`); };
  const del = (id: string) => { if (!window.confirm(`هل تريد حذف الطلب ${id}؟`)) return; setRows(p => p.filter(r => r.id !== id)); if (selected === id) setSelected(null); flash(`تم حذف الطلب ${id}.`); };

  const cards: [ReactNode, number, string, string, string][] = [
    [<Copy key="a" size={26} />, count(), "طلبات الفحص", "إجمالي الطلبات", "bg-primary-soft text-primary"],
    [<CheckCircle2 key="b" size={28} />, count("منتهية"), "منتهية", "تم اعتمادها", "bg-success-soft text-success"],
    [<Clock key="c" size={28} />, count("بالانتظار"), "بالانتظار", "بانتظار المراجعة", "bg-warning-soft text-warning"],
    [<Repeat2 key="d" size={28} />, count("تم إعادتها"), "تم إعادتها", "تحتاج إلى إجراء تعديل", "bg-destructive/10 text-destructive"],
  ];

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1400px]">
    <nav className="flex items-center gap-2 text-xs text-primary"><Home size={14} />الرئيسية<ChevronLeft size={12} /><span className="text-muted-foreground">طلبات الفحص</span></nav>
    {msg && <p className="mt-3 rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3 xl:block">
          <div className="flex items-center gap-3"><FileSearch className="shrink-0 text-brand-deep" size={48} strokeWidth={1.6} /><div><h1 className="text-3xl font-extrabold text-brand-deep">طلبات الفحص</h1><p className="text-sm">متابعة جميع طلبات الفحص وحالاتها</p></div></div>
          <Link to="/medical-exam/tests" className="mt-0 flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground xl:mt-5 xl:mr-auto xl:w-fit"><Plus size={18} />طلب فحص جديد<Plus size={18} className="hidden xl:block" /></Link>
        </div>

        {detail && <aside className="rounded-xl border border-border bg-card shadow-sm p-4">
          <div className="flex items-center justify-between border-b border-border pb-3"><h2 className="text-xl font-extrabold">تفاصيل الطلب</h2><button onClick={() => setSelected(null)} aria-label="إغلاق"><X /></button></div>
          <div className="mt-3 flex items-center justify-between"><Eye className="text-primary" size={20} /><span className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-bold ${tone[detail.status]}`}><span className="size-2 rounded-full bg-current" />{detail.status}</span></div>
          <dl className="mt-3 space-y-2.5 text-sm">{[["رقم الطلب", detail.id], ["عنوان الطلب", detail.title], ["نوع الفحص", detail.type], ["الجهة", detail.dept], ["مقدم الطلب", detail.by], ["تاريخ الطلب", detail.date], ["تاريخ آخر تحديث", "2025/09/24 10:30"]].map(([k, v]) => <div key={k} className="flex justify-between gap-3"><dt className="text-primary">{k}</dt><dd className="text-left font-semibold">{v}</dd></div>)}</dl>
          <h3 className="mt-5 flex items-center gap-2 font-extrabold"><Paperclip size={17} />المرفقات</h3>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/40 p-3"><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded bg-destructive/10 text-destructive"><FileText size={18} /></span><div className="text-sm"><b className="block" dir="ltr">{detail.title.replaceAll(" ", "_")}.pdf</b><span className="text-xs text-muted-foreground">2.4 MB</span></div></div><button onClick={() => flash("جاري تحميل الملف...")} className="text-primary" aria-label="تحميل"><Download size={19} /></button></div>
          <h3 className="mt-5 flex items-center gap-2 font-extrabold"><History size={17} />سير المعاملة</h3>
          <ol className="relative mt-3 space-y-4 pr-7 before:absolute before:right-2.5 before:top-2 before:h-[calc(100%-1.5rem)] before:w-px before:bg-border">
            {(detail.status === "منتهية" ? [["تم الاعتماد", "أحمد السبيعي", "2025/09/24 10:30", true], ["مراجعة الفحص", "فاطمة الزهراني", "2025/09/24 09:15", true], ["تم الإرسال للفحص", detail.by, `${detail.date} 02:20`, true]] : detail.status === "بالانتظار" ? [["مراجعة الفحص", "فاطمة الزهراني", "قيد المراجعة", false], ["تم الإرسال للفحص", detail.by, `${detail.date} 02:20`, true]] : [["تمت الإعادة للتعديل", "فاطمة الزهراني", detail.reason, false], ["تم الإرسال للفحص", detail.by, `${detail.date} 02:20`, true]]).map(([t, p, d, ok]) => <li key={t as string} className="relative text-sm"><span className={`absolute -right-7 top-0.5 grid size-5 place-items-center rounded-full ${ok ? "bg-success" : "bg-warning"} text-primary-foreground`}>{ok ? <CheckCircle2 size={13} /> : <Clock size={12} />}</span><b className="block">{t as string}</b><span className="block text-muted-foreground">{p as string}</span><span className="text-xs text-muted-foreground">{d as string}</span></li>)}
          </ol>
        </aside>}
      </div>

      <div className="min-w-0 space-y-4 xl:order-first">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(([icon, n, t, s, c]) => <div key={t} className="rounded-xl border border-border bg-card shadow-sm flex items-center gap-3 p-4"><span className={`grid size-14 shrink-0 place-items-center rounded-full ${c}`}>{icon}</span><div className="min-w-0"><b className="block text-2xl text-brand-deep">{n}</b><b className="block text-sm">{t}</b><span className="text-xs text-muted-foreground">{s}</span></div></div>)}</div>

        <div className="rounded-xl border border-border bg-card shadow-sm grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]">
          <label className="relative"><input value={q} onChange={e => f(setQ)(e.target.value)} placeholder="بحث في الطلبات ..." className={`${sel} pr-9`} /><Search size={17} className="absolute right-3 top-3 text-muted-foreground" /></label>
          <Select value={status} onChange={f(setStatus)} opts={["منتهية", "بالانتظار", "تم إعادتها"]} all="جميع الحالات" />
          <Select value={type} onChange={f(setType)} opts={["قانوني", "إداري", "مالي", "تقني"]} all="جميع أنواع الفحص" />
          <Select value={dept} onChange={f(setDept)} opts={[...new Set(rows.map(r => r.dept))]} all="جميع الجهات" />
          <div className="flex items-center gap-1 rounded-md border border-border px-2"><span className="text-xs text-muted-foreground">من</span><input type="date" value={from} onChange={e => f(setFrom)(e.target.value)} className="h-9 min-w-0 flex-1 bg-transparent text-xs outline-none" /><span className="text-xs text-muted-foreground">إلى</span><input type="date" value={to} onChange={e => f(setTo)(e.target.value)} className="h-9 min-w-0 flex-1 bg-transparent text-xs outline-none" /><CalendarDays size={16} className="shrink-0 text-muted-foreground" /></div>
        </div>

        <section className="rounded-xl border border-border bg-card shadow-sm p-4">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold text-brand-deep"><FileSearch size={24} />قائمة طلبات الفحص</h2>
          <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-center text-xs">
            <thead><tr className="bg-primary-soft/60 text-sm">{["#", "رقم الطلب", "عنوان الطلب", "نوع الفحص", "الجهة", "مقدم الطلب", "تاريخ الطلب", "الحالة", "سبب الإعادة", "الإجراءات"].map(h => <th key={h} className="p-3 font-bold">{h}</th>)}</tr></thead>
            <tbody>{shown.length === 0 ? <tr><td colSpan={10} className="p-8 text-sm text-muted-foreground">لا توجد طلبات مطابقة.</td></tr> : shown.map((r, i) => <tr key={r.id} onClick={() => setSelected(r.id)} className={`cursor-pointer border-b border-border ${selected === r.id ? "bg-primary-soft/60" : "hover:bg-muted/40"}`}>
              <td className="p-3 font-bold">{(cur - 1) * per + i + 1}</td><td className="p-3 font-semibold" dir="ltr">{r.id}</td><td className="p-3 font-semibold">{r.title}</td><td className="p-3">{r.type}</td><td className="p-3">{r.dept}</td><td className="p-3">{r.by}</td><td className="p-3">{r.date}</td>
              <td className="p-3"><span className={`rounded px-2.5 py-1 font-bold ${tone[r.status]}`}>{r.status}</span></td>
              <td className="max-w-40 p-3 text-[11px]">{r.reason}</td>
              <td className="relative p-3" onClick={e => e.stopPropagation()}><div className="flex items-center justify-center gap-2">
                {r.status === "تم إعادتها" ? <button onClick={() => resend(r.id)} title="إعادة إرسال" className="text-destructive"><RotateCcw size={16} /></button> : <button onClick={() => setSelected(r.id)} title="عرض" className="text-primary"><Eye size={16} /></button>}
                <button onClick={() => setMenu(menu === r.id ? null : r.id)} aria-label="إجراءات"><MoreVertical size={16} /></button></div>
                {menu === r.id && <div className="absolute left-10 top-8 z-20 w-32 rounded-md border border-border bg-card py-1 text-right text-sm shadow-lg">
                  <button onClick={() => { setSelected(r.id); setMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted"><Eye size={14} />عرض</button>
                  <button onClick={() => { setEdit(r); setMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-muted"><Pencil size={14} />تعديل</button>
                  <button onClick={() => { setMenu(null); del(r.id); }} className="flex w-full items-center gap-2 px-3 py-2 text-destructive hover:bg-muted"><Trash2 size={14} />حذف</button>
                </div>}
              </td></tr>)}</tbody></table></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span>إظهار {filtered.length ? (cur - 1) * per + 1 : 0} - {Math.min(cur * per, filtered.length)} من أصل <b>{filtered.length}</b> نتيجة</span>
            <div className="flex items-center gap-1"><button onClick={() => setPage(Math.max(1, cur - 1))} className="grid size-8 place-items-center rounded border border-border"><ChevronRight size={15} /></button>{Array.from({ length: pages }, (_, i) => i + 1).map(n => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded ${n === cur ? "bg-primary text-primary-foreground" : ""}`}>{n}</button>)}<button onClick={() => setPage(Math.min(pages, cur + 1))} className="grid size-8 place-items-center rounded border border-border"><ChevronLeft size={15} /></button></div>
            <label className="flex items-center gap-1">عرض<select value={per} onChange={e => { setPer(+e.target.value); setPage(1); }} className="rounded border border-border bg-card px-1 font-bold">{[5, 10, 20].map(n => <option key={n}>{n}</option>)}</select>نتائج لكل صفحة</label>
          </div>
        </section>
      </div>
    </div>

    {edit && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setEdit(null)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); setRows(p => p.map(r => r.id === edit.id ? edit : r)); flash(`تم تحديث الطلب ${edit.id}.`); setEdit(null); }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">تعديل الطلب {edit.id}</h3><button type="button" onClick={() => setEdit(null)}><X /></button></div>
      <label className="block font-bold">عنوان الطلب<input required value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} className={`${sel} mt-1 font-normal`} /></label>
      <label className="block font-bold">نوع الفحص<select value={edit.type} onChange={e => setEdit({ ...edit, type: e.target.value })} className={`${sel} mt-1 font-normal`}>{["قانوني", "إداري", "مالي", "تقني"].map(o => <option key={o}>{o}</option>)}</select></label>
      <label className="block font-bold">الحالة<select value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value as ExamStatus })} className={`${sel} mt-1 font-normal`}>{["منتهية", "بالانتظار", "تم إعادتها"].map(o => <option key={o}>{o}</option>)}</select></label>
      <button className="h-11 w-full rounded-md bg-primary font-bold text-primary-foreground">حفظ التعديلات</button>
    </form></div>}
  </div></main></AppShell>;
}
