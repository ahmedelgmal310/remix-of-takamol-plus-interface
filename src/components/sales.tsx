import { useMemo, useState } from "react";
import {
  BarChart3, CheckCircle2, ChevronLeft, ChevronRight, CircleDollarSign,
  Clock, Download, Eye, FileText, Filter, MoreHorizontal, Pencil, Plus, Printer, Search,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { salesCustomers, salesDistribution, salesInvoices } from "@/data/mockData";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";

const statusStyle: Record<string, string> = {
  "مدفوعة": "bg-success/15 text-success",
  "معلقة": "bg-warning/15 text-warning",
  "قيد المراجعة": "bg-primary-soft text-primary",
};

const stats = [
  { icon: CircleDollarSign, title: "إجمالي المبيعات (شامل الضريبة)", value: "1,250,750", unit: "ر.س", delta: 12, cls: "text-finance-teal bg-finance-mint border-finance-mint-border" },
  { icon: FileText, title: "عدد الفواتير", value: "48", unit: "", delta: 8, cls: "text-finance-blue bg-finance-sky border-finance-sky-border" },
  { icon: Clock, title: "الفواتير المعلقة", value: "3", unit: "", delta: -40, cls: "text-finance-purple bg-finance-violet border-finance-violet-border" },
  { icon: CheckCircle2, title: "الفواتير المسددة", value: "45", unit: "", delta: 15, cls: "text-finance-orange bg-finance-peach border-finance-peach-border" },
];

const payMethods = ["تحويل بنكي", "نقدي", "بطاقة ائتمانية"];
const statuses = ["مدفوعة", "معلقة", "قيد المراجعة"];
const PER_PAGE = 5;

function Donut() {
  const R = 60, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center justify-center gap-5 py-4">
      <div className="relative">
        <svg viewBox="0 0 160 160" className="size-44 -rotate-90">
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--muted)" strokeWidth="20" />
          {salesDistribution.map(([name, pct, color]) => {
            const dash = (pct / 100) * C;
            const el = <circle key={name} cx="80" cy="80" r={R} fill="none" stroke={color} strokeWidth="20" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc} />;
            acc += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <b className="block text-sm font-black text-brand-deep" dir="ltr">1,250,750</b>
            <span className="text-[9px] text-muted-foreground">ر.س</span>
          </div>
        </div>
      </div>
      <ul className="grid gap-2 text-xs font-bold">
        {salesDistribution.map(([name, pct, color]) => (
          <li key={name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: color }} />
            <span>{name}</span>
            <b className="text-muted-foreground" dir="ltr">{pct}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SalesEntries() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("2025-09-01");
  const [to, setTo] = useState("2025-09-30");
  const [customer, setCustomer] = useState("all");
  const [status, setStatus] = useState("all");
  const [pay, setPay] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => salesInvoices.filter((r) => {
    const d = r[1].replaceAll("/", "-");
    if (from && d < from) return false;
    if (to && d > to) return false;
    if (customer !== "all" && r[2] !== customer) return false;
    if (status !== "all" && r[7] !== status) return false;
    if (pay !== "all" && r[6] !== pay) return false;
    if (q && !r[0].includes(q) && !r[2].includes(q)) return false;
    return true;
  }), [from, to, customer, status, pay, q]);

  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const shown = rows.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const soon = () => toast("هذه الميزة ستتوفر قريبًا");

  const sel = "h-9 w-full appearance-none rounded-md border border-border bg-card px-3 text-xs";
  return (
    <AppShell>
      <nav className="flex items-center gap-1 text-[11px] text-muted-foreground" aria-label="مسار الصفحة">
        <span>الرئيسية</span><ChevronLeft size={12} /><span>المبيعات</span><ChevronLeft size={12} /><b className="text-foreground">إدخالات المبيعات</b>
      </nav>
      <header className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-black text-brand-deep"><FileText className="size-5 shrink-0" />إدخالات المبيعات</h1>
          <p className="mt-1 text-xs text-muted-foreground">إدارة وتسجيل فواتير المبيعات ومتابعة حالتها</p>
        </div>
        <Button className="shrink-0 gap-1" onClick={() => navigate({ to: "/sales/new" })}><Plus size={16} />إضافة فاتورة مبيعات</Button>
      </header>

      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <article key={s.title} className={`rounded-md border p-4 shadow-sm ${s.cls}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 text-foreground">
                <h2 className="text-[11px] font-extrabold">{s.title}</h2>
                <strong className="mt-2 block text-xl leading-none">{s.value} {s.unit && <span className="text-xs">{s.unit}</span>}</strong>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-current/15"><s.icon size={20} /></span>
            </div>
            <p className={`mt-3 text-[11px] font-bold ${s.delta < 0 ? "text-destructive" : "text-success"}`} dir="ltr">{s.delta > 0 ? "↑" : "↓"} {Math.abs(s.delta)}% <span className="font-normal text-muted-foreground">مقارنة بالفترة السابقة</span></p>
          </article>
        ))}
      </section>

      <section className="panel mt-3 flex flex-wrap items-end gap-2 p-3">
        <label className="grid gap-1 text-[10px] font-bold text-muted-foreground">من<input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className={sel} dir="ltr" /></label>
        <label className="grid gap-1 text-[10px] font-bold text-muted-foreground">إلى<input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className={sel} dir="ltr" /></label>
        <label className="grid min-w-32 flex-1 gap-1 text-[10px] font-bold text-muted-foreground">العميل
          <select value={customer} onChange={(e) => { setCustomer(e.target.value); setPage(1); }} className={sel}>
            <option value="all">جميع العملاء</option>
            {salesCustomers.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="grid min-w-28 gap-1 text-[10px] font-bold text-muted-foreground">الحالة
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={sel}>
            <option value="all">جميع الحالات</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="grid min-w-28 gap-1 text-[10px] font-bold text-muted-foreground">طريقة الدفع
          <select value={pay} onChange={(e) => { setPay(e.target.value); setPage(1); }} className={sel}>
            <option value="all">جميع طرق الدفع</option>
            {payMethods.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className="relative grid min-w-40 flex-1 gap-1 text-[10px] font-bold text-muted-foreground">بحث
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="ابحث باسم العميل أو رقم الفاتورة..." className="h-9 rounded-md border border-border bg-card px-3 pr-8 text-xs" />
          <Search size={14} className="pointer-events-none absolute bottom-2.5 right-2.5 text-muted-foreground" />
        </label>
        <Button variant="outline" size="sm" className="h-9 gap-1" onClick={soon}><Filter size={14} />تصفية متقدمة</Button>
      </section>

      <section className="panel mt-3 overflow-hidden">
        <div className="flex h-11 items-center justify-between border-b border-border px-4">
          <h2 className="flex items-center gap-2 text-xs font-extrabold"><BarChart3 size={15} className="text-primary" />قائمة فواتير المبيعات</h2>
          <span className="text-[10px] text-muted-foreground">إجمالي عدد الفواتير: {rows.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[10px] text-muted-foreground">
                {["#", "رقم الفاتورة", "تاريخ الفاتورة", "العميل", "إجمالي المبلغ", "الضريبة (15%)", "المبلغ الإجمالي", "طريقة الدفع", "الحالة", "الإجراءات"].map((h) => <th key={h} className="px-3 py-2.5 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr key={r[0]} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2.5 text-muted-foreground">{(cur - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-3 py-2.5 font-bold text-primary" dir="ltr">{r[0]}</td>
                  <td className="px-3 py-2.5" dir="ltr">{r[1]}</td>
                  <td className="px-3 py-2.5 font-bold">{r[2]}</td>
                  <td className="px-3 py-2.5" dir="ltr">{r[3]}</td>
                  <td className="px-3 py-2.5" dir="ltr">{r[4]}</td>
                  <td className="px-3 py-2.5 font-extrabold" dir="ltr">{r[5]}</td>
                  <td className="px-3 py-2.5">{r[6]}</td>
                  <td className="px-3 py-2.5"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[r[7]]}`}>{r[7]}</span></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <Link to="/sales/invoice" search={{ id: r[0] }} title="عرض" className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><Eye size={14} /></Link>
                      <button title="تعديل" onClick={soon} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><Pencil size={14} /></button>
                      <button title="طباعة" onClick={soon} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><Printer size={14} /></button>
                      <button title="المزيد" onClick={soon} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-10 text-center text-muted-foreground">لا توجد فواتير مطابقة للفلاتر المحددة</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <span className="text-[10px] text-muted-foreground">صفحة {cur} من {pages}</span>
          <div className="flex items-center gap-1" dir="ltr">
            <button disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-7 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={14} /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`grid size-7 place-items-center rounded-md border text-xs font-bold ${n === cur ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>
            ))}
            <button disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-7 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={14} /></button>
          </div>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 xl:grid-cols-3">
        <div className="panel overflow-hidden">
          <div className="flex h-11 items-center justify-between border-b border-border px-4">
            <h2 className="text-xs font-extrabold">أحدث الفواتير</h2>
            <Button variant="ghost" size="sm" className="h-7 px-1 text-[10px] text-primary" onClick={soon}>عرض الكل<ChevronLeft size={12} /></Button>
          </div>
          <ul className="grid divide-y divide-border">
            {salesInvoices.slice(0, 4).map((r) => (
              <li key={r[0]} className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs">
                <div className="min-w-0">
                  <b className="block text-primary" dir="ltr">{r[0]}</b>
                  <span className="block truncate text-[10px] text-muted-foreground">{r[2]} · <span dir="ltr">{r[1]}</span></span>
                </div>
                <div className="shrink-0 text-left">
                  <b className="block" dir="ltr">{r[5]} ر.س</b>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${statusStyle[r[7]]}`}>{r[7]}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel overflow-hidden">
          <div className="flex h-11 items-center border-b border-border px-4"><h2 className="text-xs font-extrabold">توزيع المبيعات حسب العميل</h2></div>
          <Donut />
        </div>
        <div className="panel overflow-hidden">
          <div className="flex h-11 items-center border-b border-border px-4"><h2 className="text-xs font-extrabold">إجراءات سريعة</h2></div>
          <div className="grid gap-2 p-4">
            <Button variant="outline" className="justify-start gap-2" onClick={() => navigate({ to: "/sales/new" })}><Plus size={15} className="text-primary" />إضافة فاتورة مبيعات</Button>
            <Button variant="outline" className="justify-start gap-2" onClick={soon}><BarChart3 size={15} className="text-primary" />إصدار تقرير المبيعات</Button>
            <Button variant="outline" className="justify-start gap-2" onClick={soon}><Download size={15} className="text-primary" />تصدير إلى Excel</Button>
            <Button variant="outline" className="justify-start gap-2" onClick={soon}><Printer size={15} className="text-primary" />طباعة الفواتير</Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
