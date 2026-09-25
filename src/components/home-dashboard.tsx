import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Banknote, CalendarDays, CheckCircle2, ChevronLeft, FileText, Headset, Inbox, Lightbulb, MoreVertical, Receipt, Users, Wallet,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import welcome from "@/assets/home-welcome.jpg";

type Req = { id: number; t: string; s: string; dept: string; by: string; date: string; time: string; status: string; icon: typeof Inbox; cls: string };
const seed: Req[] = [
  { id: 1, t: "إجازة سنوية", s: "طلب إجازة موظف", dept: "الموارد البشرية", by: "أحمد علي", date: "2025/09/18", time: "10:24 ص", status: "بانتظار موافقتك", icon: CalendarDays, cls: "bg-finance-violet text-finance-purple" },
  { id: 2, t: "اعتماد فاتورة", s: "فاتورة رقم 245", dept: "المالية", by: "سارة محمد", date: "2025/09/18", time: "09:15 ص", status: "بانتظار موافقتك", icon: Receipt, cls: "bg-success/10 text-success" },
  { id: 3, t: "طلب عميل جديد", s: "معلومات عميل جديد", dept: "خدمة العملاء", by: "فهد العتيبي", date: "2025/09/17", time: "04:32 م", status: "بانتظار موافقتك", icon: Headset, cls: "bg-primary-soft text-primary" },
  { id: 4, t: "صرف رواتب", s: "دورة الرواتب لشهر سبتمبر", dept: "المالية", by: "خالد المطيري", date: "2025/09/16", time: "11:20 ص", status: "مكتمل", icon: Banknote, cls: "bg-success/10 text-success" },
  { id: 5, t: "إضافة موظف جديد", s: "بيانات موظف", dept: "الموارد البشرية", by: "نورة القحطاني", date: "2025/09/15", time: "02:45 م", status: "قيد المراجعة", icon: Users, cls: "bg-finance-violet text-finance-purple" },
  { id: 6, t: "طلب سلفة", s: "سلفة على الراتب", dept: "المالية", by: "ريم الدوسري", date: "2025/09/14", time: "01:10 م", status: "بانتظار موافقتك", icon: Wallet, cls: "bg-success/10 text-success" },
  { id: 7, t: "خطاب تعريف", s: "خطاب لجهة حكومية", dept: "الموارد البشرية", by: "ماجد الحربي", date: "2025/09/13", time: "10:05 ص", status: "مكتمل", icon: FileText, cls: "bg-finance-violet text-finance-purple" },
  { id: 8, t: "تذكرة عميل", s: "شكوى تأخر خدمة", dept: "خدمة العملاء", by: "عبير السالم", date: "2025/09/12", time: "03:40 م", status: "قيد المراجعة", icon: Headset, cls: "bg-primary-soft text-primary" },
  { id: 9, t: "اعتماد مصروف", s: "مصروفات تشغيلية", dept: "المالية", by: "سعد الغامدي", date: "2025/09/11", time: "12:15 م", status: "بانتظار موافقتك", icon: Receipt, cls: "bg-success/10 text-success" },
  { id: 10, t: "طلب إجازة مرضية", s: "إجازة يومين", dept: "الموارد البشرية", by: "هند العنزي", date: "2025/09/10", time: "08:30 ص", status: "مكتمل", icon: CalendarDays, cls: "bg-finance-violet text-finance-purple" },
];
const badge: Record<string, string> = { "بانتظار موافقتك": "bg-warning/15 text-warning", "مكتمل": "bg-success/15 text-success", "قيد المراجعة": "bg-primary-soft text-primary", "مرفوض": "bg-destructive/10 text-destructive" };
const card = "min-w-0 rounded-xl border border-border bg-card shadow-sm";

export function HomeDashboard() {
  const [rows, setRows] = useState(seed);
  const [all, setAll] = useState(false);
  const [view, setView] = useState<Req | null>(null);
  const pending = rows.filter((r) => r.status === "بانتظار موافقتك").length;
  const inbox = 12 - (seed.filter((r) => r.status === "بانتظار موافقتك").length - pending);
  const decide = (id: number, ok: boolean) => { setRows((p) => p.map((r) => r.id === id ? { ...r, status: ok ? "مكتمل" : "مرفوض" } : r)); toast.success(ok ? "تم اعتماد الطلب" : "تم رفض الطلب"); setView(null); };
  const shown = all ? rows : rows.slice(0, 5);

  const top = [
    { t: "موافقات", v: pending, s: "بانتظار إجرائك", icon: CheckCircle2, box: "bg-destructive/5 border-destructive/20", ic: "bg-destructive/10 text-destructive", vc: "text-destructive", to: "/notifications" as const },
    { t: "طلبات مالية", v: 3, s: "بانتظار الموافقة", icon: Banknote, box: "bg-success/5 border-success/20", ic: "bg-success/15 text-success", vc: "text-success", to: "/finance" as const },
    { t: "تذاكر العملاء", v: 8, s: "تحتاج متابعة", icon: Headset, box: "bg-finance-violet border-finance-purple/20", ic: "bg-finance-purple/15 text-finance-purple", vc: "", to: "/customer-service" as const },
  ];
  const sections = [
    { t: "الموارد البشرية", d: "إدارة الموظفين والإجازات والعقود", icon: Users, box: "bg-primary-soft", ic: "text-primary", to: "/self-service" as const },
    { t: "المالية", d: "إدارة الفواتير والمصروفات والمدفوعات", icon: Banknote, box: "bg-success/10", ic: "text-success", to: "/finance" as const },
    { t: "خدمة العملاء", d: "إدارة العملاء والتذاكر والطلبات", icon: Headset, box: "bg-finance-violet", ic: "text-finance-purple", to: "/customer-service" as const },
  ];
  const quick = [
    { t: "إجمالي الموظفين", v: 120, icon: Users, cls: "bg-primary-soft text-primary", to: "/self-service" as const },
    { t: "الفواتير المعلقة", v: 25, icon: FileText, cls: "bg-warning/15 text-warning", to: "/sales" as const },
    { t: "تذاكر العملاء المفتوحة", v: 48, icon: Headset, cls: "bg-primary-soft text-primary", to: "/customer-service" as const },
  ];

  return (
    <AppShell>
      <main className="space-y-4 p-4 md:p-6">
        <section className="relative overflow-hidden rounded-xl border border-border bg-primary-soft">
          <img src={welcome} alt="" className="absolute inset-y-0 left-0 hidden h-full w-1/3 object-cover sm:block" />
          <div className="relative bg-gradient-to-l from-primary-soft via-primary-soft to-transparent p-6 sm:w-3/4">
            <h1 className="text-2xl font-extrabold">مرحباً، أحمد 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">نحن هنا لمساعدتك في إدارة أعمالك بكل سهولة</p>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {top.map((c) => (
            <Link key={c.t} to={c.to} className={`flex items-center gap-4 rounded-xl border p-5 shadow-sm transition hover:shadow-md ${c.box}`}>
              <span className={`grid size-14 shrink-0 place-items-center rounded-xl ${c.ic}`}><c.icon size={26} /></span>
              <div className="flex-1"><p className="font-extrabold">{c.t}</p><p className={`text-2xl font-extrabold ${c.vc}`}>{c.v}</p><p className="text-sm text-muted-foreground">{c.s}</p></div>
              <ChevronLeft size={18} className="text-muted-foreground" />
            </Link>
          ))}
        </div>

        <section className={`${card} p-4`}>
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg border border-border text-primary"><Inbox size={20} /></span>
              <div><h2 className="flex items-center gap-2 text-lg font-extrabold">صندوق العمل <span className="rounded-full bg-destructive px-2 text-xs text-primary-foreground">{inbox}</span></h2><p className="text-xs text-muted-foreground">جميع الطلبات التي تحتاج إلى موافقتك</p></div>
            </div>
            <button onClick={() => setAll(!all)} className="flex items-center gap-1 text-sm font-bold text-primary">{all ? "عرض أقل" : "عرض الكل"}<ChevronLeft size={15} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-muted/50 text-xs"><tr>{["الطلب", "القسم", "مقدم الطلب", "تاريخ الطلب", "الحالة", "الإجراء"].map((h) => <th key={h} className="p-2.5 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>{shown.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-2.5"><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-lg ${r.cls}`}><r.icon size={17} /></span><div><p className="font-bold">{r.t}</p><p className="text-xs text-muted-foreground">{r.s}</p></div></div></td>
                  <td className="p-2.5 font-bold">{r.dept}</td><td className="p-2.5">{r.by}</td>
                  <td className="p-2.5 text-xs"><p>{r.date}</p><p className="text-muted-foreground">{r.time}</p></td>
                  <td className="p-2.5"><span className={`rounded-full px-3 py-1 text-xs font-bold ${badge[r.status]}`}>{r.status}</span></td>
                  <td className="p-2.5"><div className="flex items-center gap-1.5">
                    {r.status === "بانتظار موافقتك" ? <Button size="sm" className="w-20" onClick={() => setView(r)}>مراجعة</Button> : <Button size="sm" variant="outline" className="w-20" onClick={() => setView(r)}>عرض</Button>}
                    <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="خيارات" className="grid size-8 place-items-center rounded-md hover:bg-muted"><MoreVertical size={16} /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setView(r)}>عرض</DropdownMenuItem>
                        <DropdownMenuItem disabled={r.status !== "بانتظار موافقتك"} onClick={() => decide(r.id, true)}>اعتماد</DropdownMenuItem>
                        <DropdownMenuItem disabled={r.status !== "بانتظار موافقتك"} onClick={() => decide(r.id, false)}>رفض</DropdownMenuItem>
                      </DropdownMenuContent></DropdownMenu>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
          <section className={`${card} p-4`}>
            <h2 className="mb-3 font-extrabold">إحصائيات السريع</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {sections.map((s) => (
                <div key={s.t} className={`relative overflow-hidden rounded-xl border border-border p-4 ${s.box}`}>
                  <div className="flex items-start gap-3"><span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-card ${s.ic}`}><s.icon size={22} /></span><div><p className="font-extrabold">{s.t}</p><p className="text-xs text-muted-foreground">{s.d}</p></div></div>
                  <s.icon size={70} className={`absolute -bottom-3 left-2 opacity-15 ${s.ic}`} />
                  <Link to={s.to} className={`relative mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-card px-4 text-sm font-bold ${s.ic}`}><ChevronLeft size={15} />الدخول</Link>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground"><Lightbulb size={15} className="text-primary" />نصيحة: يمكنك استخدام صندوق العمل لمتابعة جميع الطلبات والموافقات في مكان واحد.</p>
          </section>
          <section className={`${card} p-4`}>
            <h2 className="mb-3 font-extrabold">الوصول السريع</h2>
            <div className="space-y-2.5">
              {quick.map((q) => (
                <Link key={q.t} to={q.to} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3 hover:bg-muted/60">
                  <div><p className="text-xs text-muted-foreground">{q.t}</p><p className="text-xl font-extrabold">{q.v}</p></div>
                  <span className={`grid size-10 place-items-center rounded-full ${q.cls}`}><q.icon size={19} /></span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle className="text-right">{view?.t}</DialogTitle></DialogHeader>
          {view && <dl className="space-y-2 text-sm">
            {[["الوصف", view.s], ["القسم", view.dept], ["مقدم الطلب", view.by], ["التاريخ", `${view.date} — ${view.time}`], ["الحالة", view.status]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-border pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-bold">{v}</dd></div>)}
          </dl>}
          {view?.status === "بانتظار موافقتك" && <div className="flex gap-2"><Button className="flex-1" onClick={() => decide(view.id, true)}>اعتماد</Button><Button variant="outline" className="flex-1" onClick={() => decide(view.id, false)}>رفض</Button></div>}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
