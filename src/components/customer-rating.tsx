import { useMemo, useState } from "react";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Clock, Globe, Mail, MessageCircle, MessageSquare, MoreVertical, Phone, Star } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Status = "بانتظار الرد" | "قيد المعالجة" | "تم الرد" | "متأخرة";
type Channel = "واتساب" | "البريد الإلكتروني" | "الموقع الإلكتروني" | "الهاتف" | "الدردشة المباشرة";
type Ticket = { id: string; subject: string; customer: string; channel: Channel; status: Status; agent: string; updated: string; rating: number };

const agents = ["سارة", "أحمد", "نورة", "خالد"];
const statuses: Status[] = ["بانتظار الرد", "قيد المعالجة", "تم الرد", "متأخرة"];
const initial: Ticket[] = [
  { id: "#1001", subject: "استفسار عن المنتج", customer: "محمد علي", channel: "واتساب", status: "بانتظار الرد", agent: "سارة", updated: "منذ 10 دقائق", rating: 0 },
  { id: "#1002", subject: "مشكلة في الطلب", customer: "نورة أحمد", channel: "البريد الإلكتروني", status: "قيد المعالجة", agent: "أحمد", updated: "منذ 25 دقيقة", rating: 0 },
  { id: "#1003", subject: "طلب إرجاع", customer: "سلمان خالد", channel: "الموقع الإلكتروني", status: "تم الرد", agent: "نورة", updated: "منذ ساعة", rating: 5 },
  { id: "#1004", subject: "استفسار عن الفاتورة", customer: "هند عبدالله", channel: "الهاتف", status: "متأخرة", agent: "خالد", updated: "منذ ساعتين", rating: 0 },
  { id: "#1005", subject: "تعديل البيانات", customer: "فيصل محمد", channel: "واتساب", status: "تم الرد", agent: "سارة", updated: "منذ 3 ساعات", rating: 4 },
  { id: "#1006", subject: "تأخر الشحنة", customer: "ريم سعد", channel: "الدردشة المباشرة", status: "قيد المعالجة", agent: "نورة", updated: "منذ 4 ساعات", rating: 0 },
  { id: "#1007", subject: "طلب عرض سعر", customer: "عبدالرحمن فهد", channel: "البريد الإلكتروني", status: "تم الرد", agent: "أحمد", updated: "أمس", rating: 5 },
];
const statusCls: Record<Status, string> = {
  "بانتظار الرد": "bg-warning/15 text-warning", "قيد المعالجة": "bg-primary/10 text-primary", "تم الرد": "bg-success/15 text-success", "متأخرة": "bg-destructive/10 text-destructive",
};
const channelIcon: Record<Channel, typeof Phone> = { "واتساب": MessageCircle, "البريد الإلكتروني": Mail, "الموقع الإلكتروني": Globe, "الهاتف": Phone, "الدردشة المباشرة": MessageSquare };
const channelCls: Record<Channel, string> = { "واتساب": "bg-success text-success-foreground", "البريد الإلكتروني": "bg-primary text-primary-foreground", "الموقع الإلكتروني": "bg-chart-4 text-primary-foreground", "الهاتف": "bg-warning text-primary-foreground", "الدردشة المباشرة": "bg-muted-foreground text-primary-foreground" };
const channels: [Channel, number][] = [["واتساب", 145], ["البريد الإلكتروني", 80], ["الموقع الإلكتروني", 48], ["الهاتف", 32], ["الدردشة المباشرة", 15]];
const pie = [
  { name: "واتساب", v: 45, c: "var(--success)" }, { name: "البريد الإلكتروني", v: 25, c: "var(--primary)" },
  { name: "الموقع الإلكتروني", v: 15, c: "var(--chart-4)" }, { name: "الهاتف", v: 10, c: "var(--warning)" }, { name: "أخرى", v: 5, c: "var(--muted-foreground)" },
];
const team = {
  week: [{ n: "سارة", d: 20, p: 16, l: 2 }, { n: "أحمد", d: 17, p: 14, l: 1 }, { n: "نورة", d: 15, p: 11, l: 2 }, { n: "خالد", d: 14, p: 8, l: 2 }],
  month: [{ n: "سارة", d: 78, p: 40, l: 6 }, { n: "أحمد", d: 66, p: 35, l: 5 }, { n: "نورة", d: 60, p: 30, l: 7 }, { n: "خالد", d: 52, p: 26, l: 4 }],
};
const resp = {
  14: [6.5, 4.8, 3.6, 3, 3.4, 2.2, 2.2, 1.6, 1.5].map((v, i) => ({ d: `${8 + i * 1.5 | 0} سبتمبر`, v })),
  30: [7.2, 6.8, 6, 5.5, 4.9, 4.2, 3.8, 3.1, 2.8, 2.4].map((v, i) => ({ d: `${1 + i * 3} سبتمبر`, v })),
};

const Stars = ({ value, onPick }: { value: number; onPick?: (n: number) => void }) => (
  <div className="flex gap-0.5" dir="ltr">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" disabled={!onPick} onClick={() => onPick?.(n)}>
        <Star className={`size-5 ${n <= Math.round(value) ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
      </button>
    ))}
  </div>
);

export function CustomerRating() {
  const [tickets, setTickets] = useState(initial);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [range, setRange] = useState<14 | 30>(14);
  const [view, setView] = useState<Ticket | null>(null);
  const [all, setAll] = useState(false);
  const [q, setQ] = useState("");
  const [fs, setFs] = useState<string>("الكل");
  const [ch, setCh] = useState<Channel | null>(null);

  const update = (id: string, patch: Partial<Ticket>) => {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setView((v) => (v && v.id === id ? { ...v, ...patch } : v));
  };
  const shown = ch ? tickets.filter((t) => t.channel === ch) : tickets.slice(0, 5);
  const filtered = useMemo(() => tickets.filter((t) => (fs === "الكل" || t.status === fs) && (t.subject + t.customer + t.id).includes(q)), [tickets, fs, q]);

  const kpis = [
    { t: "إجمالي التذاكر", v: "320", ch: "12%", up: true, good: true, icon: CheckCircle2, cls: "bg-success" },
    { t: "تم الرد عليها", v: "180", ch: "12%", up: true, good: true, icon: MessageSquare, cls: "bg-primary" },
    { t: "بانتظار الرد", v: "74", ch: "8%", up: true, good: false, icon: Clock, cls: "bg-warning" },
    { t: "متأخرة", v: "18", ch: "5%", up: false, good: false, icon: AlertCircle, cls: "bg-destructive", tint: "bg-destructive/5" },
  ];

  const Row = ({ t }: { t: Ticket }) => {
    const I = channelIcon[t.channel];
    return (
      <tr className="border-b">
        <td className="p-2 text-muted-foreground">{t.id}</td>
        <td className="p-2 font-bold">{t.subject}</td>
        <td className="p-2">{t.customer}</td>
        <td className="p-2"><span className="flex items-center gap-1.5 text-xs"><span className={`grid size-5 place-items-center rounded ${channelCls[t.channel]}`}><I className="size-3" /></span>{t.channel}</span></td>
        <td className="p-2 text-center"><span className={`rounded-md px-2 py-0.5 text-xs ${statusCls[t.status]}`}>{t.status}</span></td>
        <td className="p-2 text-center">{t.agent}</td>
        <td className="p-2 text-center text-xs text-muted-foreground">{t.updated}</td>
        <td className="p-2">
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => setView(t)} className="rounded-md border border-primary px-4 py-1 text-xs text-primary hover:bg-primary/5">عرض</button>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded p-1 hover:bg-muted"><MoreVertical className="size-4" /></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {agents.filter((a) => a !== t.agent).map((a) => <DropdownMenuItem key={a} onClick={() => { update(t.id, { agent: a }); toast.success(`تم التحويل إلى ${a}`); }}>تحويل إلى {a}</DropdownMenuItem>)}
                {statuses.filter((s) => s !== t.status).map((s) => <DropdownMenuItem key={s} onClick={() => update(t.id, { status: s, updated: "الآن" })}>تغيير إلى: {s}</DropdownMenuItem>)}
                <DropdownMenuItem className="text-destructive" onClick={() => { setTickets((ts) => ts.filter((x) => x.id !== t.id)); toast.success("تم حذف التذكرة"); }}>حذف</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </td>
      </tr>
    );
  };
  const Head = () => (
    <thead className="bg-muted text-xs text-muted-foreground"><tr>
      <th className="p-2 text-right">#</th><th className="p-2 text-right">موضوع التذكرة</th><th className="p-2 text-right">العميل</th><th className="p-2 text-right">القناة</th>
      <th className="p-2">الحالة</th><th className="p-2">المسؤول</th><th className="p-2">تاريخ التحديث</th><th className="p-2">الإجراء</th>
    </tr></thead>
  );
  const sel = "rounded-lg border bg-card px-3 py-1.5 text-xs";

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <div><h1 className="text-2xl font-extrabold">خدمة العملاء</h1><p className="text-sm text-muted-foreground">متابعة التذاكر والأداء في جميع قنوات التواصل</p></div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border bg-chart-4/5 p-4">
            <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-chart-4 text-primary-foreground"><Star className="size-6 fill-current" /></span><span className="text-sm">تقييم العملاء</span></div>
            <p className="mt-3 text-3xl font-extrabold">4.8</p>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">من 5<Stars value={4.8} /></div>
          </div>
          {kpis.map((k) => (
            <div key={k.t} className={`rounded-2xl border p-4 ${k.tint ?? "bg-card"}`}>
              <div className="flex items-center gap-3"><span className={`grid size-12 place-items-center rounded-xl ${k.cls} text-primary-foreground`}><k.icon className="size-6" /></span><span className="text-sm">{k.t}</span></div>
              <p className="mt-3 text-3xl font-extrabold">{k.v}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">مقارنة بالشهر السابق
                <span className={`flex items-center font-bold ${k.good ? "text-success" : "text-destructive"}`}>{k.up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}{k.ch}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="min-w-0 rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between"><h3 className="font-bold">متوسط زمن الرد</h3>
              <select value={range} onChange={(e) => setRange(Number(e.target.value) as 14 | 30)} className={sel}><option value={14}>آخر 14 يوم</option><option value={30}>آخر 30 يوم</option></select></div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-center"><p className="text-3xl font-extrabold">{range === 14 ? "2.4" : "3.1"}</p><p className="text-sm">ساعة</p>
                <p className="mt-2 flex items-center justify-center text-sm font-bold text-success"><ArrowDown className="size-3" />{range === 14 ? "35%" : "28%"}</p><p className="text-[10px] text-muted-foreground">مقارنة بالفترة السابقة</p></div>
              <div className="h-48 min-w-0 flex-1" dir="ltr">
                <ResponsiveContainer><AreaChart data={resp[range]} margin={{ left: -25, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} orientation="right" /><Tooltip />
                  <Area isAnimationActive={false} dataKey="v" name="ساعة" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.12} strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart></ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border bg-card p-4">
            <h3 className="font-bold">توزيع التذاكر حسب القناة</h3>
            <div className="mt-2 flex items-center gap-3">
              <ul className="flex-1 space-y-3 text-sm">{pie.map((p) => <li key={p.name} className="flex items-center justify-between gap-2"><span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: p.c }} />{p.name}</span><b>{p.v}%</b></li>)}</ul>
              <div className="relative size-36 shrink-0">
                <ResponsiveContainer><PieChart><Pie isAnimationActive={false} data={pie} dataKey="v" innerRadius={42} outerRadius={66} stroke="none">{pie.map((p) => <Cell key={p.name} fill={p.c} />)}</Pie></PieChart></ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-xl font-extrabold">320</p><p className="text-xs">تذكرة</p></div></div>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between"><h3 className="font-bold">أداء فريق خدمة العملاء</h3>
              <select value={period} onChange={(e) => setPeriod(e.target.value as "week" | "month")} className={sel}><option value="week">هذا الأسبوع</option><option value="month">هذا الشهر</option></select></div>
            <div className="mt-2 h-44" dir="ltr">
              <ResponsiveContainer><BarChart data={team[period]} margin={{ left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="n" tick={{ fontSize: 11 }} reversed /><YAxis tick={{ fontSize: 10 }} /><Tooltip />
                <Bar isAnimationActive={false} dataKey="l" name="متأخرة" stackId="a" fill="var(--muted-foreground)" /><Bar isAnimationActive={false} dataKey="p" name="قيد المعالجة" stackId="a" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar isAnimationActive={false} dataKey="d" name="تم الرد" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart></ResponsiveContainer>
            </div>
            <div className="flex justify-around text-center text-xs">{team[period].map((a) => <div key={a.n}><span className="mx-auto grid size-7 place-items-center rounded-full bg-primary/10 font-bold text-primary">{a.n[0]}</span><p>{a.n}</p><b>{a.d + a.p + a.l}</b></div>)}</div>
            <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
              {[["تم الرد", "bg-success"], ["قيد المعالجة", "bg-primary"], ["متأخرة", "bg-muted-foreground"]].map(([l, c]) => <span key={l} className="flex items-center gap-1"><span className={`size-2 rounded-full ${c}`} />{l}</span>)}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0 rounded-2xl border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">أحدث التذاكر {ch && <span className="text-sm font-normal text-muted-foreground">— {ch} <button onClick={() => setCh(null)} className="text-primary">(إلغاء الفلتر)</button></span>}</h3>
              <button onClick={() => setAll(true)} className="text-sm text-primary">عرض الكل ‹</button>
            </div>
            <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><Head /><tbody>{shown.map((t) => <Row key={t.id} t={t} />)}</tbody></table>
              {!shown.length && <p className="p-6 text-center text-sm text-muted-foreground">لا توجد تذاكر لهذه القناة</p>}</div>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <h3 className="mb-3 font-bold">قنوات التواصل</h3>
            <div className="space-y-2">{channels.map(([c, n]) => {
              const I = channelIcon[c];
              return (
                <button key={c} onClick={() => setCh(ch === c ? null : c)} className={`flex w-full items-center justify-between rounded-xl p-2 text-sm ${ch === c ? "bg-primary/10" : "hover:bg-muted"}`}>
                  <span className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-lg ${channelCls[c]}`}><I className="size-5" /></span>{c}</span><b>{n}</b>
                </button>
              );
            })}</div>
          </div>
        </section>
      </main>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>تذكرة {view?.id}</DialogTitle></DialogHeader>
          {view && <div className="space-y-3 text-sm">
            <p><b>الموضوع:</b> {view.subject}</p><p><b>العميل:</b> {view.customer}</p><p><b>القناة:</b> {view.channel}</p><p><b>المسؤول:</b> {view.agent}</p>
            <label className="flex items-center gap-2"><b>الحالة:</b>
              <select value={view.status} onChange={(e) => update(view.id, { status: e.target.value as Status, updated: "الآن" })} className={sel}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
            <div className="rounded-xl bg-muted/50 p-3"><p className="mb-2 font-bold">تقييم العميل للموظف {view.agent}</p>
              <Stars value={view.rating} onPick={(n) => { update(view.id, { rating: n }); toast.success(`تم حفظ التقييم ${n} من 5`); }} /></div>
          </div>}
          <DialogFooter><button onClick={() => setView(null)} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">تم</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={all} onOpenChange={setAll}>
        <DialogContent dir="rtl" className="max-w-5xl">
          <DialogHeader><DialogTitle>جميع التذاكر</DialogTitle></DialogHeader>
          <div className="flex flex-wrap gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالموضوع أو العميل أو الرقم" className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2 text-sm" />
            <select value={fs} onChange={(e) => setFs(e.target.value)} className={sel}><option>الكل</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <div className="max-h-[60vh] overflow-auto"><table className="w-full min-w-[760px] text-sm"><Head /><tbody>{filtered.map((t) => <Row key={t.id} t={t} />)}</tbody></table></div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
