import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronLeft, Clock, Flag, Folder, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import saud from "@/assets/member-saud.jpg";
import abdullah from "@/assets/member-abdullah.jpg";

type Status = "قيد التنفيذ" | "لم يبدأ" | "مكتمل" | "متأخر";
type P = { id: number; name: string; manager: string; start: string; end: string; progress: number; status: Status };
type T = { id: number; task: string; project: string; owner: string; due: string; priority: "عالية" | "متوسطة" | "منخفضة"; status: Status };

const photos: Record<string, string> = { "أحمد السبيعي": saud, "عبدالله القحطاني": abdullah };
const initialProjects: P[] = [
  { id: 1, name: "تطوير النظام المالي", manager: "أحمد السبيعي", start: "2025/01/01", end: "2025/06/30", progress: 80, status: "قيد التنفيذ" },
  { id: 2, name: "مشروع التحول الرقمي", manager: "سارة أحمد", start: "2025/02/15", end: "2025/08/31", progress: 45, status: "قيد التنفيذ" },
  { id: 3, name: "تطوير الموارد البشرية", manager: "خالد الغامدي", start: "2025/03/01", end: "2025/09/30", progress: 20, status: "لم يبدأ" },
  { id: 4, name: "مشروع خدمة العملاء", manager: "ريم العتيبي", start: "2025/01/20", end: "2025/05/15", progress: 100, status: "مكتمل" },
  { id: 5, name: "تطوير البنية التحتية", manager: "عبدالله القحطاني", start: "2025/02/01", end: "2025/07/31", progress: 60, status: "قيد التنفيذ" },
  { id: 6, name: "نظام إدارة المخزون", manager: "فهد العتيبي", start: "2025/01/10", end: "2025/04/30", progress: 100, status: "مكتمل" },
  { id: 7, name: "بوابة الموظفين", manager: "نورة الشهري", start: "2025/03/15", end: "2025/10/15", progress: 35, status: "قيد التنفيذ" },
  { id: 8, name: "أتمتة الرواتب", manager: "أحمد السبيعي", start: "2025/01/05", end: "2025/03/31", progress: 70, status: "متأخر" },
  { id: 9, name: "تطبيق الجوال", manager: "سارة أحمد", start: "2025/04/01", end: "2025/11/30", progress: 0, status: "لم يبدأ" },
  { id: 10, name: "تحسين الأمن السيبراني", manager: "خالد الغامدي", start: "2025/02/10", end: "2025/06/10", progress: 55, status: "قيد التنفيذ" },
  { id: 11, name: "برنامج التدريب", manager: "ريم العتيبي", start: "2025/01/15", end: "2025/04/15", progress: 100, status: "مكتمل" },
  { id: 12, name: "نظام الأرشفة", manager: "عبدالله القحطاني", start: "2025/03/01", end: "2025/08/01", progress: 25, status: "قيد التنفيذ" },
];
const initialTasks: T[] = [
  { id: 1, task: "مراجعة التصاميم", project: "تطوير النظام المالي", owner: "سارة أحمد", due: "2025/04/25", priority: "عالية", status: "قيد التنفيذ" },
  { id: 2, task: "إعداد التقرير الشهري", project: "مشروع خدمة العملاء", owner: "خالد الغامدي", due: "2025/04/26", priority: "متوسطة", status: "لم يبدأ" },
  { id: 3, task: "اجتماع الفريق", project: "تطوير الموارد البشرية", owner: "ريم العتيبي", due: "2025/04/27", priority: "متوسطة", status: "قيد التنفيذ" },
  { id: 4, task: "مراجعة الموردين", project: "تطوير البنية التحتية", owner: "أحمد السبيعي", due: "2025/04/28", priority: "منخفضة", status: "لم يبدأ" },
  { id: 5, task: "تحديث الوثائق", project: "مشروع التحول الرقمي", owner: "عبدالله القحطاني", due: "2025/04/29", priority: "عالية", status: "قيد التنفيذ" },
  { id: 6, task: "اختبار الوحدات", project: "تطوير النظام المالي", owner: "أحمد السبيعي", due: "2025/04/12", priority: "عالية", status: "مكتمل" },
  { id: 7, task: "تحليل المتطلبات", project: "بوابة الموظفين", owner: "نورة الشهري", due: "2025/04/18", priority: "متوسطة", status: "قيد التنفيذ" },
  { id: 8, task: "تجهيز الخوادم", project: "تطوير البنية التحتية", owner: "فهد العتيبي", due: "2025/04/08", priority: "منخفضة", status: "مكتمل" },
];
const statusCls: Record<Status, string> = {
  "قيد التنفيذ": "bg-primary-soft text-primary", "لم يبدأ": "bg-muted text-muted-foreground", "مكتمل": "bg-success/10 text-success", "متأخر": "bg-destructive/10 text-destructive",
};
const prioCls = { "عالية": "bg-destructive/10 text-destructive", "متوسطة": "bg-primary-soft text-primary", "منخفضة": "bg-success/10 text-success" };
const barCls = (p: P) => (p.status === "مكتمل" ? "bg-success" : p.status === "متأخر" ? "bg-destructive" : "bg-primary");
const nextStatus: Record<Status, Status> = { "لم يبدأ": "قيد التنفيذ", "قيد التنفيذ": "مكتمل", "مكتمل": "لم يبدأ", "متأخر": "قيد التنفيذ" };

function Avatar({ name }: { name: string }) {
  return photos[name]
    ? <img src={photos[name]} alt={name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
    : <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{name.split(" ").map((w) => w[0]).join("")}</span>;
}
const Badge = ({ children, cls, onClick }: { children: string; cls: string; onClick?: () => void }) => (
  <button type="button" onClick={onClick} className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold ${cls} ${onClick ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}>{children}</button>
);
const Card = ({ title, action, children, className = "" }: { title: string; action?: () => void; children: React.ReactNode; className?: string }) => (
  <section className={`rounded-xl border bg-card p-5 shadow-sm ${className}`}>
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="text-lg font-extrabold">{title}</h2>
      {action && <button onClick={action} className="text-xs font-semibold text-primary hover:underline">عرض الكل</button>}
    </div>
    {children}
  </section>
);

export function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);
  const [tab, setTab] = useState("المشاريع");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<P | null>(null);
  const [form, setForm] = useState({ name: "", manager: "", start: "", end: "" });
  const [acts, setActs] = useState([
    { who: "أحمد السبيعي", text: "أضاف مهمة جديدة في مشروع تطوير النظام", when: "منذ 10 دقائق" },
    { who: "سارة أحمد", text: "تم تحديث حالة المهمة (مراجعة التصاميم)", when: "منذ 35 دقيقة" },
    { who: "خالد الغامدي", text: "أكمل المهمة (إعداد التقرير)", when: "منذ ساعة" },
    { who: "ريم العتيبي", text: "تم إغلاق مشروع تدريب الموظفين", when: "منذ ساعتين" },
  ]);

  const list = useMemo(() => projects.filter((p) => (filter === "all" || p.status === filter) && (p.name.includes(q) || p.manager.includes(q))), [projects, q, filter]);
  const shown = showAll ? list : list.slice(0, 5);
  const log = (text: string) => setActs((a) => [{ who: "مدير النظام", text, when: "الآن" }, ...a]);
  const update = (id: number, patch: Partial<P>) => setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const add = () => {
    if (!form.name || !form.manager || !form.start || !form.end) { toast.error("يرجى تعبئة جميع الحقول"); return; }
    setProjects((ps) => [{ id: Math.max(...ps.map((p) => p.id)) + 1, name: form.name, manager: form.manager, start: form.start.replaceAll("-", "/"), end: form.end.replaceAll("-", "/"), progress: 0, status: "لم يبدأ" }, ...ps]);
    log(`أنشأ مشروعًا جديدًا (${form.name})`);
    toast.success("تم إضافة المشروع");
    setForm({ name: "", manager: "", start: "", end: "" }); setOpen(false); setTab("المشاريع");
  };
  const cycleTask = (id: number) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status: nextStatus[t.status] } : t)));

  const stats = [
    { n: 12, l: "إجمالي المشاريع", icon: Folder, cls: "bg-primary-soft text-primary" },
    { n: 48, l: "مهام مكتملة", icon: CheckCircle2, cls: "bg-success/10 text-success" },
    { n: 24, l: "مهام قيد التنفيذ", icon: Clock, cls: "bg-finance-purple/10 text-finance-purple" },
    { n: 5, l: "مشاريع متأخرة", icon: Flag, cls: "bg-destructive/10 text-destructive" },
  ];
  const donut = [{ l: "مكتمل", v: 33, c: "var(--success)" }, { l: "قيد التنفيذ", v: 42, c: "var(--primary)" }, { l: "لم يبدأ", v: 17, c: "var(--muted-foreground)" }, { l: "متأخر", v: 8, c: "var(--destructive)" }];
  let acc = 0;
  const grad = donut.map((d) => `${d.c} ${acc}% ${(acc += d.v)}%`).join(",");
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const mIdx = (s: string) => { const [, m = 1, d = 1] = s.split("/").map(Number); return (m - 1 + (d - 1) / 30) / 12 * 100; };

  const TaskTable = ({ rows }: { rows: T[] }) => (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[760px] whitespace-nowrap text-sm">
        <thead className="bg-muted/50 text-muted-foreground"><tr>{["#", "المهمة", "المشروع", "المسؤول", "تاريخ الاستحقاق", "الأولوية", "الحالة"].map((h) => <th key={h} className="p-3 text-right font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((t, i) => (
          <tr key={t.id} className="border-t">
            <td className="p-3">{i + 1}</td><td className="p-3 font-bold">{t.task}</td><td className="p-3 text-muted-foreground">{t.project}</td>
            <td className="p-3"><div className="flex items-center gap-2"><Avatar name={t.owner} />{t.owner}</div></td>
            <td className="p-3">{t.due}</td><td className="p-3"><Badge cls={prioCls[t.priority]}>{t.priority}</Badge></td>
            <td className="p-3"><Badge cls={statusCls[t.status]} onClick={() => cycleTask(t.id)}>{t.status}</Badge></td>
          </tr>))}</tbody>
      </table>
    </div>
  );

  return (
    <AppShell>
      <div className="space-y-5 p-4 md:p-6">
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <nav className="mb-1 flex items-center gap-1 text-xs text-muted-foreground"><Link to="/" className="hover:text-primary">الرئيسية</Link><ChevronLeft className="h-3 w-3" /><span className="text-primary">المشاريع والمهام</span></nav>
            <h1 className="text-2xl font-black sm:text-3xl">المشاريع والمهام</h1>
            <p className="text-sm text-muted-foreground">إدارة المشاريع ومتابعة المهام وتحقيق الأهداف</p>
          </div>
          <button onClick={() => setOpen(true)} className="flex w-fit items-center gap-2 self-end rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow"><PlusCircle className="h-4 w-4" />مشروع جديد</button>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="min-w-0"><p className="text-2xl font-black sm:text-3xl">{s.n}</p><p className="truncate text-sm text-muted-foreground">{s.l}</p></div>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${s.cls}`}><s.icon className="h-6 w-6" /></span>
            </div>))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-5">
            <section className="rounded-xl border bg-card shadow-sm">
              <div className="flex gap-1 overflow-x-auto border-b px-4 pt-3">
                {["المشاريع", "المهام", "مخطط جانت", "التقويم"].map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-bold ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>))}
              </div>
              <div className="p-4">
                {tab === "المشاريع" && (<>
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-lg font-extrabold">قائمة المشاريع</h2>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <div className="relative"><Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث في المشاريع..." className="h-10 w-full rounded-lg border bg-background pr-9 pl-3 text-sm sm:w-56" /></div>
                      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
                        <option value="all">جميع الحالات</option>{Object.keys(statusCls).map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setOpen(true)} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground"><PlusCircle className="h-4 w-4" />مشروع جديد</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[900px] whitespace-nowrap text-sm">
                      <thead className="bg-muted/50 text-muted-foreground"><tr>{["#", "اسم المشروع", "المدير", "تاريخ البداية", "تاريخ الانتهاء", "التقدم", "الحالة", "الإجراءات"].map((h) => <th key={h} className="p-3 text-right font-semibold">{h}</th>)}</tr></thead>
                      <tbody>
                        {shown.map((p, i) => (
                          <tr key={p.id} className="border-t">
                            <td className="p-3">{i + 1}</td><td className="p-3 font-bold">{p.name}</td>
                            <td className="p-3"><div className="flex items-center gap-2"><Avatar name={p.manager} />{p.manager}</div></td>
                            <td className="p-3">{p.start}</td><td className="p-3">{p.end}</td>
                            <td className="p-3"><div className="flex items-center gap-2"><div className="h-2 w-24 rounded-full bg-muted"><div className={`h-2 rounded-full ${barCls(p)}`} style={{ width: `${p.progress}%` }} /></div><span className="text-xs font-bold">{p.progress}%</span></div></td>
                            <td className="p-3"><Badge cls={statusCls[p.status]}>{p.status}</Badge></td>
                            <td className="p-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="grid h-8 w-8 place-items-center rounded-md border"><MoreHorizontal className="h-4 w-4" /></DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem onClick={() => setView(p)}>عرض التفاصيل</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { const v = Math.min(100, p.progress + 10); update(p.id, { progress: v, status: v === 100 ? "مكتمل" : p.status === "لم يبدأ" ? "قيد التنفيذ" : p.status }); toast.success("تم تحديث التقدم"); }}>تحديث التقدم (+10%)</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { update(p.id, { progress: 100, status: "مكتمل" }); log(`أكمل مشروع (${p.name})`); toast.success("تم تعليم المشروع كمكتمل"); }}>تعليم كمكتمل</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive" onClick={() => { setProjects((ps) => ps.filter((x) => x.id !== p.id)); toast.success("تم حذف المشروع"); }}>حذف</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>))}
                        {!shown.length && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">لا توجد مشاريع مطابقة</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  {list.length > 5 && <button onClick={() => setShowAll(!showAll)} className="mt-3 text-sm font-semibold text-primary">{showAll ? "عرض أقل" : `عرض كل المشاريع (${list.length})`}</button>}
                </>)}
                {tab === "المهام" && <TaskTable rows={tasks} />}
                {tab === "مخطط جانت" && (
                  <div className="overflow-x-auto"><div className="min-w-[760px]">
                    <div className="grid grid-cols-[180px_1fr] border-b pb-2 text-xs text-muted-foreground"><span /><div className="grid grid-cols-12">{months.map((m) => <span key={m} className="text-center">{m}</span>)}</div></div>
                    {projects.map((p) => (
                      <div key={p.id} className="grid grid-cols-[180px_1fr] items-center border-b py-2 text-sm">
                        <span className="truncate font-bold">{p.name}</span>
                        <div className="relative h-6 rounded bg-muted/40">
                          <div className={`absolute top-0 h-6 rounded ${barCls(p)} opacity-90`} style={{ right: `${mIdx(p.start)}%`, width: `${Math.max(3, mIdx(p.end) - mIdx(p.start))}%` }}>
                            <span className="px-2 text-xs font-bold leading-6 text-primary-foreground">{p.progress}%</span>
                          </div>
                        </div>
                      </div>))}
                  </div></div>
                )}
                {tab === "التقويم" && (
                  <div>
                    <p className="mb-3 font-bold">أبريل 2025</p>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map((d) => <span key={d} className="py-1 font-semibold text-muted-foreground">{d}</span>)}
                      {Array.from({ length: 2 }).map((_, i) => <span key={`e${i}`} />)}
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                        const due = tasks.filter((t) => Number(t.due.split("/")[2]) === day);
                        return (
                          <div key={day} className={`min-h-16 rounded-md border p-1 text-right ${due.length ? "bg-primary-soft" : ""}`}>
                            <span className="font-bold">{day}</span>
                            {due.map((t) => <p key={t.id} className="mt-0.5 truncate rounded bg-card px-1 text-[10px] text-primary">{t.task}</p>)}
                          </div>);
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <Card title="المهام القادمة" action={() => setTab("المهام")}>
              <TaskTable rows={tasks.slice(0, 5)} />
            </Card>
          </div>

          <div className="space-y-5">
            <Card title="حالة المشاريع" action={() => { setTab("المشاريع"); setShowAll(true); }}>
              <div className="flex items-center justify-between gap-4">
                <ul className="flex-1 space-y-3 text-sm">{donut.map((d) => <li key={d.l} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: d.c }} />{d.l}</span><b>{d.v}%</b></li>)}</ul>
                <div className="grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${grad})` }}>
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-card text-center"><div><p className="text-xl font-black">12</p><p className="text-xs">مشروع</p></div></div>
                </div>
              </div>
            </Card>
            <Card title="أولوية المهام" action={() => setTab("المهام")}>
              {[{ l: "عالية", n: 18, c: "bg-destructive" }, { l: "متوسطة", n: 32, c: "bg-primary" }, { l: "منخفضة", n: 14, c: "bg-success" }].map((r) => (
                <div key={r.l} className="mb-3 grid grid-cols-[60px_1fr_30px] items-center gap-3 text-sm">
                  <span>{r.l}</span><div className="h-2.5 rounded-full bg-muted"><div className={`h-2.5 rounded-full ${r.c} opacity-80`} style={{ width: `${(r.n / 40) * 100}%` }} /></div><b className="text-left">{r.n}</b>
                </div>))}
            </Card>
            <Card title="أحدث الأنشطة" action={() => toast("يتم عرض أحدث الأنشطة")}>
              <ul className="space-y-4">{acts.slice(0, 5).map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Avatar name={a.who} />
                  <div className="min-w-0 flex-1"><p className="text-sm font-bold">{a.who}</p><p className="text-xs text-muted-foreground">{a.text}</p></div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{a.when}</span>
                </li>))}</ul>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>مشروع جديد</DialogTitle></DialogHeader>
          <div className="grid gap-3 text-sm">
            <label className="grid gap-1">اسم المشروع<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>
            <label className="grid gap-1">مدير المشروع<input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1">تاريخ البداية<input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>
              <label className="grid gap-1">تاريخ الانتهاء<input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>
            </div>
          </div>
          <DialogFooter className="gap-2"><button onClick={add} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">حفظ المشروع</button><button onClick={() => setOpen(false)} className="rounded-lg border px-5 py-2 text-sm">إلغاء</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && <div className="grid gap-2 text-sm">
            <p>المدير: <b>{view.manager}</b></p><p>الفترة: {view.start} — {view.end}</p><p>التقدم: <b>{view.progress}%</b></p><p>الحالة: <Badge cls={statusCls[view.status]}>{view.status}</Badge></p>
          </div>}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
