import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays, ChevronDown, ChevronLeft, FileText, Paperclip, Pencil, Plus, Printer, Receipt, Save,
  Search, Trash2, UploadCloud, X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { purchaseProducts, purchaseSuppliers } from "@/data/mockData";
import { toast } from "sonner";

type Line = { id: number; name: string; sku: string; qty: number; price: number; disc: number; tax: number };
type Att = { name: string; size: string; url?: string };

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const field = "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-primary";
const init = {
  supplier: purchaseSuppliers[0]!.name, invNo: "INV-2025-0098", date: "2025-09-22", due: "2025-10-22",
  type: "فاتورة شراء", status: "معلقة", warehouse: "المستودع الرئيسي", pay: "تحويل بنكي", ref: "", notes: "", general: "",
};
const initLines: Line[] = [
  { id: 1, name: "لابتوب ديل", sku: "SKU-001", qty: 5, price: 3000, disc: 0, tax: 15 },
  { id: 2, name: "ماوس لاسلكي", sku: "SKU-002", qty: 10, price: 75, disc: 0, tax: 15 },
  { id: 3, name: "لوحة مفاتيح", sku: "SKU-003", qty: 5, price: 150, disc: 5, tax: 15 },
];
const initAtt: Att[] = [{ name: "فاتورة المورد.pdf", size: "2.4 MB" }];
const statusDot: Record<string, string> = { "معلقة": "bg-success", "مدفوعة": "bg-primary", "ملغاة": "bg-destructive" };

function L({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return <label className="mb-1.5 block text-sm font-bold text-foreground">{children}{req && <span className="text-destructive"> *</span>}</label>;
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
function Box({ title, icon: Icon, children, action }: { title: string; icon?: typeof FileText; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-extrabold text-foreground">{Icon && <Icon size={17} className="text-primary" />}{title}</h2>{action}
      </div>
      {children}
    </section>
  );
}

export function PurchaseInvoiceNew() {
  const [f, setF] = useState(init);
  const set = (k: keyof typeof init) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const [suppliers, setSuppliers] = useState(purchaseSuppliers.map((s) => ({ ...s })));
  const [lines, setLines] = useState(initLines);
  const [atts, setAtts] = useState(initAtt);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const sup = suppliers.find((s) => s.name === f.supplier);

  const calc = (l: Line) => {
    const gross = l.qty * l.price, d = (gross * l.disc) / 100, before = gross - d, tax = (before * l.tax) / 100;
    return { d, before, tax, after: before + tax };
  };
  const totals = useMemo(() => lines.reduce((a, l) => { const c = calc(l); return { before: a.before + c.before, tax: a.tax + c.tax, disc: a.disc + c.d }; }, { before: 0, tax: 0, disc: 0 }), [lines]);
  const upd = (id: number, p: Partial<Line>) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));
  const suggestions = q ? purchaseProducts.filter((p) => p.name.includes(q) || p.sku.toLowerCase().includes(q.toLowerCase())).slice(0, 5) : [];
  const addLine = (p?: (typeof purchaseProducts)[number]) => {
    const prod = p ?? suggestions[0] ?? purchaseProducts[0]!;
    setLines((ls) => [...ls, { id: Date.now(), name: prod.name, sku: prod.sku, qty: 1, price: prod.price, disc: 0, tax: 15 }]);
    setQ(""); toast.success(`تمت إضافة «${prod.name}»`);
  };
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const ok = Array.from(files).filter((x) => /\.(pdf|jpe?g|png)$/i.test(x.name));
    if (ok.length < files.length) toast.error("المسموح PDF و JPG و PNG فقط");
    setAtts((a) => [...a, ...ok.map((x) => ({ name: x.name, size: `${(x.size / 1048576).toFixed(1)} MB`, url: URL.createObjectURL(x) }))]);
  };
  const addSupplier = () => {
    const name = window.prompt("اسم المورد الجديد"); if (!name?.trim()) return;
    const n = { name: name.trim(), code: `SUP-000${126 + suppliers.length}`, cr: "" };
    setSuppliers((s) => [...s, n]); set("supplier")(n.name); toast.success("تمت إضافة المورد");
  };
  const save = (print = false) => {
    if (!f.supplier) { toast.error("اختر المورد أولاً"); return; }
    if (!lines.length) { toast.error("أضف صنفًا واحدًا على الأقل"); return; }
    toast.success(`تم حفظ فاتورة المشتريات ${f.invNo} بإجمالي ${fmt(totals.before + totals.tax)} ر.س`);
    if (print) setTimeout(() => window.print(), 300);
  };
  const reset = () => { setF(init); setLines(initLines); setAtts(initAtt); setEditing(null); toast("تم إلغاء التعديلات"); };

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">الرئيسية</Link><ChevronLeft size={13} /><span>المشتريات</span><ChevronLeft size={13} /><span>إدخال فاتورة مشتريات</span>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-foreground"><FileText className="text-primary" size={22} />إدخال فاتورة مشتريات</h1>
            <p className="mt-1 text-sm text-muted-foreground">قم بإدخال بيانات فاتورة المشتريات وتفاصيل الأصناف والمبالغ</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-1.5" onClick={reset}><X size={16} />إلغاء</Button>
            <Button variant="outline" className="gap-1.5" onClick={() => save(true)}><Printer size={16} />حفظ وطباعة</Button>
            <Button className="gap-1.5 px-6" onClick={() => save()}><Save size={16} />حفظ</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Box title="معلومات إضافية">
            <div className="space-y-3">
              <div><L>المستودع</L><Sel value={f.warehouse} onChange={set("warehouse")} options={["المستودع الرئيسي", "مستودع جدة", "مستودع الدمام"]} /></div>
              <div><L req>طريقة الدفع</L><Sel value={f.pay} onChange={set("pay")} options={["تحويل بنكي", "نقدي", "شيك", "آجل"]} /></div>
              <div><L>رقم المرجع</L><input className={field} placeholder="أدخل رقم المرجع إن وجد" value={f.ref} onChange={(e) => set("ref")(e.target.value)} /></div>
              <div><L>ملاحظات</L><textarea className={`${field} h-16 py-2`} placeholder="أدخل ملاحظات الفاتورة (اختياري)" value={f.notes} onChange={(e) => set("notes")(e.target.value)} /></div>
            </div>
          </Box>
          <Box title="تفاصيل الفاتورة">
            <div className="grid grid-cols-2 gap-3">
              <div><L req>رقم الفاتورة</L><input className={field} dir="ltr" style={{ textAlign: "right" }} value={f.invNo} onChange={(e) => set("invNo")(e.target.value)} /></div>
              <div><L req>تاريخ الفاتورة</L><input type="date" className={field} value={f.date} onChange={(e) => set("date")(e.target.value)} /></div>
              <div><L req>نوع الفاتورة</L><Sel value={f.type} onChange={set("type")} options={["فاتورة شراء", "فاتورة شراء آجلة", "أمر شراء"]} /></div>
              <div><L>تاريخ الاستحقاق</L><input type="date" className={field} value={f.due} onChange={(e) => set("due")(e.target.value)} /></div>
              <div className="col-span-2"><L req>حالة الفاتورة</L>
                <div className="relative">
                  <span className={`pointer-events-none absolute right-3 top-3.5 size-2.5 rounded-full ${statusDot[f.status]}`} />
                  <select value={f.status} onChange={(e) => set("status")(e.target.value)} className={`${field} appearance-none pr-8 font-bold`}>{Object.keys(statusDot).map((s) => <option key={s}>{s}</option>)}</select>
                  <ChevronDown size={15} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Box>
          <Box title="معلومات المورد" action={<button aria-label="إضافة مورد" onClick={addSupplier} className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><Plus size={18} /></button>}>
            <div className="space-y-3">
              <div><L req>اسم المورد</L><Sel value={f.supplier} onChange={set("supplier")} options={suppliers.map((s) => s.name)} /></div>
              <div><L>رقم المورد</L><input readOnly className={`${field} bg-muted/40`} value={sup?.code ?? ""} /></div>
              <div><L>السجل التجاري</L><input readOnly className={`${field} bg-muted/40`} value={sup?.cr || "—"} /></div>
            </div>
          </Box>
        </div>

        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="relative min-w-0 flex-1">
              <Search size={16} className="absolute right-3 top-3 text-primary" />
              <input className={`${field} pr-9`} placeholder="ابحث عن صنف أو باركود ..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLine()} />
              {suggestions.length > 0 && (
                <div className="absolute inset-x-0 top-11 z-10 rounded-lg border border-border bg-popover p-1 shadow-lg">
                  {suggestions.map((p) => <button key={p.sku} onClick={() => addLine(p)} className="flex w-full justify-between rounded px-2 py-1.5 text-sm hover:bg-muted"><span>{p.name}</span><span className="text-muted-foreground">{p.sku}</span></button>)}
                </div>
              )}
            </div>
            <Button className="gap-1" onClick={() => addLine()}><Plus size={16} />إضافة صنف</Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>{["م", "الصنف", "الكمية", "سعر الوحدة (ر.س)", "الخصم (%)", "قيمة الخصم (ر.س)", "الإجمالي قبل الضريبة", "الضريبة (%)", "قيمة الضريبة", "الإجمالي بعد الضريبة", "إجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {lines.map((l, i) => { const c = calc(l); const ed = editing === l.id; return (
                  <tr key={l.id} className="border-t border-border">
                    <td className="p-2.5">{i + 1}</td>
                    <td className="p-2.5">{ed ? <input className={`${field} h-9`} value={l.name} onChange={(e) => upd(l.id, { name: e.target.value })} /> : <><p className="font-bold">{l.name}</p><p className="text-xs text-muted-foreground">{l.sku}</p></>}</td>
                    <td className="p-2"><input type="number" min={1} className={`${field} h-9 w-20`} value={l.qty} onChange={(e) => upd(l.id, { qty: Math.max(1, +e.target.value || 1) })} /></td>
                    <td className="p-2.5">{ed ? <input type="number" className={`${field} h-9 w-24`} value={l.price} onChange={(e) => upd(l.id, { price: +e.target.value || 0 })} /> : fmt(l.price)}</td>
                    <td className="p-2"><input type="number" min={0} max={100} className={`${field} h-9 w-16`} value={l.disc} onChange={(e) => upd(l.id, { disc: Math.min(100, Math.max(0, +e.target.value || 0)) })} /></td>
                    <td className="p-2.5">{fmt(c.d)}</td>
                    <td className="p-2.5">{fmt(c.before)}</td>
                    <td className="p-2"><select className={`${field} h-9 w-20`} value={l.tax} onChange={(e) => upd(l.id, { tax: +e.target.value })}>{[0, 5, 15].map((t) => <option key={t} value={t}>{t}%</option>)}</select></td>
                    <td className="p-2.5">{fmt(c.tax)}</td>
                    <td className="p-2.5 font-bold">{fmt(c.after)}</td>
                    <td className="p-2"><div className="flex gap-1.5">
                      <button aria-label="تعديل" onClick={() => setEditing(ed ? null : l.id)} className={`grid size-8 place-items-center rounded-md border border-border ${ed ? "bg-primary text-primary-foreground" : "text-primary"}`}><Pencil size={14} /></button>
                      <button aria-label="حذف" onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} className="grid size-8 place-items-center rounded-md border border-border text-destructive"><Trash2 size={14} /></button>
                    </div></td>
                  </tr>
                ); })}
                {!lines.length && <tr><td colSpan={11} className="p-6 text-center text-muted-foreground">لا توجد أصناف — أضف صنفًا للبدء</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          <Box title="ملاحظات المشتريات" icon={FileText}>
            <textarea className={`${field} h-32 py-2`} placeholder="أدخل أي ملاحظات إضافية على الفاتورة ..." value={f.general} onChange={(e) => set("general")(e.target.value)} />
          </Box>
          <Box title="المرفقات" icon={Paperclip}>
            <button type="button" onClick={() => fileRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
              className={`flex w-full flex-col items-center gap-1 rounded-lg border-2 border-dashed p-4 text-sm ${drag ? "border-primary bg-primary-soft" : "border-border"}`}>
              <UploadCloud className="text-primary" /><span>اسحب الملفات هنا أو اضغط للاختيار</span><span className="text-xs text-muted-foreground">(PDF, JPG, PNG)</span>
            </button>
            <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            <ul className="mt-3 space-y-2">
              {atts.map((a, i) => (
                <li key={a.name + i} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
                  <span className="flex items-center gap-2"><FileText size={16} className="text-destructive" />{a.url ? <a href={a.url} download={a.name} className="hover:text-primary">{a.name}</a> : a.name}</span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">{a.size}<button aria-label="حذف المرفق" onClick={() => setAtts((x) => x.filter((_, j) => j !== i))} className="text-destructive"><Trash2 size={14} /></button></span>
                </li>
              ))}
            </ul>
          </Box>
          <Box title="إجمالي الفاتورة" icon={Receipt}>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2"><dt>إجمالي قبل الضريبة</dt><dd>{fmt(totals.before)}</dd></div>
              <div className="flex justify-between border-b border-border pb-2"><dt>قيمة الضريبة (15%)</dt><dd>{fmt(totals.tax)}</dd></div>
              <div className="flex justify-between border-b border-border pb-2"><dt>الخصومات</dt><dd>{fmt(totals.disc)}</dd></div>
              <div className="flex items-center justify-between rounded-lg bg-primary-soft p-4"><dt className="font-extrabold">الإجمالي الكلي</dt><dd className="text-2xl font-extrabold text-primary">{fmt(totals.before + totals.tax)} <span className="text-sm">ر.س</span></dd></div>
            </dl>
          </Box>
        </div>
      </main>
    </AppShell>
  );
}
