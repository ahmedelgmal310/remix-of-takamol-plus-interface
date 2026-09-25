import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle, Bell, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, FileText, Filter, Home, Mail,
  MoreVertical, RotateCcw, Search, SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type N = { id: number; type: string; title: string; body: string; date: string; time: string; read: boolean };
const types: Record<string, { icon: typeof Bell; cls: string; dot: string }> = {
  "مهام": { icon: SlidersHorizontal, cls: "bg-success/10 text-success", dot: "var(--success)" },
  "طلبات": { icon: FileText, cls: "bg-primary-soft text-primary", dot: "var(--primary)" },
  "موافقات": { icon: CheckCircle2, cls: "bg-success/10 text-success", dot: "var(--finance-purple)" },
  "تذكير": { icon: CalendarDays, cls: "bg-warning/10 text-warning", dot: "var(--finance-orange)" },
  "تنبيهات": { icon: AlertTriangle, cls: "bg-destructive/10 text-destructive", dot: "var(--destructive)" },
  "رسائل": { icon: Mail, cls: "bg-primary-soft text-primary", dot: "var(--muted-foreground)" },
};
const label: Record<string, string> = { "مهام": "مهمة", "طلبات": "طلب", "موافقات": "موافقة", "تذكير": "تذكير", "تنبيهات": "تنبيه", "رسائل": "رسالة" };
const first: Omit<N, "id">[] = [
  { type: "طلبات", title: "طلب إجازة جديد", body: "قام الموظف عبدالله القحطاني بتقديم طلب إجازة", date: "2025/09/23", time: "09:15 ص", read: false },
  { type: "موافقات", title: "تم اعتماد الطلب", body: "تم اعتماد طلب السلفة الخاص بك", date: "2025/09/23", time: "08:40 ص", read: false },
  { type: "تذكير", title: "موعد مهم", body: "لديك اجتماع لجنة التقييم الوظيفي غدًا", date: "2025/09/22", time: "04:30 م", read: true },
  { type: "تنبيهات", title: "انتهاء فترة التقييم", body: "تنتهي فترة التقييم السنوي خلال 3 أيام", date: "2025/09/22", time: "12:10 م", read: true },
  { type: "مهام", title: "مهمة جديدة موجهة لك", body: "تم إسناد مهمة \"مراجعة التقرير المالي\" إليك", date: "2025/09/21", time: "11:05 ص", read: true },
  { type: "رسائل", title: "رسالة من الموارد البشرية", body: "تم إرسال تعميم جديد من إدارة الموارد البشرية", date: "2025/09/21", time: "10:20 ص", read: false },
  { type: "موافقات", title: "تم رفض الطلب", body: "تم رفض طلب الاستئذان بسبب عدم اكتمال البيانات", date: "2025/09/20", time: "03:45 م", read: true },
  { type: "تذكير", title: "موعد نهاية العقد", body: "ينتهي عقدك خلال 30 يوم، يرجى مراجعة الإدارة", date: "2025/09/20", time: "09:00 ص", read: true },
  { type: "تنبيهات", title: "تحديث النظام", body: "تم إضافة ميزة جديدة في النظام", date: "2025/09/19", time: "05:20 م", read: true },
  { type: "مهام", title: "إكمال بيانات الشخصية", body: "يرجى تحديث بياناتك الشخصية في ملف الموظف", date: "2025/09/19", time: "11:10 ص", read: true },
];
// remaining 18 to reach type totals: مهام 8, طلبات 6, موافقات 4, تذكير 5, تنبيهات 3, رسائل 2 — unread total 12
const extra: [string, string, string][] = [
  ["مهام", "مهمة متابعة", "متابعة إجراءات تسكين موظف جديد"], ["مهام", "مراجعة مستندات", "مراجعة مستندات الموظفين المنتهية"], ["مهام", "إعداد تقرير", "إعداد تقرير الحضور الشهري"], ["مهام", "تحديث سياسة", "تحديث سياسة الإجازات الداخلية"], ["مهام", "مهمة تدريب", "تنسيق برنامج تدريب الموظفين الجدد"], ["مهام", "مراجعة الرواتب", "مراجعة مسير رواتب الشهر"],
  ["طلبات", "طلب خطاب تعريف", "طلب خطاب تعريف من سارة الشهري"], ["طلبات", "طلب سلفة", "طلب سلفة جديد من فهد العتيبي"], ["طلبات", "طلب عهدة", "طلب عهدة جهاز محمول"], ["طلبات", "طلب نقل", "طلب نقل إلى إدارة المالية"], ["طلبات", "طلب استئذان", "طلب استئذان لمدة ساعتين"],
  ["موافقات", "تم اعتماد الإجازة", "تم اعتماد إجازتك السنوية"], ["موافقات", "اعتماد الترقية", "تم اعتماد قرار الترقية"],
  ["تذكير", "تجديد الإقامة", "موعد تجديد إقامة أحد الموظفين"], ["تذكير", "فحص طبي", "موعد الفحص الطبي الدوري"], ["تذكير", "اجتماع الإدارة", "اجتماع الإدارة الأسبوعي"],
  ["تنبيهات", "تأخر حضور", "تم تسجيل تأخر في الحضور"], ["رسائل", "رسالة من المدير", "يرجى مراجعة جدول المهام"],
];
const seed: N[] = [...first, ...extra.map(([type, title, body], i) => ({ type, title, body, date: `2025/09/${String(18 - Math.floor(i / 2)).padStart(2, "0")}`, time: i % 2 ? "02:15 م" : "10:30 ص", read: i % 3 !== 0 }))].map((n, i) => ({ ...n, id: i + 1 }));
const periods = ["جميع الفترات", "اليوم", "آخر 7 أيام", "آخر 30 يوم"];
const PER = 10;
const card = "min-w-0 rounded-xl border border-border bg-card shadow-sm";

export function Notifications() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"الكل" | "غير مقروء" | "مقروء">("الكل");
  const [typeF, setTypeF] = useState<string[]>([]);
  const [period, setPeriod] = useState(periods[0]!);
  const [sel, setSel] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const inPeriod = (d: string) => {
    const days = period === "اليوم" ? 0 : period === "آخر 7 أيام" ? 7 : period === "آخر 30 يوم" ? 30 : 999;
    return 23 - Number(d.slice(-2)) <= days;
  };
  const filtered = useMemo(() => rows.filter((r) => (!q || r.title.includes(q) || r.body.includes(q)) && (status === "الكل" || (status === "مقروء") === r.read) && (!typeF.length || typeF.includes(r.type)) && inPeriod(r.date)), [rows, q, status, typeF, period]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER)); const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * PER, cur * PER);
  const unread = rows.filter((r) => !r.read).length;
  const allSel = shown.length > 0 && shown.every((r) => sel.includes(r.id));

  const markRead = (id: number) => setRows((p) => p.map((r) => r.id === id ? { ...r, read: true } : r));
  const bulk = (fn: "read" | "unread" | "delete") => {
    if (!sel.length) { toast.error("حدد إشعارًا واحدًا على الأقل"); return; }
    setRows((p) => fn === "delete" ? p.filter((r) => !sel.includes(r.id)) : p.map((r) => sel.includes(r.id) ? { ...r, read: fn === "read" } : r));
    toast.success(fn === "delete" ? "تم حذف الإشعارات المحددة" : "تم تحديث حالة الإشعارات");
    setSel([]);
  };
  const reset = () => { setStatus("الكل"); setTypeF([]); setPeriod(periods[0]!); setQ(""); setPage(1); };
  const stats = [
    { v: 8, t: "مواعيد قادمة", icon: CalendarDays, cls: "bg-primary-soft text-primary" },
    { v: 12, t: "مهام جديدة", icon: CheckCircle2, cls: "bg-success/10 text-success" },
    { v: 5, t: "إشعارات عاجلة", icon: AlertTriangle, cls: "bg-destructive/10 text-destructive" },
    { v: 3, t: "رسائل جديدة", icon: Mail, cls: "bg-primary-soft text-primary" },
  ];
  const Check = ({ on, onClick, label: l, count }: { on: boolean; onClick: () => void; label: React.ReactNode; count: number }) => (
    <label className="flex cursor-pointer items-center justify-between py-1.5 text-sm"><span className="flex items-center gap-2"><input type="checkbox" checked={on} onChange={onClick} className="size-4 accent-primary" />{l}</span><span className="text-muted-foreground">({count})</span></label>
  );

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Home size={13} className="text-primary" /><Link to="/" className="text-primary">الرئيسية</Link> ‹ الإشعارات</p>
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary"><Bell size={28} fill="currentColor" /></span>
              <div><h1 className="text-2xl font-extrabold">الإشعارات</h1><p className="text-sm text-muted-foreground">متابعة جميع الإشعارات والتنبيهات الخاصة بك</p></div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-primary-soft p-5">
            <div><p className="text-xl font-extrabold">كن على اطلاع دائم ..</p><p className="mt-1 text-sm">جميع ما يهمك في مكان واحد</p></div>
            <span className="relative text-primary"><Bell size={56} fill="currentColor" /><span className="absolute -top-1 -left-1 grid size-6 place-items-center rounded-full bg-destructive text-xs font-bold text-primary-foreground">!</span></span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.t} className={`${card} flex items-center justify-between p-5`}>
              <div><p className="text-2xl font-extrabold">{s.v}</p><p className="text-sm text-muted-foreground">{s.t}</p></div>
              <span className={`grid size-14 place-items-center rounded-xl ${s.cls}`}><s.icon size={26} /></span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
          <section className={`${card} p-4 xl:order-1`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="relative w-full max-w-xs"><Search size={16} className="absolute right-3 top-3 text-muted-foreground" /><input className="h-10 w-full rounded-lg border border-border bg-card pr-9 pl-3 text-sm outline-none focus:border-primary" placeholder="بحث في الإشعارات ..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
              <div className="flex gap-2">
                <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-border px-3 text-sm"><input type="checkbox" className="size-4 accent-primary" checked={allSel} onChange={() => setSel(allSel ? sel.filter((i) => !shown.some((r) => r.id === i)) : [...new Set([...sel, ...shown.map((r) => r.id)])])} />تحديد الكل</label>
                <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="خيارات" className="grid size-10 place-items-center rounded-lg border border-border"><MoreVertical size={16} /></button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => bulk("read")}>تعليم المحدد كمقروء</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulk("unread")}>تعليم المحدد كغير مقروء</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulk("delete")} className="text-destructive">حذف المحدد</DropdownMenuItem>
                  </DropdownMenuContent></DropdownMenu>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-muted/50 text-xs"><tr>{["#", "نوع الإشعار", "عنوان الإشعار", "تفاصيل الإشعار", "التاريخ والوقت", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
                <tbody>{shown.map((r, i) => {
                  const T = types[r.type]!;
                  return (
                    <tr key={r.id} onClick={() => markRead(r.id)} className={`cursor-pointer border-t border-border hover:bg-muted/30 ${r.read ? "" : "bg-primary-soft/30"}`}>
                      <td className="p-2.5">{(cur - 1) * PER + i + 1}</td>
                      <td className="p-2.5"><span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${T.cls}`}><T.icon size={14} />{label[r.type]}</span></td>
                      <td className="p-2.5 font-extrabold">{r.title}</td>
                      <td className="p-2.5 text-muted-foreground">{r.body}</td>
                      <td className="p-2.5 text-xs"><p>{r.date}</p><p className="text-muted-foreground">{r.time}</p></td>
                      <td className="p-2.5"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${r.read ? "bg-muted text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>{r.read ? "مقروء" : "غير مقروء"}</span></td>
                      <td className="p-2.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`تحديد ${r.title}`} className="size-4 accent-primary" checked={sel.includes(r.id)} onChange={() => setSel((s) => s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id])} /></td>
                    </tr>
                  );
                })}{!shown.length && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">لا توجد إشعارات مطابقة</td></tr>}</tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">عرض {shown.length} من {filtered.length} إشعار</span>
              <div className="flex gap-1.5">
                <button aria-label="السابق" disabled={cur === 1} onClick={() => setPage(cur - 1)} className="grid size-9 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronRight size={15} /></button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} onClick={() => setPage(n)} className={`size-9 rounded-md border ${cur === n ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{n}</button>)}
                <button aria-label="التالي" disabled={cur === pages} onClick={() => setPage(cur + 1)} className="grid size-9 place-items-center rounded-md border border-border disabled:opacity-40"><ChevronLeft size={15} /></button>
              </div>
            </div>
          </section>

          <aside className={`${card} p-4`}>
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><Filter size={17} className="text-primary" />التصفية</h2>
            <h3 className="text-sm font-bold">حالة الإشعار</h3>
            <Check on={status === "الكل"} onClick={() => { setStatus("الكل"); setPage(1); }} label="الكل" count={rows.length} />
            <Check on={status === "غير مقروء"} onClick={() => { setStatus("غير مقروء"); setPage(1); }} label="غير مقروء" count={unread} />
            <Check on={status === "مقروء"} onClick={() => { setStatus("مقروء"); setPage(1); }} label="مقروء" count={rows.length - unread} />
            <h3 className="mt-3 border-t border-border pt-3 text-sm font-bold">نوع الإشعار</h3>
            <Check on={!typeF.length} onClick={() => { setTypeF([]); setPage(1); }} label="جميع الأنواع" count={rows.length} />
            {Object.entries(types).map(([t, v]) => (
              <Check key={t} on={typeF.includes(t)} onClick={() => { setTypeF((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]); setPage(1); }} label={<><span className="size-2.5 rounded-full" style={{ background: v.dot }} />{t}</>} count={rows.filter((r) => r.type === t).length} />
            ))}
            <h3 className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm font-bold"><CalendarDays size={15} />الفترة الزمنية</h3>
            <select className="mt-2 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm" value={period} onChange={(e) => { setPeriod(e.target.value); setPage(1); }}>{periods.map((p) => <option key={p}>{p}</option>)}</select>
            <button onClick={reset} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-bold hover:bg-muted"><RotateCcw size={15} />إعادة تعيين الفلاتر</button>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
