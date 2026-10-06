import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, CalendarClock, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDot, Clock3, Copy,
  CreditCard, Database, FileText, Headphones, Home, Landmark, RotateCcw, Trash2, UploadCloud, Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import buyHr from "@/assets/buy-hr.jpg";
import buyFinance from "@/assets/buy-finance.jpg";
import buyService from "@/assets/buy-service.jpg";
import { buyCatalog, myOrders, type MyOrder } from "@/data/mockData";

const fmt = (n: number) => n.toLocaleString("en-US");
const imgs: Record<string, string> = { hr: buyHr, finance: buyFinance, service: buyService };
const icons: Record<string, typeof Users> = { hr: Users, finance: Database, service: Headphones };
const iconTone: Record<string, string> = { hr: "bg-buy-violet-soft text-buy-violet", finance: "bg-primary-soft text-primary", service: "bg-primary-soft text-buy-navy" };
const steps = ["اختيار البرامج", "مراجعة الطلب", "الدفع", "تأكيد الطلب"];
const card = "rounded-2xl border border-border bg-card p-5 shadow-sm";

function Stepper({ cur }: { cur: number }) {
  return (
    <div className="mb-4 flex items-start">
      {steps.map((s, i) => (
        <div key={s} className="relative flex flex-1 flex-col items-center">
          {i < steps.length - 1 && <span className={`absolute top-3.5 right-1/2 h-px w-full ${i < cur ? "bg-buy-navy" : "bg-border"}`} />}
          <span className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${i === cur ? "border-buy-navy bg-buy-navy text-background" : i < cur ? "border-buy-navy bg-background text-buy-navy" : "border-muted-foreground/40 bg-background text-muted-foreground"}`}>{i + 1}</span>
          <span className={`mt-1.5 whitespace-nowrap text-[11px] ${i === cur ? "font-bold text-buy-navy" : "text-muted-foreground"}`}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, req = true }: { label: string; value: string; onChange: (v: string) => void; req?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-foreground">{req && <span className="text-destructive">* </span>}{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-buy-navy" />
    </label>
  );
}

function StatusPill({ s }: { s: MyOrder["status"] }) {
  return s === "قيد المراجعة"
    ? <span className="inline-flex items-center gap-1 rounded-md bg-warning-soft px-3 py-1 text-xs font-bold text-warning"><Clock3 className="h-3.5 w-3.5" /> قيد المراجعة</span>
    : <span className="rounded-md bg-success-soft px-4 py-1 text-xs font-bold text-success">مفعل</span>;
}

export function BuyPrograms() {
  const [cart, setCart] = useState<string[]>(["finance"]);
  const [step, setStep] = useState(1);
  const [buyer, setBuyer] = useState({ org: "مؤسسة امتيازات الصفوة للتجارة", name: "أحمد محمد", phone: "0501522859", email: "ahmed@company.com", city: "الرياض", note: "" });
  const [pay, setPay] = useState<"bank" | "card">("bank");
  const [receipt, setReceipt] = useState("");
  const [orders, setOrders] = useState<MyOrder[]>(myOrders);
  const [last, setLast] = useState<MyOrder>(myOrders[0]!);
  const [track, setTrack] = useState<MyOrder>(myOrders[0]!);
  const [tab, setTab] = useState<"cur" | "past">("cur");

  const items = buyCatalog.filter((p) => cart.includes(p.id));
  const total = items.reduce((s, p) => s + p.price, 0);
  const main = items[0];
  const extras = buyCatalog.filter((p) => p.id !== main?.id);
  const names = items.map((p) => p.name).join(" + ") || "—";
  const upd = (k: keyof typeof buyer) => (v: string) => setBuyer((b) => ({ ...b, [k]: v }));

  const buyNow = (id: string) => { setCart([id]); setStep(1); toast.success("تمت إضافة البرنامج إلى طلبك"); };
  const confirm = () => {
    if (!items.length) { toast.error("اختر برنامجاً واحداً على الأقل"); return; }
    if (pay === "bank" && !receipt) { toast.error("أرفق إيصال التحويل أولاً"); return; }
    const n = 126 + orders.length;
    const o: MyOrder = { id: `TK-2026-00${n}`, program: names, amount: total, date: "2026/10/06", time: "10:45", method: pay === "bank" ? "تحويل بنكي" : "دفع إلكتروني", status: "قيد المراجعة", kind: main?.id ?? "finance", current: true };
    setOrders((p) => [o, ...p]); setLast(o); setTrack(o); setStep(3); setTab("cur");
    toast.success("تم استلام طلبك بنجاح (عرض توضيحي)");
  };
  const shown = orders.filter((o) => (tab === "cur" ? o.current : !o.current));
  const curCount = orders.filter((o) => o.current).length;

  return (
    <AppShell>
      <div className="space-y-5 p-3 sm:p-5" dir="rtl">
        <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1.45fr]">
          {/* buyer data (rightmost) */}
          <section className={`${card} order-3 xl:order-1`}>
            <h2 className="mb-3 text-xl font-extrabold text-foreground">بيانات المشتري</h2>
            <Stepper cur={1} />
            <div className="space-y-3">
              <Field label="اسم الجهة / المنشأة" value={buyer.org} onChange={upd("org")} />
              <Field label="اسم المسؤول" value={buyer.name} onChange={upd("name")} />
              <Field label="الجوال" value={buyer.phone} onChange={upd("phone")} />
              <Field label="البريد الإلكتروني" value={buyer.email} onChange={upd("email")} />
              <label className="block">
                <span className="mb-1 block text-xs font-bold"><span className="text-destructive">* </span>المدينة</span>
                <div className="relative">
                  <select value={buyer.city} onChange={(e) => upd("city")(e.target.value)} className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 text-sm outline-none">
                    {["الرياض", "جدة", "الدمام", "مكة", "المدينة"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold">ملاحظات إضافية</span>
                <input value={buyer.note} onChange={(e) => upd("note")(e.target.value)} placeholder="اكتب أي ملاحظات ..." className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none" />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-[1.8fr_1fr] gap-3">
              <button onClick={() => { if (!buyer.org || !buyer.name || !buyer.phone) { toast.error("أكمل الحقول المطلوبة"); return; } setStep(2); toast("انتقل إلى إتمام الدفع"); }} className="flex items-center justify-center gap-2 rounded-md bg-buy-navy py-2.5 text-sm font-bold text-background"><ArrowRight className="h-4 w-4 rotate-180" /> متابعة إلى الدفع</button>
              <button onClick={() => setStep(1)} className="rounded-md border border-border py-2.5 text-sm font-bold">السابق</button>
            </div>
          </section>

          {/* review */}
          <section className={`${card} order-2`}>
            <h2 className="mb-3 text-xl font-extrabold text-foreground">مراجعة الطلب</h2>
            <Stepper cur={step >= 1 ? 1 : 0} />
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[1fr_100px_70px] bg-muted/50 px-3 py-2 text-xs font-bold"><span>البرنامج</span><span>السعر</span><span className="text-center">إجراء</span></div>
              {main ? (
                <div className="grid grid-cols-[1fr_100px_70px] items-center border-t border-border px-3 py-3 text-sm">
                  <span className="flex items-center gap-3 font-bold"><span className={`grid h-9 w-9 place-items-center rounded-lg ${iconTone[main.id]}`}>{(() => { const I = icons[main.id]!; return <I className="h-5 w-5" />; })()}</span>{main.name}</span>
                  <span className="font-extrabold">{fmt(main.price)} ريال</span>
                  <button onClick={() => setCart((c) => c.filter((x) => x !== main.id))} className="mx-auto rounded-md border border-border p-1.5 text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                </div>
              ) : <div className="border-t border-border p-4 text-center text-sm text-muted-foreground">لم يتم اختيار برنامج</div>}
            </div>
            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              <div className="bg-muted/50 px-3 py-2 text-xs font-bold">إضافة برامج أخرى (اختياري)</div>
              {extras.map((p) => {
                const I = icons[p.id]!;
                return (
                  <label key={p.id} className="grid cursor-pointer grid-cols-[1fr_100px_70px] items-center border-t border-border px-3 py-2.5 text-sm">
                    <span className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-lg ${iconTone[p.id]}`}><I className="h-5 w-5" /></span>{p.name}</span>
                    <span className="font-extrabold">{fmt(p.price)} ريال</span>
                    <input type="checkbox" checked={cart.includes(p.id)} onChange={(e) => setCart((c) => (e.target.checked ? [...c, p.id] : c.filter((x) => x !== p.id)))} className="mx-auto h-4 w-4 accent-buy-navy" />
                  </label>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between px-1"><span className="text-xl font-extrabold">الإجمالي</span><span className="text-xl font-extrabold">{fmt(total)} ريال</span></div>
            <div className="mt-4 grid grid-cols-[1.8fr_1fr] gap-3">
              <button onClick={() => { if (!items.length) { toast.error("اختر برنامجاً"); return; } toast("أكمل بيانات المشتري"); }} className="flex items-center justify-center gap-2 rounded-md bg-buy-navy py-2.5 text-sm font-bold text-background"><ArrowRight className="h-4 w-4 rotate-180" /> إتمام الطلب</button>
              <button onClick={() => setStep(0)} className="rounded-md border border-border py-2.5 text-sm font-bold">السابق</button>
            </div>
          </section>

          {/* catalog (leftmost) */}
          <section className={`${card} order-1 xl:order-3`}>
            <h2 className="text-2xl font-extrabold text-foreground">شراء البرامج</h2>
            <p className="mt-1 text-sm text-muted-foreground">اختر البرنامج الذي تحتاجه الآن ويمكنك إضافة برامج أخرى لاحقاً</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {buyCatalog.map((p) => (
                <div key={p.id} className={`flex flex-col overflow-hidden rounded-xl border border-border ${p.id === "service" ? "bg-warning-soft/40" : p.id === "hr" ? "bg-buy-violet-soft/40" : "bg-primary-soft/40"}`}>
                  <img src={imgs[p.id]} alt={p.name} loading="lazy" className="h-28 w-full object-cover" />
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-center text-base font-extrabold">{p.name}</h3>
                    <p className="text-center text-xs text-muted-foreground">{p.desc}</p>
                    <ul className="mt-3 space-y-1.5 text-xs">
                      {p.features.map((f) => <li key={f} className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 shrink-0 ${p.id === "service" ? "text-buy-gold" : p.id === "hr" ? "text-buy-violet" : "text-buy-navy"}`} />{f}</li>)}
                    </ul>
                    <div className="mt-auto pt-4 text-center text-2xl font-extrabold">{fmt(p.price)} <span className="text-base">ريال</span></div>
                    <button onClick={() => buyNow(p.id)} className={`mt-3 rounded-md py-2.5 text-sm font-bold ${p.id === "service" ? "bg-buy-gold text-buy-navy" : "bg-buy-navy text-background"}`}>شراء الآن</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* my orders (rightmost) */}
          <section className={`${card} order-4 xl:order-1`}>
            <h2 className="mb-3 text-xl font-extrabold">طلباتي</h2>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/50 p-1 text-sm font-bold">
              <button onClick={() => setTab("cur")} className={`rounded-md py-2 ${tab === "cur" ? "bg-buy-navy text-background" : ""}`}>الطلبات الحالية ({curCount})</button>
              <button onClick={() => setTab("past")} className={`rounded-md py-2 ${tab === "past" ? "bg-buy-navy text-background" : ""}`}>الطلبات السابقة (5)</button>
            </div>
            <div className="mt-3 space-y-3">
              {shown.slice(0, 2).map((o) => {
                const I = icons[o.kind] ?? Database;
                return (
                  <div key={o.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <StatusPill s={o.status} />
                        <div className="truncate text-sm font-bold">{o.program}</div>
                      </div>
                      <div className="flex items-start gap-2 text-left">
                        <div className="space-y-0.5">
                          <div className="text-sm font-extrabold" dir="ltr">#{o.id}</div>
                          <div className="text-[11px] text-muted-foreground" dir="ltr">{o.date} {o.time}</div>
                          <div className="text-sm font-extrabold">{fmt(o.amount)} ريال</div>
                        </div>
                        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${o.kind === "service" ? "bg-buy-violet-soft text-buy-violet" : "bg-warning-soft text-buy-gold"}`}><I className="h-6 w-6" /></span>
                      </div>
                    </div>
                    <button onClick={() => setTrack(o)} className="mt-2 flex w-full max-w-[130px] items-center justify-center gap-1 rounded-md border border-buy-navy py-1 text-xs font-bold text-buy-navy">{o.status === "مفعل" ? "عرض التفاصيل" : "متابعة الطلب"} <ArrowLeft className="h-3.5 w-3.5" /></button>
                  </div>
                );
              })}
              {shown.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">لا توجد طلبات</div>}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button className="rounded-md border border-border p-1.5"><ChevronRight className="h-4 w-4" /></button>
              <button className="h-8 w-8 rounded-md bg-buy-navy text-sm font-bold text-background">1</button>
              <button className="rounded-md border border-border p-1.5"><ChevronLeft className="h-4 w-4" /></button>
            </div>
          </section>

          {/* tracking */}
          <section className={`${card} order-3 xl:order-2`}>
            <div className="flex items-start justify-between">
              <div><h2 className="text-xl font-extrabold">متابعة الطلب</h2><p className="text-xs text-muted-foreground">يمكنك متابعة حالة طلبك في أي وقت</p></div>
              <button onClick={() => setTrack(orders[0]!)} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm">رجوع <ArrowLeft className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 flex items-start rounded-lg border border-border p-3">
              {[["استلام الطلب", "10:45"], ["قيد المراجعة", "02:30 م"], ["تفعيل الحساب", ""], ["اكتمال الطلب", ""]].map(([l, t], i) => {
                const done = i === 0 || (track.status === "مفعل");
                const cur = i === 1 && track.status !== "مفعل";
                return (
                  <div key={l} className="relative flex flex-1 flex-col items-center text-center">
                    {i < 3 && <span className={`absolute top-4 right-1/2 h-px w-full ${done ? "bg-primary" : "bg-border"}`} />}
                    <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full ${done ? "bg-success text-background" : cur ? "bg-primary text-background ring-4 ring-primary-soft" : "border border-border bg-background text-muted-foreground"}`}>
                      {done ? <Check className="h-4 w-4" /> : cur ? <FileText className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
                    </span>
                    <span className={`mt-1 text-[11px] ${done ? "font-bold text-success" : cur ? "font-bold text-primary" : "text-muted-foreground"}`}>{l}</span>
                    {(done || cur) && <span className="text-[10px] text-muted-foreground">{track.date}<br />{t}</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-sm font-bold">تفاصيل الطلب</div>
            <dl className="mt-2 space-y-2.5 text-sm">
              {[["رقم الطلب", `#${track.id}`], ["البرنامج", track.program], ["المبلغ", `${fmt(track.amount)} ريال`], ["تاريخ الطلب", `${track.date}   ${track.time}`], ["طريقة الدفع", track.method]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2"><dt className="text-muted-foreground">{k}</dt><dd className="truncate font-medium">{v}</dd></div>
              ))}
              <div className="flex justify-between"><dt className="text-muted-foreground">حالة الطلب</dt><dd><StatusPill s={track.status} /></dd></div>
            </dl>
          </section>

          {/* success */}
          <section className={`${card} order-2 xl:order-3 text-center`}>
            <div className="relative mx-auto mt-1 h-20 w-full">
              {["right-[12%] top-1", "right-[22%] top-8", "left-[14%] top-0", "left-[24%] top-9", "right-[32%] top-0", "left-[34%] top-2"].map((c, i) => (
                <span key={c} className={`absolute ${c} text-lg ${i % 2 ? "text-buy-gold" : "text-primary"}`}>✦</span>
              ))}
              <span className="absolute left-1/2 top-0 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full bg-buy-gold text-background shadow-lg"><Check className="h-11 w-11" strokeWidth={3} /></span>
            </div>
            <h2 className="mt-3 text-xl font-extrabold text-success">تم استلام طلبك بنجاح</h2>
            <p className="mt-1 text-xs text-muted-foreground">شكراً لك ، سيتم مراجعة طلبك وتفعيله خلال وقت قصير</p>
            <div className="mt-3 rounded-lg border border-border p-3">
              <div className="text-xs text-muted-foreground">رقم الطلب</div>
              <div className="flex items-center justify-center gap-2 text-xl font-extrabold" dir="ltr">#{last.id}
                <button onClick={() => { navigator.clipboard?.writeText(last.id); toast.success("تم نسخ رقم الطلب"); }}><Copy className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <dl className="mt-2 space-y-2 text-right text-xs">
                {[["البرامج", last.program], ["المبلغ", `${fmt(last.amount)} ريال`], ["تاريخ الطلب", `${last.date}  ${last.time}`], ["طريقة الدفع", last.method]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2 border-b border-border pb-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="truncate font-bold">{v}</dd></div>
                ))}
                <div className="flex justify-between"><dt className="text-muted-foreground">حالة الطلب</dt><dd><StatusPill s={last.status} /></dd></div>
              </dl>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">سنقوم بإشعارك عند تحديث حالة الطلب</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button onClick={() => { setTrack(last); setTab("cur"); }} className="flex items-center justify-center gap-2 rounded-md bg-buy-navy py-2.5 text-sm font-bold text-background"><FileText className="h-4 w-4" /> استعراض طلباتي</button>
              <Link to="/dashboard" className="flex items-center justify-center gap-2 rounded-md border border-buy-navy py-2.5 text-sm font-bold text-buy-navy"><Home className="h-4 w-4" /> العودة للرئيسية</Link>
            </div>
          </section>

          {/* payment (leftmost) */}
          <section className={`${card} order-1 xl:order-4`}>
            <h2 className="mb-3 text-xl font-extrabold">إتمام الدفع</h2>
            <Stepper cur={2} />
            <div className="text-sm font-bold">اختر طريقة الدفع</div>
            <div className="mt-2 overflow-hidden rounded-lg border border-border">
              {([["bank", "تحويل بنكي", "سيتم تفعيل الطلب بعد رفع إيصال التحويل", Landmark], ["card", "دفع إلكتروني", "", CreditCard]] as const).map(([k, l, d, I]) => (
                <button key={k} onClick={() => setPay(k)} className={`flex w-full items-center gap-3 border-b border-border px-3 py-3 text-right last:border-0 ${pay === k ? "bg-muted/40" : ""}`}>
                  <I className="h-8 w-8 shrink-0 text-buy-navy" />
                  <span className="flex-1"><span className="block text-sm font-bold">{l}</span>{d ? <span className="text-[11px] text-muted-foreground">{d}</span> : <span className="mt-1 flex gap-1.5 text-[10px] font-extrabold"><span className="rounded bg-muted px-1">mada</span><span className="italic text-buy-navy">VISA</span><span className="flex"><span className="h-3.5 w-3.5 rounded-full bg-destructive" /><span className="-mr-1.5 h-3.5 w-3.5 rounded-full bg-warning/90" /></span></span>}</span>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${pay === k ? "border-buy-gold bg-buy-gold text-background" : "border-muted-foreground/50"}`}>{pay === k && <Check className="h-3 w-3" />}</span>
                </button>
              ))}
            </div>
            {pay === "bank" && (
              <>
                <div className="mt-3 rounded-lg border border-border p-3 text-xs">
                  <div className="mb-2 text-sm font-bold">بيانات التحويل البنكي</div>
                  {[["اسم البنك", "مصرف الراجحي"], ["رقم الحساب", "SA12 8000 0000 6080 1016 7519"], ["اسم الحساب", "مؤسسة امتيازات الصفوة للتجارة"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 py-1"><span className="text-muted-foreground">{k}</span><span className="font-medium" dir={k === "رقم الحساب" ? "ltr" : undefined}>{v}</span></div>
                  ))}
                </div>
                <label className="mt-3 flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-muted-foreground/50 p-3 text-center text-xs">
                  <span className="flex items-center gap-2 text-sm font-bold">{receipt ? receipt : "إرفاق إيصال التحويل"} <UploadCloud className="h-6 w-6 text-buy-navy" /></span>
                  <span className="text-muted-foreground">(PDF, JPG, PNG)</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(e) => setReceipt(e.target.files?.[0]?.name ?? "")} />
                </label>
              </>
            )}
            <div className="mt-4 grid grid-cols-[1.8fr_1fr] gap-3">
              <button onClick={confirm} className="flex items-center justify-center gap-2 rounded-md bg-buy-navy py-2.5 text-sm font-bold text-background"><ArrowRight className="h-4 w-4 rotate-180" /> تأكيد الطلب</button>
              <button onClick={() => setStep(1)} className="rounded-md border border-border py-2.5 text-sm font-bold">السابق</button>
            </div>
          </section>
        </div>
        <span className="hidden">{step}<CircleDot /><RotateCcw /></span>
      </div>
    </AppShell>
  );
}
