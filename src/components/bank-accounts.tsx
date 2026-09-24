import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown, ArrowLeftRight, ArrowUp, ArrowUpFromLine, ArrowDownToLine, ChevronLeft, ChevronRight, Download, Globe, Landmark,
  Plus, RefreshCw, Search, Wallet, HandCoins, PiggyBank,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import alrajhi from "@/assets/banks/alrajhi.svg";
import snb from "@/assets/banks/snb.svg";

type Kind = "إيداع" | "سحب" | "تحويل";
type Mv = { id: number; bank: string; date: string; desc: string; kind: Kind; amount: number; status: string };
type Bank = { id: string; name: string; last4: string; iban: string; balance: number; logo: string | null };

const initialBanks: Bank[] = [
  { id: "rajhi", name: "مصرف الراجحي", last4: "4821", iban: "SA56 8000 0123 4567 8901 2345", balance: 650250, logo: alrajhi },
  { id: "snb", name: "البنك الأهلي السعودي", last4: "7315", iban: "SA12 1000 0987 6543 2101 7315", balance: 420800, logo: snb },
  { id: "riyad", name: "بنك الرياض", last4: "9042", iban: "SA33 2000 0456 7890 1234 9042", balance: 213600, logo: null },
];
const m = (id: number, bank: string, date: string, desc: string, kind: Kind, amount: number, status = "مطابقة"): Mv => ({ id, bank, date, desc, kind, amount, status });
const seed: Mv[] = [
  m(1, "rajhi", "2026-09-20", "تحصيل فاتورة مبيعات رقم (INV-125)", "إيداع", 25000),
  m(2, "rajhi", "2026-09-19", "سداد لمورد رقم (PUR-084)", "سحب", 8500),
  m(3, "rajhi", "2026-09-18", "تحويل من البنك الأهلي", "تحويل", 40000),
  m(4, "rajhi", "2026-09-17", "إيداع نقدي", "إيداع", 12500, "بانتظار التسوية"),
  m(5, "rajhi", "2026-09-16", "أمر صرف رواتب الموظفين", "سحب", 62400),
  m(6, "rajhi", "2026-09-15", "تحصيل من عميل رقم (INV-099)", "إيداع", 15750),
  m(7, "rajhi", "2026-09-14", "مصاريف تشغيلية", "سحب", 5200, "مراجعة"),
  m(8, "rajhi", "2026-09-13", "تحويل إلى حساب آخر", "تحويل", 33750),
  m(9, "snb", "2026-09-20", "تحصيل فاتورة مبيعات رقم (INV-121)", "إيداع", 18200),
  m(10, "snb", "2026-09-18", "تحويل إلى مصرف الراجحي", "تحويل", 40000),
  m(11, "snb", "2026-09-15", "سداد إيجار المبنى", "سحب", 50000),
  m(12, "snb", "2026-09-11", "إيداع شيك عميل", "إيداع", 27300, "بانتظار التسوية"),
  m(13, "riyad", "2026-09-19", "رسوم خدمات بنكية", "سحب", 350, "مراجعة"),
  m(14, "riyad", "2026-09-16", "تحصيل من عميل رقم (INV-110)", "إيداع", 22400),
  m(15, "riyad", "2026-09-12", "سداد اشتراك البرامج", "سحب", 6800),
];
const chart = [["1-5", 68, 45], ["6-10", 75, 58], ["11-15", 66, 55], ["16-20", 88, 70], ["21-30", 118, 100]] as const;
const fmt = (n: number) => n.toLocaleString("en-US");
const dmy = (d: string) => d.replaceAll("-", "/");
const sign = (k: Kind) => (k === "سحب" ? -1 : 1);
const pill: Record<string, string> = { "مطابقة": "bg-success/15 text-success", "بانتظار التسوية": "bg-warning/15 text-warning", "مراجعة": "bg-primary-soft text-primary" };
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const PER = 8;

function Logo({ b, size = 44 }: { b: Bank; size?: number }) {
  return b.logo ? <img src={b.logo} alt={b.name} style={{ width: size, height: size }} className="rounded-full border border-border bg-card object-contain p-1" />
    : <span style={{ width: size, height: size }} className="grid place-items-center rounded-full bg-primary-soft text-primary"><Landmark size={size / 2} /></span>;
}

export function BankAccounts() {
  const [banks, setBanks] = useState(initialBanks);
  const [mvs, setMvs] = useState(seed);
  const [sel, setSel] = useState("rajhi");
  const [q, setQ] = useState(""); const [kind, setKind] = useState("الكل"); const [from, setFrom] = useState(""); const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<{ bank: string; kind: Kind; amount: string; desc: string; date: string } | null>(null);
  const [settle, setSettle] = useState(false);
  const bank = banks.find((b) => b.id === sel) ?? banks[0]!;

  const added = mvs.filter((x) => x.id > 1000);
  const dep = 425800 + added.filter((x) => x.kind !== "سحب").reduce((s, x) => s + x.amount, 0);
  const wd = 218450 + added.filter((x) => x.kind === "سحب").reduce((s, x) => s + x.amount, 0);
  const pending = 7 - seed.filter((x) => x.status !== "مطابقة").length + mvs.filter((x) => x.status !== "مطابقة").length;
  const totalBal = banks.reduce((s, b) => s + b.balance, 0);

  const bankMvs = mvs.filter((x) => x.bank === sel);
  const today = bankMvs[0]?.date;
  const todayIn = bankMvs.filter((x) => x.date === today && x.kind !== "سحب").reduce((s, x) => s + x.amount, 0);
  const todayOut = bankMvs.filter((x) => x.date === today && x.kind === "سحب").reduce((s, x) => s + x.amount, 0);
  const filtered = useMemo(() => bankMvs.filter((x) => (!q || x.desc.includes(q)) && (kind === "الكل" || x.kind === kind) && (!from || x.date >= from) && (!to || x.date <= to)), [bankMvs, q, kind, from, to]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);

  const open = (k: Kind, desc = "") => setForm({ bank: sel, kind: k, amount: "", desc, date: "2026-09-21" });
  const save = () => {
    if (!form) return;
    const amt = Number(form.amount);
    if (!amt || amt <= 0 || !form.desc.trim()) { toast.error("اكتب المبلغ والبيان"); return; }
    setMvs((xs) => [{ id: Date.now(), bank: form.bank, date: form.date, desc: form.desc, kind: form.kind, amount: amt, status: "مطابقة" }, ...xs].sort((a, b) => b.date.localeCompare(a.date)));
    setBanks((bs) => bs.map((b) => (b.id === form.bank ? { ...b, balance: b.balance + sign(form.kind) * amt } : b)));
    toast.success("تم تسجيل الحركة البنكية"); setForm(null); setSel(form.bank); setPage(1);
  };
  const exportCsv = () => {
    const csv = [["التاريخ", "البيان", "النوع", "المبلغ", "الحالة"], ...filtered.map((x) => [dmy(x.date), x.desc, x.kind, sign(x.kind) * x.amount, x.status])].map((l) => l.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })); a.download = `حركات-${bank.name}.csv`; a.click();
    toast.success("تم تصدير التقرير");
  };

  const stats = [
    { t: "إجمالي الأرصدة", v: totalBal, sub: "جميع الحسابات البنكية", d: "↑ 12%", icon: Wallet, cls: "bg-success/15 text-success", dc: "text-success" },
    { t: "إجمالي الإيداعات", v: dep, sub: "خلال الشهر الحالي", d: "↑ 18%", icon: PiggyBank, cls: "bg-primary-soft text-primary", dc: "text-success" },
    { t: "إجمالي المسحوبات", v: wd, sub: "خلال الشهر الحالي", d: "↑ 7%", icon: HandCoins, cls: "bg-destructive/10 text-destructive", dc: "text-success" },
    { t: "حركات قيد التسوية", v: pending, sub: "تحتاج لمراجعة وتسوية", d: "↓ 2%", icon: ArrowLeftRight, cls: "bg-finance-violet text-finance-purple", dc: "text-destructive", n: true },
  ];

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">الرئيسية</Link><ChevronLeft size={12} />
          <Link to="/finance" className="hover:text-primary">الحسابات المالية</Link><ChevronLeft size={12} /><span className="text-foreground">حسابات البنوك</span>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><Landmark className="text-primary" size={26} />حسابات البنوك</h1>
            <p className="mt-1 text-sm text-muted-foreground">إدارة أرصدة الحسابات البنكية ومتابعة جميع عمليات السحب والإيداع والتحويلات</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1.5" onClick={exportCsv}><Download size={16} />تصدير التقرير</Button>
            <Button className="gap-1.5" onClick={() => open("إيداع")}><Plus size={16} />تسجيل حركة بنكية</Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.t} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between"><div><p className="text-sm font-bold">{s.t}</p><p className="mt-2 text-2xl font-extrabold">{fmt(s.v)} {!s.n && <span className="text-sm">ر.س</span>}</p></div>
                <span className={`grid size-11 place-items-center rounded-full ${s.cls}`}><s.icon size={21} /></span></div>
              <div className="mt-3 flex justify-between text-xs"><span className="text-muted-foreground">{s.sub}</span><b className={s.dc}>{s.d}</b></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr_1.1fr]">
          <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="flex items-center gap-2 font-extrabold"><Landmark size={18} className="text-primary" />الحسابات البنكية</h2>
            <p className="mb-3 text-xs text-muted-foreground">إجمالي {banks.length} حسابات</p>
            <div className="space-y-3">
              {banks.map((b) => (
                <button key={b.id} onClick={() => { setSel(b.id); setPage(1); }} className={`w-full rounded-xl border p-4 text-right transition ${sel === b.id ? "border-primary bg-primary-soft" : "border-border hover:bg-muted/40"}`}>
                  <div className="flex items-center justify-between gap-2"><div><p className="font-extrabold">{b.name}</p><p className="text-xs text-muted-foreground">رقم الحساب <span dir="ltr">****{b.last4}</span></p></div><Logo b={b} /></div>
                  <div className="mt-3 flex items-center justify-between"><span className="flex items-center gap-1.5 text-xs text-success"><span className="size-2 rounded-full bg-success" />نشط</span><b className="text-lg text-primary">{fmt(b.balance)} <span className="text-xs">ر.س</span></b></div>
                </button>
              ))}
            </div>
          </section>

          <div className="min-w-0 space-y-4">
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="flex items-center gap-2 font-extrabold"><Landmark size={18} className="text-primary" />حركة الحساب - {bank.name}</h2>
              <p className="mt-2 text-xs text-muted-foreground">الرصيد الحالي</p><p className="text-2xl font-extrabold">{fmt(bank.balance)} <span className="text-sm">ر.س</span></p>
              <div className="mt-3 grid grid-cols-3 divide-x divide-x-reverse divide-border rounded-lg border border-border p-3 text-center">
                <div><p className="text-xs text-muted-foreground">إيداعات اليوم</p><p className="font-bold text-success">↑ {fmt(todayIn)}</p></div>
                <div><p className="text-xs text-muted-foreground">مسحوبات اليوم</p><p className="font-bold text-destructive">↓ {fmt(todayOut)}</p></div>
                <div><p className="text-xs text-muted-foreground">رصيد متاح</p><p className="font-extrabold">{fmt(bank.balance)}</p></div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-3 font-extrabold">آخر الحركات البنكية</h2>
              <div className="mb-3 grid gap-2 sm:grid-cols-4">
                <div className="relative"><Search size={15} className="absolute right-3 top-3 text-muted-foreground" /><input className={`${field} pr-9`} placeholder="ابحث في الحركة..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
                <select className={field} value={kind} onChange={(e) => { setKind(e.target.value); setPage(1); }}><option value="الكل">كل الحركات</option><option>إيداع</option><option>سحب</option><option>تحويل</option></select>
                <input type="date" aria-label="من تاريخ" className={field} value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} />
                <input type="date" aria-label="إلى تاريخ" className={field} value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-muted/60 text-xs text-muted-foreground"><tr>{["#", "التاريخ", "البيان", "النوع", "المبلغ", "الحالة"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                  <tbody>
                    {shown.map((x, i) => (
                      <tr key={x.id} className="border-t border-border">
                        <td className="p-2.5">{(cur - 1) * PER + i + 1}</td><td className="p-2.5">{dmy(x.date)}</td><td className="p-2.5">{x.desc}</td>
                        <td className={`p-2.5 font-bold ${x.kind === "سحب" ? "text-destructive" : x.kind === "إيداع" ? "text-success" : "text-primary"}`}>
                          <span className="flex items-center gap-1">{x.kind === "سحب" ? <ArrowDown size={14} /> : x.kind === "إيداع" ? <ArrowUp size={14} /> : <ArrowLeftRight size={14} />}{x.kind}</span></td>
                        <td className={`p-2.5 font-bold ${x.kind === "سحب" ? "text-destructive" : "text-success"}`} dir="ltr">{x.kind === "سحب" ? "-" : "+"} {fmt(x.amount)}.00</td>
                        <td className="p-2.5"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${pill[x.status] ?? ""}`}>{x.status}</span></td>
                      </tr>
                    ))}
                    {!shown.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">لا توجد حركات مطابقة</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">إجمالي عدد الحركات: {filtered.length}</span>
                <div className="flex gap-1.5">
                  <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                  {Array.from({ length: pages }, (_, i) => <button key={i} onClick={() => setPage(i + 1)} className={`size-8 rounded-md border ${cur === i + 1 ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{i + 1}</button>)}
                  <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-8 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
                </div>
              </div>
            </section>
          </div>

          <div className="min-w-0 space-y-4">
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 font-extrabold"><Landmark size={18} className="text-primary" />تفاصيل الحساب</h2>
              <div className="rounded-lg border border-border p-3 text-sm">
                <div className="mb-3 flex items-center justify-between"><b>{bank.name}</b><Logo b={bank} size={36} /></div>
                {[["رقم الحساب", `****${bank.last4}`], ["IBAN", bank.iban], ["نوع الحساب", "جاري"], ["العملة", "ريال سعودي"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2 py-1.5"><span className="text-muted-foreground">{k}</span><span className="font-bold" dir="ltr">{v}</span></div>
                ))}
                <div className="mt-2 flex justify-between rounded-lg bg-primary-soft p-2.5"><span>الرصيد الحالي</span><b className="text-primary">{fmt(bank.balance)} ر.س</b></div>
              </div>
              <h3 className="mt-4 text-sm font-extrabold">سحوبات وإيداعات الشهر الحالي</h3>
              <div className="mt-1 flex gap-3 text-[11px]"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-success" />إيداع</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-destructive" />سحب</span></div>
              <svg viewBox="0 0 240 150" className="mt-2 w-full">
                {[0, 50, 100, 150].map((v) => <g key={v}><line x1="28" x2="238" y1={130 - v * 0.8} y2={130 - v * 0.8} stroke="var(--border)" /><text x="0" y={133 - v * 0.8} fontSize="8" fill="var(--muted-foreground)">{v ? `${v}K` : 0}</text></g>)}
                {chart.map(([l, a, b], i) => { const x = 38 + i * 41; return (
                  <g key={l}><rect x={x} y={130 - a * 0.8} width="12" height={a * 0.8} rx="2" fill="var(--success)" /><rect x={x + 14} y={130 - b * 0.8} width="12" height={b * 0.8} rx="2" fill="var(--destructive)" /><text x={x + 13} y="144" fontSize="8" textAnchor="middle" fill="var(--muted-foreground)">{l}</text></g>); })}
              </svg>
            </section>
            <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-3 font-extrabold">خيارات سريعة</h2>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="gap-1.5" onClick={() => open("سحب", "سحب نقدي")}><ArrowUpFromLine size={15} />سحب نقدي</Button>
                <Button variant="outline" className="gap-1.5" onClick={() => open("إيداع", "إيداع نقدي")}><ArrowDownToLine size={15} />إيداع نقدي</Button>
                <Button variant="outline" className="gap-1.5" onClick={() => open("تحويل", "تحويل دولي")}><Globe size={15} />تحويل دولي</Button>
                <Button variant="outline" className="gap-1.5" onClick={() => open("تحويل", "تحويل بين حسابات")}><ArrowLeftRight size={15} />تحويل بين حسابات</Button>
              </div>
              <Button variant="outline" className="mt-2 w-full gap-1.5 text-primary" onClick={() => setSettle(true)}><RefreshCw size={15} />تسوية بنكية</Button>
            </section>
          </div>
        </div>
      </main>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>تسجيل حركة بنكية</DialogTitle></DialogHeader>
          {form && (
            <div className="grid gap-3">
              <label className="text-sm font-bold">الحساب<select className={field} value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })}>{banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
              <label className="text-sm font-bold">النوع<select className={field} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as Kind })}><option>إيداع</option><option>سحب</option><option>تحويل</option></select></label>
              <label className="text-sm font-bold">المبلغ (ر.س)<input type="number" min={0} className={field} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
              <label className="text-sm font-bold">البيان<input className={field} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
              <label className="text-sm font-bold">التاريخ<input type="date" className={field} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <div className="flex gap-2"><Button className="flex-1" onClick={save}>حفظ</Button><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>إلغاء</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={settle} onOpenChange={setSettle}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader><DialogTitle>تسوية بنكية - {bank.name}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">سيتم اعتماد {bankMvs.filter((x) => x.status !== "مطابقة").length} حركة معلقة كمطابقة.</p>
          <div className="flex gap-2"><Button className="flex-1" onClick={() => { setMvs((xs) => xs.map((x) => (x.bank === sel ? { ...x, status: "مطابقة" } : x))); setSettle(false); toast.success("تمت التسوية البنكية"); }}>تأكيد التسوية</Button><Button variant="outline" className="flex-1" onClick={() => setSettle(false)}>إلغاء</Button></div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
