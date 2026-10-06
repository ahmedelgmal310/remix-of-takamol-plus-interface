import { useMemo, useState } from "react";
import {
  Building2, CalendarDays, Check, CheckCircle2, ChevronDown, CircleCheck, Clock3, Database, Download, Eye, FileCheck2, FileText,
  Hash, History, Hourglass, Landmark, Mail, MapPin, MoreHorizontal, PlayCircle, PlusCircle, Phone, Search, Settings, ShoppingCart,
  User, XCircle, Coins, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { programOrders, orderSteps, type OrderStatus, type ProgramOrder } from "@/data/mockData";

const fmt = (n: number) => n.toLocaleString("en-US");
const statusCls: Record<OrderStatus, string> = {
  "طلب جديد": "bg-primary-soft text-primary",
  "مراجعة الدفع": "bg-warning-soft text-warning",
  "بانتظار التفعيل": "bg-buy-violet-soft text-buy-violet",
  "مفعلة": "bg-success-soft text-success",
  "مرفوضة": "bg-destructive/10 text-destructive",
};
const progCls: Record<string, string> = {
  "المالية": "bg-success-soft text-success",
  "الموارد البشرية": "bg-buy-violet-soft text-buy-violet",
  "خدمة العملاء": "bg-primary-soft text-primary",
  "جميع البرامج": "bg-warning-soft text-warning",
};
const tabs: { label: string; status?: OrderStatus }[] = [
  { label: "الكل" }, { label: "جديد", status: "طلب جديد" }, { label: "مراجعة الدفع", status: "مراجعة الدفع" },
  { label: "بانتظار التفعيل", status: "بانتظار التفعيل" }, { label: "مفعلة", status: "مفعلة" }, { label: "مرفوضة", status: "مرفوضة" },
];
const baseCounts: Record<string, number> = { "الكل": 56, "طلب جديد": 12, "مراجعة الدفع": 8, "بانتظار التفعيل": 5, "مفعلة": 28, "مرفوضة": 3 };

function Kpi({ title, value, sub, icon: Icon, tone }: { title: string; value: string; sub: string; icon: typeof FileText; tone: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="min-w-0">
        <div className="whitespace-nowrap text-sm font-bold text-foreground">{title}</div>
        <div className="mt-1 text-2xl font-extrabold text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="h-7 w-7" /></div>
    </div>
  );
}

export function ProgramOrders() {
  const [orders, setOrders] = useState<ProgramOrder[]>(programOrders);
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const [selId, setSelId] = useState(programOrders[0]!.id);
  const [note, setNote] = useState("");
  const sel = orders.find((o) => o.id === selId) ?? orders[0]!;

  const counts = useMemo(() => {
    const c = { ...baseCounts };
    programOrders.forEach((o0) => {
      const o = orders.find((x) => x.id === o0.id)!;
      if (o.status !== o0.status) { c[o0.status]--; c[o.status]++; }
    });
    return c;
  }, [orders]);

  const rows = orders.filter((o) => (!tabs[tab]!.status || o.status === tabs[tab]!.status) &&
    (!q || [o.id, o.client, o.phone, o.org].some((v) => v.includes(q))));

  const update = (status: OrderStatus, step: number, msg: string) => {
    setOrders((p) => p.map((o) => (o.id === sel.id ? { ...o, status, step: Math.max(o.step, step) } : o)));
    toast.success(msg + " (عرض توضيحي)");
  };

  return (
    <AppShell>
      <div className="space-y-4 p-3 sm:p-5" dir="rtl">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Kpi title="طلبات جديدة" value={String(counts["طلب جديد"])} sub="بانتظار المراجعة" icon={FileText} tone="bg-primary-soft text-primary" />
          <Kpi title="مراجعة الدفع" value={String(counts["مراجعة الدفع"])} sub="قيد المراجعة" icon={Hourglass} tone="bg-warning-soft text-warning" />
          <Kpi title="بانتظار التفعيل" value={String(counts["بانتظار التفعيل"])} sub="تم اعتمادها" icon={Settings} tone="bg-buy-violet-soft text-buy-violet" />
          <Kpi title="مفعلة" value={String(counts["مفعلة"])} sub="هذا الشهر" icon={CheckCircle2} tone="bg-success-soft text-success" />
          <Kpi title="مرفوضة" value={String(counts["مرفوضة"])} sub="هذا الشهر" icon={XCircle} tone="bg-destructive/10 text-destructive" />
          <Kpi title="إجمالي المبيعات" value="498,500" sub="ريال سعودي" icon={Coins} tone="bg-warning-soft text-buy-gold" />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-foreground"><ShoppingCart className="h-7 w-7" /> طلبات شراء البرامج</h1>
            <div className="relative min-w-[220px] flex-1 lg:mr-6 lg:max-w-[370px]">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث برقم الطلب أو اسم العميل أو الجوال ..." className="h-11 w-full rounded-lg border border-border bg-background pr-9 pl-3 text-sm outline-none focus:border-primary" />
            </div>
            <button className="flex h-11 w-[240px] items-center justify-between rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> كل الفترات</span><ChevronDown className="h-4 w-4" /></button>
            <Button variant="outline" className="h-11 gap-2" onClick={() => toast("تم تجهيز ملف التصدير (عرض توضيحي)")}><Download className="h-4 w-4" /> تصدير</Button>
            <Button className="h-11 gap-2" onClick={() => toast("نموذج الطلب اليدوي (عرض توضيحي)")}><PlusCircle className="h-4 w-4" /> طلب جديد (يدوي)</Button>
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {tabs.map((t, i) => (
              <button key={t.label} onClick={() => setTab(i)} className={`shrink-0 rounded-lg border px-6 py-2 text-sm font-semibold ${i === tab ? "border-primary/30 bg-primary-soft text-primary border-b-2 border-b-primary" : "border-border bg-muted/40 text-foreground"}`}>
                {t.label} ({counts[t.status ?? "الكل"]})
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[1100px] whitespace-nowrap text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>{["#", "رقم الطلب", "تاريخ الطلب", "اسم العميل", "المنشأة", "البرامج المطلوبة", "المبلغ", "طريقة الدفع", "الإيصال", "الحالة", "الإجراءات"].map((h) => <th key={h} className="px-3 py-3 text-right font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((o, i) => (
                  <tr key={o.id} className={`border-t border-border ${o.id === sel.id ? "bg-primary-soft/40" : ""}`}>
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold">{o.id}</td>
                    <td className="px-3 py-2 text-center text-xs leading-4">{o.date}<br />{o.time}</td>
                    <td className="px-3 py-2">{o.client}</td>
                    <td className="px-3 py-2">{o.org}</td>
                    <td className="px-3 py-2"><span className={`inline-block min-w-[96px] rounded px-3 py-1 text-center text-xs font-semibold ${progCls[o.program]}`}>{o.program}</span></td>
                    <td className="px-3 py-2 font-bold">{fmt(o.amount)} ريال</td>
                    <td className="px-3 py-2"><span className="flex items-center gap-2">{o.method === "مدى" && <Landmark className="h-4 w-4" />}{o.method}</span></td>
                    <td className="px-3 py-2"><FileText className="h-5 w-5 text-muted-foreground" /></td>
                    <td className="px-3 py-2"><span className={`inline-block min-w-[92px] rounded px-3 py-1 text-center text-xs font-semibold ${statusCls[o.status]}`}>{o.status}</span></td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => setSelId(o.id)} className="flex items-center gap-2 rounded-md border border-border px-4 py-1.5 text-primary"><Eye className="h-4 w-4" /> عرض</button>
                        <button className="rounded-md border border-border px-3 py-1.5"><MoreHorizontal className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={11} className="py-8 text-center text-muted-foreground">لا توجد طلبات مطابقة</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr_1.2fr]">
          {/* actions (first in RTL = right) */}
          <div className="order-1 rounded-xl border border-border bg-card p-4 shadow-sm lg:order-1">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><Settings className="h-5 w-5" /> إجراءات الطلب</h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => update("بانتظار التفعيل", 3, "تم اعتماد الطلب")} className="flex items-center justify-center gap-2 rounded-md bg-success py-2.5 text-sm font-bold text-background"><CircleCheck className="h-4 w-4" /> اعتماد الطلب</button>
              <button onClick={() => update("مرفوضة", sel.step, "تم رفض الطلب")} className="flex items-center justify-center gap-2 rounded-md bg-destructive py-2.5 text-sm font-bold text-background"><XCircle className="h-4 w-4" /> رفض الطلب</button>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { l: "مراجعة إيصال التحويل", i: FileCheck2, f: () => update("مراجعة الدفع", 2, "تمت مراجعة الإيصال") },
                { l: "إصدار العقد", i: FileText, f: () => update(sel.status === "مرفوضة" ? sel.status : "بانتظار التفعيل", 4, "تم إصدار العقد") },
                { l: "تفعيل البرنامج", i: PlayCircle, f: () => update("مفعلة", 6, "تم تفعيل البرنامج") },
                { l: "إرسال بيانات الدخول للعميل", i: Mail, f: () => toast.success("تم إرسال بيانات الدخول (عرض توضيحي)") },
              ].map((a) => (
                <button key={a.l} onClick={a.f} className="flex w-full items-center justify-between rounded-md border border-buy-navy/60 px-4 py-2 text-sm font-semibold text-buy-navy">
                  <span>{a.l}</span><a.i className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm font-bold">ملاحظات إدارة (داخلية)</div>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="اكتب ملاحظة ..." className="mt-2 h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none" />
            <button onClick={() => { toast.success("تم حفظ الملاحظة (عرض توضيحي)"); setNote(""); }} className="mt-3 w-full rounded-md bg-buy-navy py-2.5 text-sm font-bold text-background">حفظ الملاحظة</button>
          </div>

          {/* details */}
          <div className="order-2 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><FileText className="h-5 w-5" /> تفاصيل الطلب <span dir="ltr">#{sel.id}</span></h2>
              <span className={`rounded px-6 py-1 text-xs font-semibold ${statusCls[sel.status]}`}>{sel.status}</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-border p-3 text-sm">
                {[
                  [CalendarDays, "تاريخ الطلب", `${sel.date} - ${sel.time}`], [User, "اسم العميل", sel.client], [Phone, "الجوال", sel.phone],
                  [Mail, "البريد الإلكتروني", sel.email], [Building2, "المنشأة", sel.org], [MapPin, "المدينة", sel.city],
                ].map(([I, k, v]) => {
                  const Ic = I as typeof User;
                  return <div key={k as string} className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-muted-foreground"><Ic className="h-4 w-4" /> {k as string}</span><span className="font-medium text-foreground">{v as string}</span></div>;
                })}
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-border p-3">
                  <div className="text-sm font-bold">البرامج المطلوبة</div>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/40 p-3">
                    <span className="font-bold text-success">برنامج {sel.program === "جميع البرامج" ? "تكامل بلس الكامل" : sel.program === "المالية" ? "الشؤون المالية" : sel.program}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-success-soft text-success"><Database className="h-5 w-5" /></span>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">المبلغ الإجمالي</div>
                  <div className="text-xl font-extrabold">{fmt(sel.amount)} ريال</div>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="text-sm font-bold">إيصال التحويل</div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="text-sm"><div>إيصال تحويل بنكي.pdf</div><div className="text-xs text-muted-foreground">1.2 MB</div></div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toast("تنزيل الإيصال (عرض توضيحي)")} className="rounded-md border border-border p-2"><Download className="h-4 w-4" /></button>
                      <div className="relative h-14 w-14 rounded border border-border bg-muted/40 p-1"><div className="space-y-1">{[1, 2, 3, 4].map((x) => <div key={x} className="h-1 rounded bg-muted-foreground/30" />)}</div><Check className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full bg-success p-0.5 text-background" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold"><MessageSquare className="h-4 w-4" /> ملاحظات العميل</div>
            <div className="mt-2 rounded-lg border border-border p-3 text-xs text-muted-foreground">{sel.note}</div>
          </div>

          {/* timeline */}
          <div className="order-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold"><History className="h-5 w-5" /> سجل الطلب</h2>
            <ol className="rounded-lg border border-border p-3">
              {orderSteps.map((s, i) => {
                const done = i < sel.step, cur = i === sel.step;
                return (
                  <li key={s.label} className="relative flex items-center gap-3 py-2.5">
                    {i < orderSteps.length - 1 && <span className="absolute right-[13px] top-1/2 h-full w-px bg-border" />}
                    <span className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${done ? "border-primary bg-background" : cur ? "border-warning bg-warning text-background" : "border-border bg-background"}`}>
                      {done ? <span className="h-3 w-3 rounded-full bg-primary" /> : cur ? <Clock3 className="h-4 w-4" /> : null}
                    </span>
                    <span className={`flex-1 whitespace-nowrap text-sm ${done || cur ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                    {(done || cur) && <span className="whitespace-nowrap text-xs text-muted-foreground">{s.by}</span>}
                    <span className="whitespace-nowrap text-left text-xs text-muted-foreground" dir="ltr">{done || cur ? `${sel.date} ${s.time}` : ""}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
