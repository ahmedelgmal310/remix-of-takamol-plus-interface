import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  BarChart3, Box, Check, ChevronLeft, Download, FileText, Gavel, GraduationCap, Headset, House, Layers, Minus,
  PlusCircle, RotateCcw, Search, Settings, Shield, ShieldCheck, UserRound, Users, UsersRound, Wallet, X, ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type S = "full" | "partial" | "none" | "na";
type Role = { id: string; name: string; icon: LucideIcon; tone: string };

const baseRoles: Role[] = [
  { id: "admin", name: "مدير النظام", icon: Shield, tone: "bg-primary/10 text-primary" },
  { id: "ceo", name: "المدير التنفيذي", icon: UserRound, tone: "bg-destructive/10 text-destructive" },
  { id: "mgr", name: "مدير إدارة", icon: Settings, tone: "bg-warning/15 text-warning" },
  { id: "head", name: "رئيس قسم", icon: UsersRound, tone: "bg-chart-4/15 text-chart-4" },
  { id: "emp", name: "موظف", icon: UserRound, tone: "bg-success/10 text-success" },
  { id: "trainee", name: "متدرب", icon: GraduationCap, tone: "bg-primary/10 text-primary" },
];
const systems: { name: string; icon: LucideIcon }[] = [
  { name: "الصفحة الرئيسية", icon: House }, { name: "الموارد البشرية", icon: Users }, { name: "خدمة ذاتية للموظف", icon: UserRound },
  { name: "الرواتب والمزايا", icon: Wallet }, { name: "المشاريع والمهام", icon: ClipboardCheck }, { name: "المستندات والنماذج", icon: FileText },
  { name: "التقارير والإحصائيات", icon: BarChart3 }, { name: "المشتريات والمخزون", icon: Box }, { name: "المناقصات", icon: Gavel },
  { name: "خدمة العملاء", icon: Headset }, { name: "الإعدادات", icon: Settings },
];
// columns: admin, ceo, mgr(partial=green), head, emp, trainee
const F = "full", P = "partial", N = "none", A = "na";
const initialRows: S[][] = [
  [F, F, P, F, P, N], [F, F, P, P, F, F], [F, F, P, F, A, P], [F, F, P, P, F, N], [F, F, P, F, N, N], [F, F, P, P, N, N],
  [F, F, P, P, F, N], [F, F, P, F, N, N], [F, F, P, A, N, N], [F, F, P, A, N, N], [F, F, P, F, N, N],
];
const KEY = "tkp-permissions";
const initial = () => ({ roles: baseRoles.map((r) => r.id), extra: [] as string[], grid: initialRows.map((r) => [...r]) });

function Cell({ s, onClick }: { s: S; onClick: () => void }) {
  if (s === "na") return <span className="text-muted-foreground"><Minus className="mx-auto size-4" /></span>;
  const cls = s === "full" ? "bg-primary border-primary text-primary-foreground" : s === "partial" ? "bg-success border-success text-primary-foreground" : "border-border bg-card";
  return <button onClick={onClick} aria-label="تغيير الصلاحية" className={`mx-auto grid size-5 place-items-center rounded border-2 transition hover:scale-110 ${cls}`}>{s !== "none" && <Check className="size-3.5" strokeWidth={3} />}</button>;
}

const at = (g: S[][], r: number, c: number): S => g[r]?.[c] ?? "none";

export function Permissions() {
  const [state, setState] = useState(initial);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [roleF, setRoleF] = useState("all");
  const [sysF, setSysF] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setState(JSON.parse(s)); } catch { /* ignore */ } }, []);

  const roles: Role[] = [...baseRoles, ...state.extra.map((n, i) => ({ id: `x${i}`, name: n, icon: UserRound, tone: "bg-muted text-foreground" }))];
  const visRoles = roles.map((r, i) => ({ r, i })).filter(({ r }) => roleF === "all" || r.id === roleF);
  const visSys = systems.map((s, i) => ({ s, i })).filter(({ s }) => (sysF === "all" || s.name === sysF) && s.name.includes(q.trim()));
  const total = useMemo(() => state.grid.flat().filter((s) => s === "full" || s === "partial").length, [state]);

  const cycle = (r: number, c: number) => setState((st) => {
    const g = st.grid.map((x) => [...x]); const cur = at(g, r, c); const row = g[r]; if (!row) return st;
    row[c] = cur === "full" ? "partial" : cur === "partial" ? "none" : "full"; return { ...st, grid: g };
  });
  const clearRow = (r: number) => setState((st) => ({ ...st, grid: st.grid.map((x, i) => i === r ? x.map((s) => s === "na" ? s : "none") : x) }));
  const addRole = () => {
    const n = newName.trim().slice(0, 40); if (!n) { toast.error("اكتب اسم الدور"); return; }
    setState((st) => ({ ...st, extra: [...st.extra, n], grid: st.grid.map((x) => [...x, "none"]) }));
    setNewName(""); setOpen(false); toast.success(`تمت إضافة دور «${n}»`);
  };
  const exportCsv = () => {
    const label: Record<S, string> = { full: "مسموح بالكامل", partial: "مسموح جزئيًا", none: "غير مسموح", na: "غير متاح" };
    const rows = [["النظام", ...roles.map((r) => r.name)], ...systems.map((s, i) => [s.name, ...(state.grid[i] ?? []).map((x) => label[x])])];
    const blob = new Blob(["\ufeff" + rows.map((r) => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "permissions.csv"; a.click();
  };

  return (
    <AppShell>
      <main className="min-w-0 space-y-5 p-4 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-xs text-muted-foreground"><Link to="/">الرئيسية</Link><ChevronLeft className="size-3" /><Link to="/settings">الإعدادات</Link><ChevronLeft className="size-3" /><span>إدارة الصلاحيات</span></nav>
            <h1 className="mt-2 text-2xl font-extrabold">جدول الصلاحيات</h1>
            <p className="mt-1 text-sm text-muted-foreground">إدارة صلاحيات المستخدمين حسب الأدوار والأنظمة</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button variant="outline" onClick={() => setOpen(true)}><PlusCircle className="text-primary" />إضافة دور جديد</Button>
            <Button variant="outline" onClick={exportCsv}><Download />تصدير</Button>
            <Button variant="outline" onClick={() => { setState(initial()); toast.info("تمت إعادة الضبط"); }}><RotateCcw />إعادة الضبط</Button>
            <Button onClick={() => { localStorage.setItem(KEY, JSON.stringify(state)); toast.success("تم حفظ التغييرات"); }}><Check />حفظ التغييرات</Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold">عرض
            <div className="flex rounded-lg bg-muted p-1">
              {(["grid", "list"] as const).map((v) => <button key={v} onClick={() => setView(v)} className={`rounded-md px-4 py-1.5 text-sm ${view === v ? "bg-primary text-primary-foreground" : ""}`}>{v === "grid" ? "جدول الصلاحيات" : "قائمة الصلاحيات"}</button>)}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select value={roleF} onChange={(e) => setRoleF(e.target.value)} className="h-10 rounded-lg border bg-card px-3 text-sm"><option value="all">جميع الأدوار</option>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
            <select value={sysF} onChange={(e) => setSysF(e.target.value)} className="h-10 rounded-lg border bg-card px-3 text-sm"><option value="all">جميع الأنظمة</option>{systems.map((s) => <option key={s.name}>{s.name}</option>)}</select>
            <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث عن صلاحية ..." className="pl-9" /></div>
          </div>
        </div>

        {view === "grid" ? (
          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[820px] text-sm">
              <thead><tr>
                <th className="p-4 text-right"><span className="flex items-center gap-2 font-extrabold"><Layers className="size-5 text-primary" />الصلاحيات / الأنظمة</span></th>
                {visRoles.map(({ r }) => <th key={r.id} className={`p-3 ${r.tone}`}><r.icon className="mx-auto mb-1 size-5" /><span className="font-bold">{r.name}</span></th>)}
              </tr></thead>
              <tbody>
                {visSys.map(({ s, i }) => (
                  <tr key={s.name} className="border-t">
                    <td className="p-3"><div className="flex items-center gap-3"><s.icon className="size-5 shrink-0 text-primary" /><span className="flex-1 font-semibold">{s.name}</span><button onClick={() => clearRow(i)} aria-label="مسح" className="text-muted-foreground hover:text-destructive"><X className="size-3.5" /></button></div></td>
                    {visRoles.map(({ r, i: c }) => <td key={r.id} className="border-r p-3 text-center"><Cell s={at(state.grid, i, c)} onClick={() => cycle(i, c)} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visRoles.map(({ r, i: c }) => (
              <div key={r.id} className="rounded-2xl border bg-card p-4">
                <div className="mb-3 flex items-center gap-2"><span className={`grid size-9 place-items-center rounded-lg ${r.tone}`}><r.icon className="size-5" /></span><b>{r.name}</b></div>
                <ul className="space-y-1.5 text-sm">{visSys.filter(({ i }) => ["full", "partial"].includes(at(state.grid, i, c))).map(({ s, i }) => <li key={s.name} className="flex justify-between"><span>{s.name}</span><span className={at(state.grid, i, c) === "full" ? "text-primary" : "text-success"}>{at(state.grid, i, c) === "full" ? "كامل" : "جزئي"}</span></li>)}</ul>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,2fr)]">
          {[{ t: "الأنظمة المغطاة", n: 12, icon: ShieldCheck, c: "bg-success/10 text-success" }, { t: "إجمالي الصلاحيات", n: 128 + total - 48, icon: FileText, c: "bg-primary/10 text-primary" }, { t: "إجمالي الأدوار", n: roles.length, icon: Users, c: "bg-primary/10 text-primary" }].map((k) => (
            <div key={k.t} className="flex items-center justify-between rounded-2xl border bg-card p-5"><div><p className="text-sm text-muted-foreground">{k.t}</p><p className="mt-1 text-2xl font-extrabold">{k.n}</p></div><span className={`grid size-12 place-items-center rounded-xl ${k.c}`}><k.icon className="size-6" /></span></div>
          ))}
          <div className="rounded-2xl border bg-card p-5">
            <p className="mb-4 font-extrabold">دليل الألوان والرموز</p>
            <div className="flex flex-wrap gap-5 text-sm">
              <span className="flex items-center gap-2"><Cell s="full" onClick={() => {}} />مسموح بالكامل</span>
              <span className="flex items-center gap-2"><Cell s="partial" onClick={() => {}} />مسموح جزئيًا</span>
              <span className="flex items-center gap-2"><Cell s="none" onClick={() => {}} />غير مسموح</span>
              <span className="flex items-center gap-2"><Minus className="size-4" />غير متاح</span>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent><DialogHeader><DialogTitle>إضافة دور جديد</DialogTitle></DialogHeader>
          <Input value={newName} maxLength={40} onChange={(e) => setNewName(e.target.value)} placeholder="اسم الدور" />
          <DialogFooter><Button onClick={addRole}>إضافة</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
