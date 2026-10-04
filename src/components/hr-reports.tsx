import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, CalendarDays, FileDown, FileText, Globe2, Printer, Users, UserRound, UserRoundCheck, UserRoundX } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { hrReportDepartments, hrReportJobs, hrReportMonths } from "@/data/mockData";

type Filters = { location: string; job: string; dept: string; quarter: string; year: string };
const initial: Filters = { location: "جميع المواقع", job: "جميع الوظائف", dept: "جميع الأقسام", quarter: "الربع الرابع", year: "2026" };
const panel = "min-w-0 rounded-md border border-border bg-card shadow-sm";
const selectClass = "h-8 min-w-0 rounded border border-border bg-card px-2 text-[11px] font-bold text-foreground outline-none focus:ring-2 focus:ring-ring";
const fmt = (n: number) => n.toLocaleString("en-US");
const percent = (n: number, total: number) => total ? Math.round(n / total * 100) : 0;
const escapeCsv = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;

function ReportBars({ data, max, salary = false }: { data: { name: string; saudi: number; other: number; salarySaudi?: number; salaryOther?: number }[]; max: number; salary?: boolean }) {
  return <div className="flex h-[120px] items-end gap-1 border-b border-border pt-3" dir="rtl">{data.map(row => {
    const a = salary ? row.salarySaudi ?? 0 : row.saudi;
    const b = salary ? row.salaryOther ?? 0 : row.other;
    return <div key={row.name} className="flex h-full min-w-0 flex-1 flex-col justify-end gap-1" title={`${row.name}: سعودي ${fmt(a)}، غير سعودي ${fmt(b)}`}>
      <div className="flex h-[94px] items-end justify-center gap-0.5"><span className="w-[34%] max-w-[18px] rounded-t-sm bg-success" style={{ height: `${max ? Math.max(2, a / max * 100) : 0}%` }} /><span className="w-[34%] max-w-[18px] rounded-t-sm bg-primary" style={{ height: `${max ? Math.max(2, b / max * 100) : 0}%` }} /></div>
      <span className="hidden text-center text-[8px] leading-tight sm:block">{row.name}</span>
    </div>;
  })}</div>;
}

function TrendChart({ factor }: { factor: number }) {
  const points = hrReportMonths.map((m, i) => ({ ...m, x: 28 + i * 37, saudi: Math.round(m.saudi * factor), other: Math.round(m.other * factor) }));
  const line = (key: "saudi" | "other") => points.map(p => `${p.x},${130 - p[key] * .47}`).join(" ");
  return <svg viewBox="0 0 400 163" role="img" aria-label="حركة الموظفين السعوديين وغير السعوديين خلال السنة" className="h-[153px] w-full" preserveAspectRatio="none" dir="ltr">
    {[0, 50, 100, 150, 200, 250].map(n => <g key={n}><line x1="28" x2="388" y1={130 - n * .47} y2={130 - n * .47} stroke="var(--border)"/><text x="2" y={133 - n * .47} fontSize="8" fill="var(--foreground)">{n}</text></g>)}
    <polygon points={`28,130 ${line("saudi")} 361,130`} fill="var(--success-soft)" opacity=".55" />
    <polygon points={`28,130 ${line("other")} 361,130`} fill="var(--primary-soft)" opacity=".7" />
    <polyline fill="none" stroke="var(--success)" strokeWidth="2.5" points={line("saudi")} /><polyline fill="none" stroke="var(--primary)" strokeWidth="2.5" points={line("other")} />
    {points.map((p,i) => <g key={p.name}><circle cx={p.x} cy={130 - p.saudi * .47} r="2.7" fill="var(--success)"/><circle cx={p.x} cy={130 - p.other * .47} r="2.7" fill="var(--primary)"/><text x={p.x} y="151" textAnchor="middle" fontSize="7.5" fill="var(--foreground)">{i % 2 === 0 || i === points.length - 1 ? p.name : ""}</text></g>)}
  </svg>;
}

export function HrReports() {
  const [filters, setFilters] = useState<Filters>(initial);
  const update = (key: keyof Filters, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const report = useMemo(() => {
    const locationFactor = filters.location === "جميع المواقع" ? 1 : filters.location === "الرياض" ? .55 : filters.location === "جدة" ? .3 : .15;
    const timeFactor = filters.year === "2026" ? 1 : .84;
    const quarterFactor = filters.quarter === "الربع الرابع" ? 1 : filters.quarter === "جميع الأرباع" ? 1 : filters.quarter === "الربع الثالث" ? .84 : filters.quarter === "الربع الثاني" ? .68 : .53;
    const factor = locationFactor * timeFactor * quarterFactor;
    const jobs = hrReportJobs.map(row => ({ ...row, saudi: Math.round(row.saudi * factor), other: Math.round(row.other * factor) }));
    const departments = hrReportDepartments.map(row => ({ ...row, saudi: Math.round(row.saudi * factor), other: Math.round(row.other * factor) }));
    const job = filters.job === "جميع الوظائف" ? undefined : jobs.find(row => row.name === filters.job);
    const dept = filters.dept === "جميع الأقسام" ? undefined : departments.find(row => row.name === filters.dept);
    // Intersections are illustrative proportional estimates; the source has aggregate rows, not employee records.
    const jobFraction = job ? (job.saudi + job.other) / (jobs.reduce((n,r) => n + r.saudi + r.other,0) || 1) : 1;
    const deptFraction = dept ? (dept.saudi + dept.other) / (departments.reduce((n,r) => n + r.saudi + r.other,0) || 1) : 1;
    const scaledJobs = jobs.map(row => ({ ...row, saudi: filters.job !== "جميع الوظائف" && row.name !== filters.job ? 0 : Math.round(row.saudi * deptFraction), other: filters.job !== "جميع الوظائف" && row.name !== filters.job ? 0 : Math.round(row.other * deptFraction) })).filter(row => row.saudi + row.other > 0);
    const scaledDepartments = departments.map(row => ({ ...row, saudi: filters.dept !== "جميع الأقسام" && row.name !== filters.dept ? 0 : Math.round(row.saudi * jobFraction), other: filters.dept !== "جميع الأقسام" && row.name !== filters.dept ? 0 : Math.round(row.other * jobFraction) })).filter(row => row.saudi + row.other > 0);
    const saudi = filters.dept !== "جميع الأقسام" ? scaledDepartments.reduce((n,r) => n + r.saudi, 0) : scaledJobs.reduce((n,r) => n + r.saudi, 0);
    const other = filters.dept !== "جميع الأقسام" ? scaledDepartments.reduce((n,r) => n + r.other, 0) : scaledJobs.reduce((n,r) => n + r.other, 0);
    const total = saudi + other;
    const female = Math.round(total * 116 / 312);
    return { jobs: scaledJobs, departments: scaledDepartments, saudi, other, total, female, male: total - female, factor: factor * jobFraction * deptFraction };
  }, [filters]);
  const exportCsv = () => {
    const rows: (string | number)[][] = [["تقارير الموارد البشرية", `${filters.year} / ${filters.quarter} / ${filters.location} / ${filters.job} / ${filters.dept}`], ["إجمالي الموظفين", report.total], ["الذكور", report.male], ["الإناث", report.female], ["السعوديون", report.saudi], ["غير السعوديين", report.other], [], ["الفئة الوظيفية", "سعودي", "غير سعودي", "الإجمالي"], ...report.jobs.map(r => [r.name, r.saudi, r.other, r.saudi + r.other]), [], ["القسم", "سعودي", "غير سعودي", "الإجمالي"], ...report.departments.map(r => [r.name, r.saudi, r.other, r.saudi + r.other])];
    const csv = "\uFEFF" + rows.map(row => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "تقارير-الموارد-البشرية.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const cards = [
    { title: "الإناث", value: report.female, pct: percent(report.female, report.total), icon: UserRound, tone: "text-destructive", bg: "bg-destructive/10" },
    { title: "الذكور", value: report.male, pct: percent(report.male, report.total), icon: UserRound, tone: "text-primary", bg: "bg-primary-soft" },
    { title: "غير السعوديين", value: report.other, pct: percent(report.other, report.total), icon: Globe2, tone: "text-primary", bg: "bg-primary-soft", trend: "14%" },
    { title: "السعوديون", value: report.saudi, pct: percent(report.saudi, report.total), icon: UserRoundCheck, tone: "text-success", bg: "bg-success-soft", trend: "10%" },
    { title: "إجمالي الموظفين", value: report.total, pct: 58, icon: Users, tone: "text-primary", bg: "bg-primary-soft", trend: "12%" },
  ];
  const legend = <div className="flex items-center justify-center gap-4 text-[9px] font-bold"><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-success"/>سعودي</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-primary"/>غير سعودي</span></div>;
  const heading = (title: string) => <h2 className="mb-1 text-[12px] font-extrabold text-buy-navy">{title}</h2>;
  const options = (key: keyof Filters, label: string, values: string[]) => <select key={key} aria-label={label} className={selectClass} value={filters[key]} onChange={e => update(key, e.target.value)}>{values.map(v => <option key={v}>{v}</option>)}</select>;
  const distribution = (rows: { name: string; saudi: number; other: number }[], title: string) => <section className={`${panel} p-2.5`}>
    {heading(title)}<div className="overflow-x-auto"><table className="w-full min-w-[300px] text-[10px]"><thead className="bg-primary-soft"><tr><th className="p-1.5 text-right">{title.includes("القسم") ? "القسم" : "الفئة الوظيفية"}</th><th className="p-1.5">سعودي</th><th className="p-1.5">غير سعودي</th><th className="p-1.5">الإجمالي</th></tr></thead><tbody>{rows.map(r => <tr key={r.name} className="border-t border-border"><td className="whitespace-nowrap p-1.5"><div className="flex items-center gap-2"><span className="min-w-[86px]">{r.name}</span><span className="h-2 w-12 rounded-sm bg-primary-soft"><span className="block h-full rounded-sm bg-success" style={{ width: `${Math.min(100,(r.saudi + r.other) / (report.total || 1) * 260)}%` }} /></span></div></td><td className="p-1.5 text-center">{r.saudi}</td><td className="p-1.5 text-center">{r.other}</td><td className="p-1.5 text-center font-bold">{r.saudi+r.other}</td></tr>)}</tbody></table></div>
  </section>;
  return <AppShell><main id="hr-report" dir="rtl" className="mx-auto max-w-[1600px] space-y-2.5 p-3 text-buy-navy md:p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><h1 className="text-xl font-extrabold">تقارير الموارد البشرية</h1><p className="text-[10px]"><Link to="/" className="text-muted-foreground">الرئيسية</Link> / تقارير الموارد البشرية</p></div>
      <div className="flex flex-wrap items-center gap-1.5 print:hidden">{options("location", "الموقع", ["جميع المواقع", "الرياض", "جدة", "الدمام"])}{options("job", "الفئة الوظيفية", ["جميع الوظائف", ...hrReportJobs.map(r => r.name)])}{options("dept", "القسم", ["جميع الأقسام", ...hrReportDepartments.map(r => r.name)])}{options("quarter", "الربع", ["الربع الرابع", "الربع الثالث", "الربع الثاني", "الربع الأول", "جميع الأرباع"])}<label className="flex items-center gap-1 rounded border border-border bg-card px-1"><CalendarDays size={13} className="text-primary"/>{options("year", "السنة", ["2026", "2025"])}</label><Button variant="outline" size="icon" aria-label="طباعة التقرير" title="طباعة التقرير" onClick={() => window.print()}><Printer size={15}/></Button><Button variant="outline" size="icon" aria-label="تصدير التقرير CSV" title="تصدير التقرير CSV" onClick={exportCsv}><FileDown size={15}/></Button></div></div>
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">{cards.map(c => <section key={c.title} className={`${panel} flex min-h-[85px] items-center justify-between gap-1.5 p-2.5`}><div className="min-w-0"><h2 className="text-[10px] font-extrabold">{c.title}</h2><p className={`text-xl font-extrabold leading-tight ${c.title === "الإناث" ? "text-destructive" : ""}`}>{fmt(c.value)}</p><p className="text-[11px] font-bold">{c.pct}%</p>{c.trend && <p className="flex flex-wrap items-center gap-1 text-[9px]"><span className="text-muted-foreground">مقارنة بالفترة السابقة</span><b className="flex items-center text-success"><ArrowUp size={11}/>{c.trend}</b></p>}</div><span className={`grid size-11 shrink-0 place-items-center rounded-full ${c.bg} ${c.tone}`}><c.icon size={23}/></span></section>)}</div>
    {report.total === 0 ? <div className={`${panel} p-12 text-center text-muted-foreground`}>لا توجد بيانات مطابقة للفلاتر المحددة</div> : <>
    <div className="grid gap-2 lg:grid-cols-[1.1fr_1.25fr_1fr]">
      <section className={`${panel} p-2.5`}>{heading("توزيع الموظفين حسب الجنسية والوظيفة")}{legend}<ReportBars data={report.jobs} max={80}/></section>
      <section className={`${panel} p-2.5`}>{heading("حركة الموظفين خلال السنة حسب الجنسية")}{legend}<TrendChart factor={report.factor}/></section>
      <section className={`${panel} p-2.5`}>{heading("توزيع الموظفين حسب الجنسية")}<div className="flex min-h-[155px] items-center justify-around gap-3"><div className="relative grid size-[125px] shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--success) 0 ${percent(report.saudi,report.total)}%, var(--primary) ${percent(report.saudi,report.total)}% 100%)` }}><span className="grid size-[73px] place-content-center rounded-full bg-card text-center"><b className="text-lg leading-5">{report.total}</b><small className="text-[9px]">موظف</small></span></div><div className="min-w-0 flex-1 space-y-3 text-[10px]"><div className="flex items-center justify-between gap-1"><span className="text-success">● سعودي</span><b>{report.saudi}</b><b>{percent(report.saudi,report.total)}%</b></div><div className="flex items-center justify-between gap-1"><span className="text-primary">● غير سعودي</span><b>{report.other}</b><b>{percent(report.other,report.total)}%</b></div></div></div></section>
    </div>
    <div className="grid gap-2 lg:grid-cols-[1.05fr_1.15fr_.95fr]">
      <section className={`${panel} p-2.5`}>{heading("مؤشرات رئيسية")}<div className="grid grid-cols-2 gap-2">{[
        ["معدل غير السعوديين",percent(report.other,report.total),Globe2,"text-primary","bg-primary-soft"],["معدل السعودة",percent(report.saudi,report.total),UserRoundCheck,"text-success","bg-success-soft"],["نسبة الإناث",percent(report.female,report.total),UserRound,"text-destructive","bg-destructive/10"],["نسبة الذكور",percent(report.male,report.total),UserRoundX,"text-warning","bg-warning-soft"]
      ].map(([label,value,Icon,tone,bg]) => { const IconType = Icon as typeof Globe2; return <div key={String(label)} className={`flex min-h-[73px] items-center justify-between gap-1 rounded p-2 ${bg}`}><div><p className="text-[9px] font-bold">{String(label)}</p><b className={`text-lg ${tone}`}>{String(value)}%</b></div><IconType size={22} className={String(tone)}/></div>; })}</div></section>
      {distribution(report.jobs,"توزيع الموظفين حسب الجنسية والفئة الوظيفية")}
      {distribution(report.departments,"توزيع الموظفين حسب الجنسية والقسم")}
    </div>
    <div className="grid gap-2 lg:grid-cols-[1fr_1.2fr]"><section className={`${panel} p-2.5`}>{heading("توزيع الرواتب حسب الجنسية")}{legend}<ReportBars data={report.jobs} max={20000} salary/></section>
      <section className={`${panel} p-2.5`}>{heading("تفاصيل الموظفين حسب الجنسية")}<div className="overflow-x-auto"><table className="w-full min-w-[470px] text-[10px]"><thead className="bg-primary-soft"><tr>{["الجنسية","العدد","النسبة","متوسط العمر","متوسط سنوات الخدمة","متوسط الراتب (ريال)"].map(h => <th key={h} className="p-2 text-right">{h}</th>)}</tr></thead><tbody>{[["سعودي",report.saudi,percent(report.saudi,report.total),"33 سنة","6.8","15,200"],["غير سعودي",report.other,percent(report.other,report.total),"36 سنة","5.1","10,800"]].map(row => <tr key={row[0]} className="border-t border-border">{row.map((v,i) => <td key={i} className="p-2">{v}{i===2?"%":""}</td>)}</tr>)}</tbody></table></div></section>
    </div></>}
    <p className="text-[9px] text-muted-foreground">بيانات توضيحية غير مرتبطة بسجلات الموظفين الفعلية</p>
  </main></AppShell>;
}
