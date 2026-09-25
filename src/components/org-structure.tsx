import { useRef, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft, BarChart3, Banknote, ChevronLeft, Calculator, Coins, Cog, Database, Download, List, Maximize, Minus, Monitor, Network, Plus,
  PlusCircle, Printer, Settings2, Users, Home,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import saud from "@/assets/member-saud.jpg";
import abdullah from "@/assets/member-abdullah.jpg";

type Dept = { id: number; name: string; manager: string; salary: number; count: number; tone: string; icon: typeof Users };
const tones = ["--finance-purple", "--success", "--primary", "--finance-orange", "--destructive", "--primary"];
const icons = [Cog, Settings2, Users, BarChart3, Monitor, Users];
const initial: Dept[] = [
  { id: 1, name: "الإدارة المالية", manager: "أ. علي الشهري", salary: 120000, count: 8, tone: tones[0]!, icon: Cog },
  { id: 2, name: "الإدارة التشغيلية", manager: "أ. خالد العتيبي", salary: 90000, count: 6, tone: tones[1]!, icon: Settings2 },
  { id: 3, name: "الموارد البشرية", manager: "أ. أحمد السبيعي", salary: 110000, count: 7, tone: tones[2]!, icon: Users },
  { id: 4, name: "الإدارة الاستراتيجية", manager: "أ. نورة القحطاني", salary: 95000, count: 5, tone: tones[3]!, icon: BarChart3 },
  { id: 5, name: "تقنية المعلومات", manager: "م. عبدالله الغامدي", salary: 130000, count: 9, tone: tones[4]!, icon: Monitor },
  { id: 6, name: "الإدارة الطبية", manager: "د. فهد المطيري", salary: 200000, count: 15, tone: tones[5]!, icon: Users },
];
const CEO_SALARY = 50000;
const photo = (n: string) => (n.includes("السبيعي") || n.includes("سعد") ? saud : n.includes("عبدالله") || n.includes("فهد") ? abdullah : null);
const fmt = (n: number) => n.toLocaleString("en-US");
const staffNames = ["محمد الحربي", "سلمان الدوسري", "هند الزهراني", "ماجد العنزي", "لمى الشمري", "تركي المالكي", "ريم الأحمدي", "بندر القرشي", "منى السبيعي", "يوسف البقمي", "عبير الجهني", "فيصل الرشيدي", "أمل العمري", "نواف الشهراني", "دانة اليامي"];

function Avatar({ name, size = "h-11 w-11" }: { name: string; size?: string }) {
  const p = photo(name);
  const init = name.replace(/^(أ|د|م)\.\s*/, "").split(" ").map((w) => w[0]).join("");
  return p ? <img src={p} alt={name} className={`${size} shrink-0 rounded-full border-2 border-card object-cover`} />
    : <span className={`${size} grid shrink-0 place-items-center rounded-full border-2 border-card bg-primary-soft text-sm font-bold text-primary`}>{init}</span>;
}

export function OrgStructure() {
  const router = useRouter();
  const [depts, setDepts] = useState(initial);
  const [mode, setMode] = useState<"tree" | "list">("tree");
  const [showSalary, setShowSalary] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [view, setView] = useState<Dept | null>(null);
  const [form, setForm] = useState({ name: "", manager: "", salary: "", count: "" });
  const box = useRef<HTMLDivElement>(null);

  const total = depts.reduce((s, d) => s + d.salary, 0);
  const staff = depts.reduce((s, d) => s + d.count, 0);
  const money = (n: number) => (showSalary ? <>{fmt(n)} <span className="text-xs">ريال</span></> : "••••••");

  const add = () => {
    const salary = Number(form.salary), count = Number(form.count);
    if (!form.name || !form.manager || !salary || !count) { toast.error("يرجى تعبئة جميع الحقول بشكل صحيح"); return; }
    const i = depts.length % tones.length;
    setDepts((ds) => [...ds, { id: Date.now(), name: form.name, manager: form.manager, salary, count, tone: tones[i]!, icon: icons[i]! }]);
    toast.success("تمت إضافة القسم"); setForm({ name: "", manager: "", salary: "", count: "" }); setAddOpen(false);
  };
  const exportCsv = () => {
    const rows = [["القسم", "المدير", "إجمالي الرواتب", "عدد الموظفين"], ["الرئيس التنفيذي", "د. سعد بن محمد", CEO_SALARY, 1], ...depts.map((d) => [d.name, d.manager, d.salary, d.count])];
    const blob = new Blob(["\uFEFF" + rows.map((r) => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "الهيكل-التنظيمي.csv"; a.click();
    toast.success("تم تصدير الهيكل التنظيمي");
  };
  const fullscreen = () => { if (document.fullscreenElement) document.exitFullscreen(); else box.current?.requestFullscreen?.(); };

  return (
    <AppShell>
      <main className="space-y-5 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <nav className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary"><Home className="h-3.5 w-3.5" /></Link><ChevronLeft className="h-3 w-3" />
              <span>الموارد البشرية</span><ChevronLeft className="h-3 w-3" /><span className="text-primary">الهيكل التنظيمي</span>
            </nav>
            <h1 className="flex items-center gap-2 text-2xl font-black sm:text-3xl"><Network className="h-7 w-7 text-primary" />الهيكل التنظيمي</h1>
            <p className="text-sm text-muted-foreground">عرض الهيكل التنظيمي للجهة مع الرواتب والتكاليف</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button onClick={() => setAddOpen(true)} className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow"><PlusCircle className="h-4 w-4" />إضافة قسم</button>
            <button onClick={exportCsv} className="flex items-center justify-center gap-2 rounded-lg border bg-card px-5 py-2.5 text-sm font-semibold"><Download className="h-4 w-4" />تصدير</button>
            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-lg border bg-card px-5 py-2.5 text-sm font-semibold"><Printer className="h-4 w-4" />طباعة</button>
            <button onClick={() => router.history.back()} className="col-span-2 flex items-center justify-center gap-2 rounded-lg border bg-card px-5 py-2.5 text-sm font-semibold sm:col-span-1">رجوع<ArrowLeft className="h-4 w-4" /></button>
          </div>
        </div>

        <section ref={box} className="overflow-hidden rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border">
                <button onClick={fullscreen} className="grid h-9 w-9 place-items-center" aria-label="ملء الشاشة"><Maximize className="h-4 w-4" /></button>
                <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))} className="grid h-9 w-9 place-items-center border-x" aria-label="تصغير"><Minus className="h-4 w-4" /></button>
                <button onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} className="grid h-9 w-9 place-items-center" aria-label="تكبير"><Plus className="h-4 w-4" /></button>
              </div>
              <button onClick={() => setMode("tree")} className={`flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${mode === "tree" ? "bg-primary text-primary-foreground" : "border"}`}><Network className="h-4 w-4" />عرض هيكلي</button>
              <button onClick={() => setMode("list")} className={`flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold ${mode === "list" ? "bg-primary text-primary-foreground" : "border"}`}><List className="h-4 w-4" />عرض قائمة</button>
            </div>
            <label className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm">
              <Database className="h-4 w-4" />
              <select value={showSalary ? "1" : "0"} onChange={(e) => setShowSalary(e.target.value === "1")} className="bg-transparent outline-none">
                <option value="1">عرض مع الرواتب</option><option value="0">عرض بدون رواتب</option>
              </select>
            </label>
          </div>

          {mode === "tree" ? (
            <div className="overflow-x-auto">
              <div style={{ zoom }} className="mx-auto">
                <div className="flex flex-col items-center">
                  <div className="relative z-10 -mb-8"><Avatar name="د. سعد بن محمد" size="h-16 w-16" /></div>
                  <div className="w-64 rounded-xl bg-sidebar px-4 pb-4 pt-10 text-center text-sidebar-foreground shadow-lg">
                    <p className="text-lg font-extrabold">الرئيس التنفيذي</p><p className="text-xs opacity-80">د. سعد بن محمد</p>
                  </div>
                  <div className="-mt-1 grid grid-cols-2 divide-x divide-x-reverse rounded-lg border bg-card shadow-sm">
                    <div className="flex items-center gap-3 px-4 py-2"><Users className="h-5 w-5 text-sidebar" /><div><p className="text-[11px] text-muted-foreground">عدد الموظفين</p><b>1</b></div></div>
                    <div className="flex items-center gap-3 px-4 py-2"><Banknote className="h-5 w-5 text-sidebar" /><div><p className="text-[11px] text-muted-foreground">الراتب الشهري</p><b className="text-lg">{showSalary ? fmt(CEO_SALARY) : "••••"}</b></div></div>
                  </div>
                  <div className="h-5 w-px bg-primary" />
                  <span className="h-2 w-2 rounded-full border-2 border-primary bg-card" />
                </div>
                <div className="hidden md:block"><div className="mx-[8%] h-5 border-x border-t border-primary/60 rounded-t-md" /></div>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                  {depts.map((d) => {
                    const c = `var(${d.tone})`;
                    return (
                      <div key={d.id} className="rounded-xl border p-2" style={{ background: `color-mix(in oklab, ${c} 8%, var(--card))`, borderColor: `color-mix(in oklab, ${c} 25%, transparent)` }}>
                        <div className="py-3 text-center" style={{ color: c }}>
                          <d.icon className="mx-auto h-7 w-7" /><p className="mt-1 font-extrabold text-foreground">{d.name}</p>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 rounded-lg bg-card p-2"><Avatar name={d.manager} /><div className="min-w-0"><p className="truncate text-sm font-bold">{d.manager}</p><p className="text-[11px] text-muted-foreground">مدير الإدارة</p></div></div>
                          <div className="flex items-center gap-3 rounded-lg bg-card p-2"><Banknote className="h-5 w-5 shrink-0" style={{ color: c }} /><div><p className="text-[11px] text-muted-foreground">إجمالي الرواتب</p><b className="text-sm">{money(d.salary)}</b></div></div>
                          <div className="flex items-center gap-3 rounded-lg bg-card p-2"><Users className="h-5 w-5 shrink-0" style={{ color: c }} /><div><p className="text-[11px] text-muted-foreground">عدد الموظفين</p><b className="text-sm">{d.count}</b></div></div>
                          <button onClick={() => setView(d)} className="flex w-full items-center justify-center gap-2 rounded-lg border bg-card py-2 text-sm font-semibold hover:bg-muted">عرض التفاصيل<ArrowLeft className="h-4 w-4" /></button>
                        </div>
                      </div>);
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[640px] whitespace-nowrap text-sm">
                <thead className="bg-muted/50 text-muted-foreground"><tr>{["القسم", "المدير", "إجمالي الرواتب", "عدد الموظفين", ""].map((h) => <th key={h} className="p-3 text-right font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  <tr className="border-t bg-primary-soft/40"><td className="p-3 font-bold">الرئيس التنفيذي</td><td className="p-3">د. سعد بن محمد</td><td className="p-3">{money(CEO_SALARY)}</td><td className="p-3">1</td><td /></tr>
                  {depts.map((d) => <tr key={d.id} className="border-t"><td className="p-3 font-bold">{d.name}</td><td className="p-3"><div className="flex items-center gap-2"><Avatar name={d.manager} size="h-8 w-8" />{d.manager}</div></td><td className="p-3">{money(d.salary)}</td><td className="p-3">{d.count}</td><td className="p-3"><button onClick={() => setView(d)} className="text-primary">عرض التفاصيل</button></td></tr>)}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-3">
            {[
              { l: "إجمالي عدد الموظفين", v: String(staff), s: "موظف", icon: Users, c: "text-success" },
              { l: "عدد الأقسام", v: String(depts.length), s: "أقسام", icon: Network, c: "text-finance-purple" },
              { l: "راتب الرئيس التنفيذي", v: showSalary ? `${fmt(CEO_SALARY)} ريال` : "••••", s: "عدد الموظفين 1", icon: Coins, c: "text-primary" },
            ].map((k) => (
              <div key={k.l} className="flex items-center justify-between gap-3 rounded-lg border p-4">
                <div><p className="text-sm text-muted-foreground">{k.l}</p><p className="text-2xl font-black">{k.v}</p><p className="text-xs text-muted-foreground">{k.s}</p></div>
                <k.icon className={`h-10 w-10 shrink-0 ${k.c}`} />
              </div>))}
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm">
            <div><p className="font-extrabold">إجمالي الرواتب في الهيكل التنظيمي</p><p className="my-1 text-3xl font-black text-sidebar">{money(total)}</p><p className="text-xs text-muted-foreground">إجمالي الرواتب الشهري لجميع الإدارات</p></div>
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-primary-soft"><BarChart3 className="h-10 w-10 text-primary" /></span>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-success/30 bg-success/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3 font-extrabold"><Database className="h-8 w-8 shrink-0 text-success" />الإجمالي الكلي للرواتب (مع الرئيس التنفيذي)</p>
          <p className="flex items-center gap-2 text-3xl font-black text-sidebar">{money(total + CEO_SALARY)}<Calculator className="h-7 w-7 text-success" /></p>
        </div>
      </main>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إضافة قسم جديد</DialogTitle></DialogHeader>
          <div className="grid gap-3 text-sm">
            {([["name", "اسم القسم", "text"], ["manager", "مدير الإدارة", "text"], ["salary", "إجمالي الرواتب (ريال)", "number"], ["count", "عدد الموظفين", "number"]] as const).map(([k, l, t]) => (
              <label key={k} className="grid gap-1">{l}<input type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="h-10 rounded-lg border bg-background px-3" /></label>))}
          </div>
          <DialogFooter className="gap-2"><button onClick={add} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">حفظ القسم</button><button onClick={() => setAddOpen(false)} className="rounded-lg border px-5 py-2 text-sm">إلغاء</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!view} onOpenChange={() => setView(null)}>
        <DialogContent dir="rtl" className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{view?.name}</DialogTitle></DialogHeader>
          {view && <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Avatar name={view.manager} /><div><b>{view.manager}</b><p className="text-xs text-muted-foreground">مدير الإدارة</p></div></div>
            <div className="grid grid-cols-2 gap-2"><div className="rounded-lg border p-3">إجمالي الرواتب<br /><b>{money(view.salary)}</b></div><div className="rounded-lg border p-3">عدد الموظفين<br /><b>{view.count}</b></div></div>
            <p className="font-bold">موظفو القسم</p>
            <ul className="divide-y rounded-lg border">{staffNames.slice(0, view.count).map((n) => <li key={n} className="flex items-center gap-2 p-2"><Avatar name={n} size="h-8 w-8" />{n}</li>)}</ul>
          </div>}
          <DialogFooter><button onClick={() => { setDepts((ds) => ds.filter((d) => d.id !== view?.id)); toast.success("تم حذف القسم"); setView(null); }} className="rounded-lg bg-destructive px-5 py-2 text-sm font-bold text-destructive-foreground">حذف القسم</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
