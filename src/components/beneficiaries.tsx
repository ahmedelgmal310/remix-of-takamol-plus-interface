import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUp, Ban, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, Database, Eye, FileText, Filter, Folder, MoreHorizontal,
  Pencil, Search, Star, Stethoscope, Trash2, User, UserCog, UserPlus, Users, UserRound, UsersRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { beneficiariesSeed, type Beneficiary, type BenStatus } from "@/data/mockData";

const statusCls: Record<BenStatus, string> = {
  "معتمد": "bg-success-soft text-success",
  "قيد المراجعة": "bg-warning-soft text-warning",
  "مرفوض": "bg-destructive/10 text-destructive",
};

function Avatar({ b, size = "sm" }: { b: Beneficiary; size?: "sm" | "lg" }) {
  const big = size === "lg";
  const cls = b.gender === "f" ? "bg-buy-navy/90 text-primary-foreground" : "bg-primary-soft text-buy-navy";
  return (
    <span className={`grid shrink-0 place-items-center rounded-full ${cls} ${big ? "size-28 ring-8 ring-primary-soft" : "size-7"}`}>
      {b.type === "طبيب" && big ? <Stethoscope size={48} /> : <UserRound size={big ? 52 : 16} />}
    </span>
  );
}

function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="relative flex h-11 min-w-28 flex-1 items-center rounded-lg border border-border bg-card">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-full w-full appearance-none bg-transparent pe-9 ps-4 text-sm font-semibold outline-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute end-3" />
    </label>
  );
}

const empty = { name: "", nationality: "سعودي", idNo: "", specialty: "", type: "طبيب", status: "قيد المراجعة", phone: "", email: "", gender: "m" };

export function Beneficiaries() {
  const [rows, setRows] = useState<Beneficiary[]>(beneficiariesSeed);
  const [selId, setSelId] = useState(1);
  const [q, setQ] = useState("");
  const [nat, setNat] = useState("جميع الجنسيات");
  const [type, setType] = useState("جميع الأنواع");
  const [spec, setSpec] = useState("جميع التخصصات");
  const [gender, setGender] = useState("جميع الأنواع");
  const [status, setStatus] = useState("جميع الحالات");
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);
  const [tab, setTab] = useState("basic");
  const [checked, setChecked] = useState<number[]>([]);
  const [dlg, setDlg] = useState<null | "add" | "edit">(null);
  const [form, setForm] = useState(empty);

  const nats = ["جميع الجنسيات", ...new Set(rows.map((r) => r.nationality))];
  const specs = ["جميع التخصصات", ...new Set(rows.map((r) => r.specialty))];

  const filtered = useMemo(() => rows.filter((r) =>
    (!q || [r.name, r.idNo, r.specialty].some((v) => v.includes(q))) &&
    (nat === "جميع الجنسيات" || r.nationality === nat) &&
    (type === "جميع الأنواع" || r.type === type) &&
    (spec === "جميع التخصصات" || r.specialty === spec) &&
    (gender === "جميع الأنواع" || (gender === "ذكر" ? r.gender === "m" : r.gender === "f")) &&
    (status === "جميع الحالات" || r.status === status)), [rows, q, nat, type, spec, gender, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / per));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * per, cur * per);
  const sel = rows.find((r) => r.id === selId) ?? rows[0];

  // Displayed totals: reference numbers plus local changes vs. the seed.
  const delta = (f: (r: Beneficiary) => boolean) => rows.filter(f).length - beneficiariesSeed.filter(f).length;
  const cards = [
    { t: "إجمالي المستفيدين", v: 312 + delta(() => true), p: "12%", icon: UsersRound, wrap: "bg-success-soft/40 border-success/15", ic: "bg-success-soft text-success", tc: "text-buy-navy" },
    { t: "الأطباء", v: 156 + delta((r) => r.type === "طبيب"), p: "8%", icon: UserCog, wrap: "bg-primary-soft/40 border-primary/15", ic: "bg-primary-soft text-primary", tc: "text-buy-navy" },
    { t: "الكادر الصحي", v: 126 + delta((r) => r.type === "كادر صحي"), p: "15%", icon: User, wrap: "bg-finance-violet/50 border-finance-purple/15", ic: "bg-finance-violet text-finance-purple", tc: "text-buy-navy" },
    { t: "قيد المراجعة", v: 18 + delta((r) => r.status === "قيد المراجعة"), p: "20%", icon: Users, wrap: "bg-warning-soft/50 border-warning/15", ic: "bg-warning-soft text-warning", tc: "text-warning" },
    { t: "مرفوضة", v: 12 + delta((r) => r.status === "مرفوض"), p: "5%", icon: Ban, wrap: "bg-destructive/5 border-destructive/15", ic: "bg-destructive/10 text-destructive", tc: "text-destructive" },
  ];

  const openEdit = () => { if (!sel) return; setForm({ ...sel }); setDlg("edit"); };
  const save = () => {
    if (!form.name || !form.idNo) { toast.error("أدخل الاسم ورقم الهوية"); return; }
    const data = form as Omit<Beneficiary, "id" | "date">;
    if (dlg === "add") {
      const id = Math.max(0, ...rows.map((r) => r.id)) + 1;
      setRows((p) => [{ ...data, id, date: "2026/10/05" }, ...p]);
      setSelId(id); setPage(1);
    } else if (sel) {
      setRows((p) => p.map((r) => (r.id === sel.id ? { ...r, ...data } : r)));
    }
    toast.success("تم الحفظ (بيانات تجريبية)");
    setDlg(null);
  };

  const card = "rounded-xl border border-border bg-card shadow-sm";
  const tabs = [
    { k: "basic", l: "البيانات الأساسية", i: User },
    { k: "docs", l: "المستندات", i: Folder },
    { k: "contracts", l: "العقود", i: FileText },
    { k: "dues", l: "المستحقات", i: Database },
  ];
  const pageNums = Array.from({ length: pages }, (_, i) => i + 1).slice(Math.max(0, cur - 3), Math.max(0, cur - 3) + 5);

  return (
    <AppShell>
      <main dir="rtl" className="space-y-4 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-buy-navy">المستفيدون</h1>
            <nav className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">الرئيسية</Link><span>/</span>
              <Link to="/employees" className="hover:text-primary">الموارد البشرية</Link><span>/</span><span>المستفيدون</span>
            </nav>
          </div>
          <Button onClick={() => { setForm(empty); setDlg("add"); }} className="h-13 gap-3 rounded-xl bg-buy-gold px-8 text-base font-extrabold text-buy-navy shadow-md hover:bg-buy-gold/90">
            <UserPlus size={22} />إضافة مستفيد جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.t} className={`rounded-xl border p-5 shadow-sm ${c.wrap}`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className={`whitespace-nowrap text-base font-bold ${c.tc === "text-buy-navy" ? "text-foreground" : c.tc}`}>{c.t}</p>
                  <p className={`mt-2 text-3xl font-extrabold leading-none ${c.tc}`}>{c.v}</p>
                </div>
                <span className={`grid size-16 shrink-0 place-items-center rounded-full ${c.ic}`}><c.icon size={30} /></span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">مقارنة بالشهر السابق</span>
                <b className={`flex items-center gap-0.5 ${c.tc === "text-destructive" ? "text-destructive" : "text-success"}`}><ArrowUp size={15} />{c.p}</b>
              </div>
            </div>
          ))}
        </div>

        <section className={`${card} space-y-4 p-4`}>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="h-11 gap-2 bg-primary-soft/50 px-5 font-bold text-buy-navy" onClick={() => { setNat("جميع الجنسيات"); setType("جميع الأنواع"); setSpec("جميع التخصصات"); setGender("جميع الأنواع"); setStatus("جميع الحالات"); setQ(""); }}>
              <Filter size={17} />تصفية
            </Button>
            <Sel value={nat} onChange={(v) => { setNat(v); setPage(1); }} options={nats} />
            <Sel value={type} onChange={(v) => { setType(v); setPage(1); }} options={["جميع الأنواع", "طبيب", "كادر صحي"]} />
            <Sel value={spec} onChange={(v) => { setSpec(v); setPage(1); }} options={specs} />
            <Sel value={gender} onChange={(v) => { setGender(v); setPage(1); }} options={["جميع الأنواع", "ذكر", "أنثى"]} />
            <Sel value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={["جميع الحالات", "معتمد", "قيد المراجعة", "مرفوض"]} />
            <label className="flex h-11 min-w-48 flex-[1.6] items-center gap-2 rounded-lg border border-border bg-card px-3">
              <Search size={20} className="text-buy-navy" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="البحث في المستفيدين ..." className="w-full bg-transparent text-sm outline-none" />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_230px]">
            {/* Table first in DOM = right side in RTL */}
            <div className="order-2 min-w-0 xl:order-1">
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[820px] whitespace-nowrap text-xs">
                  <thead className="bg-primary-soft/40 font-bold text-buy-navy">
                    <tr>{["م", "الاسم", "الجنسية", "الهوية/الإقامة", "التخصص", "نوع المستفيد", "الحالة", "تاريخ التسجيل", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-center first:w-8">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {shown.map((r) => (
                      <tr key={r.id} onClick={() => setSelId(r.id)} className={`cursor-pointer border-t border-border text-center hover:bg-muted/40 ${r.id === sel?.id ? "bg-primary-soft/30" : ""}`}>
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" aria-label={`تحديد ${r.name}`} checked={checked.includes(r.id)} onChange={() => setChecked((p) => p.includes(r.id) ? p.filter((x) => x !== r.id) : [...p, r.id])} className="size-4 accent-primary" />
                        </td>
                        <td className="p-2"><span className="flex items-center gap-2 text-start"><Avatar b={r} />{r.name}</span></td>
                        <td className="p-2">{r.nationality}</td>
                        <td className="p-2">{r.idNo}</td>
                        <td className="p-2">{r.specialty}</td>
                        <td className="p-2">{r.type}</td>
                        <td className="p-2"><span className={`inline-block min-w-[72px] rounded-md px-2 py-1 text-xs font-bold ${statusCls[r.status]}`}>{r.status}</span></td>
                        <td className="p-2">{r.date}</td>
                        <td className="p-2" onClick={(e) => e.stopPropagation()}>
                          <span className="flex items-center justify-center gap-2.5 text-buy-navy">
                            <button aria-label="عرض" onClick={() => setSelId(r.id)}><Eye size={18} /></button>
                            <button aria-label="تعديل" onClick={() => { setSelId(r.id); setForm({ ...r }); setDlg("edit"); }}><Pencil size={17} /></button>
                            <button aria-label="المستندات" onClick={() => { setSelId(r.id); setTab("docs"); }}><FileText size={18} /></button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><button aria-label="المزيد"><MoreHorizontal size={18} /></button></DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem className="text-destructive" onClick={() => { setRows((p) => p.filter((x) => x.id !== r.id)); toast("تم الحذف"); }}><Trash2 size={14} />حذف</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!shown.length && <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">لا توجد نتائج</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2" dir="rtl">
                  <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-10 place-items-center rounded-lg border border-border bg-card disabled:opacity-40"><ChevronRight size={16} /></button>
                  {pageNums.map((n) => <button key={n} onClick={() => setPage(n)} className={`grid size-10 place-items-center rounded-lg border font-bold ${n === cur ? "border-buy-navy bg-buy-navy text-primary-foreground" : "border-border bg-card"}`}>{n}</button>)}
                  <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-10 place-items-center rounded-lg border border-border bg-card disabled:opacity-40"><ChevronLeft size={16} /></button>
                  <button aria-label="الأخيرة" onClick={() => setPage(pages)} className="grid size-10 place-items-center rounded-lg border border-border bg-card"><ChevronsLeft size={16} /></button>
                </div>
                <span>عرض {filtered.length ? (cur - 1) * per + 1 : 0} إلى {Math.min(cur * per, filtered.length)} من {filtered.length} نتيجة</span>
                <label className="flex items-center gap-3">إظهار
                  <span className="relative flex h-10 w-20 items-center rounded-lg border border-border bg-card">
                    <select value={per} onChange={(e) => { setPer(Number(e.target.value)); setPage(1); }} className="h-full w-full appearance-none bg-transparent px-3 outline-none">
                      {[5, 10, 20].map((n) => <option key={n}>{n}</option>)}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute end-2" />
                  </span>
                </label>
              </div>
            </div>

            {/* Side card (left in RTL) */}
            {sel && (
              <aside className="order-1 rounded-xl border border-border bg-card p-3 xl:order-2">
                <div className="flex justify-start"><span className={`rounded-md px-3 py-1 text-xs font-bold ${statusCls[sel.status]}`}>{sel.status}</span></div>
                <div className="mt-1 flex flex-col items-center text-center">
                  <Avatar b={sel} size="lg" />
                  <h2 className="mt-4 text-lg font-extrabold text-buy-navy">{sel.name}</h2>
                  <p className="text-xs text-muted-foreground">{sel.specialty}</p>
                  <span className="mt-2 flex items-center gap-1 rounded-md bg-primary-soft px-3 py-1 text-xs font-bold text-primary"><Star size={12} />{sel.type}</span>
                </div>
                <div className="mt-4 grid grid-cols-4 border-b border-border text-[10px]">
                  {tabs.map((t) => (
                    <button key={t.k} onClick={() => setTab(t.k)} className={`flex flex-col items-center gap-1 pb-2 ${tab === t.k ? "border-b-2 border-buy-navy font-bold text-buy-navy" : "text-muted-foreground"}`}>
                      <t.i size={16} />{t.l}
                    </button>
                  ))}
                </div>
                <div className="mt-3 min-h-52 text-xs">
                  {tab === "basic" && (
                    <dl className="space-y-2.5">
                      {[["رقم الهوية", sel.idNo], ["الجنسية", sel.nationality], ["الجوال", sel.phone], ["البريد الإلكتروني", sel.email], ["التخصص", sel.specialty], ["نوع المستفيد", sel.type], ["تاريخ التسجيل", sel.date]].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2"><dt className="text-muted-foreground">{k}</dt><dd className="truncate">{v}</dd></div>
                      ))}
                      <div className="flex items-center justify-between"><dt className="text-muted-foreground">الحالة</dt><dd><span className={`rounded-full px-4 py-1 font-bold ${statusCls[sel.status]}`}>{sel.status}</span></dd></div>
                    </dl>
                  )}
                  {tab === "docs" && <ul className="space-y-2">{["صورة الهوية", "الشهادة المهنية", "ترخيص الهيئة", "السيرة الذاتية"].map((d) => <li key={d} className="flex items-center gap-2 rounded-md border border-border p-2"><FileText size={14} className="text-primary" />{d}</li>)}</ul>}
                  {tab === "contracts" && <ul className="space-y-2"><li className="rounded-md border border-border p-2"><b>عقد تشغيل</b><p className="text-muted-foreground">من 2026/01/01 إلى 2026/12/31</p></li><li className="rounded-md border border-border p-2"><b>ملحق عقد</b><p className="text-muted-foreground">2026/06/15</p></li></ul>}
                  {tab === "dues" && <ul className="space-y-2">{[["سبتمبر 2026", "18,500"], ["أغسطس 2026", "18,500"], ["يوليو 2026", "17,200"]].map(([m, v]) => <li key={m} className="flex justify-between rounded-md border border-border p-2"><span>{m}</span><b>{v} ريال</b></li>)}</ul>}
                </div>
                <Button onClick={openEdit} className="mt-3 h-11 w-full gap-2 bg-buy-navy font-bold text-primary-foreground hover:bg-buy-navy/90"><Pencil size={16} />تعديل البيانات</Button>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => toast.success("تم إنشاء مسودة عقد (تجريبي)")} className="h-10 gap-1 bg-primary-soft/40 px-1 text-xs text-buy-navy"><FileText size={14} />إصدار عقد</Button>
                  <Button variant="outline" onClick={() => setTab("docs")} className="h-10 gap-1 bg-primary-soft/40 px-1 text-xs text-buy-navy"><Folder size={14} />عرض المستندات</Button>
                </div>
              </aside>
            )}
          </div>
        </section>

        <Dialog open={!!dlg} onOpenChange={(o) => !o && setDlg(null)}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>{dlg === "add" ? "إضافة مستفيد جديد" : "تعديل البيانات"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {([["name", "الاسم"], ["idNo", "رقم الهوية/الإقامة"], ["nationality", "الجنسية"], ["specialty", "التخصص"], ["phone", "الجوال"], ["email", "البريد الإلكتروني"]] as const).map(([k, l]) => (
                <label key={k} className="grid gap-1">{l}<input className="h-10 rounded-md border border-border bg-card px-2" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>
              ))}
              <label className="grid gap-1">نوع المستفيد<select className="h-10 rounded-md border border-border bg-card px-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>طبيب</option><option>كادر صحي</option></select></label>
              <label className="grid gap-1">الحالة<select className="h-10 rounded-md border border-border bg-card px-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>معتمد</option><option>قيد المراجعة</option><option>مرفوض</option></select></label>
              <label className="grid gap-1">الجنس<select className="h-10 rounded-md border border-border bg-card px-2" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="m">ذكر</option><option value="f">أنثى</option></select></label>
            </div>
            <Button onClick={save} className="bg-buy-navy text-primary-foreground hover:bg-buy-navy/90">حفظ</Button>
          </DialogContent>
        </Dialog>
      </main>
    </AppShell>
  );
}
