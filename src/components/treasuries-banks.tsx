import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronDown, ChevronLeft, Coins, Database, Eye, Landmark, MoreHorizontal,
  Paperclip, Pencil, Plus, Trash2, Archive, Wallet,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import alrajhi from "@/assets/banks/alrajhi.svg";
import snb from "@/assets/banks/snb.svg";
import { tbBanks, tbTreasuries, tbMovements, tbMonthly, type TbKind, type TbMovement } from "@/data/mockData";

const fmt = (n: number) => n.toLocaleString("en-US");
const logos: Record<string, string> = { alrajhi, snb };
const NAVY = "var(--buy-navy)";
const GOLD = "var(--buy-gold)";
const kindCls: Record<TbKind, string> = {
  "إيداع": "bg-success-soft text-success",
  "صرف": "bg-destructive/10 text-destructive",
  "تحويل": "bg-primary-soft text-primary",
};
const pieColors = ["var(--buy-navy)", "var(--success)", "var(--finance-purple)", "var(--primary)", "var(--buy-gold)"];

function RowMenu({ onDelete }: { onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="خيارات" className="grid h-8 w-10 place-items-center rounded-md border border-border bg-card hover:bg-muted"><MoreHorizontal size={16} /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => toast("عرض التفاصيل")}><Eye size={14} />عرض</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("تعديل (تجريبي)")}><Pencil size={14} />تعديل</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={onDelete}><Trash2 size={14} />حذف</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="relative flex h-10 items-center rounded-lg border border-border bg-card">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-full w-full appearance-none bg-transparent pe-9 ps-4 text-sm font-semibold outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute end-3" />
    </label>
  );
}

export function TreasuriesBanks() {
  const [banks, setBanks] = useState(tbBanks);
  const [treas, setTreas] = useState(tbTreasuries);
  const [moves, setMoves] = useState<TbMovement[]>(tbMovements);
  const [kind, setKind] = useState("جميع الأنواع");
  const [status, setStatus] = useState("جميع الحالات");
  const [moveFilter, setMoveFilter] = useState("جميع الحركات");
  const [from, setFrom] = useState("2026-10-01");
  const [to, setTo] = useState("2026-10-31");
  const [dlg, setDlg] = useState<null | "move" | "bank" | "treasury">(null);
  const [form, setForm] = useState<Partial<Record<"name" | "last4" | "amount" | "desc" | "kind" | "account", string>>>({});

  const tTotal = treas.reduce((s, t) => s + t.balance, 0);
  const bTotal = banks.reduce((s, b) => s + b.balance, 0);
  const income = 620000 + moves.filter((m) => m.id > 100 && m.kind === "إيداع").reduce((s, m) => s + m.amount, 0);
  const expense = 410000 + moves.filter((m) => m.id > 100 && m.kind === "صرف").reduce((s, m) => s + m.amount, 0);
  const total = tTotal + bTotal;

  const filtered = useMemo(() => moves.filter((m) => {
    const k = moveFilter !== "جميع الحركات" ? moveFilter : kind !== "جميع الأنواع" ? kind : null;
    if (k && m.kind !== k) return false;
    if (status !== "جميع الحالات" && m.status !== status) return false;
    const d = m.date.replaceAll("/", "-");
    return d >= from && d <= to;
  }), [moves, kind, status, moveFilter, from, to]);

  const barData = [...banks.map((b) => ({ name: b.short, banks: b.balance, treas: b.chartTreas })), ...treas.map((t) => ({ name: t.name, banks: t.chartBank, treas: t.balance }))];
  const pieData = [...banks.map((b) => ({ name: b.short, value: b.balance })).slice(0, 4), { name: "الخزائن", value: tTotal }];

  const cards = [
    { t: "إجمالي المصروفات", v: expense, icon: ArrowDownLeft, wrap: "bg-destructive/5 border-destructive/20", ic: "bg-destructive/10 text-destructive", tc: "text-destructive" },
    { t: "إجمالي الإيرادات", v: income, icon: ArrowUpRight, wrap: "bg-primary-soft/50 border-primary/15", ic: "bg-primary-soft text-primary", tc: "" },
    { t: "إجمالي الرصيد الكلي", v: total, icon: Database, wrap: "bg-success-soft/50 border-success/20", ic: "bg-success-soft text-success", tc: "" },
    { t: "إجمالي أرصدة البنوك", v: bTotal, icon: Landmark, wrap: "bg-primary-soft/50 border-primary/15", ic: "bg-primary-soft text-buy-navy", tc: "" },
    { t: "إجمالي أرصدة الخزائن", v: tTotal, icon: Wallet, wrap: "bg-warning-soft/60 border-warning/20", ic: "bg-warning-soft text-buy-gold", tc: "" },
  ].reverse();

  const save = (): void => {
    const amt = Number(form["amount"] || 0);
    if (dlg === "move") {
      if (!amt || !form["desc"]) { toast.error("أدخل الوصف والمبلغ"); return; }
      const desc = form["desc"];
      const k = (form["kind"] || "إيداع") as TbKind;
      const acc = form["account"] || banks[0]?.name || "";
      const today = "2026/10/05";
      setMoves((p) => [{ id: 100 + p.length + 1, date: today, kind: k, desc, account: acc, amount: amt, after: total + (k === "صرف" ? -amt : amt), user: "مدير النظام", attach: false, status: "مكتملة" }, ...p]);
      setBanks((p) => p.map((b) => b.name === acc ? { ...b, balance: b.balance + (k === "صرف" ? -amt : k === "إيداع" ? amt : 0) } : b));
      setTreas((p) => p.map((t) => t.name === acc ? { ...t, balance: t.balance + (k === "صرف" ? -amt : k === "إيداع" ? amt : 0) } : t));
      setTo((v) => (v < "2026-10-05" ? "2026-10-05" : v));
    } else if (dlg === "bank") {
      const name = form["name"];
      if (!name) { toast.error("أدخل اسم البنك"); return; }
      setBanks((p) => [...p, { id: `b${p.length}`, name, short: name, iban: `SA** **** ***** ${form["last4"] || "0000"}`, balance: amt, logo: null, chartTreas: 0 }]);
    } else if (dlg === "treasury") {
      const name = form["name"];
      if (!name) { toast.error("أدخل اسم الخزينة"); return; }
      setTreas((p) => [...p, { id: `t${p.length}`, name, balance: amt, chartBank: 0 }]);
    }
    toast.success("تمت الإضافة (بيانات تجريبية)");
    setDlg(null); setForm({});
  };

  const card = "rounded-xl border border-border bg-card shadow-sm";

  return (
    <AppShell>
      <main dir="rtl" className="space-y-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-extrabold text-buy-navy">الخزائن والبنوك</h1>
            <nav className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">الرئيسية</Link><span>/</span>
              <Link to="/finance" className="hover:text-primary">الشؤون المالية</Link><span>/</span>
              <span>الخزائن والبنوك</span>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold">
              <CalendarDays size={15} />
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-transparent outline-none" />
              <span>-</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-transparent outline-none" />
            </label>
            <Select value={kind} onChange={setKind} options={["جميع الأنواع", "إيداع", "صرف", "تحويل"]} />
            <Select value={status} onChange={setStatus} options={["جميع الحالات", "مكتملة", "معلقة"]} />
            <Button onClick={() => setDlg("move")} className="h-11 gap-2 border-2 border-buy-gold bg-buy-navy px-6 text-base font-extrabold text-buy-gold hover:bg-buy-navy/90">
              <Plus size={18} />إضافة حركة مالية
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.t} className={`flex items-center justify-between rounded-xl border p-5 shadow-sm ${c.wrap}`}>
              <div>
                <p className={`whitespace-nowrap text-sm font-bold ${c.tc}`}>{c.t}</p>
                <p className={`mt-2 text-2xl font-extrabold leading-none ${c.tc || "text-buy-navy"}`}>{fmt(c.v)}</p>
                <p className={`mt-2 text-sm ${c.tc}`}>ريال</p>
              </div>
              <span className={`grid size-14 shrink-0 place-items-center rounded-full ${c.ic}`}><c.icon size={28} /></span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_1fr]">
          <section className={`${card} min-w-0 p-4`}>
            <h2 className="text-lg font-extrabold text-buy-navy">أرصدة الخزائن والبنوك</h2>
            <div className="mt-2 flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-buy-navy" />البنوك</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-buy-gold" />الخزائن</span>
            </div>
            <div className="h-60" dir="ltr">
              <ResponsiveContainer>
                <BarChart data={[...barData].reverse()} barGap={2} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} reversed />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v >= 1e6 ? `${v / 1e6}M` : v ? `${v / 1000}K` : "0"} width={40} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="treas" name="الخزائن" fill={GOLD} barSize={22} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="banks" name="البنوك" fill={NAVY} barSize={22} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className={`${card} min-w-0 p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-buy-navy">حركة الحسابات الشهرية</h2>
              <Select value="هذا العام" onChange={() => {}} options={["هذا العام", "العام الماضي"]} />
            </div>
            <div className="mt-2 flex justify-center gap-6 text-sm">
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-success" />الإيرادات</span>
              <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-primary" />المصروفات</span>
            </div>
            <div className="h-56" dir="ltr">
              <ResponsiveContainer>
                <AreaChart data={tbMonthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tbInc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--success)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--success)" stopOpacity={0.03} /></linearGradient>
                    <linearGradient id="tbExp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0.03} /></linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v ? `${v / 1000}K` : "0"} width={40} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Area type="linear" dataKey="inc" name="الإيرادات" stroke="var(--success)" strokeWidth={2.5} fill="url(#tbInc)" dot={{ r: 4, fill: "var(--success)" }} />
                  <Area type="linear" dataKey="exp" name="المصروفات" stroke="var(--primary)" strokeWidth={2.5} fill="url(#tbExp)" dot={{ r: 4, fill: "var(--primary)" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Distribution / banks / treasuries */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.75fr_1.55fr_1.3fr]">
          <section className={`${card} p-4`}>
            <h2 className="text-lg font-extrabold text-buy-navy">توزيع الأرصدة</h2>
            <div className="relative mx-auto h-44 w-44">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={52} outerRadius={80} startAngle={90} endAngle={-270} stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div><p className="text-xl font-extrabold text-buy-navy">{fmt(total)}</p><p className="text-sm">ريال</p></div>
              </div>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {pieData.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><i className="size-3 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />{p.name}</span>
                  <b>{((p.value / total) * 100).toFixed(1)}%</b>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${card} min-w-0 p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-buy-navy">حسابات البنوك</h2>
              <Button onClick={() => setDlg("bank")} className="gap-2 bg-buy-gold font-bold text-buy-navy hover:bg-buy-gold/90"><Plus size={16} />إضافة حساب بنكي</Button>
            </div>
            <div className="mt-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[440px] text-sm">
                <thead className="bg-muted/50 text-muted-foreground"><tr><th className="p-2.5 text-start font-semibold">البنك</th><th className="p-2.5 text-start font-semibold">رقم الحساب (IBAN)</th><th className="p-2.5 text-start font-semibold">الرصيد الحالي</th><th /></tr></thead>
                <tbody>
                  {banks.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="p-2.5"><span className="flex items-center gap-2.5">
                        {b.logo && logos[b.logo] ? <img src={logos[b.logo]} alt="" className="size-7 object-contain" /> : <span className="grid size-7 place-items-center rounded bg-buy-navy text-primary-foreground"><Landmark size={14} /></span>}
                        {b.name}</span></td>
                      <td className="p-2.5" dir="ltr" style={{ textAlign: "right" }}>{b.iban}</td>
                      <td className="p-2.5 font-extrabold">{fmt(b.balance)} <span className="text-xs font-normal">ريال</span></td>
                      <td className="w-12 p-2"><RowMenu onDelete={() => setBanks((p) => p.filter((x) => x.id !== b.id))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`${card} min-w-0 p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-buy-navy">الخزائن</h2>
              <Button onClick={() => setDlg("treasury")} className="gap-2 bg-buy-gold font-bold text-buy-navy hover:bg-buy-gold/90"><Plus size={16} />إضافة خزينة</Button>
            </div>
            <div className="mt-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[360px] text-sm">
                <thead className="bg-muted/50 text-muted-foreground"><tr><th className="p-2.5 text-start font-semibold">اسم الخزينة</th><th className="p-2.5 text-start font-semibold">الرصيد الحالي</th><th /></tr></thead>
                <tbody>
                  {treas.map((t) => (
                    <tr key={t.id} className="border-t border-border">
                      <td className="p-3"><span className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-warning-soft text-buy-gold"><Archive size={20} /></span><b className="font-bold">{t.name}</b></span></td>
                      <td className="p-3 font-extrabold">{fmt(t.balance)} <span className="text-xs font-normal">ريال</span></td>
                      <td className="p-3"><RowMenu onDelete={() => setTreas((p) => p.filter((x) => x.id !== t.id))} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Movements */}
        <section className={`${card} min-w-0 p-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-buy-navy">آخر الحركات المالية</h2>
            <Select value={moveFilter} onChange={setMoveFilter} options={["جميع الحركات", "إيداع", "صرف", "تحويل"]} />
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[960px] text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>{["م", "", "التاريخ", "النوع", "الوصف", "الحساب/الخزينة", "المبلغ (ريال)", "الرصيد بعد الحركة", "المستخدم", "مرفقات", "حالة"].map((h, i) => <th key={i} className="p-2 text-center font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr key={m.id} className="border-t border-border text-center">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2" />
                    <td className="p-2">{m.date}</td>
                    <td className="p-2"><span className={`inline-block min-w-14 rounded px-2 py-0.5 font-bold ${kindCls[m.kind]}`}>{m.kind}</span></td>
                    <td className="p-2">{m.desc}</td>
                    <td className="p-2">{m.account}</td>
                    <td className={`p-2 font-bold ${m.kind === "إيداع" ? "text-success" : m.kind === "صرف" ? "text-destructive" : "text-destructive"}`}>{fmt(m.amount)}</td>
                    <td className="p-2">{fmt(m.after)}</td>
                    <td className="p-2">{m.user}</td>
                    <td className="p-2">{m.attach && <Paperclip size={14} className="mx-auto text-primary" />}</td>
                    <td className="p-2"><span className="inline-block rounded-full bg-success-soft px-4 py-0.5 font-bold text-success">{m.status}</span></td>
                  </tr>
                ))}
                {!filtered.length && <tr><td colSpan={11} className="p-6 text-center text-muted-foreground">لا توجد حركات مطابقة</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <Dialog open={!!dlg} onOpenChange={(o) => { if (!o) { setDlg(null); setForm({}); } }}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>{dlg === "move" ? "إضافة حركة مالية" : dlg === "bank" ? "إضافة حساب بنكي" : "إضافة خزينة"}</DialogTitle></DialogHeader>
            <div className="grid gap-3 text-sm">
              {dlg === "move" && <>
                <label className="grid gap-1">النوع<select className="h-10 rounded-md border border-border bg-card px-2" value={form["kind"] || "إيداع"} onChange={(e) => setForm({ ...form, kind: e.target.value })}>{["إيداع", "صرف", "تحويل"].map((o) => <option key={o}>{o}</option>)}</select></label>
                <label className="grid gap-1">الحساب/الخزينة<select className="h-10 rounded-md border border-border bg-card px-2" value={form["account"] || banks[0]?.name} onChange={(e) => setForm({ ...form, account: e.target.value })}>{[...banks.map((b) => b.name), ...treas.map((t) => t.name)].map((o) => <option key={o}>{o}</option>)}</select></label>
                <label className="grid gap-1">الوصف<input className="h-10 rounded-md border border-border bg-card px-2" value={form["desc"] || ""} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
              </>}
              {dlg !== "move" && <label className="grid gap-1">{dlg === "bank" ? "اسم البنك" : "اسم الخزينة"}<input className="h-10 rounded-md border border-border bg-card px-2" value={form["name"] || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
              {dlg === "bank" && <label className="grid gap-1">آخر 4 أرقام من الحساب<input maxLength={4} className="h-10 rounded-md border border-border bg-card px-2" value={form["last4"] || ""} onChange={(e) => setForm({ ...form, last4: e.target.value })} /></label>}
              <label className="grid gap-1">{dlg === "move" ? "المبلغ" : "الرصيد الافتتاحي"}<input type="number" className="h-10 rounded-md border border-border bg-card px-2" value={form["amount"] || ""} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
              <Button onClick={save} className="bg-buy-navy text-buy-gold hover:bg-buy-navy/90"><Coins size={16} />حفظ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </AppShell>
  );
}
