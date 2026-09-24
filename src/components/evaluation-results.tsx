import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Briefcase, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, Crown, Download, FileText, Home, Medal, Network, NotebookPen, Printer, User, Users, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import sara from "@/assets/candidate-sara.jpg";
import ahmed from "@/assets/candidate-ahmed.jpg";
import reem from "@/assets/candidate-reem.jpg";
import khaled from "@/assets/candidate-khaled.jpg";
import noura from "@/assets/candidate-noura.jpg";
import chair from "@/assets/dept-manager.jpg";

const criteria = [["المؤهلات العلمية", 20], ["الخبرات العملية", 25], ["الاختبار المهني", 20], ["المقابلة الشخصية", 20], ["الملاءمة الثقافية", 15]] as const;
const cands = [
  { name: "سارة عبدالله أحمد", short: "سارة أحمد", id: "CND-001", img: sara, s: [18.9, 23, 19, 18, 13.5] },
  { name: "أحمد محمد السبيعي", short: "أحمد السبيعي", id: "CND-002", img: ahmed, s: [17.2, 22, 18, 17.5, 12] },
  { name: "ريم فهد العتيبي", short: "ريم العتيبي", id: "CND-003", img: reem, s: [16.1, 20, 15.5, 16, 11] },
  { name: "خالد علي الغامدي", short: "خالد الغامدي", id: "CND-004", img: khaled, s: [14.8, 18, 14, 15, 10.5] },
  { name: "نورة سعد القحطاني", short: "نورة القحطاني", id: "CND-005", img: noura, s: [13.6, 15, 11.5, 12, 8] },
];
const strengths = ["خبرة عملية قوية", "أداء متميز في الاختبار المهني", "مقابلة شخصية ممتازة", "ملاءمة ثقافية عالية للجهة"];
const f = (n: number) => n.toFixed(1);
const verdict = (t: number) => t >= 90 ? ["مُرشّح مفضل", "bg-success-soft text-success border-success/40"] : t >= 80 ? ["مؤهل بشدة", "bg-success-soft/60 text-success border-success/30"] : t >= 70 ? ["مؤهل", "bg-primary/10 text-primary border-primary/30"] : ["غير مؤهل حاليا", "bg-destructive/10 text-destructive border-destructive/30"];
const scoreBox = (r: number, t: number) => t < 70 ? "bg-destructive/10 text-destructive" : r === 0 ? "bg-success-soft text-success" : "bg-primary/10 text-primary";
const barColor = ["bg-success", "bg-primary", "bg-primary/60", "bg-primary/35", "bg-destructive/50"];
const cellColor = (v: number, w: number) => v / w < 0.8 ? (v / w < 0.6 ? "text-destructive" : "text-warning") : "text-foreground";

function Panel({ icon, title, children, className = "", extra }: { icon: ReactNode; title: string; children: ReactNode; className?: string; extra?: ReactNode }) {
  return <section className={`panel min-w-0 p-4 ${className}`}><div className="mb-3 flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-lg font-extrabold text-brand-deep"><span className="[&_svg]:size-6">{icon}</span>{title}</h2>{extra}</div>{children}</section>;
}

export function EvaluationResultsPage() {
  const [approved, setApproved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [detail, setDetail] = useState<number | null>(null);
  const [notes, setNotes] = useState<[string, string, string][]>([["أ. علي الشهري", "مستوى ممتاز في جميع المعايير.", "2025/09/28 10:30"], ["أ. نورة الحمد", "تتمتع بمهارات تواصل عالية.", "2025/09/28 11:15"], ["أ. خالد العتيبي", "خبرة عملية مناسبة لاحتياجات القسم.", "2025/09/28 12:05"]]);
  const [note, setNote] = useState("");
  const rows = useMemo(() => cands.map(c => ({ ...c, total: +c.s.reduce((a, b) => a + b, 0).toFixed(1) })).sort((a, b) => b.total - a.total), []);
  const top = rows[0]!;
  const step = approved ? 3 : 2;

  const exportCsv = () => {
    const head = ["الترتيب", "المرشح", "الرقم", ...criteria.map(c => c[0]), "الإجمالي", "النتيجة"];
    const lines = rows.map((r, i) => [i + 1, r.name, r.id, ...r.s, r.total, verdict(r.total)[0]].join(","));
    const blob = new Blob(["\uFEFF" + [head.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "نتائج-تقييم-المرشحين.csv"; a.click();
  };

  const info = [[Users, "اللجنة", "لجنة التوظيف المالية"], [CalendarDays, "تاريخ التقييم", "2025/09/28"], [Users, "عدد المرشحين", String(rows.length)], [Network, "القسم", "الإدارة المالية"], [Briefcase, "الوظيفة", "محاسب أول"]] as const;
  const stepsL = ["تشكيل اللجنة ومعايير التقييم", "تقييم المرشحين", "حساب النتائج والمفاضلة", "التوصية والاعتماد"];

  return <AppShell>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <nav className="flex items-center gap-2 text-xs text-primary"><Home size={14} />الموارد البشرية<ChevronLeft size={12} />التقييم الوظيفي<ChevronLeft size={12} /><Link to="/performance/committee">تقييم المرشحين من اللجان</Link></nav>
        <h1 className="mt-3 text-2xl font-extrabold text-brand-deep">نتائج تقييم المرشحين</h1>
        <p className="text-sm text-muted-foreground">عرض الدرجات النهائية والمفاضلة بين المرشحين</p>
      </div>
      <div className="flex flex-wrap gap-2 print:hidden">
        <button disabled={approved} onClick={() => setConfirm(true)} className="flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground disabled:bg-success">{approved ? "تم الاعتماد" : "اعتماد النتيجة النهائية"}<Check size={18} /></button>
        <button onClick={exportCsv} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-6 text-sm">تصدير<Download size={18} /></button>
        <button onClick={() => window.print()} className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-6 text-sm">طباعة<Printer size={18} /></button>
        <Link to="/performance/committee" className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-6 text-sm">رجوع<ArrowLeft size={18} /></Link>
      </div>
    </div>

    <section className="panel mt-3 overflow-x-auto px-5 py-4"><div className="flex min-w-[640px]">{stepsL.map((x, i) => <div key={x} className="relative flex flex-1 flex-col items-center after:absolute after:right-1/2 after:top-4 after:h-px after:w-full after:bg-border last:after:hidden"><span className={`z-10 grid size-8 place-items-center rounded-full text-sm font-bold text-primary-foreground ${i === step ? "bg-primary ring-4 ring-primary/20" : approved && i < step ? "bg-success" : "bg-evaluation-step"}`}>{approved && i < step ? <Check size={16} /> : i + 1}</span><span className="mt-2 text-xs">{x}</span></div>)}</div></section>

    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">{info.map(([I, k, v]) => <div key={k} className="panel flex items-center justify-between gap-3 p-4"><div><p className="text-xs text-muted-foreground">{k}</p><b className="mt-1 block text-base text-brand-deep">{v}</b></div><span className="grid size-12 place-items-center rounded-md bg-primary/10 text-brand-deep"><I size={24} /></span></div>)}</div>

    <div className="mt-3 grid gap-3 xl:grid-cols-[240px_minmax(0,1fr)]">
      <Panel icon={<Crown className="hidden" />} title="المرشح الأعلى تقييماً">
        <div className="relative rounded-lg border border-success/40 bg-success-soft/40 p-4 text-center">
          <Crown size={18} className="absolute left-3 top-3 text-warning" />
          <img src={top.img} alt={top.name} className="mx-auto size-20 rounded-full object-cover" />
          <b className="mt-2 block text-base text-brand-deep">{top.name}</b>
          <p className="text-xs">{top.id}</p>
          <span className="mt-2 inline-block rounded bg-success px-8 py-1 text-xs font-bold text-primary-foreground">المركز الأول</span>
          <p className="mt-2 text-2xl font-extrabold text-brand-deep">{f(top.total)}</p>
          <p className="text-xs text-muted-foreground">إجمالي الدرجة من 100</p>
        </div>
        <h3 className="mt-3 flex items-center gap-2 text-sm font-extrabold text-brand-deep"><CheckCircle2 size={16} className="text-brand-deep" />أهم نقاط القوة</h3>
        <ul className="mt-2 grid gap-2 text-xs">{strengths.map(s => <li key={s} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" />{s}</li>)}</ul>
      </Panel>

      <Panel icon={<FileText />} title="مقارنة المرشحين حسب معايير التقييم" extra={<div className="relative"><select value={detail ?? ""} onChange={e => setDetail(e.target.value === "" ? null : +e.target.value)} className="h-10 w-52 appearance-none rounded-md border border-border bg-card pr-3 pl-8 text-sm"><option value="">عرض تفصيلي لكل مرشح</option>{rows.map((r, i) => <option key={r.id} value={i}>{r.name}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3" /></div>}>
        <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-sm">
          <thead className="bg-search text-xs"><tr><th className="p-2 text-right">#</th><th className="p-2 text-right">المرشح</th>{criteria.map(([c, w]) => <th key={c} className="p-2">{c}<br /><span className="font-normal">({w}%)</span></th>)}<th className="p-2">إجمالي الدرجة<br /><span className="font-normal">(100)</span></th><th className="p-2">الترتيب</th><th className="p-2">النتيجة</th></tr></thead>
          <tbody>{rows.map((r, i) => { const v = verdict(r.total); return <tr key={r.id} onClick={() => setDetail(i)} className="cursor-pointer border-b border-border hover:bg-search/50">
            <td className="p-2">{i + 1}</td>
            <td className="p-2"><div className="flex items-center gap-2"><img src={r.img} alt={r.name} className="size-10 rounded-full object-cover" /><div><b className="block text-xs">{r.name}</b><span className="text-[11px] text-muted-foreground">{r.id}</span></div></div></td>
            {r.s.map((v2, j) => <td key={j} className={`p-2 text-center font-bold ${cellColor(v2, criteria[j]![1])}`}>{f(v2)}</td>)}
            <td className="p-2"><span className={`mx-auto block w-20 rounded py-1.5 text-center text-lg font-extrabold ${scoreBox(i, r.total)}`}>{f(r.total)}</span></td>
            <td className="p-2 text-center">{i === 0 ? <Crown className="mx-auto text-warning" size={20} /> : i < 3 ? <Medal className={`mx-auto ${i === 1 ? "text-muted-foreground" : "text-warning"}`} size={20} /> : i + 1}</td>
            <td className="p-2"><span className={`mx-auto block w-24 rounded border py-1 text-center text-xs font-bold ${v[1]}`}>{v[0]}</span></td>
          </tr>; })}</tbody>
        </table></div>
      </Panel>
    </div>

    <div className="mt-3 grid gap-3 lg:grid-cols-3">
      <Panel icon={<NotebookPen />} title="ملاحظات اللجنة">
        <div className="grid divide-y divide-border">{notes.map(([n, t, d]) => <div key={n + d} className="flex items-start gap-3 py-2"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-brand-deep"><User size={18} /></span><div className="flex-1"><b className="text-sm text-brand-deep">{n}</b><p className="text-xs">{t}</p></div><span className="text-[11px] text-muted-foreground">{d}</span></div>)}</div>
        <div className="mt-2 flex gap-2 print:hidden"><input value={note} onChange={e => setNote(e.target.value)} placeholder="أضف ملاحظة..." className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-xs" /><button onClick={() => { if (!note.trim()) return; setNotes([...notes, ["مدير النظام", note.trim(), "2025/09/28 13:00"]]); setNote(""); }} className="rounded-md bg-primary px-3 text-xs font-bold text-primary-foreground">إضافة</button></div>
      </Panel>
      <Panel icon={<FileText />} title="توصية اللجنة">
        <div className="rounded-md border border-border p-3 text-center"><p className="text-xs">بناءً على نتائج التقييم، توصي اللجنة باختيار المرشحة</p><b className="my-1 block text-xl text-brand-deep">{top.name}</b><p className="text-xs">لوظيفة محاسب أول في الإدارة المالية.</p></div>
        <div className="mt-2 grid grid-cols-2 gap-2"><div className="flex items-center gap-2 rounded-md border border-border p-2"><img src={chair} alt="أ. علي الشهري" className="size-12 rounded-md object-cover" /><div><p className="text-[11px] text-muted-foreground">رئيس اللجنة</p><b className="text-sm">أ. علي الشهري</b></div></div><div className="flex items-center gap-2 rounded-md border border-border p-2"><CalendarDays className="text-brand-deep" /><div><p className="text-[11px] text-muted-foreground">تاريخ التوصية</p><b className="text-sm">2025/09/28</b></div></div></div>
      </Panel>
      <Panel icon={<BarChart3 />} title="مقارنة إجمالي الدرجات">
        <div className="flex h-44 gap-2"><div className="flex flex-col justify-between pb-5 text-[10px] text-muted-foreground">{[100, 80, 60, 40, 20, 0].map(n => <span key={n}>{n}</span>)}</div>
          <div className="flex min-w-0 flex-1 items-end justify-around gap-1 border-b border-border">{rows.map((r, i) => <div key={r.id} className="flex h-full w-full max-w-12 min-w-0 flex-col items-center justify-end"><b className="text-xs">{f(r.total)}</b><div className={`w-full ${barColor[i]}`} style={{ height: `${r.total * 0.8}%` }} /></div>)}</div></div>
        <div className="mr-6 flex justify-around text-[10px]">{rows.map(r => <span key={r.id}>{r.short}</span>)}</div>
      </Panel>
    </div>

    {confirm && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4"><div className="w-full max-w-sm rounded-lg bg-card p-5 text-center"><h3 className="text-lg font-extrabold">اعتماد النتيجة النهائية؟</h3><p className="mt-2 text-sm text-muted-foreground">سيتم اعتماد {top.name} كمرشح أول، ولا يمكن التعديل بعد الاعتماد.</p><div className="mt-4 flex justify-center gap-2"><button onClick={() => { setApproved(true); setConfirm(false); }} className="rounded-md bg-primary px-6 py-2 text-sm font-bold text-primary-foreground">اعتماد</button><button onClick={() => setConfirm(false)} className="rounded-md border border-border px-6 py-2 text-sm">إلغاء</button></div></div></div>}

    {detail !== null && rows[detail] && (() => { const r = rows[detail]; return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={() => setDetail(null)}><div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-card p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><img src={r.img} alt={r.name} className="size-14 rounded-full object-cover" /><div><b className="block text-brand-deep">{r.name}</b><span className="text-xs text-muted-foreground">{r.id} — المركز {detail + 1}</span></div></div><button onClick={() => setDetail(null)}><X /></button></div><div className="mt-4 grid gap-3">{criteria.map(([c, w], j) => <div key={c}><div className="flex justify-between text-xs"><span>{c} ({w}%)</span><b>{f(r.s[j]!)} / {w}</b></div><div className="mt-1 h-2 rounded bg-search"><div className="h-2 rounded bg-primary" style={{ width: `${(r.s[j]! / w) * 100}%` }} /></div></div>)}</div><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><b>الإجمالي</b><b className="text-xl text-brand-deep">{f(r.total)}</b></div></div></div>; })()}
  </AppShell>;
}
