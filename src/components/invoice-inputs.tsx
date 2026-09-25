import { Link } from "@tanstack/react-router";
import {
  Hash, User, CalendarDays, FileText, Package, Coins, Percent, Receipt, CreditCard, NotebookPen, CircleCheck,
  Truck, Warehouse, Settings, ShoppingCart, Calculator, Check, FileSpreadsheet, ClipboardList,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

type Item = [string, string, typeof Hash];
const sales: Item[] = [
  ["رقم الفاتورة", "تلقائي أو حسب الترتيب المحدد", Hash],
  ["اسم العميل", "من سجل العملاء أو إضافة جديد", User],
  ["التاريخ", "تاريخ إصدار الفاتورة", CalendarDays],
  ["نوع الفاتورة", "ضريبية / ضريبية مبسطة / عادية", FileText],
  ["تفاصيل الأصناف", "اسم الصنف – الكمية – السعر – الخصم", Package],
  ["الإجمالي قبل الضريبة", "إجمالي قيمة الأصناف", Coins],
  ["قيمة الضريبة (VAT)", "حسب نسبة الضريبة المعتمدة", Percent],
  ["الإجمالي بعد الضريبة", "المبلغ الكلي للفاتورة", Receipt],
  ["طريقة الدفع", "نقدي / أجل / تحويل بنكي / مدى", CreditCard],
  ["الملاحظات", "أي ملاحظات إضافية للفاتورة", NotebookPen],
  ["حالة الفاتورة", "تم الإصدار / ملغاة / مسددة", CircleCheck],
];
const purchases: Item[] = [
  ["رقم الفاتورة", "تلقائي أو حسب الترتيب المحدد", Hash],
  ["اسم المورد", "من سجل الموردين أو إضافة جديد", User],
  ["التاريخ", "تاريخ إصدار الفاتورة", CalendarDays],
  ["نوع الفاتورة", "ضريبية / ضريبية مبسطة / عادية", FileText],
  ["تفاصيل الأصناف", "اسم الصنف – الكمية – السعر – الخصم", Package],
  ["الإجمالي قبل الضريبة", "إجمالي قيمة الأصناف", Coins],
  ["قيمة الضريبة (VAT)", "حسب نسبة الضريبة المعتمدة", Percent],
  ["الإجمالي بعد الضريبة", "المبلغ الكلي للفاتورة", Receipt],
  ["طريقة الدفع", "نقدي / أجل / تحويل بنكي / شيك", CreditCard],
  ["رقم أمر الشراء", "يرتبط بأمر الشراء (إن وجد)", ClipboardList],
  ["الملاحظات", "أي ملاحظات إضافية للفاتورة", FileText],
];
const support: Item[] = [
  ["العملاء", "بيانات العميل الأساسية (الاسم – السجل التجاري – العنوان – رقم الجوال)", User],
  ["الموردين", "بيانات المورد الأساسية (الاسم – السجل التجاري – العنوان – رقم الجوال)", Truck],
  ["الأصناف", "بيانات الأصناف (الاسم – الوحدة – سعر التكلفة – سعر البيع)", Package],
  ["المستودعات", "تحديد المستودع الذي يتم منه الصرف أو الإضافة", Warehouse],
  ["أوامر الشراء", "تسجيل طلبات الشراء من الموردين", FileText],
  ["أوامر البيع", "تسجيل طلبات العملاء قبل إصدار الفاتورة", FileText],
  ["العملات", "العملات المستخدمة في التعاملات (ريال – دولار – يورو ...)", Coins],
  ["الخصومات", "أنواع وقيم الخصومات المسموح بها", Percent],
  ["طرق الدفع", "النقدي – التحويل البنكي – مدى – شيك ...", CreditCard],
  ["الضرائب", "نسبة الضريبة حسب النظام الضريبي المعتمد", FileSpreadsheet],
  ["الضبط والإعدادات", "إعدادات عامة للنظام (قوالب الفواتير – الترقيم – الضرائب)", Settings],
];
const cols = [
  { t: "فواتير المبيعات", s: "البيانات المطلوبة لإصدار فواتير المبيعات", items: sales, head: "bg-success", tint: "bg-success/10 text-success", icon: FileText, to: "/sales/new" as const },
  { t: "فواتير المشتريات", s: "البيانات المطلوبة لإصدار فواتير المشتريات", items: purchases, head: "bg-primary", tint: "bg-primary-soft text-primary", icon: ShoppingCart, to: "/purchases/new" as const },
  { t: "إدخالات مساندة ومتفرعة", s: "بيانات إضافية تدعم الفواتير والتقارير", items: support, head: "bg-finance-purple", tint: "bg-finance-violet text-finance-purple", icon: Settings, to: null },
];

export function InvoiceInputs() {
  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <section className="flex items-center justify-between gap-4 rounded-2xl bg-sidebar p-6 text-sidebar-foreground shadow-sm">
          <div className="flex items-center gap-4">
            <span className="hidden size-16 shrink-0 place-items-center rounded-2xl bg-sidebar-accent sm:grid"><FileText size={34} /></span>
            <div>
              <h1 className="text-2xl font-extrabold md:text-3xl">قائمة الإدخالات للفواتير</h1>
              <p className="mt-2 text-sm opacity-80">جميع البيانات الأساسية التي نحتاجها لإصدار فواتير المبيعات والمشتريات وإدارة العملية بشكل متكامل</p>
            </div>
          </div>
          <Calculator size={56} className="hidden shrink-0 opacity-70 md:block" />
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          {cols.map((c) => (
            <section key={c.t} className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className={`flex items-center gap-3 p-4 text-primary-foreground ${c.head}`}>
                <c.icon size={34} className="shrink-0" />
                <div className="min-w-0 flex-1"><h2 className="text-xl font-extrabold">{c.t}</h2><p className="text-xs opacity-90">{c.s}</p></div>
                {c.to && <Link to={c.to} className="shrink-0 rounded-lg bg-card/20 px-3 py-1.5 text-xs font-bold hover:bg-card/30">فتح الشاشة</Link>}
              </div>
              <ol className="space-y-2.5 p-3">
                {c.items.map(([t, d, I], i) => (
                  <li key={t} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${c.tint}`}>{i + 1}</span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-extrabold">{t}</p><p className="mt-0.5 text-xs text-muted-foreground">{d}</p></div>
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${c.tint}`}><I size={20} /></span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-primary-soft p-4 text-sm font-bold text-primary">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={18} /></span>
          جميع هذه البيانات تُسجل في النظام بشكل منظم وتُستخدم في إصدار الفواتير، متابعة الحسابات، وإعداد التقارير الضريبية
        </div>
      </main>
    </AppShell>
  );
}
