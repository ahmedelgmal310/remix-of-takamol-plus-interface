import { useMemo, useState } from "react";
import {
  BarChart3, Boxes, CalendarCheck, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CircleDashed,
  Clock, Download, FileSpreadsheet, FileText, Info, Lock, MoreVertical, Receipt, Users, Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Status = "مكتمل" | "قيد الإقفال" | "قيد المراجعة" | "لم يبدأ";
type Sec = { key: string; name: string; short: string; icon: typeof Users; status: Status; date: string; user: string; progress: number };

const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const weight: Record<Status, number> = { "مكتمل": 1, "قيد الإقفال": 0.25, "قيد المراجعة": 0.15, "لم يبدأ": 0 };
const style: Record<Status, { pill: string; text: string; bar: string; dot: string; Icon: typeof CheckCircle2 }> = {
  "مكتمل": { pill: "bg-success/15 text-success", text: "text-success", bar: "bg-success", dot: "bg-success", Icon: CheckCircle2 },
  "قيد الإقفال": { pill: "bg-primary-soft text-primary", text: "text-primary", bar: "bg-primary", dot: "bg-primary", Icon: CheckCircle2 },
  "قيد المراجعة": { pill: "bg-warning/15 text-warning", text: "text-warning", bar: "bg-warning", dot: "bg-warning", Icon: Clock },
  "لم يبدأ": { pill: "bg-muted text-muted-foreground", text: "text-muted-foreground", bar: "bg-muted-foreground", dot: "bg-muted-foreground", Icon: CircleDashed },
};
const action: Record<Status, string> = { "مكتمل": "عرض التقرير", "قيد الإقفال": "متابعة", "قيد المراجعة": "عرض التفاصيل", "لم يبدأ": "بدء الإقفال" };
const today = "2025/09/30";

const seed = (current: boolean): Sec[] => {
  const s = (key: string, name: string, short: string, icon: typeof Users, status: Status, date: string, user: string, progress: number): Sec =>
    current ? { key, name, short, icon, status, date, user, progress } : { key, name, short, icon, status: "مكتمل", date: "—", user: "النظام", progress: 100 };
  return [
    s("payroll", "الرواتب والبدلات", "الرواتب والبدلات", Users, "مكتمل", "2025/09/30", "سارة العتيبي", 100),
    s("expenses", "المصروفات التشغيلية", "المصروفات", Wallet, "قيد الإقفال", "2025/09/28", "أحمد محمد", 75),
    s("revenue", "الإيرادات", "الإيرادات", BarChart3, "لم يبدأ", "-", "-", 0),
    s("journal", "القيود المحاسبية", "القيود المحاسبية", Receipt, "قيد المراجعة", "2025/09/27", "خالد الشهراني", 79),
    s("reports", "التقارير الختامية", "التقارير الختامية", FileText, "لم يبدأ", "-", "-", 0),
    s("inventory", "المخزون", "المخزون", Boxes, "مكتمل", "2025/09/26", "سارة العتيبي", 100),
  ];
};

function downloadCsv(name: string, rows: string[][]) {
  const blob = new Blob(["\uFEFF" + rows.map((r) => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${name}.csv`; a.click();
}

function Ring({ pct, size = 150, stroke = 16, children }: { pct: number; size?: number; stroke?: number; children?: React.ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--primary)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

export function MonthClose() {
  const [ym, setYm] = useState({ y: 2025, m: 8 });
  const isCurrent = ym.y === 2025 && ym.m === 8;
  const isFuture = ym.y > 2025 || (ym.y === 2025 && ym.m > 8);
  const [secs, setSecs] = useState<Sec[]>(seed(true));
  const [closed, setClosed] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const shift = (d: number) => {
    const t = ym.m + d, n = { y: ym.y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 };
    setYm(n);
    const cur = n.y === 2025 && n.m === 8, fut = n.y > 2025 || (n.y === 2025 && n.m > 8);
    setSecs(cur ? seed(true) : fut ? seed(true).map((s) => ({ ...s, status: "لم يبدأ", date: "-", user: "-", progress: 0 })) : seed(false));
    setClosed(!cur && !fut);
  };
  const setStatus = (key: string, status: Status) => {
    setSecs((ss) => ss.map((s) => (s.key === key ? { ...s, status, date: status === "لم يبدأ" ? "-" : today, user: status === "لم يبدأ" ? "-" : "مدير النظام", progress: status === "مكتمل" ? 100 : status === "قيد الإقفال" ? 50 : status === "قيد المراجعة" ? 80 : 0 } : s)));
    toast.success(`تم تحديث حالة القسم إلى «${status}»`);
  };
  const next: Record<Status, Status | null> = { "لم يبدأ": "قيد الإقفال", "قيد الإقفال": "قيد المراجعة", "قيد المراجعة": "مكتمل", "مكتمل": null };
  const report = (s: Sec) => downloadCsv(`تقرير-${s.name}-${months[ym.m]}-${ym.y}`, [["القسم", "الحالة", "تاريخ الإقفال", "المستخدم", "نسبة الإنجاز"], [s.name, s.status, s.date, s.user, `${s.progress}%`]]);
  const onAction = (s: Sec) => { const n = next[s.status]; if (n) setStatus(s.key, n); else report(s); };

  const pct = useMemo(() => Math.round((secs.reduce((a, s) => a + weight[s.status], 0) / secs.length) * 100), [secs]);
  const counts = (["مكتمل", "قيد الإقفال", "لم يبدأ", "قيد المراجعة"] as Status[]).map((st) => [st, secs.filter((s) => s.status === st).length] as const);
  const overall: Status = closed || pct === 100 ? "مكتمل" : pct === 0 ? "لم يبدأ" : "قيد المراجعة";
  const byKey = (k: string) => secs.find((s) => s.key === k)!;
  const cards = ["reports", "journal", "revenue", "expenses", "payroll"].map(byKey);
  const pending = secs.filter((s) => s.status !== "مكتمل");
  const reports = [["تقرير الرواتب والبدلات", "payroll"], ["تقرير المصروفات", "expenses"], ["تقرير الإيرادات", "revenue"], ["التقرير المالي العام", "reports"]] as const;

  const doClose = () => {
    setConfirm(false);
    if (pending.length) { toast.error(`لا يمكن الإقفال — أقسام غير مكتملة: ${pending.map((s) => s.name).join("، ")}`); return; }
    setClosed(true); toast.success(`تم إقفال شهر ${months[ym.m]} ${ym.y} بنجاح`);
  };

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold text-foreground"><CalendarCheck className="text-primary" size={26} />إقفال الشهر</h1>
            <p className="mt-1 text-sm text-muted-foreground">إدارة إقفال الشهر للرواتب وغيرها من العمليات المالية والإدارية</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 shadow-sm">
            <CalendarDays className="text-primary" size={22} />
            <button aria-label="الشهر السابق" onClick={() => shift(-1)} className="text-muted-foreground hover:text-primary"><ChevronRight size={18} /></button>
            <div className="min-w-28 text-center"><p className="text-xs text-muted-foreground">الشهر المستهدف</p><p className="font-extrabold">{months[ym.m]} {ym.y}</p></div>
            <button aria-label="الشهر التالي" onClick={() => shift(1)} className="text-muted-foreground hover:text-primary"><ChevronLeft size={18} /></button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-bold">حالة الإقفال العام</span>
            <div className="mt-3 flex items-center gap-3">
              <Ring pct={pct} size={64} stroke={7}><span className={`text-[10px] font-bold ${style[overall].text}`}>{closed ? "مقفل" : overall === "قيد المراجعة" ? "قيد المراجعة" : overall}</span></Ring>
              <span className="text-2xl font-extrabold text-primary">{pct}%</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">آخر إقفال تم بتاريخ</p><p className="text-sm font-bold">{closed && isCurrent ? "30/09/2025" : "31/08/2025"}</p>
          </div>
          {cards.map((s) => { const st = style[s.status]; return (
            <div key={s.key} className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div><p className="text-sm font-bold">{s.short}</p><p className={`mt-2 text-lg font-extrabold ${st.text}`}>{s.status}</p></div>
                <span className={`grid size-10 place-items-center rounded-lg ${st.pill}`}><s.icon size={19} /></span>
              </div>
              {s.status === "مكتمل" ? <p className="mt-2 text-xs text-success">تم إقفال القسم بنجاح</p> : (
                <div className="mt-3"><div className="h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${st.bar}`} style={{ width: `${s.progress}%` }} /></div><p className="mt-1 text-xs text-muted-foreground">{s.progress}%</p></div>
              )}
              <button onClick={() => toast(`${s.name}: ${s.status} — ${s.user !== "-" ? s.user : "لم يُسند بعد"}`)} className="mt-auto flex items-center gap-1 pt-3 text-xs font-bold text-foreground hover:text-primary">تفاصيل<ChevronLeft size={13} /></button>
            </div>
          ); })}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2.2fr]">
          <section className="min-w-0 order-2 rounded-xl border border-border bg-card p-5 shadow-sm xl:order-1">
            <h2 className="flex items-center gap-2 font-extrabold"><BarChart3 size={18} className="text-primary" />نسبة إكتمال الإقفال</h2>
            <div className="my-5 flex justify-center"><Ring pct={pct} size={160} stroke={16}><span className="text-4xl font-extrabold">{pct}%</span></Ring></div>
            <ul className="divide-y divide-border text-sm">
              {counts.map(([st, n]) => <li key={st} className="flex items-center justify-between py-2"><span className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${style[st].dot}`} />{st}</span><b>{n}</b></li>)}
            </ul>
          </section>
          <section className="min-w-0 order-1 rounded-xl border border-border bg-card p-5 shadow-sm xl:order-2">
            <h2 className="mb-4 flex items-center gap-2 font-extrabold"><FileSpreadsheet size={18} className="text-primary" />تفاصيل أقسام الإقفال</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground"><tr>{["القسم", "الحالة", "تاريخ الإقفال", "المستخدم", "الإجراءات"].map((h) => <th key={h} className="p-3 text-right font-bold">{h}</th>)}</tr></thead>
                <tbody>
                  {secs.map((s) => { const st = style[s.status]; return (
                    <tr key={s.key} className="border-t border-border">
                      <td className="p-3"><span className="flex items-center gap-2 font-bold"><s.icon size={17} className="text-primary" />{s.name}</span></td>
                      <td className="p-3"><span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${st.pill}`}><st.Icon size={13} />{s.status}</span></td>
                      <td className="p-3">{s.date}</td>
                      <td className="p-3">{s.user}</td>
                      <td className="p-3"><div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="w-28 border-primary/40 text-primary" onClick={() => onAction(s)} disabled={closed}>{action[s.status]}</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><button aria-label="خيارات" className="grid size-8 place-items-center rounded-md border border-border"><MoreVertical size={15} /></button></DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem disabled={closed || s.status === "مكتمل"} onClick={() => setStatus(s.key, "مكتمل")}>اعتماد كمكتمل</DropdownMenuItem>
                            <DropdownMenuItem disabled={closed || s.status === "لم يبدأ"} onClick={() => setStatus(s.key, "لم يبدأ")}>إعادة فتح القسم</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => report(s)}>تحميل التقرير</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div></td>
                    </tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr_1.6fr]">
          <section className="min-w-0 flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
            <span className="grid size-16 place-items-center rounded-2xl bg-primary-soft text-primary"><CalendarCheck size={32} /></span>
            <h2 className="mt-3 text-lg font-extrabold">إقفال الشهر</h2>
            <p className="mt-2 text-sm text-muted-foreground">قم بمراجعة جميع الأقسام والتأكد من اكتمال البيانات قبل تنفيذ الإقفال النهائي.</p>
            {confirm ? (
              <div className="mt-4 w-full space-y-2 rounded-lg border border-border p-3">
                <p className="text-sm font-bold">تأكيد إقفال شهر {months[ym.m]} {ym.y}؟</p>
                <div className="flex gap-2"><Button className="flex-1" onClick={doClose}>تأكيد</Button><Button variant="outline" className="flex-1" onClick={() => setConfirm(false)}>إلغاء</Button></div>
              </div>
            ) : (
              <Button className="mt-4 h-12 w-full gap-2 text-base" disabled={closed || isFuture} onClick={() => setConfirm(true)}><Lock size={18} />{closed ? "الشهر مقفل" : "إقفال الشهر الآن"}</Button>
            )}
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-extrabold"><FileText size={18} className="text-primary" />التقارير الشهرية</h2>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {reports.map(([label, k]) => { const s = byKey(k); const st = style[s.status]; return (
                <li key={k} className="flex items-center justify-between gap-2 p-3 text-sm">
                  <span className="font-bold">{label}</span>
                  <span className="flex items-center gap-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${st.pill}`}><st.Icon size={12} />{s.status}</span>
                  <button aria-label={`تحميل ${label}`} onClick={() => report(s)} className="text-muted-foreground hover:text-primary"><Download size={16} /></button></span>
                </li>
              ); })}
            </ul>
          </section>
          <section className="min-w-0 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-5 font-extrabold">الخطوات المتبقية للإقفال</h2>
            {pending.length ? (
              <div className="flex flex-wrap items-start justify-around gap-3">
                {pending.map((s, i) => (
                  <div key={s.key} className="flex items-start gap-3">
                    <div className="flex w-24 flex-col items-center text-center">
                      <span className={`grid size-12 place-items-center rounded-full border-2 ${s.status === "لم يبدأ" ? "border-border text-muted-foreground" : "border-primary text-primary"}`}><s.icon size={20} /></span>
                      <b className="mt-1 text-sm">{i + 1}</b><span className="text-xs text-muted-foreground">إقفال {s.short}</span>
                    </div>
                    {i < pending.length - 1 && <ChevronLeft size={18} className="mt-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            ) : <p className="py-6 text-center text-sm font-bold text-success">كل الأقسام مكتملة — جاهز للإقفال</p>}
            <p className="mt-5 flex items-center gap-2 rounded-lg bg-primary-soft p-3 text-xs"><Info size={15} className="shrink-0 text-primary" />بعد إقفال جميع الأقسام بنجاح سيتم قفل الشهر بالكامل وإتاحة التقارير النهائية.</p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
