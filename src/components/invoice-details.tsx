import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight, Banknote, Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, Clock, CreditCard, Download,
  FileText, Mail, MessageSquareText, Paperclip, Printer, ListChecks, User, Wallet, AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { salesInvoices } from "@/data/mockData";
import { toast } from "sonner";

const baseItems = [
  { name: "استشارات تقنية", desc: "خدمة استشارية لتطوير النظام", qty: 1, share: 25 / 45 },
  { name: "تراخيص المستخدمين", desc: "ترخيص سنوي لعدد 10 مستخدمين", qty: 10, share: 12 / 45 },
  { name: "دعم فني", desc: "دعم فني لمدة سنة", qty: 1, share: 8 / 45 },
];
const customers: Record<string, { code: string; vat: string; phone: string; email: string; addr: string }> = {
  "شركة النور للتجارة": { code: "C-000125", vat: "300123456700003", phone: "0501234567", email: "info@alnoor.com", addr: "الرياض - حي العليا" },
};
const fallbackCust = (name: string, i: number) => ({ code: `C-00${String(100 + i * 7)}`, vat: `3001234567${String(10000 + i * 137).slice(0, 5)}`, phone: `05012345${String(10 + i * 3).slice(-2)}`, email: "info@client.sa", addr: "الرياض - المملكة العربية السعودية" });

function statusOf(s: string) {
  if (s === "مدفوعة") return { label: "مكتملة", sub: "تم سداد الفاتورة بالكامل", cls: "bg-success/15 text-success", Icon: CheckCircle2 };
  if (s === "متأخرة") return { label: "متأخرة", sub: "تجاوزت الفاتورة تاريخ الاستحقاق", cls: "bg-destructive/10 text-destructive", Icon: AlertCircle };
  return { label: s === "قيد المراجعة" ? "قيد المراجعة" : "معلقة", sub: "بانتظار سداد الفاتورة", cls: "bg-warning/15 text-warning", Icon: Clock };
}
const num = (s: string) => Number(s.replace(/,/g, ""));
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });

function build(id?: string) {
  const r = salesInvoices.find((x) => x[0] === id);
  if (!r) return { no: "INV-20250915-001", method: "تحويل بنكي", issued: "2025/09/15", due: "2025/09/30", status: "مدفوعة", customer: "شركة النور للتجارة", cust: customers["شركة النور للتجارة"]!, subtotal: 45000, paidOn: "2025/09/18", receipt: "PAY-000458" };
  const i = salesInvoices.indexOf(r); const [y, m, d] = r[1].split("/").map(Number) as [number, number, number];
  const due = new Date(y, m - 1, d + 15);
  return { no: r[0], method: r[6], issued: r[1], due: `${due.getFullYear()}/${String(due.getMonth() + 1).padStart(2, "0")}/${String(due.getDate()).padStart(2, "0")}`, status: r[7] as string, customer: r[2] as string, cust: fallbackCust(r[2], i), subtotal: num(r[3]), paidOn: r[1], receipt: `PAY-000${440 + i}` };
}

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="grid grid-cols-[8.5rem_1fr] gap-2 py-1 text-sm"><span className="text-muted-foreground">{k} :</span><span className="font-medium">{v}</span></div>
);
const Card = ({ title, icon: I, children, className = "" }: { title: string; icon: typeof User; children: React.ReactNode; className?: string }) => (
  <section className={`min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}>
    <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold"><I size={20} className="text-primary" />{title}</h2>{children}
  </section>
);

export function InvoiceDetails({ id }: { id?: string }) {
  const inv = build(id); const navigate = useNavigate();
  const [status, setStatus] = useState(inv.status);
  const [mail, setMail] = useState(false); const [to, setTo] = useState(inv.cust.email);
  const st = statusOf(status); const paid = status === "مدفوعة";
  const items = baseItems.map((b) => { const total = Math.round(inv.subtotal * b.share * 100) / 100; return { ...b, unit: total / b.qty, total }; });
  const vat = inv.subtotal * 0.15; const total = inv.subtotal + vat;
  const pdf = `${inv.no}.pdf`;

  const download = () => {
    const txt = [`فاتورة ${inv.no}`, `العميل: ${inv.customer}`, `تاريخ الإصدار: ${inv.issued}`, ...items.map((it, i) => `${i + 1}. ${it.name} × ${it.qty} = ${fmt(it.total)} ريال`), `المجموع الفرعي: ${fmt(inv.subtotal)}`, `ضريبة 15%: ${fmt(vat)}`, `الإجمالي الكلي: ${fmt(total)} ريال`].join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + txt], { type: "text/plain;charset=utf-8" })); a.download = pdf.replace(".pdf", ".txt"); a.click();
    toast.success("تم تحميل الفاتورة");
  };

  return (
    <AppShell>
      <style>{`@media print { aside, header, .no-print { display:none !important } main { padding:0 !important } }`}</style>
      <main className="space-y-4 p-4 md:p-6">
        <nav className="no-print flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/sales" className="hover:text-primary">المبيعات</Link><ChevronLeft size={12} />
          <Link to="/sales" className="hover:text-primary">الفواتير</Link><ChevronLeft size={12} /><span className="text-foreground">تفاصيل الفاتورة</span>
        </nav>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold"><FileText className="text-primary" size={26} />تفاصيل الفاتورة</h1>
            <p className="mt-1 text-sm text-muted-foreground">عرض جميع تفاصيل الفاتورة وحالتها والعمليات المرتبطة بها</p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <Button className="gap-1.5" onClick={() => setMail(true)}><Mail size={16} />إرسال عبر البريد</Button>
            <Button variant="outline" className="gap-1.5" onClick={() => window.print()}><Printer size={16} />طباعة</Button>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="gap-1.5">المزيد<ChevronDown size={14} /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={download}>تحميل PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { navigator.clipboard?.writeText(inv.no); toast.success("تم نسخ رقم الفاتورة"); }}>نسخ الفاتورة</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" disabled={status === "ملغاة"} onClick={() => { if (confirm("هل تريد إلغاء الفاتورة؟")) { setStatus("ملغاة"); toast.success("تم إلغاء الفاتورة"); } }}>إلغاء الفاتورة</DropdownMenuItem>
              </DropdownMenuContent></DropdownMenu>
            <Button variant="outline" className="gap-1.5" onClick={() => navigate({ to: "/sales" })}><ArrowRight size={16} />رجوع</Button>
          </div>
        </div>

        <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          {[["رقم الفاتورة", inv.no, FileText], ["طريقة الدفع", inv.method, CreditCard], ["تاريخ الإصدار", inv.issued, CalendarDays], ["تاريخ الاستحقاق", inv.due, CalendarDays]].map(([k, v, I]) => {
            const Ic = I as typeof FileText; return (
              <div key={k as string} className="flex items-start gap-3 border-border p-2 lg:border-l">
                <Ic size={20} className="mt-0.5 text-primary" /><div><p className="text-sm text-muted-foreground">{k as string}</p><p className="mt-1 text-lg font-extrabold" dir={k === "رقم الفاتورة" ? "ltr" : undefined}>{v as string}</p></div>
              </div>);
          })}
          <div className={`rounded-xl p-4 ${status === "ملغاة" ? "bg-muted text-muted-foreground" : st.cls}`}>
            <p className="flex items-center gap-2 text-xl font-extrabold"><st.Icon size={22} />{status === "ملغاة" ? "ملغاة" : st.label}</p>
            <p className="mt-1 text-xs">{status === "ملغاة" ? "تم إلغاء الفاتورة" : st.sub}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card title="معلومات الشركة" icon={Building2}>
            <Row k="اسم الشركة" v="تكامل بلس للحلول التقنية" /><Row k="الرقم الضريبي" v="300987654300003" /><Row k="الجوال" v="0507111781" />
            <Row k="البريد الإلكتروني" v="info@takamulplus.com" /><Row k="العنوان" v="الرياض - المملكة العربية السعودية" />
          </Card>
          <Card title="معلومات العميل" icon={User}>
            <Row k="اسم العميل" v={inv.customer} /><Row k="رقم العميل" v={inv.cust.code} /><Row k="الرقم الضريبي" v={inv.cust.vat} />
            <Row k="الجوال" v={inv.cust.phone} /><Row k="البريد الإلكتروني" v={inv.cust.email} /><Row k="العنوان" v={inv.cust.addr} />
          </Card>
        </div>

        <Card title="بنود الفاتورة" icon={ListChecks}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-primary-soft text-xs"><tr>{["#", "المنتج / الخدمة", "الوصف", "الكمية", "سعر الوحدة (ريال)", "الخصم (ريال)", "الإجمالي (ريال)"].map((h) => <th key={h} className="p-3 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>{items.map((it, i) => (
                <tr key={it.name} className="border-t border-border"><td className="p-3">{i + 1}</td><td className="p-3 font-bold">{it.name}</td><td className="p-3 text-muted-foreground">{it.desc}</td><td className="p-3">{it.qty}</td><td className="p-3">{fmt(it.unit)}</td><td className="p-3">0</td><td className="p-3 font-bold">{fmt(it.total)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="ملاحظات" icon={MessageSquareText}>
            <p className="text-sm leading-7 text-muted-foreground">شكرًا لتعاملكم معنا...<br />في حال وجود أي استفسار يرجى التواصل معنا.</p>
          </Card>
          <Card title="حالة الدفع" icon={Wallet}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Row k="المبلغ المدفوع" v={`${fmt(paid ? total : 0)} ريال`} /><Row k="تاريخ السداد" v={paid ? inv.paidOn : "—"} />
                <Row k="رقم الإيصال" v={paid ? inv.receipt : "—"} /><Row k="البنك" v={paid ? "البنك الأهلي" : "—"} />
              </div>
              <div className={`shrink-0 text-center text-sm font-bold ${paid ? "text-success" : "text-warning"}`}>
                {paid ? <CheckCircle2 size={40} className="mx-auto" /> : <Banknote size={40} className="mx-auto" />}<p className="mt-1">{paid ? "تم السداد بالكامل" : "لم يتم السداد"}</p>
              </div>
            </div>
          </Card>
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            {[["المجموع الفرعي", inv.subtotal], ["الخصم", 0], ["ضريبة القيمة المضافة (15%)", vat]].map(([k, v]) => (
              <div key={k as string} className="flex justify-between border-b border-border py-2.5 text-sm"><span>{k}</span><b>{fmt(v as number)} ريال</b></div>
            ))}
            <div className="mt-3 flex justify-between rounded-lg bg-success/15 p-3 text-lg font-extrabold"><span>الإجمالي الكلي</span><span>{fmt(total)} ريال</span></div>
          </section>
        </div>

        <Card title="المرفقات" icon={Paperclip}>
          <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center gap-2"><FileText size={24} className="text-destructive" /><div><p className="text-sm font-bold" dir="ltr">{pdf}</p><p className="text-[11px] text-muted-foreground">245 KB</p></div></div>
            <button aria-label="تحميل المرفق" onClick={download} className="no-print grid size-8 place-items-center rounded-md text-primary hover:bg-muted"><Download size={17} /></button>
          </div>
        </Card>
      </main>

      <Dialog open={mail} onOpenChange={setMail}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>إرسال الفاتورة عبر البريد</DialogTitle></DialogHeader>
          <label className="text-sm font-bold">البريد الإلكتروني<input dir="ltr" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" /></label>
          <p className="text-xs text-muted-foreground">سيتم إرفاق {pdf}</p>
          <div className="flex gap-2"><Button className="flex-1" onClick={() => { if (!/^\S+@\S+\.\S+$/.test(to)) return toast.error("اكتب بريدًا صحيحًا"); setMail(false); toast.success(`تم إرسال الفاتورة إلى ${to}`); }}>إرسال</Button><Button variant="outline" className="flex-1" onClick={() => setMail(false)}>إلغاء</Button></div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
