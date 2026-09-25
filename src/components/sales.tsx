import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3, Calendar, ChevronLeft, ChevronRight, Download, Eye, FileText, Landmark, Plus, Printer, Receipt,
  Search, ShoppingCart, TrendingUp, Wallet, Zap, FileSpreadsheet, Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { salesCustomers } from "@/data/mockData";
import { toast } from "sonner";

type Inv = { id: string; customer: string; date: string; due: string; total: number; status: string };
const statuses = ["مدفوعة", "قيد المراجعة", "معلقة"];
const first: Inv[] = [
  { id: "INV-000125", customer: "شركة التقنية الحديثة", date: "2025-09-20", due: "2025-10-05", total: 12650, status: "مدفوعة" },
  { id: "INV-000124", customer: "مؤسسة الخليج للتجارة", date: "2025-09-18", due: "2025-10-03", total: 8450, status: "قيد المراجعة" },
  { id: "INV-000123", customer: "شركة الأفق للمقاولات", date: "2025-09-15", due: "2025-09-30", total: 25300, status: "معلقة" },
  { id: "INV-000122", customer: "مركز الواحة الطبي", date: "2025-09-12", due: "2025-09-27", total: 9780, status: "مدفوعة" },
  { id: "INV-000121", customer: "شركة السلام للصناعة", date: "2025-09-10", due: "2025-09-25", total: 17500, status: "معلقة" },
];
const customers = Array.from(new Set([...first.map((f) => f.customer), ...salesCustomers]));
const seed: Inv[] = [...first, ...Array.from({ length: 43 }, (_, i) => {
  const day = 9 - (i % 9);
  return { id: `INV-${String(120 - i).padStart(6, "0")}`, customer: customers[i % customers.length]!, date: `2025-09-${String(day).padStart(2, "0")}`, due: `2025-09-${String(day + 15).padStart(2, "0")}`, total: 4000 + ((i * 2731) % 40) * 650, status: i % 4 === 1 ? "معلقة" : i % 11 === 5 ? "قيد المراجعة" : "مدفوعة" };
})];
const purchases = [
  { id: "PUR-000056", vendor: "شركة المواد الخام", date: "2025/09/18", due: "2025/10/03", tax: "2,280.00", status: "مدفوعة" },
  { id: "PUR-000055", vendor: "مؤسسة الخدمات اللوجستية", date: "2025/09/16", due: "2025/10/01", tax: "1,027.50", status: "قيد المراجعة" },
  { id: "PUR-000054", vendor: "شركة التقنية", date: "2025/09/12", due: "2025/09/27", tax: "1,714.50", status: "معلقة" },
  { id: "PUR-000053", vendor: "شركة الإمداد", date: "2025/09/09", due: "2025/09/24", tax: "945.00", status: "مدفوعة" },
  { id: "PUR-000052", vendor: "مؤسسة النور", date: "2025/09/05", due: "2025/09/20", tax: "1,320.00", status: "مدفوعة" },
];
const months: [string, number][] = [["أغسطس", 23], ["سبتمبر", 28], ["أكتوبر", 21], ["نوفمبر", 28], ["ديسمبر", 21]];
const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const badge: Record<string, string> = { "مدفوعة": "bg-success/15 text-success", "قيد المراجعة": "bg-primary-soft text-primary", "معلقة": "bg-warning/15 text-warning" };
const card = "min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm";
const PER = 5;

export function SalesEntries() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState(""); const [st, setSt] = useState("الكل"); const [cu, setCu] = useState("الكل");
  const [from, setFrom] = useState("2025-09-01"); const [to, setTo] = useState("2025-09-30");
  const [page, setPage] = useState(1); const [pPage, setPPage] = useState(1);
  const [checked, setChecked] = useState<string[]>([]);

  const filtered = useMemo(() => rows.filter((r) => (!q || r.id.includes(q) || r.customer.includes(q)) && (st === "الكل" || r.status === st) && (cu === "الكل" || r.customer === cu) && r.date >= from && r.date <= to), [rows, q, st, cu, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const pStart = Math.min(Math.max(1, cur - 2), Math.max(1, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => pStart + i);
  const pShown = purchases.slice((pPage - 1) * 3, pPage * 3);
  const allChecked = shown.length > 0 && shown.every((r) => checked.includes(r.id));

  const exportCsv = (list: Inv[], name: string) => {
    const csv = [["رقم الفاتورة", "العميل", "تاريخ الفاتورة", "تاريخ الاستحقاق", "المبلغ الإجمالي", "الضريبة (15%)", "الحالة"], ...list.map((r) => [r.id, r.customer, dmy(r.date), dmy(r.due), r.total, (r.total * 0.15).toFixed(2), r.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = `${name}.csv`; a.click();
    toast.success("تم تنزيل الملف");
  };
  const printInv = (r: Inv) => {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html dir="rtl"><body style="font-family:Cairo,sans-serif;padding:32px"><h2>فاتورة مبيعات ${r.id}</h2><p>العميل: ${r.customer}</p><p>تاريخ الفاتورة: ${dmy(r.date)}</p><p>تاريخ الاستحقاق: ${dmy(r.due)}</p><p>المبلغ: ${fmt(r.total)} ر.س</p><p>الضريبة: ${fmt(r.total * 0.15)} ر.س</p><p>الحالة: ${r.status}</p></body></html>`);
    w.document.close(); w.print();
  };
  const del = (id: string) => { setRows((p) => p.filter((r) => r.id !== id)); toast.success(`تم حذف ${id}`); };

  const stats = [
    { t: "الفواتير المعلقة", v: "16", d: "↓ 6%", dc: "text-destructive", icon: Wallet, box: "bg-warning/10 border-warning/30", ic: "bg-warning/20 text-warning", tc: "text-warning" },
    { t: "الفواتير المدفوعة", v: "32", d: "↑ 15%", dc: "text-success", icon: FileText, box: "bg-finance-violet border-finance-purple/20", ic: "bg-finance-purple/15 text-finance-purple", tc: "text-finance-purple" },
    { t: "عدد الفواتير", v: "48", d: "↑ 8%", dc: "text-success", icon: Receipt, box: "bg-success/10 border-success/20", ic: "bg-success/20 text-success", tc: "" },
    { t: "إجمالي المبالغ", v: "542,750.00", unit: "ر.س", d: "↑ 12%", dc: "text-success", icon: Landmark, box: "bg-primary-soft border-primary/20", ic: "bg-primary/15 text-primary", tc: "" },
  ];
  const quick: [string, typeof Plus, string, () => void][] = [
    ["إصدار فاتورة مبيعات", FileText, "bg-primary-soft text-primary", () => navigate({ to: "/sales/new" })],
    ["إصدار فاتورة مشتريات", ShoppingCart, "bg-success/10 text-success", () => navigate({ to: "/purchases/new" })],
    ["تقرير ضريبة القيمة المضافة", BarChart3, "bg-finance-violet text-finance-purple", () => document.getElementById("vat")?.scrollIntoView({ behavior: "smooth" })],
    ["تقرير المبيعات", TrendingUp, "bg-primary-soft text-primary", () => exportCsv(rows, "تقرير-المبيعات")],
    ["تقرير المشتريات", FileSpreadsheet, "bg-success/10 text-success", () => navigate({ to: "/purchases/new" })],
    ["تقرير الأرباح والخسائر", BarChart3, "bg-warning/10 text-warning", () => navigate({ to: "/reports/financial" })],
  ];
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  const donut: [string, number, string][] = [["مدفوعة", 32, "var(--success)"], ["معلقة", 12, "var(--finance-orange)"], ["قيد المراجعة", 4, "var(--primary)"]];

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">المالية ‹ الفواتير ‹ فواتير المبيعات</p>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold"><FileText className="text-primary" size={26} />فواتير المبيعات</h1>
          <p className="mt-1 text-sm text-muted-foreground">إصدار وإدارة فواتير المبيعات ومتابعة حالتها إلكترونيًا.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.t} className={`rounded-xl border p-4 shadow-sm ${s.box}`}>
              <div className="flex items-start justify-between"><div><p className={`text-sm font-bold ${s.tc}`}>{s.t}</p><p className={`mt-2 text-2xl font-extrabold ${s.tc}`}>{s.v} {s.unit && <span className="text-sm">{s.unit}</span>}</p></div><span className={`grid size-11 place-items-center rounded-full ${s.ic}`}><s.icon size={20} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر الماضي</span><b className={s.dc}>{s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="grid items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr_auto_auto]">
          <div className="relative"><Search size={16} className="absolute right-3 top-3 text-muted-foreground" /><input className={`${field} pr-9`} placeholder="ابحث عن رقم الفاتورة أو اسم العميل..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
          <select className={field} value={st} onChange={(e) => { setSt(e.target.value); setPage(1); }}><option value="الكل">جميع الحالات</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
          <select className={field} value={cu} onChange={(e) => { setCu(e.target.value); setPage(1); }}><option value="الكل">جميع العملاء</option>{customers.map((s) => <option key={s}>{s}</option>)}</select>
          <div className="flex items-center gap-1.5"><Calendar size={16} className="shrink-0 text-muted-foreground" /><input type="date" aria-label="من" className={field} value={from} onChange={(e) => setFrom(e.target.value)} /><input type="date" aria-label="إلى" className={field} value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <Button variant="outline" className="h-10 gap-1.5" onClick={() => exportCsv(filtered, "فواتير-المبيعات")}><Download size={16} />تصدير</Button>
          <Button className="h-10 gap-1.5" onClick={() => navigate({ to: "/sales/new" })}><Plus size={16} />إصدار فاتورة مبيعات</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
          <section className={card}>
            <h2 className="mb-3 font-extrabold">قائمة فواتير المبيعات</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-muted/50 text-xs"><tr>
                  <th className="p-2.5"><input type="checkbox" aria-label="تحديد الكل" checked={allChecked} onChange={() => setChecked(allChecked ? checked.filter((c) => !shown.some((r) => r.id === c)) : [...new Set([...checked, ...shown.map((r) => r.id)])])} /></th>
                  {["رقم الفاتورة", "العميل", "تاريخ الفاتورة", "تاريخ الاستحقاق", "المبلغ الإجمالي", "الضريبة (15%)", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}
                </tr></thead>
                <tbody>{shown.map((r) => (
                  <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                    <td className="p-2.5 text-center"><input type="checkbox" aria-label={r.id} checked={checked.includes(r.id)} onChange={() => setChecked((c) => c.includes(r.id) ? c.filter((x) => x !== r.id) : [...c, r.id])} /></td>
                    <td className="p-2.5 font-bold">{r.id}</td><td className="p-2.5">{r.customer}</td><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5">{dmy(r.due)}</td>
                    <td className="p-2.5">{fmt(r.total)}</td><td className="p-2.5">{fmt(r.total * 0.15)}</td>
                    <td className="p-2.5"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${badge[r.status]}`}>{r.status}</span></td>
                    <td className="p-2.5"><div className="flex gap-1">
                      <button title="حذف" onClick={() => del(r.id)} className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
                      <button title="طباعة" onClick={() => printInv(r)} className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted"><Printer size={13} /></button>
                      <Link to="/sales/invoice" search={{ id: r.id }} title="عرض" className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted"><Eye size={13} /></Link>
                    </div></td>
                  </tr>
                ))}{!shown.length && <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">لا توجد فواتير مطابقة</td></tr>}</tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>إجمالي عدد الفواتير: <b>{filtered.length}</b></span>
              <div className="flex gap-1.5">
                <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                {nums.map((n) => <button key={n} onClick={() => setPage(n)} className={`size-8 rounded-md border ${cur === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
                <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
              </div>
            </div>
          </section>

          <div className="space-y-4">
            <section className={card}>
              <h2 className="mb-2 flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />إجمالي المبيعات</h2>
              <svg viewBox="0 0 260 150" className="w-full">
                {[0, 10, 20, 30, 40].map((v) => <g key={v}><line x1="28" x2="258" y1={125 - v * 2.6} y2={125 - v * 2.6} stroke="var(--border)" /><text x="0" y={128 - v * 2.6} fontSize="8" fill="var(--muted-foreground)">{v ? `${v}k` : 0}</text></g>)}
                {months.map(([m, v], i) => <g key={m}><rect x={40 + i * 44} y={125 - v * 2.6} width="26" height={v * 2.6} rx="3" fill="var(--primary)" opacity={m === "سبتمبر" ? 1 : 0.25} /><text x={53 + i * 44} y="142" fontSize="8" textAnchor="middle" fontWeight={m === "سبتمبر" ? 700 : 400} fill="var(--muted-foreground)">{m}</text></g>)}
              </svg>
            </section>
            <section className={card}>
              <h2 className="mb-3 font-extrabold">حالة الفواتير</h2>
              <div className="flex items-center justify-between gap-4">
                <ul className="flex-1 space-y-3 text-sm">{donut.map(([n, v, c]) => <li key={n} className="flex justify-between"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><b>{v}</b></li>)}</ul>
                <div className="relative">
                  <svg viewBox="0 0 140 140" className="size-32 -rotate-90">{donut.map(([n, v, c]) => { const L = (v / 48) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="20" strokeDasharray={`${L} ${C - L}`} strokeDashoffset={-acc} />; acc += L; return el; })}</svg>
                  <div className="absolute inset-0 grid place-content-center text-center"><b className="text-xl">48</b><span className="text-[10px] text-muted-foreground">إجمالي الفواتير</span></div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr_1fr]">
          <section className={card}>
            <h2 className="flex items-center gap-2 font-extrabold"><Receipt size={18} className="text-primary" />فواتير المشتريات</h2>
            <p className="mb-3 text-xs text-muted-foreground">متابعة فواتير المشتريات من الموردين</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-muted/50 text-xs"><tr>{["رقم الفاتورة", "المورد", "تاريخ الفاتورة", "تاريخ الاستحقاق", "الضريبة (15%)", "الحالة"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                <tbody>{pShown.map((p) => <tr key={p.id} className="border-t border-border"><td className="p-2.5">{p.id}</td><td className="p-2.5">{p.vendor}</td><td className="p-2.5">{p.date}</td><td className="p-2.5">{p.due}</td><td className="p-2.5">{p.tax}</td><td className="p-2.5"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${badge[p.status]}`}>{p.status}</span></td></tr>)}</tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">إجمالي عدد الفواتير: 28</span>
              <div className="flex gap-1.5">{[1, 2].map((n) => <button key={n} onClick={() => setPPage(n)} className={`size-8 rounded-md border ${pPage === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}</div>
            </div>
          </section>

          <section id="vat" className={card}>
            <h2 className="flex items-center gap-2 font-extrabold"><Landmark size={18} className="text-primary" />تقرير ضريبة القيمة المضافة</h2>
            <p className="mb-3 text-xs text-muted-foreground">عرض ملخص الضريبة المستحقة والخصم والفروق.</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-finance-violet p-2"><p>الضريبة المستحقة</p><b className="mt-1 block text-sm">42,640.00 ر.س</b></div>
              <div className="rounded-lg bg-primary-soft p-2"><p>ضريبة المدخلات</p><b className="mt-1 block text-sm">42,780.00 ر.س</b></div>
              <div className="rounded-lg bg-success/10 p-2"><p>ضريبة المخرجات</p><b className="mt-1 block text-sm">85,420.00 ر.س</b></div>
            </div>
            <h3 className="mb-2 mt-4 text-sm font-bold">تفاصيل التقرير</h3>
            <div className="overflow-hidden rounded-lg border border-border text-xs">
              {[["البند", "المبلغ"], ["إجمالي المبيعات الخاضعة للضريبة", "567,000.00"], ["إجمالي المشتريات الخاضعة للضريبة", "285,200.00"], ["الضريبة على المبيعات (15%)", "85,420.00"], ["الضريبة على المشتريات (15%)", "42,780.00"]].map(([k, v], i) => <div key={k} className={`flex justify-between p-2 ${i ? "border-t border-border" : "bg-muted/50 font-bold"}`}><span>{k}</span><span>{v}</span></div>)}
              <div className="flex justify-between border-t border-border bg-primary-soft p-2.5 text-sm font-extrabold"><span>الضريبة المستحقة</span><span>42,640.00</span></div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => navigate({ to: "/reports/financial" })}><FileText size={14} />عرض التقرير الكامل</Button>
          </section>

          <section className={card}>
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><Zap size={18} className="text-primary" />إجراءات سريعة</h2>
            <div className="space-y-2">{quick.map(([l, I, cls, fn]) => <button key={l} onClick={fn} className={`flex w-full items-center justify-between rounded-lg border border-border p-3 text-sm font-bold hover:opacity-80 ${cls}`}><span>{l}</span><I size={17} /></button>)}</div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
