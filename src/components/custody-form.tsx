import { FileText, Printer, X } from "lucide-react";
import { Logo, Qr } from "@/components/financial-letter";

export type CustodyFormData = { no: string; date: string; emp: string; dept: string; asset: string; qty: number };

const ahmedItems = [
  ["لابتوب", "Dell Latitude 5440", "DL5440-784521", 1, "جيدة", "مع الشاحن والشنطة"],
  ["شاشة", 'Dell 27"', "MN27-993221", 1, "جديدة", "-"],
  ["ماوس لاسلكي", "Logitech M330", "LG-M330-2211", 1, "جيدة", "-"],
  ["لوحة مفاتيح", "Logitech K270", "LG-K270-5500", 1, "جيدة", "-"],
  ["سماعة رأس", "Jabra Evolve 20", "JB-20-7788", 1, "جيدة", "-"],
] as const;
const terms = ["أقر بأنني استلمت جميع الأصناف المذكورة أعلاه بحالة سليمة وجيدة.", "أتحمل المسؤولية الكاملة عن المحافظة على العهدة واستخدامها لأغراض العمل فقط.", "ألتزم بإعادة العهدة عند انتهاء الحاجة إليها أو عند انتهاء خدمتي في الشركة.", "في حال فقدان أو تلف أي من الأصناف، أتحمل مسؤولية ذلك وفقاً لأنظمة الشركة."];

function Bars({ code }: { code: string }) {
  const bars = Array.from({ length: 60 }, (_, i) => ((code.charCodeAt(i % code.length) * (i + 3)) % 3) + 1);
  return <div className="text-center"><div className="flex h-12 items-stretch gap-[1.5px]">{bars.map((w, i) => <span key={i} className="bg-foreground" style={{ width: w }} />)}</div><b className="text-sm" dir="ltr">{code}</b></div>;
}

export function CustodyForm({ d }: { d: CustodyFormData }) {
  const isAhmed = d.emp.includes("السبيعي");
  const items = isAhmed ? ahmedItems : [[d.asset, "-", `SN-${d.no.slice(-4)}`, d.qty, "جيدة", "-"] as const];
  const info = [["اسم الموظف", isAhmed ? "أحمد محمد السبيعي" : d.emp, "المنصب", isAhmed ? "أخصائي دعم فني" : "موظف"], ["الرقم الوظيفي", isAhmed ? "EMP-00125" : "EMP-00" + (100 + d.emp.length), "الإدارة", isAhmed ? "الإدارة التقنية" : d.dept], ["القسم", d.dept, "موقع العمل", "الرياض"]];
  return <article id="custody-form" dir="rtl" className="mx-auto w-full max-w-[860px] bg-card px-8 py-7 text-foreground">
    <div className="flex items-start justify-between gap-4"><div className="space-y-1 text-sm"><b className="block text-lg text-letter-navy">شركة تكامل بلس</b><p>المملكة العربية السعودية - الرياض</p><p>سجل تجاري: 1010965401</p></div><Logo /></div>
    <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-6">
      <dl className="grid grid-cols-[auto_auto_auto] gap-x-3 gap-y-2 rounded-md bg-search px-4 py-3 text-sm"><dt>رقم العهدة</dt><span>:</span><dd>{d.no}</dd><dt>تاريخ التسليم</dt><span>:</span><dd>{d.date}</dd><dt>الرقم المرجعي</dt><span>:</span><dd>من النظام</dd></dl>
      <div className="text-center"><h1 className="text-3xl font-extrabold text-letter-navy">نموذج تسليم عهدة</h1><p className="mt-2 text-lg text-muted-foreground">إقرار واستلام عهدة من ممتلكات الشركة</p></div>
      <Bars code={d.no} />
    </div>
    <section className="mt-6 overflow-hidden rounded-md border border-border"><h2 className="bg-search px-4 py-2.5 font-extrabold text-letter-navy">بيانات الموظف</h2>
      {info.map(r => <div key={r[0]} className="grid grid-cols-2 border-t border-border text-sm">{[0, 2].map(k => <div key={k} className="grid grid-cols-[110px_20px_1fr] px-4 py-2.5 odd:border-l odd:border-border"><span>{r[k]}</span><span>:</span><span>{r[k + 1]}</span></div>)}</div>)}
    </section>
    <section className="mt-5 overflow-hidden rounded-md border border-border"><h2 className="bg-letter-navy px-4 py-2.5 font-extrabold text-primary-foreground">تفاصيل العهدة المسلمة</h2>
      <table className="w-full text-sm"><thead className="bg-search"><tr>{["#", "الصنف", "الماركة / الموديل", "الرقم التسلسلي", "الكمية", "الحالة", "ملاحظات"].map(h => <th key={h} className="border-l border-border p-2.5 last:border-0">{h}</th>)}</tr></thead>
        <tbody>{items.map((r, i) => <tr key={i} className="border-t border-border text-center">{[i + 1, ...r].map((c, j) => <td key={j} className="border-l border-border p-2.5 last:border-0">{j === 5 ? <span className={`inline-block rounded px-6 py-0.5 text-xs font-bold ${c === "جديدة" ? "bg-primary/10 text-primary" : "bg-success-soft text-success"}`}>{c}</span> : c}</td>)}</tr>)}</tbody></table>
    </section>
    <section className="mt-5 rounded-md border border-border bg-search/50 px-5 py-4"><h2 className="mb-2 flex items-center gap-2 font-extrabold text-letter-navy"><FileText size={22} />شروط وأحكام</h2><ol className="list-decimal space-y-1 pr-6 text-sm">{terms.map(t => <li key={t}>{t}</li>)}</ol></section>
    <div className="mt-5 grid grid-cols-3 gap-3">{["الموظف المستلم", "مسؤول القسم", "إدارة الموارد البشرية"].map(t => <div key={t} className="overflow-hidden rounded-md border border-border"><h3 className="bg-letter-navy py-2.5 text-center font-bold text-primary-foreground">{t}</h3><div className="space-y-4 px-4 py-4 text-sm">{["الاسم", "التوقيع", "التاريخ"].map(k => <p key={k} className="grid grid-cols-[55px_12px_1fr] items-end"><span>{k}</span><span>:</span><span className="border-b border-dotted border-foreground" /></p>)}</div></div>)}</div>
    <div className="mt-6 flex items-end justify-between text-xs text-muted-foreground"><div className="space-y-2"><p>صفحة 1 من 1</p><p>تاريخ الطباعة : {d.date} 10:45 ص</p></div><p className="text-sm">معاً .. نحو إدارة أكثر كفاءة</p><div className="flex items-center gap-3"><div className="space-y-1"><p>للتحقق من صحة المستند</p><p>يرجى مسح رمز QR</p></div><div className="w-16"><Qr /></div></div></div>
  </article>;
}

export function CustodyFormModal({ d, onClose }: { d: CustodyFormData; onClose: () => void }) {
  return <div className="custody-print-root fixed inset-0 z-50 overflow-auto bg-foreground/50 p-4" onClick={onClose}>
    <div className="mx-auto max-w-[880px]" onClick={e => e.stopPropagation()}>
      <div className="mb-2 flex justify-between print:hidden"><button onClick={() => window.print()} className="flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground"><Printer size={18} />طباعة النموذج</button><button onClick={onClose} className="grid size-10 place-items-center rounded-md bg-card"><X /></button></div>
      <div className="rounded-lg shadow-xl"><CustodyForm d={d} /></div>
    </div>
  </div>;
}
