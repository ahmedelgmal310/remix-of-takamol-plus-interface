import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2, CalendarDays, ChevronDown, ChevronLeft, FileText, Link2, Pencil, Plus, Printer, Save,
  Search, Trash2, User, X, Receipt, BadgePercent, StickyNote,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { salesCustomers, salesProducts } from "@/data/mockData";
import { toast } from "sonner";

type Line = { id: number; name: string; barcode: string; qty: number; price: number; disc: number; tax: number; note?: string };

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const customerCodes: Record<string, string> = { "شركة النخبة التجارية": "C00125" };

const initialLines: Line[] = [
  { id: 1, name: "شاشة سمارت 55 بوصة", barcode: "100125", qty: 2, price: 1200, disc: 0, tax: 15 },
  { id: 2, name: "سماعات بلوتوث", barcode: "200458", qty: 3, price: 150, disc: 10, tax: 15 },
  { id: 3, name: "شاحن سريع", barcode: "300789", qty: 5, price: 100, disc: 0, tax: 15 },
];

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm font-bold text-foreground">{children}</label>;
}
function Card({ title, icon: Icon, children, className = "" }: { title: string; icon?: typeof FileText; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-border bg-card p-4 shadow-sm ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 font-extrabold text-foreground">{Icon && <Icon size={17} className="text-primary" />}{title}</h2>
      {children}
    </section>
  );
}
function Sel({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${field} appearance-none pl-8`}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" />
    </div>
  );
}

export function SalesInvoiceNew() {
  const navigate = useNavigate();
  const customers = ["شركة النخبة التجارية", ...salesCustomers];
  const [invNo, setInvNo] = useState("INV-000152");
  const [date, setDate] = useState("2025-09-23");
  const [type, setType] = useState("فاتورة مبيعات");
  const [pay, setPay] = useState("نقدي");
  const [customer, setCustomer] = useState("شركة النخبة التجارية");
  const [warehouse, setWarehouse] = useState("المستودع الرئيسي");
  const [ref, setRef] = useState("");
  const [emp, setEmp] = useState("أحمد محمد");
  const [notes, setNotes] = useState("");
  const [general, setGeneral] = useState("");
  const [discType, setDiscType] = useState("نسبة مئوية");
  const [discVal, setDiscVal] = useState(0);
  const [discReason, setDiscReason] = useState("");
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<number | null>(null);

  const calc = (l: Line) => {
    const gross = l.qty * l.price;
    const d = (gross * l.disc) / 100;
    const before = gross - d;
    return { gross, d, before, after: before + (before * l.tax) / 100 };
  };
  const totals = useMemo(() => {
    let before = 0, tax = 0, lineDisc = 0;
    lines.forEach((l) => { const c = calc(l); before += c.before; tax += c.after - c.before; lineDisc += c.d; });
    const extra = discType === "نسبة مئوية" ? ((before + tax) * discVal) / 100 : discVal;
    return { before, tax, disc: lineDisc + extra, total: before + tax - extra, extra };
  }, [lines, discType, discVal]);

  const update = (id: number, patch: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const addLine = (p?: (typeof salesProducts)[number]) => {
    const prod = p ?? salesProducts.find((x) => x.name.includes(q) || x.barcode.includes(q)) ?? salesProducts[0];
    if (!prod) return;
    setLines((ls) => [...ls, { id: Date.now(), name: prod.name, barcode: prod.barcode, qty: 1, price: prod.price, disc: 0, tax: 15 }]);
    setQ("");
    toast.success(`تمت إضافة «${prod.name}»`);
  };
  const save = (print = false) => {
    if (!customer) return toast.error("اختر العميل أولاً");
    if (!lines.length) return toast.error("أضف صنفًا واحدًا على الأقل");
    toast.success(`تم حفظ الفاتورة ${invNo} بإجمالي ${fmt(totals.total)} ر.س`);
    if (print) setTimeout(() => window.print(), 300);
  };
  const suggestions = q ? salesProducts.filter((p) => p.name.includes(q) || p.barcode.includes(q)).slice(0, 5) : [];

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">الرئيسية</Link><ChevronLeft size={13} />
          <span>المبيعات</span><ChevronLeft size={13} />
          <Link to="/sales" className="hover:text-primary">إدخالات المبيعات</Link>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-foreground"><FileText className="text-primary" size={22} />إدخال فاتورة مبيعات</h1>
            <p className="mt-1 text-sm text-muted-foreground">إضافة فاتورة مبيعات جديدة مع إمكانية اختيار العميل والمنتجات</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-1.5" onClick={() => navigate({ to: "/sales" })}><X size={16} />إلغاء</Button>
            <Button variant="outline" className="gap-1.5" onClick={() => save(true)}><Printer size={16} />حفظ وطباعة</Button>
            <Button className="gap-1.5 px-6" onClick={() => save()}><Save size={16} />حفظ</Button>
          </div>
        </div>

        <section className="grid gap-6 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-3">
            <h2 className="font-extrabold text-foreground">بيانات الفاتورة</h2>
            <div><Label>رقم الفاتورة</Label><div className="relative"><input className={`${field} pl-9`} value={invNo} onChange={(e) => setInvNo(e.target.value)} dir="ltr" style={{ textAlign: "right" }} /><CalendarDays size={15} className="absolute left-3 top-3 text-muted-foreground" /></div></div>
            <div><Label>تاريخ الفاتورة</Label><input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><Label>نوع الفاتورة</Label><Sel value={type} onChange={setType} options={["فاتورة مبيعات", "فاتورة ضريبية مبسطة", "عرض سعر"]} /></div>
            <div><Label>طريقة الدفع</Label><Sel value={pay} onChange={setPay} options={["نقدي", "تحويل بنكي", "بطاقة ائتمانية", "آجل"]} /></div>
          </div>
          <div className="space-y-3 md:pt-8">
            <div><Label>العميل</Label>
              <div className="flex gap-2"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-primary"><User size={17} /></span><Sel value={customer} onChange={setCustomer} options={customers} /></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Building2 size={19} /></span>
              <div><p className="text-sm font-bold">{customer}</p><p className="text-xs text-muted-foreground">#{customerCodes[customer] ?? `C00${130 + customers.indexOf(customer)}`}</p></div>
            </div>
            <div><Label>المستودع</Label><Sel value={warehouse} onChange={setWarehouse} options={["المستودع الرئيسي", "مستودع جدة", "مستودع الدمام"]} /></div>
          </div>
          <div className="space-y-3">
            <h2 className="font-extrabold text-foreground">معلومات إضافية</h2>
            <div><Label>رقم المرجع</Label><div className="flex gap-2"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-primary"><Link2 size={16} /></span><input className={field} placeholder="أدخل رقم المرجع (اختياري)" value={ref} onChange={(e) => setRef(e.target.value)} /></div></div>
            <div><Label>الموظف المسؤول</Label><Sel value={emp} onChange={setEmp} options={["أحمد محمد", "سارة عبدالله", "خالد الغامدي"]} /></div>
            <div><Label>ملاحظات</Label><textarea className={`${field} h-20 py-2`} placeholder="أضف ملاحظات إضافية (اختياري)" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-extrabold text-foreground">تفاصيل الأصناف</h2>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute right-3 top-3 text-muted-foreground" />
                <input className={`${field} pr-9`} placeholder="ابحث عن صنف بالاسم أو الباركود" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLine()} />
                {suggestions.length > 0 && (
                  <div className="absolute inset-x-0 top-11 z-10 rounded-lg border border-border bg-popover p-1 shadow-lg">
                    {suggestions.map((p) => <button key={p.barcode} onClick={() => addLine(p)} className="flex w-full justify-between rounded px-2 py-1.5 text-sm hover:bg-muted"><span>{p.name}</span><span className="text-muted-foreground">{p.barcode}</span></button>)}
                  </div>
                )}
              </div>
              <Button className="gap-1" onClick={() => addLine()}><Plus size={16} />إضافة صنف</Button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>{["#", "الصنف", "الباركود", "الكمية", "سعر الوحدة", "الخصم (%)", "الضريبة (%)", "إجمالي قبل الضريبة", "إجمالي بعد الضريبة", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {lines.map((l, i) => { const c = calc(l); const ed = editing === l.id; return (
                  <tr key={l.id} className="border-t border-border align-top">
                    <td className="p-2.5">{i + 1}</td>
                    <td className="p-2"><div className="relative"><input className={`${field} h-9 pl-8`} value={l.name} onChange={(e) => update(l.id, { name: e.target.value })} /><Search size={13} className="absolute left-3 top-3 text-muted-foreground" /></div>{l.note && <p className="mt-1 text-xs text-muted-foreground">📝 {l.note}</p>}</td>
                    <td className="p-2"><input className={`${field} h-9 w-24`} value={l.barcode} onChange={(e) => update(l.id, { barcode: e.target.value })} /></td>
                    <td className="p-2"><input type="number" min={1} className={`${field} h-9 w-20`} value={l.qty} onChange={(e) => update(l.id, { qty: Math.max(1, +e.target.value || 1) })} /></td>
                    <td className="p-2.5">{ed ? <input type="number" className={`${field} h-9 w-24`} value={l.price} onChange={(e) => update(l.id, { price: +e.target.value || 0 })} /> : fmt(l.price)}</td>
                    <td className="p-2.5">{ed ? <input type="number" className={`${field} h-9 w-16`} value={l.disc} onChange={(e) => update(l.id, { disc: Math.min(100, +e.target.value || 0) })} /> : `${l.disc}%`}</td>
                    <td className="p-2.5">{ed ? <input type="number" className={`${field} h-9 w-16`} value={l.tax} onChange={(e) => update(l.id, { tax: +e.target.value || 0 })} /> : `${l.tax}%`}</td>
                    <td className="p-2.5">{fmt(c.before)}</td>
                    <td className="p-2.5 font-bold">{fmt(c.after)}</td>
                    <td className="p-2"><div className="flex gap-1.5">
                      <button aria-label="تعديل" onClick={() => setEditing(ed ? null : l.id)} className={`grid size-8 place-items-center rounded-md border border-border ${ed ? "bg-primary text-primary-foreground" : "text-primary"}`}><Pencil size={14} /></button>
                      <button aria-label="حذف" onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} className="grid size-8 place-items-center rounded-md border border-border text-destructive"><Trash2 size={14} /></button>
                    </div></td>
                  </tr>
                ); })}
                {!lines.length && <tr><td colSpan={10} className="p-6 text-center text-muted-foreground">لا توجد أصناف — أضف صنفًا للبدء</td></tr>}
              </tbody>
            </table>
          </div>
          <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => {
            const last = lines[lines.length - 1]; if (!last) return toast.error("لا توجد أصناف");
            const n = window.prompt(`ملاحظة على «${last.name}»`, last.note ?? ""); if (n !== null) update(last.id, { note: n });
          }}><StickyNote size={14} />إضافة ملاحظة للسطر</Button>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="ملاحظات عامة" icon={FileText}>
            <textarea className={`${field} h-28 py-2`} placeholder="أدخل ملاحظات عامة على الفاتورة (اختياري)" value={general} onChange={(e) => setGeneral(e.target.value)} />
          </Card>
          <Card title="بيانات الخصم (اختياري)" icon={BadgePercent}>
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                <div><Label>نوع الخصم</Label><Sel value={discType} onChange={setDiscType} options={["نسبة مئوية", "مبلغ ثابت"]} /></div>
                <input type="number" min={0} className={field} value={discVal} onChange={(e) => setDiscVal(Math.max(0, +e.target.value || 0))} />
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-border text-sm">{discType === "نسبة مئوية" ? "%" : "ر.س"}</span>
              </div>
              <div><Label>قيمة الخصم</Label><input readOnly className={`${field} bg-muted/40`} value={fmt(totals.extra)} /></div>
              <div><Label>السبب</Label><textarea className={`${field} h-16 py-2`} placeholder="أدخل سبب الخصم (اختياري)" value={discReason} onChange={(e) => setDiscReason(e.target.value)} /></div>
            </div>
          </Card>
          <Card title="إجمالي الفاتورة" icon={Receipt}>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2"><dt>إجمالي المبلغ قبل الضريبة</dt><dd>{fmt(totals.before)}</dd></div>
              <div className="flex justify-between border-b border-border pb-2"><dt>قيمة الضريبة (15%)</dt><dd>{fmt(totals.tax)}</dd></div>
              <div className="flex justify-between border-b border-border pb-2"><dt>الخصومات</dt><dd>{fmt(totals.disc)}</dd></div>
              <div className="flex items-center justify-between rounded-lg bg-primary-soft p-4"><dt className="font-extrabold">الإجمالي الكلي</dt><dd className="text-2xl font-extrabold text-primary">{fmt(totals.total)}</dd></div>
            </dl>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
