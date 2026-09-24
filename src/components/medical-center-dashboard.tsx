import { useMemo, useRef, useState, type ReactNode } from "react";
import { Activity, BarChart3, CalendarDays, CalendarPlus, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Download, FileText, FlaskConical, MoreVertical, PlusSquare, RotateCcw, Search, Send, TestTube, UserPlus, X, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import banner from "@/assets/stethoscope-banner.jpg";

type St = "جديد" | "قيد المراجعة" | "بانتظار الموعد" | "قيد الفحص" | "بانتظار اعتماد النتيجة" | "تم الاعتماد" | "تم الإرجاع للشركة" | "مرفوض";
const STATUSES: { s: St; c: string; icon: ReactNode }[] = [
  { s: "جديد", c: "--mc-new", icon: <PlusSquare size={18} /> },
  { s: "قيد المراجعة", c: "--mc-review", icon: <Clock size={18} /> },
  { s: "بانتظار الموعد", c: "--mc-wait", icon: <CalendarDays size={18} /> },
  { s: "قيد الفحص", c: "--mc-exam", icon: <TestTube size={18} /> },
  { s: "بانتظار اعتماد النتيجة", c: "--mc-pending", icon: <FileText size={18} /> },
  { s: "تم الاعتماد", c: "--mc-approved", icon: <Check size={18} /> },
  { s: "تم الإرجاع للشركة", c: "--mc-returned", icon: <Send size={18} /> },
  { s: "مرفوض", c: "--mc-rejected", icon: <RotateCcw size={18} /> },
];
const col = (s: St) => `var(${STATUSES.find(x => x.s === s)!.c})`;
const FLOW: St[] = ["جديد", "قيد المراجعة", "بانتظار الموعد", "قيد الفحص", "بانتظار اعتماد النتيجة", "تم الاعتماد", "تم الإرجاع للشركة"];

type Req = { id: string; name: string; nid: string; type: string; company: string; date: string; status: St; note?: string };
const seed: Omit<Req, "id">[] = [
  { name: "أحمد محمد الشهري", nid: "1234567890", type: "فحص طبي شامل", company: "شركة الاعمال المتحدة", date: "2025/09/22 09:10", status: "جديد" },
  { name: "سارة علي القحطاني", nid: "9876543210", type: "تحليل مخبري", company: "شركة نجد", date: "2025/09/22 08:45", status: "قيد المراجعة" },
  { name: "محمد عبدالله العتيبي", nid: "1357924680", type: "أشعة سينية", company: "المؤسسة العامة", date: "2025/09/21 16:30", status: "بانتظار الموعد" },
  { name: "فاطمة أحمد الزهراني", nid: "2468135790", type: "تحليل مخبري", company: "شركة المدينة", date: "2025/09/21 14:20", status: "قيد الفحص" },
  { name: "خالد محمد السبيعي", nid: "1122334455", type: "فحص طبي شامل", company: "شركة الخليج", date: "2025/09/20 11:15", status: "بانتظار اعتماد النتيجة" },
  { name: "نورة سعد القحطاني", nid: "5566778899", type: "أشعة سينية", company: "مجموعة الرؤية", date: "2025/09/20 09:40", status: "تم الاعتماد" },
  { name: "عبدالله فهد الغامدي", nid: "9988776655", type: "تحليل مخبري", company: "شركة السلام", date: "2025/09/19 13:25", status: "تم الإرجاع للشركة" },
  { name: "ريم خالد المطيري", nid: "2233445566", type: "فحص طبي شامل", company: "شركة الأمل", date: "2025/09/19 10:50", status: "مرفوض" },
];
const target: Record<St, number> = { "جديد": 15, "قيد المراجعة": 8, "بانتظار الموعد": 6, "قيد الفحص": 12, "بانتظار اعتماد النتيجة": 4, "تم الاعتماد": 25, "تم الإرجاع للشركة": 20, "مرفوض": 2 };
const names = ["سلمان العنزي", "هند الدوسري", "ماجد الحربي", "لمى الشمري", "بدر المالكي", "جود القرني", "تركي السالم", "مها العمري"];
const companies = ["شركة نجد", "شركة الخليج", "مجموعة الرؤية", "شركة السلام", "شركة المدينة", "شركة الأمل"];
const types = ["فحص طبي شامل", "تحليل مخبري", "أشعة سينية"];
const initial: Req[] = (() => {
  const out: Omit<Req, "id">[] = [...seed];
  let k = 0;
  for (const { s } of STATUSES) for (let i = 1; i < target[s]; i++, k++) out.push({ name: names[k % 8]!, nid: String(1000000000 + k * 7919), type: types[k % 3]!, company: companies[k % 6]!, date: `2025/09/${String(18 - (k % 12)).padStart(2, "0")} ${String(8 + (k % 9)).padStart(2, "0")}:${String((k * 7) % 60).padStart(2, "0")}`, status: s });
  return out.map((r, i) => ({ ...r, id: `REQ-2025-${String(987 - i).padStart(5, "0")}` }));
})();

const chart7 = [[20, 8, 12, 25, 3, 9], [23, 9, 7, 22, 4, 11], [27, 17, 8, 13, 3, 11], [20, 9, 6, 9, 4, 11], [20, 8, 10, 9, 4, 15], [23, 11, 8, 14, 3, 7]];
const chartKeys: St[] = ["تم الاعتماد", "بانتظار اعتماد النتيجة", "قيد الفحص", "بانتظار الموعد", "قيد المراجعة", "مرفوض"];
const card = "rounded-xl border border-border bg-card shadow-sm";

export function MedicalCenterDashboard() {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState(""), [filter, setFilter] = useState<St | "">("");
  const [page, setPage] = useState(1), [per, setPer] = useState(10);
  const [range, setRange] = useState("7");
  const [open, setOpen] = useState<Req | null>(null), [menu, setMenu] = useState<string | null>(null);
  const [modal, setModal] = useState<"patient" | "appointment" | "result" | null>(null);
  const [msg, setMsg] = useState("");
  const tableRef = useRef<HTMLElement>(null);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const counts = useMemo(() => Object.fromEntries(STATUSES.map(({ s }) => [s, rows.filter(r => r.status === s).length])) as Record<St, number>, [rows]);
  const filtered = rows.filter(r => (!filter || r.status === filter) && (!q || (r.id + r.name + r.nid).includes(q)));
  const pages = Math.max(1, Math.ceil(filtered.length / per)), cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const setStatus = (id: string, status: St, m: string) => { setRows(p => p.map(r => r.id === id ? { ...r, status } : r)); setOpen(o => o && o.id === id ? { ...o, status } : o); flash(m); };
  const next = (r: Req) => { const i = FLOW.indexOf(r.status); const n = FLOW[i + 1]; if (i < 0 || !n) return; setStatus(r.id, n, `تم نقل الطلب ${r.id} إلى «${n}».`); };
  const pick = (s: St) => { setFilter(f => f === s ? "" : s); setPage(1); tableRef.current?.scrollIntoView({ behavior: "smooth" }); };

  const total = rows.length;
  let acc = 0;
  const donut = STATUSES.map(({ s, c }) => { const a = acc; acc += counts[s] / total * 100; return `var(${c}) ${a}% ${acc}%`; }).join(",");
  const days = range === "7" ? ["16/09", "17/09", "18/09", "19/09", "20/09", "22/09"] : ["أسبوع 1", "أسبوع 2", "أسبوع 3", "أسبوع 4"];
  const data = range === "7" ? chart7 : [[80, 30, 28, 40, 12, 9], [74, 34, 30, 36, 14, 8], [88, 28, 26, 44, 10, 12], [70, 32, 34, 30, 13, 7]];

  const quick: [string, ReactNode, () => void][] = [
    ["إدخال النتائج", <FlaskConical key="1" />, () => setModal("result")],
    ["تحديد موعد", <CalendarPlus key="2" />, () => setModal("appointment")],
    ["طلبات الفحص الواردة", <Download key="3" />, () => { setFilter("جديد"); setPage(1); tableRef.current?.scrollIntoView({ behavior: "smooth" }); }],
    ["إضافة مريض", <UserPlus key="4" />, () => setModal("patient")],
    ["إعادة للشركة", <Send key="5" />, () => pick("تم الاعتماد")],
    ["اعتماد النتائج", <CheckCircle2 key="6" />, () => pick("بانتظار اعتماد النتيجة")],
  ];

  return <AppShell><main dir="rtl" className="min-w-0 overflow-hidden p-3 sm:p-4"><div className="mx-auto max-w-[1400px] space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-bold text-muted-foreground">المركز الطبي / المختبر</span><span className="flex items-center gap-2 text-muted-foreground"><CalendarDays size={16} />السبت 2025/09/22 — 10:45 ص</span></div>
    {msg && <p className="rounded-md bg-success-soft p-3 text-sm font-bold text-success">{msg}</p>}

    <section className={`${card} relative flex min-h-24 items-center overflow-hidden bg-primary-soft/40 p-5`}>
      <img src={banner} alt="سماعة طبية" width={1280} height={512} className="absolute inset-y-0 left-0 hidden h-full w-3/5 object-cover [mask-image:linear-gradient(to_left,transparent,black_45%)] sm:block" />
      <div className="relative"><h1 className="flex items-center gap-2 text-2xl font-extrabold text-brand-deep"><Activity className="text-primary" />مرحباً بك في لوحة التحكم</h1><p className="mt-2 text-sm text-muted-foreground">متابعة طلبات الفحص الطبي وإدارة جميع الإجراءات من الاستلام حتى إرسال النتيجة للشركة.</p></div>
    </section>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">{STATUSES.map(({ s, c, icon }) => <button key={s} onClick={() => pick(s)} style={{ borderColor: filter === s ? `var(${c})` : undefined, background: `color-mix(in oklch, var(${c}) 9%, var(--card))` }} className={`${card} p-3 text-center transition hover:-translate-y-0.5 ${filter === s ? "border-2" : ""}`}>
      <span className="mx-auto grid size-9 place-items-center rounded-full text-primary-foreground" style={{ background: `var(${c})` }}>{icon}</span>
      <b className="mt-2 block text-2xl" style={{ color: `var(${c})` }}>{counts[s]}</b><b className="block text-sm">{s}</b><span className="text-xs text-muted-foreground">طلب</span></button>)}</div>

    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1.1fr_1.4fr]">
      <section className={`${card} p-4`}><h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><Zap className="text-primary" size={20} />إجراءات سريعة</h2>
        <div className="grid grid-cols-3 gap-3">{quick.map(([t, i, fn]) => <button key={t} onClick={fn} className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-primary-soft/30 p-2 text-xs font-bold text-primary hover:bg-primary-soft">{i}<span className="text-foreground">{t}</span></button>)}</div></section>

      <section className={`${card} p-4`}><h2 className="mb-3 text-lg font-extrabold">حالة الطلبات</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid size-36 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${donut})` }}><div className="grid size-24 place-items-center rounded-full bg-card text-center"><div><b className="block text-2xl">{total}</b><span className="text-xs">إجمالي الطلبات</span></div></div></div>
          <ul className="min-w-40 flex-1 space-y-1.5 text-xs">{[...STATUSES].reverse().reverse().map(({ s, c }) => <li key={s} className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full" style={{ background: `var(${c})` }} />{s}</span><span className="flex gap-3"><b>{counts[s]}</b><span className="w-8 text-left text-muted-foreground">{Math.round(counts[s] / total * 100)}%</span></span></li>)}</ul>
        </div></section>

      <section className={`${card} p-4 lg:col-span-2 xl:col-span-1`}><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-extrabold"><BarChart3 className="text-primary" size={20} />إحصائيات الطلبات</h2>
        <div className="relative"><select value={range} onChange={e => setRange(e.target.value)} className="h-8 appearance-none rounded-md border border-border bg-card pl-7 pr-3 text-xs"><option value="7">آخر 7 أيام</option><option value="30">آخر 30 يوم</option></select><ChevronDown size={14} className="pointer-events-none absolute left-2 top-2" /></div></div>
        <div className="flex gap-3">
          <ul className="shrink-0 space-y-2.5 pt-2 text-xs">{chartKeys.map(k => <li key={k} className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: col(k) }} />{k}</li>)}</ul>
          <div className="flex min-w-0 flex-1 flex-col"><div dir="ltr" className="flex h-40 items-end justify-around gap-2 border-b border-l border-border px-1">{data.map((d, i) => { const max = Math.max(...data.flat()); return <div key={i} className="flex h-full items-end gap-[2px]">{d.map((v, j) => <span key={j} title={`${chartKeys[j]}: ${v}`} className="w-1.5 rounded-t sm:w-2" style={{ height: `${v / max * 100}%`, background: col(chartKeys[j]!) }} />)}</div>; })}</div>
            <div dir="ltr" className="mt-1 flex justify-around text-[10px] text-muted-foreground">{days.map(d => <span key={d}>{d}</span>)}</div></div>
        </div></section>
    </div>

    <section ref={tableRef} className={`${card} p-4`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-lg font-extrabold"><FileText className="text-primary" size={20} />طلبات الفحص الطبي الواردة</h2>
        <div className="flex flex-1 items-center gap-2 sm:max-w-md"><label className="relative flex-1"><input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="ابحث برقم الطلب أو اسم الموظف أو رقم الهوية..." className="h-9 w-full rounded-md border border-border bg-card pr-8 text-xs outline-none focus:border-primary" /><Search size={15} className="absolute right-2.5 top-2.5 text-muted-foreground" /></label>
          <select value={filter} onChange={e => { setFilter(e.target.value as St | ""); setPage(1); }} className="h-9 rounded-md border border-border bg-card px-2 text-xs"><option value="">عرض الكل</option>{STATUSES.map(({ s }) => <option key={s}>{s}</option>)}</select></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-center text-xs [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
        <thead><tr className="bg-muted/50">{["رقم الطلب", "اسم الموظف", "رقم الهوية", "نوع الفحص", "الشركة الطالبة", "تاريخ الطلب", "الحالة", "الإجراءات"].map(h => <th key={h} className="p-3 font-bold">{h}</th>)}</tr></thead>
        <tbody>{shown.length === 0 ? <tr><td colSpan={8} className="p-8 text-muted-foreground">لا توجد طلبات مطابقة.</td></tr> : shown.map(r => <tr key={r.id} className="border-b border-border hover:bg-muted/30">
          <td className="p-3 font-semibold text-primary" dir="ltr">{r.id}</td><td className="p-3 font-semibold">{r.name}</td><td className="p-3">{r.nid}</td><td className="p-3">{r.type}</td><td className="p-3">{r.company}</td><td className="p-3" dir="ltr">{r.date}</td>
          <td className="p-3"><span className="inline-block min-w-24 rounded-md px-2.5 py-1 font-bold" style={{ color: col(r.status), background: `color-mix(in oklch, ${col(r.status)} 13%, transparent)` }}>{r.status}</span></td>
          <td className="relative p-3"><div className="flex items-center justify-center gap-2"><button onClick={() => setOpen(r)} className="rounded-md border border-border px-3 py-1 font-bold text-primary">عرض التفاصيل</button><button onClick={() => setMenu(menu === r.id ? null : r.id)} aria-label="إجراءات"><MoreVertical size={16} /></button></div>
            {menu === r.id && <div className="absolute left-2 top-10 z-20 w-36 rounded-md border border-border bg-card py-1 text-right shadow-lg">
              <button onClick={() => { setMenu(null); setStatus(r.id, "بانتظار الموعد", `تم تحديد موعد للطلب ${r.id}.`); }} className="block w-full px-3 py-2 hover:bg-muted">تحديد موعد</button>
              <button onClick={() => { setMenu(null); setStatus(r.id, "بانتظار اعتماد النتيجة", `تم إدخال نتيجة الطلب ${r.id}.`); }} className="block w-full px-3 py-2 hover:bg-muted">إدخال النتيجة</button>
              <button onClick={() => { setMenu(null); setStatus(r.id, "مرفوض", `تم رفض الطلب ${r.id}.`); }} className="block w-full px-3 py-2 text-destructive hover:bg-muted">رفض</button></div>}
          </td></tr>)}</tbody></table></div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-1">عرض<select value={per} onChange={e => { setPer(+e.target.value); setPage(1); }} className="rounded border border-border bg-card px-1">{[8, 10, 20].map(n => <option key={n}>{n}</option>)}</select></label>
        <div className="flex items-center gap-1"><button onClick={() => setPage(Math.max(1, cur - 1))} className="grid size-8 place-items-center rounded border border-border"><ChevronRight size={14} /></button>{Array.from({ length: pages }, (_, i) => i + 1).filter(n => n <= 5 || n === cur).map(n => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded ${n === cur ? "bg-primary text-primary-foreground" : ""}`}>{n}</button>)}<button onClick={() => setPage(Math.min(pages, cur + 1))} className="grid size-8 place-items-center rounded border border-border"><ChevronLeft size={14} /></button></div>
        <span>إجمالي الطلبات: <b>{filtered.length}</b></span>
      </div>
    </section>

    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setOpen(null)}><div dir="rtl" onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">تفاصيل الطلب {open.id}</h3><button onClick={() => setOpen(null)}><X /></button></div>
      <dl className="mt-4 space-y-2">{[["اسم الموظف", open.name], ["رقم الهوية", open.nid], ["نوع الفحص", open.type], ["الشركة الطالبة", open.company], ["تاريخ الطلب", open.date], ["الحالة", open.status]].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl>
      {FLOW.indexOf(open.status) >= 0 && FLOW.indexOf(open.status) < FLOW.length - 1 && <button onClick={() => next(open)} className="mt-5 h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">نقل إلى «{FLOW[FLOW.indexOf(open.status) + 1]}»</button>}
    </div></div>}

    {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setModal(null)}><form dir="rtl" onClick={e => e.stopPropagation()} onSubmit={e => {
      e.preventDefault(); const fd = new FormData(e.currentTarget);
      if (modal === "patient") { const id = `REQ-2025-${String(988 + rows.length - 107).padStart(5, "0")}`; setRows(p => [{ id, name: String(fd.get("name")), nid: String(fd.get("nid")), type: String(fd.get("type")), company: String(fd.get("company")), date: "2025/09/22 10:45", status: "جديد" }, ...p]); flash(`تمت إضافة المريض وإنشاء الطلب ${id}.`); }
      else { const id = String(fd.get("id")); const r = rows.find(x => x.id === id); if (!r) { flash("رقم الطلب غير موجود."); return; } setStatus(id, modal === "appointment" ? "بانتظار الموعد" : "بانتظار اعتماد النتيجة", modal === "appointment" ? `تم تحديد موعد للطلب ${id}.` : `تم إدخال نتيجة الطلب ${id}.`); }
      setModal(null);
    }} className="w-full max-w-md space-y-3 rounded-xl bg-card p-5 text-sm">
      <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">{modal === "patient" ? "إضافة مريض" : modal === "appointment" ? "تحديد موعد" : "إدخال النتائج"}</h3><button type="button" onClick={() => setModal(null)}><X /></button></div>
      {modal === "patient" ? <>
        <input required name="name" placeholder="اسم الموظف" className="h-10 w-full rounded-md border border-border px-3" />
        <input required name="nid" pattern="\d{10}" placeholder="رقم الهوية (10 أرقام)" className="h-10 w-full rounded-md border border-border px-3" />
        <select name="type" className="h-10 w-full rounded-md border border-border bg-card px-3">{types.map(t => <option key={t}>{t}</option>)}</select>
        <select name="company" className="h-10 w-full rounded-md border border-border bg-card px-3">{companies.map(t => <option key={t}>{t}</option>)}</select>
      </> : <>
        <select required name="id" className="h-10 w-full rounded-md border border-border bg-card px-3">{rows.filter(r => modal === "appointment" ? ["جديد", "قيد المراجعة"].includes(r.status) : r.status === "قيد الفحص").map(r => <option key={r.id} value={r.id}>{r.id} — {r.name}</option>)}</select>
        {modal === "appointment" ? <input required type="datetime-local" className="h-10 w-full rounded-md border border-border px-3" /> : <textarea required placeholder="النتيجة والملاحظات" className="min-h-24 w-full rounded-md border border-border p-3" />}
      </>}
      <button className="h-10 w-full rounded-md bg-primary font-bold text-primary-foreground">حفظ</button>
    </form></div>}
  </div></main></AppShell>;
}
