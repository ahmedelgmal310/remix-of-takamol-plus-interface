import { useState } from "react";
import { CalendarDays, ChevronDown, Clock, Frown, Headset, Meh, MessageSquareText, Reply, Smile, Star, Users, UsersRound, MessagesSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import ahmed from "@/assets/candidate-ahmed.jpg";
import sara from "@/assets/candidate-sara.jpg";
import khaled from "@/assets/candidate-khaled.jpg";
import noura from "@/assets/candidate-noura.jpg";
import saud from "@/assets/member-saud.jpg";
import reem from "@/assets/candidate-reem.jpg";

const staff = [
  { n: "أحمد محمد", img: ahmed, in: 312, out: 306, sp: 1.8, r: 4.8, sat: 96, note: "أداء ممتاز" },
  { n: "سارة خالد", img: sara, in: 268, out: 261, sp: 2.3, r: 4.6, sat: 92, note: "ممتاز" },
  { n: "محمد علي", img: saud, in: 214, out: 203, sp: 3.1, r: 4.5, sat: 88, note: "جيد جداً" },
  { n: "نورة عبدالله", img: noura, in: 176, out: 169, sp: 2.7, r: 4.3, sat: 84, note: "جيد" },
  { n: "خالد فهد", img: khaled, in: 142, out: 136, sp: 3.5, r: 4.2, sat: 80, note: "يحتاج إلى تحسين" },
  { n: "ريم أحمد", img: reem, in: 121, out: 110, sp: 4.2, r: 4.1, sat: 75, note: "يحتاج إلى دعم" },
];
const periods = {
  a: { label: "من 2025/09/01 إلى 2025/09/21", k: [1248, 1201, 2.8, 4.6], d: [12, 15, -32, 8], f: 1 },
  b: { label: "من 2025/08/01 إلى 2025/08/31", k: [1690, 1602, 3.4, 4.4], d: [6, 5, -12, 3], f: 1.35 },
  c: { label: "من 2025/07/01 إلى 2025/07/31", k: [1512, 1431, 3.9, 4.3], d: [-4, -2, 9, -1], f: 1.21 },
};
const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const w7 = [5.5, 4, 3.8, 2.7, 2.2, 3, 2.6, 2.9];
const w30 = [6.2, 5.1, 4.4, 3.9, 3.1, 2.8, 2.5, 2.3];
const channels = [["واتساب", 55, "var(--primary)"], ["المحادثة المباشرة", 20, "var(--success)"], ["البريد الإلكتروني", 15, "oklch(0.68 0.16 295)"], ["الهاتف", 10, "var(--warning)"]] as const;

function Stars({ v }: { v: number }) {
  return <span className="flex gap-0.5" dir="ltr">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} className={i <= Math.round(v) ? "fill-warning text-warning" : "fill-muted text-muted"} />)}</span>;
}
const Face = ({ s }: { s: number }) => s >= 84 ? <Smile size={16} className="text-success" /> : s >= 75 ? <Meh size={16} className="text-warning" /> : <Frown size={16} className="text-destructive" />;

export function CustomerServiceDashboard() {
  const [p, setP] = useState<keyof typeof periods>("a");
  const [range, setRange] = useState<"7" | "30">("7");
  const P = periods[p];
  const cards = [
    [MessageSquareText, "إجمالي الرسائل الواردة", P.k[0]!.toLocaleString("en-US"), P.d[0]!, "bg-primary/10 text-primary", false],
    [Reply, "إجمالي الردود", P.k[1]!.toLocaleString("en-US"), P.d[1]!, "bg-success-soft text-success", false],
    [Clock, "متوسط سرعة الرد", `${P.k[2]} دقيقة`, P.d[2]!, "bg-primary/10 text-primary", true],
    [Star, "متوسط تقييم العملاء", `${P.k[3]} / 5`, P.d[3]!, "bg-warning-soft text-warning", false],
    [UsersRound, "إجمالي الموظفين", "6", 0, "bg-primary/10 text-primary", false],
  ] as const;
  const pts = range === "7" ? w7 : w30;
  const W = 480, H = 140, x = (i: number) => (i / (pts.length - 1)) * W, y = (v: number) => H - (v / 8) * H;
  const line = pts.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  let acc = 0;
  const R = 55, C = 2 * Math.PI * R;
  const total = P.k[1]!;

  return <AppShell>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3"><Headset className="size-10 text-brand-deep" /><div><h1 className="text-3xl font-extrabold text-brand-deep">خدمة العملاء</h1><p className="text-sm text-muted-foreground">متابعة الرد على العملاء - احصائيات كل موظف</p></div></div>
      <div className="relative"><CalendarDays size={16} className="pointer-events-none absolute right-3 top-3.5 text-muted-foreground" /><select value={p} onChange={e => setP(e.target.value as keyof typeof periods)} className="h-11 appearance-none rounded-md border border-border bg-card pr-9 pl-9 text-sm">{Object.entries(periods).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute left-3 top-3.5" /></div>
    </div>

    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([I, t, v, d, c, inv]) => { const good = inv ? d < 0 : d > 0; return <div key={t} className="panel p-4"><div className="flex items-start justify-between"><div><b className="block text-2xl text-brand-deep">{v}</b><p className="mt-1 text-sm">{t}</p></div><span className={`grid size-12 place-items-center rounded-lg ${c}`}><I size={24} /></span></div><div className="mt-4 flex items-center justify-between text-xs"><span className="text-muted-foreground">مقارنة بالفترة السابقة</span><b className={d === 0 ? "text-muted-foreground" : good ? "text-success" : "text-destructive"} dir="ltr">{d > 0 ? "↑" : d < 0 ? "↓" : ""} {Math.abs(d)}%</b></div></div>; })}</div>

    <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_1fr_1.1fr]">
      <section className="panel p-4"><h2 className="mb-3 flex items-center gap-2 font-extrabold text-brand-deep"><Star className="size-5 text-warning" />تقييم الموظفين</h2><div className="grid gap-3">{[...staff].sort((a, b) => b.r - a.r).map(s => <div key={s.n} className="flex items-center justify-between text-sm"><span>{s.n}</span><div className="flex items-center gap-3"><Stars v={s.r} /><b className="w-7 text-left">{s.r}</b></div></div>)}</div></section>
      <section className="panel p-4"><h2 className="mb-3 flex items-center gap-2 font-extrabold text-brand-deep"><MessagesSquare className="size-5" />توزيع الردود حسب القنوات</h2>
        <div className="flex items-center justify-between gap-3"><div className="grid gap-4 text-sm">{channels.map(([n, v, c]) => <div key={n} className="flex items-center gap-3"><span className="size-3 rounded-full" style={{ background: c }} /><span className="w-32">{n}</span><span className="text-muted-foreground">{v}%</span></div>)}</div>
          <svg viewBox="0 0 140 140" className="size-36 shrink-0 -rotate-90">{channels.map(([n, v, c]) => { const el = <circle key={n} cx="70" cy="70" r={R} fill="none" stroke={c} strokeWidth="22" strokeDasharray={`${(v / 100) * C} ${C}`} strokeDashoffset={-acc} />; acc += (v / 100) * C; return el; })}<g className="rotate-90 origin-center"><text x="70" y="70" textAnchor="middle" className="fill-brand-deep text-[20px] font-extrabold">{total.toLocaleString("en-US")}</text><text x="70" y="90" textAnchor="middle" className="fill-foreground text-[11px]">رد</text></g></svg></div>
      </section>
      <section className="panel p-4"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-extrabold text-brand-deep"><Clock className="size-5" />متوسط سرعة الرد</h2><div className="relative"><select value={range} onChange={e => setRange(e.target.value as "7" | "30")} className="h-9 appearance-none rounded-md border border-border bg-card pr-3 pl-8 text-xs"><option value="7">آخر 7 أيام</option><option value="30">آخر 30 يوم</option></select><ChevronDown size={14} className="pointer-events-none absolute left-2 top-2.5" /></div></div>
        <div className="flex gap-2"><div className="flex h-[150px] flex-col justify-between text-[10px] text-muted-foreground">{[8, 6, 4, 2, 0].map(n => <span key={n}>{n}</span>)}</div>
          <svg viewBox={`0 -5 ${W} ${H + 10}`} className="h-[150px] flex-1" preserveAspectRatio="none" style={{ transform: "scaleX(-1)" }}>{[0, 2, 4, 6, 8].map(n => <line key={n} x1="0" x2={W} y1={y(n)} y2={y(n)} className="stroke-border" strokeDasharray="3 3" />)}<path d={`${line} L${W},${H} L0,${H} Z`} className="fill-primary/10" /><path d={line} fill="none" className="stroke-primary" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />{pts.slice(0, 7).map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="4" className="fill-primary" />)}</svg></div>
        <div className="mr-4 flex justify-between text-[10px] text-muted-foreground">{days.map(d => <span key={d}>{d}</span>)}</div>
      </section>
    </div>

    <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_270px]">
      <section className="panel min-w-0 p-4"><h2 className="mb-3 flex items-center gap-2 font-extrabold text-brand-deep"><Users className="size-5" />احصائيات كل موظف</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-search text-xs"><tr>{["الموظف", "عدد الرسائل الواردة", "عدد الردود", "متوسط سرعة الرد", "التقييم", "نسبة رضا العملاء", "ملاحظات المدير"].map(h => <th key={h} className="p-3 text-right font-bold">{h}</th>)}</tr></thead>
          <tbody>{staff.map(s => <tr key={s.n} className="border-b border-border"><td className="p-2"><div className="flex items-center gap-2"><img src={s.img} alt={s.n} className="size-8 rounded-full object-cover" /><b>{s.n}</b></div></td><td className="p-2">{Math.round(s.in * P.f)}</td><td className="p-2">{Math.round(s.out * P.f)}</td><td className="p-2">{s.sp} دقيقة</td><td className="p-2"><div className="flex items-center gap-2"><Stars v={s.r} /><span className="text-xs text-warning">{s.r}</span></div></td><td className="p-2"><span className="flex items-center gap-2"><Face s={s.sat} />{s.sat}%</span></td><td className="p-2 text-xs">{s.note}</td></tr>)}</tbody></table></div>
      </section>
      <section className="panel relative grid place-items-center overflow-hidden p-6 text-center"><div><span className="mx-auto grid size-20 place-items-center rounded-full border-4 border-primary/20 text-primary"><Headset size={40} /></span><b className="mt-4 block text-xl text-brand-deep">معاً .. نرتقي بتجربة عملائنا</b><p className="mt-2 text-sm text-muted-foreground">متابعة دقيقة .. استجابة أسرع .. رضا أعلى</p></div><div className="absolute inset-x-0 bottom-0 h-20 rounded-t-[100%] bg-primary/10" /></section>
    </div>
  </AppShell>;
}
