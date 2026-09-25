import { useMemo, useState } from "react";
import { BarChart3, CalendarCheck, CheckCircle2, Clock, Coins, Eye, FileText, MoreHorizontal, PieChart, Plus, Printer, Search, Wallet, X, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type O = { id: string; date: string; payee: string; amount: number; dept: string; method: string; status: string; account: string; note: string };
const depts = ["تقنية المعلومات", "الموارد البشرية", "المشتريات", "المالية", "المشاريع"];
const methods = ["تحويل بنكي", "صراف آلي", "شيك", "نقدي"];
const statuses = ["معتمد", "قيد المراجعة", "مرفوض", "ملغي"];
const first: O[] = [
  { id: "SP-2025-00123", date: "2025-09-21", payee: "شركة الحلول التقنية", amount: 250000, dept: "تقنية المعلومات", method: "تحويل بنكي", status: "معتمد", account: "SA********4567", note: "مستحقات عقد دعم فني" },
  { id: "SP-2025-00122", date: "2025-09-20", payee: "محمد علي الزهراني", amount: 75000, dept: "الموارد البشرية", method: "تحويل بنكي", status: "قيد المراجعة", account: "SA********1290", note: "مكافأة نهاية خدمة" },
  { id: "SP-2025-00121", date: "2025-09-18", payee: "مؤسسة الإبداع", amount: 180000, dept: "المشتريات", method: "تحويل بنكي", status: "معتمد", account: "SA********7781", note: "توريد أجهزة مكتبية" },
  { id: "SP-2025-00120", date: "2025-09-16", payee: "أحمد خالد العتيبي", amount: 42500, dept: "المالية", method: "صراف آلي", status: "مرفوض", account: "SA********3345", note: "بدل انتداب" },
  { id: "SP-2025-00119", date: "2025-09-14", payee: "شركة الريادة", amount: 120000, dept: "المشاريع", method: "تحويل بنكي", status: "معتمد", account: "SA********9902", note: "دفعة مشروع" },
];
const payees = ["شركة النخبة", "سارة القحطاني", "مؤسسة البناء", "فهد الشمري", "شركة الأفق"];
const seed: O[] = [...first, ...Array.from({ length: 119 }, (_, i) => ({
  id: `SP-2025-${String(118 - i).padStart(5, "0")}`, date: `2025-09-${String(13 - (i % 13)).padStart(2, "0")}`, payee: payees[i % 5]!, amount: 5000 + ((i * 3719) % 50) * 2500,
  dept: depts[i % 5]!, method: methods[i % 4]!, status: i % 7 === 3 ? "قيد المراجعة" : i % 15 === 8 ? "مرفوض" : "معتمد", account: `SA********${1000 + ((i * 37) % 9000)}`, note: "أمر صرف تشغيلي",
}))];
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const field = "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const badge: Record<string, string> = { "معتمد": "bg-success/15 text-success", "قيد المراجعة": "bg-warning/15 text-warning", "مرفوض": "bg-destructive/10 text-destructive", "ملغي": "bg-muted text-muted-foreground" };
const SIcon = ({ s }: { s: string }) => s === "معتمد" ? <CheckCircle2 size={12} /> : s === "قيد المراجعة" ? <Clock size={12} /> : <XCircle size={12} />;
const dist: [string, number, string][] = [["تقنية المعلومات", 32, "var(--primary)"], ["الموارد البشرية", 18, "var(--success)"], ["المشتريات", 15, "var(--finance-orange)"], ["المالية", 12, "var(--finance-purple)"], ["المشاريع", 10, "var(--info, var(--primary))"], ["أخرى", 13, "var(--border)"]];
const bars: [string, number][] = [["أبريل", 820], ["مايو", 1000], ["يونيو", 1280], ["يوليو", 1500], ["أغسطس", 1850], ["سبتمبر", 2250]];
const PER = 5;
const blank = { payee: "", amount: "", dept: depts[0]!, method: methods[0]!, account: "", note: "" };

export function PaymentOrders() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState(""); const [dept, setDept] = useState("الكل"); const [st, setSt] = useState("الكل"); const [mt, setMt] = useState("الكل");
  const [from, setFrom] = useState("2025-09-01"); const [to, setTo] = useState("2025-09-30");
  const [page, setPage] = useState(1); const [sel, setSel] = useState(first[0]!.id);
  const [open, setOpen] = useState(false); const [form, setForm] = useState(blank);

  const filtered = useMemo(() => rows.filter((r) => (!q || r.id.includes(q) || r.payee.includes(q)) && (dept === "الكل" || r.dept === dept) && (st === "الكل" || r.status === st) && (mt === "الكل" || r.method === mt) && r.date >= from && r.date <= to), [rows, q, dept, st, mt, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const d = rows.find((r) => r.id === sel) ?? rows[0]!;
  const setStatus = (id: string, s: string) => { setRows((p) => p.map((r) => r.id === id ? { ...r, status: s } : r)); toast.success(`تم تغيير الحالة إلى «${s}»`); };
  const printOrder = () => {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html dir="rtl"><body style="font-family:Cairo,sans-serif;padding:32px"><h2>أمر صرف ${d.id}</h2>${[["التاريخ", dmy(d.date)], ["المستفيد", d.payee], ["المبلغ", fmt(d.amount) + " ر.س"], ["الإدارة", d.dept], ["طريقة الدفع", d.method], ["رقم الحساب", d.account], ["ملاحظات", d.note], ["الحالة", d.status]].map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`).join("")}</body></html>`);
    w.document.close(); w.print();
  };
  const save = () => {
    const amt = Number(form.amount);
    if (!form.payee.trim() || !amt) { toast.error("أدخل المستفيد والمبلغ"); return; }
    const id = `SP-2025-${String(Math.max(...rows.map((r) => Number(r.id.slice(-5)))) + 1).padStart(5, "0")}`;
    setRows([{ id, date: "2025-09-30", payee: form.payee, amount: amt, dept: form.dept, method: form.method, status: "قيد المراجعة", account: form.account || "—", note: form.note || "—" }, ...rows]);
    setSel(id); setOpen(false); setForm(blank); setPage(1); toast.success(`تم إصدار أمر الصرف ${id}`);
  };

  const stats = [
    { t: "أوامر مرفوضة", v: "8", d: "0%", c: "text-muted-foreground", icon: CalendarCheck, cls: "bg-primary-soft text-primary" },
    { t: "أوامر معتمدة", v: "98", d: "↑ 15%", c: "text-success", icon: CheckCircle2, cls: "bg-warning/15 text-warning" },
    { t: "أوامر قيد المراجعة", v: "18", d: "↓ 5%", c: "text-destructive", icon: Clock, cls: "bg-primary-soft text-primary" },
    { t: "عدد أوامر الصرف", v: "124", d: "↑ 8%", c: "text-success", icon: FileText, cls: "bg-finance-violet text-finance-purple" },
    { t: "إجمالي المصروفات", v: "2,480,750", unit: "ر.س", d: "↑ 12%", c: "text-success", icon: Coins, cls: "bg-success/15 text-success" },
  ];
  const R = 52, C = 2 * Math.PI * R; let acc = 0;
  const Sel = ({ v, set, all, opts }: { v: string; set: (s: string) => void; all: string; opts: string[] }) => (
    <select className={field} value={v} onChange={(e) => { set(e.target.value); setPage(1); }}><option value="الكل">{all}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
  );

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold"><Wallet className="text-primary" size={26} />أوامر الصرف</h1>
          <p className="mt-1 text-sm text-muted-foreground">إدارة ومتابعة أوامر الصرف واعتمادها ومراقبة تفاصيلها</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-2 text-2xl font-extrabold">{s.v} {s.unit && <span className="text-sm">{s.unit}</span>}</p></div><span className={`grid size-11 place-items-center rounded-xl ${s.cls}`}><s.icon size={21} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">مقارنة بالشهر السابق</span><b className={s.c}>{s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-[auto_1.3fr_1fr_1fr_1fr_1.5fr]">
          <Button className="h-11 gap-1.5" onClick={() => setOpen(true)}><Plus size={17} />إصدار أمر صرف</Button>
          <div className="relative"><Search size={16} className="absolute right-3 top-3.5 text-muted-foreground" /><input className={`${field} pr-9`} placeholder="ابحث بالرقم أو اسم المستفيد..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
          <Sel v={dept} set={setDept} all="جميع الإدارات" opts={depts} />
          <Sel v={st} set={setSt} all="جميع الحالات" opts={statuses} />
          <Sel v={mt} set={setMt} all="جميع طرق الدفع" opts={methods} />
          <div className="flex gap-2"><input type="date" className={field} value={from} onChange={(e) => setFrom(e.target.value)} aria-label="من تاريخ" /><input type="date" className={field} value={to} onChange={(e) => setTo(e.target.value)} aria-label="إلى تاريخ" /></div>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />أوامر الصرف</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-muted/50 text-xs"><tr>{["رقم أمر الصرف", "التاريخ", "المستفيد", "المبلغ", "الإدارة", "طريقة الدفع", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>{shown.map((r) => (
                <tr key={r.id} onClick={() => setSel(r.id)} className={`cursor-pointer border-t border-border ${sel === r.id ? "bg-primary-soft/50" : "hover:bg-muted/30"}`}>
                  <td className="p-2.5 font-semibold">{r.id}</td><td className="p-2.5">{dmy(r.date)}</td><td className="p-2.5">{r.payee}</td><td className="p-2.5">{fmt(r.amount)} ر.س</td><td className="p-2.5">{r.dept}</td><td className="p-2.5">{r.method}</td>
                  <td className="p-2.5"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${badge[r.status]}`}><SIcon s={r.status} />{r.status}</span></td>
                  <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="إجراءات" className="grid size-8 place-items-center rounded-md border border-border"><MoreHorizontal size={15} /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSel(r.id)}>عرض التفاصيل</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(r.id, "معتمد")}>اعتماد</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatus(r.id, "مرفوض")}>رفض</DropdownMenuItem>
                      </DropdownMenuContent></DropdownMenu>
                  </td>
                </tr>
              ))}{!shown.length && <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">لا توجد أوامر صرف مطابقة</td></tr>}</tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">إجمالي الأوامر: {filtered.length}</span>
            <div className="flex items-center gap-2"><Button size="sm" variant="outline" disabled={cur === 1} onClick={() => setPage(cur - 1)}>السابق</Button><span>{cur} / {pages}</span><Button size="sm" variant="outline" disabled={cur === pages} onClick={() => setPage(cur + 1)}>التالي</Button></div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />إجمالي المصروفات (آخر 6 أشهر)</h2>
            <svg viewBox="0 0 320 200" className="w-full">
              {[0, 500, 1000, 1500, 2000, 2500].map((v) => <g key={v}><line x1="62" x2="318" y1={175 - v * 0.06} y2={175 - v * 0.06} stroke="var(--border)" /><text x="0" y={178 - v * 0.06} fontSize="8" fill="var(--muted-foreground)">{fmt(v * 1000)}</text></g>)}
              {bars.map(([m, v], i) => <g key={m}><rect x={78 + i * 40} y={175 - v * 0.06} width="22" height={v * 0.06} rx="3" fill="var(--primary)" /><text x={89 + i * 40} y="192" fontSize="8" textAnchor="middle" fill="var(--muted-foreground)">{m}</text></g>)}
            </svg>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><PieChart size={18} className="text-primary" />توزيع أوامر الصرف حسب الإدارة</h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ul className="min-w-40 flex-1 space-y-2.5 text-sm">{dist.map(([n, p, c]) => <li key={n} className="flex justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} />{n}</span><span className="text-muted-foreground">{p}%</span></li>)}</ul>
              <div className="relative">
                <svg viewBox="0 0 140 140" className="size-40 -rotate-90">{dist.map(([n, p, c]) => { const L = (p / 100) * C; const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="18" strokeDasharray={`${L} ${C - L}`} strokeDashoffset={-acc} />; acc += L; return el; })}</svg>
                <div className="absolute inset-0 grid place-content-center text-center"><b className="text-lg">2,480,750</b><span className="text-xs text-muted-foreground">ر.س</span></div>
              </div>
            </div>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2"><div><h2 className="font-extrabold">تفاصيل أمر الصرف</h2><p className="mt-1 text-lg font-bold">{d.id}</p></div><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${badge[d.status]}`}><SIcon s={d.status} />{d.status}</span></div>
            <dl className="mt-3 space-y-1.5 border-y border-border py-3 text-sm">
              {[["التاريخ", dmy(d.date)], ["المستفيد", d.payee], ["المبلغ", `${fmt(d.amount)} ر.س`], ["الإدارة", d.dept], ["طريقة الدفع", d.method], ["رقم الحساب", d.account], ["ملاحظات", d.note]].map(([k, v]) => <div key={k} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button className="flex-1 gap-1.5" onClick={() => toast.info(`مستندات ${d.id}: عقد_الخدمة.pdf، الفاتورة.pdf`)}><Eye size={16} />عرض المستندات</Button>
              <Button variant="outline" className="flex-1 gap-1.5" disabled={d.status === "ملغي"} onClick={() => setStatus(d.id, "ملغي")}><X size={16} />إلغاء الأمر</Button>
              <Button variant="outline" className="gap-1.5" onClick={printOrder}><Printer size={16} />طباعة</Button>
            </div>
          </section>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl"><DialogHeader><DialogTitle>إصدار أمر صرف</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">المستفيد<input className={field} value={form.payee} onChange={(e) => setForm({ ...form, payee: e.target.value })} /></label>
            <label className="text-sm">المبلغ (ر.س)<input type="number" className={field} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
            <label className="text-sm">الإدارة<select className={field} value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}>{depts.map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="text-sm">طريقة الدفع<select className={field} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>{methods.map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="text-sm">رقم الحساب<input className={field} value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} /></label>
            <label className="text-sm sm:col-span-2">ملاحظات<input className={field} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>
          </div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={save}>إصدار</Button></div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
