import { useEffect, useRef, useState } from "react";
import {
  CalendarDays, Check, ChevronDown, ChevronLeft, Clock3, Download, Eraser, FileText, Headphones, ListChecks, Mail, Maximize, Minus,
  MoreVertical, NotebookPen, Paperclip, PenLine, Plus, Printer, Send, Settings, Trash2, UploadCloud, Users, Database, Save, Sidebar,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contractDraft, contractPrograms, contractFiles } from "@/data/mockData";

const fmt = (n: number) => n.toLocaleString("en-US");
const box = "rounded-2xl border border-border bg-card p-4 shadow-sm";
const pIcon: Record<string, typeof Users> = { hr: Users, finance: Database, service: Headphones };
const pTone: Record<string, string> = { hr: "bg-buy-violet-soft text-buy-violet", finance: "bg-success-soft text-success", service: "bg-buy-violet-soft text-buy-violet" };
type Party = "us" | "client";
interface Saved { id: string; date: string; who: string }

function SignPad({ onDone }: { onDone: (url: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth * 2; c.height = c.offsetHeight * 2; ctx.scale(2, 2);
    ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.strokeStyle = getComputedStyle(c).color;
  }, []);
  const pos = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  return (
    <div>
      <canvas
        ref={ref}
        aria-label="لوحة التوقيع"
        className="h-44 w-full touch-none rounded-lg border-2 border-dashed border-primary/40 bg-background text-buy-navy"
        onPointerDown={(e) => { drawing.current = true; const ctx = ref.current!.getContext("2d")!; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(x, y); }}
        onPointerMove={(e) => { if (!drawing.current) return; const ctx = ref.current!.getContext("2d")!; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); setDirty(true); }}
        onPointerUp={() => { drawing.current = false; }}
        onPointerLeave={() => { drawing.current = false; }}
      />
      <div className="mt-3 grid grid-cols-[1.6fr_1fr] gap-2">
        <button disabled={!dirty} onClick={() => onDone(ref.current!.toDataURL())} className="flex items-center justify-center gap-2 rounded-md bg-buy-navy py-2.5 text-sm font-bold text-background disabled:opacity-50"><Check className="h-4 w-4" /> اعتماد التوقيع</button>
        <button onClick={() => { const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setDirty(false); }} className="flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-bold"><Eraser className="h-4 w-4" /> مسح</button>
      </div>
    </div>
  );
}

export function ContractIssue() {
  const [d, setD] = useState(contractDraft);
  const [progs, setProgs] = useState(contractPrograms);
  const [tpl, setTpl] = useState(0);
  const [files, setFiles] = useState(contractFiles);
  const [notes, setNotes] = useState("");
  const [zoom, setZoom] = useState(100);
  const [sig, setSig] = useState<Record<Party, string>>({ us: "", client: "" });
  const [open, setOpen] = useState(false);
  const [party, setParty] = useState<Party>("us");
  const [saved, setSaved] = useState<Saved[]>([]);
  const both = !!sig.us && !!sig.client;
  const status = both ? "تم التوقيع" : "بانتظار التوقيع";
  const flowStep = both ? 2 : 1;
  const today = "2026/10/06";
  const set = (k: keyof typeof d) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setD({ ...d, [k]: e.target.value });

  const approve = (url: string) => {
    const next = { ...sig, [party]: url };
    setSig(next);
    toast.success(party === "us" ? "تم توقيع الطرف الأول" : "تم توقيع العميل");
    if (next.us && next.client) {
      setSaved([{ id: "us", date: today, who: "نسختنا (تكامل بلس)" }, { id: "client", date: today, who: `نسخة العميل (${d.client})` }]);
      setOpen(false);
      toast.success("تم حفظ العقد الموقّع إلكترونياً لدينا ولدى العميل (عرض توضيحي)");
    } else setParty(party === "us" ? "client" : "us");
  };

  const steps = ["بيانات العميل", "اختيار البرامج", "إصدار العقد", "التوقيع الإلكتروني", "تفعيل الحساب"];
  const curStep = both ? 4 : 2;
  const total = progs.reduce((s, p) => s + p.price, 0);

  return (
    <AppShell>
      <div className="contract-page space-y-4 p-3 sm:p-5" dir="rtl">
        <div className="no-print flex items-center gap-2 text-sm"><span className="font-bold text-primary">إصدار العقد</span><ChevronLeft className="h-4 w-4" /><span>{d.id}</span><ChevronLeft className="h-4 w-4" /><span className="text-muted-foreground">إصدار العقد</span></div>

        <div className="no-print rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
          <div className="flex items-start">
            {steps.map((s, i) => (
              <div key={s} className="relative flex flex-1 flex-col items-center">
                {i < steps.length - 1 && <span className={`absolute right-1/2 top-4 h-0.5 w-full ${i < curStep ? "bg-primary" : "bg-border"}`} />}
                <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 text-sm font-bold ${i < curStep ? "border-primary bg-primary text-background" : i === curStep ? "border-primary bg-primary text-background ring-4 ring-primary-soft" : "border-muted-foreground/40 bg-background text-muted-foreground"}`}>{i < curStep ? <Check className="h-4 w-4" /> : i + 1}</span>
                <span className={`mt-1.5 text-center text-[11px] sm:text-sm ${i === curStep ? "font-bold text-primary" : "text-muted-foreground"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.75fr)_minmax(260px,0.8fr)]">
          {/* data column */}
          <div className="no-print space-y-4">
            <section className={box}>
              <h2 className="mb-3 text-xl font-extrabold">بيانات العقد</h2>
              <div className="space-y-2">
                {([["رقم الطلب", "id"], ["اسم الجهة / العميل", "client"], ["نوع المنشأة", "orgType"], ["السجل التجاري / رقم الهوية", "cr"], ["العنوان", "address"], ["البريد الإلكتروني", "email"], ["الجوال", "phone"]] as const).map(([l, k]) => (
                  <label key={k} className="grid grid-cols-[minmax(110px,0.8fr)_1.2fr] items-center gap-2 text-sm">
                    <span className="text-foreground">{l}</span>
                    <input value={d[k]} onChange={set(k)} readOnly={k === "id"} className="h-9 rounded-md border border-border bg-muted/30 px-3 text-sm outline-none focus:border-primary" />
                  </label>
                ))}
              </div>
            </section>
            <section className={box}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-extrabold"><ListChecks className="h-5 w-5 text-buy-navy" /> البرامج المشتراة</h2>
                <button onClick={() => { setProgs(progs.length === 3 ? contractPrograms.slice(0, 2) : contractPrograms); toast("تم تعديل البرامج"); }} className="rounded-md border border-primary px-6 py-1 text-xs font-bold text-primary">تعديل البرامج</button>
              </div>
              <div className="space-y-2">
                {progs.map((p) => { const I = pIcon[p.id]!; return (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                    <span className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-lg ${pTone[p.id]}`}><I className="h-5 w-5" /></span>{p.name}</span>
                    <span className="font-extrabold">{fmt(p.price)} ريال</span>
                  </div>
                ); })}
              </div>
            </section>
            <section className={box}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><CalendarDays className="h-5 w-5 text-buy-navy" /> مدة العقد</h2>
              <div className="space-y-2 text-sm">
                {([["تاريخ بداية العقد", "start"], ["تاريخ نهاية العقد", "end"]] as const).map(([l, k]) => (
                  <label key={k} className="grid grid-cols-[1fr_1.2fr] items-center gap-2"><span>{l}</span><input value={d[k]} onChange={set(k)} className="h-9 rounded-md border border-border bg-muted/30 px-3 outline-none" /></label>
                ))}
                <label className="grid grid-cols-[1fr_1.2fr] items-center gap-2"><span>مدة العقد</span>
                  <span className="relative"><select value={d.duration} onChange={set("duration")} className="h-9 w-full appearance-none rounded-md border border-border bg-muted/30 px-3 outline-none">{["سنة واحدة", "سنتان", "ثلاث سنوات"].map((x) => <option key={x}>{x}</option>)}</select><ChevronDown className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" /></span>
                </label>
              </div>
            </section>
            <section className={box}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><NotebookPen className="h-5 w-5 text-buy-navy" /> ملاحظات إضافية</h2>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="اكتب أي ملاحظات ..." className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none" />
            </section>
          </div>

          {/* contract preview */}
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="no-print flex items-center justify-between gap-2 bg-foreground/80 px-3 py-2 text-background" dir="ltr">
              <div className="flex items-center gap-3"><Sidebar className="h-4 w-4" /><FileText className="h-4 w-4" /><Maximize className="h-4 w-4" /></div>
              <div className="flex items-center gap-3 text-sm">
                <button aria-label="تصغير" onClick={() => setZoom((z) => Math.max(60, z - 10))}><Minus className="h-4 w-4" /></button><span>{zoom}%</span>
                <button aria-label="تكبير" onClick={() => setZoom((z) => Math.min(140, z + 10))}><Plus className="h-4 w-4" /></button>
                <span className="hidden items-center gap-2 sm:flex"><span className="rounded bg-background/20 px-3">1 /</span> 1</span>
              </div>
              <div className="flex items-center gap-3"><button aria-label="تنزيل" onClick={() => window.print()}><Download className="h-4 w-4" /></button><button aria-label="طباعة" onClick={() => window.print()}><Printer className="h-4 w-4" /></button><MoreVertical className="h-4 w-4" /></div>
            </div>
            <div className="max-h-[1100px] overflow-auto bg-muted/40 p-2 sm:p-3">
              <article className="contract-sheet mx-auto origin-top bg-background px-4 py-5 text-[12px] leading-6 text-foreground shadow sm:px-6" style={{ zoom: zoom / 100 }}>
                <header className="relative -mx-4 -mt-5 mb-4 overflow-hidden px-4 pb-3 pt-5 sm:-mx-6 sm:px-6">
                  <div className="absolute -left-10 -top-6 h-16 w-2/3 -rotate-6 rounded-full bg-buy-navy" />
                  <div className="absolute -left-10 top-8 h-1.5 w-2/3 -rotate-6 rounded-full bg-buy-gold" />
                  <div className="relative flex items-center gap-2">
                    <div className="flex items-end gap-0.5"><span className="h-4 w-1.5 rounded bg-buy-gold" /><span className="h-6 w-1.5 rounded bg-buy-gold" /><span className="h-8 w-1.5 rounded bg-buy-gold" /></div>
                    <div><div className="text-2xl font-extrabold text-buy-navy">تكامل <span className="text-buy-gold">بلس</span></div><div className="text-[8px] text-muted-foreground">إدارة الموارد البشرية والمالية وخدمة العملاء</div></div>
                  </div>
                </header>
                <h1 className="text-center text-lg font-extrabold text-buy-navy">عقد اشتراك واستخدام نظام تكامل بلس{tpl === 1 ? " (مع شروط إضافية)" : tpl === 2 ? " (قالب مخصص)" : ""}</h1>
                <div className="mt-2 text-xs"><div>رقم العقد: <b dir="ltr">{d.id}</b></div><div>تاريخ العقد: {d.start}</div></div>
                <p className="mt-2">إنه في يوم الإثنين الموافق {d.start}م تم الاتفاق بين كل من:</p>
                <p><b>الطرف الأول: مؤسسة تكامل بلس للأنظمة التقنية</b> (ويشار إليها فيما بعد بـ "المزود")</p>
                <p><b>الطرف الثاني: {d.client}</b> — {d.orgType}، سجل رقم {d.cr}، {d.address} (ويشار إليها فيما بعد بـ "العميل")</p>
                <p>وبناءً على رغبة الطرف الثاني في الاشتراك واستخدام نظام <b>تكامل بلس</b> لإدارة الموارد البشرية والشؤون المالية وخدمة العملاء، فقد تم الاتفاق على ما يلي:</p>
                {[
                  ["المادة (1) : موضوع العقد", <p key="a">يقدم المزود للعميل اشتراكاً في نظام <b>تكامل بلس</b> والذي يشمل البرامج المحددة في هذا العقد مع جميع المزايا والخدمات المتفق عليها.</p>],
                  ["المادة (2) : البرامج المشمولة", (
                    <table key="b" className="w-full border-collapse text-center text-[11px]">
                      <thead><tr className="bg-muted/50">{["م", "البرنامج", "السعر (ريال)", "الملاحظات"].map((h) => <th key={h} className="border border-border py-1">{h}</th>)}</tr></thead>
                      <tbody>{progs.map((p, i) => <tr key={p.id}><td className="border border-border py-1">{i + 1}</td><td className="border border-border">{p.short}</td><td className="border border-border font-bold">{fmt(p.price)}</td><td className="border border-border">وفق المواصفات المتفق عليها</td></tr>)}
                        <tr className="font-bold"><td colSpan={2} className="border border-border py-1">الإجمالي</td><td className="border border-border">{fmt(total)}</td><td className="border border-border" /></tr></tbody>
                    </table>
                  )],
                  ["المادة (3) : مدة العقد", <p key="c">مدة هذا العقد {d.duration} تبدأ من تاريخ {d.start}م وتنتهي بتاريخ {d.end}م. قابلة للتجديد بموافقة الطرفين.</p>],
                  ["المادة (4) : الالتزامات", (
                    <ol key="d" className="list-decimal pr-5">
                      <li>يلتزم المزود بتوفير النظام والخدمات وفق المواصفات المتفق عليها.</li>
                      <li>يلتزم العميل باستخدام النظام وفق شروط الاستخدام وعدم إساءة استعماله.</li>
                      <li>يلتزم الطرفان بسرية المعلومات والبيانات وفق الأنظمة المعمول بها.</li>
                      {tpl === 1 && <li>يحق للعميل الحصول على دعم فني مجاني لمدة ثلاثة أشهر من تاريخ التفعيل.</li>}
                    </ol>
                  )],
                ].map(([t, body]) => (
                  <section key={t as string} className="mt-3">
                    <h3 className="mb-1 rounded bg-primary-soft px-3 py-1 text-[13px] font-extrabold text-buy-navy">{t as string}</h3>
                    {body as React.ReactNode}
                  </section>
                ))}
                {notes && <p className="mt-2 text-muted-foreground">ملاحظات: {notes}</p>}
                <div className="mt-6 grid grid-cols-2 gap-6 text-center">
                  {(["us", "client"] as Party[]).map((p) => (
                    <div key={p}>
                      <div className="font-extrabold">{p === "us" ? "الطرف الأول" : "الطرف الثاني"}</div>
                      <div className="font-bold">{p === "us" ? "مؤسسة تكامل بلس للأنظمة التقنية" : d.client}</div>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div><div className="flex h-12 items-end justify-center border-b border-foreground/60">{sig[p] && <img src={sig[p]} alt="التوقيع" className="max-h-12" />}</div><div className="mt-1">التوقيع</div></div>
                        <div><div className="flex h-12 items-end justify-center border-b border-foreground/60 text-[11px]">{sig[p] && today}</div><div className="mt-1">التاريخ</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          {/* options column */}
          <div className="no-print space-y-4">
            <section className={box}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><FileText className="h-5 w-5 text-buy-navy" /> خيارات العقد</h2>
              <div className="space-y-2">
                {["القالب الأساسي", "قالب مع شروط إضافية", "قالب مخصص"].map((t, i) => (
                  <button key={t} onClick={() => setTpl(i)} className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm ${tpl === i ? "border-primary/40 bg-primary-soft font-bold text-primary" : "border-border"}`}>
                    {t}<span className={`h-4 w-4 rounded-full border-2 ${tpl === i ? "border-primary ring-2 ring-inset ring-background bg-primary" : "border-muted-foreground/50"}`} />
                  </button>
                ))}
                <button onClick={() => toast("معاينة القالب ظاهرة في العقد")} className="w-full rounded-lg border border-primary py-2 text-sm font-bold text-primary">معاينة القالب</button>
              </div>
            </section>
            <section className={box}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Paperclip className="h-5 w-5 text-buy-navy" /> مرفقات العقد</h2>
              <label className="flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-primary/50 p-4 text-center">
                <UploadCloud className="h-8 w-8 text-primary" />
                <span className="mt-1 font-bold text-primary">إضافة مرفقات (اختياري)</span>
                <span className="text-xs text-muted-foreground">PDF, JPG, PNG</span>
                <span className="mt-2 rounded-md border border-primary px-6 py-1 text-sm font-bold text-primary">رفع الملفات</span>
                <input type="file" multiple className="sr-only" onChange={(e) => { const f = Array.from(e.target.files ?? []).map((x) => ({ name: x.name, size: `${Math.max(1, Math.round(x.size / 1024))} KB` })); setFiles((p) => [...p, ...f]); }} />
              </label>
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li key={f.name + i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span><span className="block">{f.name}</span><span className="text-[10px] text-muted-foreground">{f.size}</span></span>
                    <button aria-label="حذف" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></button>
                  </li>
                ))}
              </ul>
            </section>
            <section className={box}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Settings className="h-5 w-5 text-buy-navy" /> إجراءات العقد</h2>
              <div className="space-y-2">
                <button onClick={() => { setParty(sig.us ? "client" : "us"); setOpen(true); }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-background"><Send className="h-4 w-4" /> إرسال العقد للتوقيع الإلكتروني</button>
                <button onClick={() => window.print()} className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-sm font-bold text-primary"><Download className="h-4 w-4" /> تحميل العقد PDF</button>
                <button onClick={() => toast.success(`تم إرسال نسخة إلى ${d.email} (عرض توضيحي)`)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary py-2.5 text-sm font-bold text-primary"><Mail className="h-4 w-4" /> إرسال نسخة للعميل</button>
              </div>
            </section>
            <section className={box}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-extrabold"><Clock3 className="h-5 w-5 text-buy-navy" /> حالة العقد</h2>
                <span className={`rounded-md px-4 py-1 text-xs font-bold ${both ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{status}</span>
              </div>
              <div className="flex items-start">
                {["إصدار العقد", "التوقيع", "التفعيل", "مكتمل"].map((s, i) => (
                  <div key={s} className="relative flex flex-1 flex-col items-center">
                    {i < 3 && <span className={`absolute right-1/2 top-3.5 h-0.5 w-full ${i < flowStep ? "bg-primary" : "bg-border"}`} />}
                    <span className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${i < flowStep ? "border-primary bg-primary text-background" : "border-muted-foreground/40 bg-background text-muted-foreground"}`}>{i < flowStep ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                    <span className="mt-1 text-[11px] text-muted-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </section>
            {saved.length > 0 && (
              <section className={box}>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold"><Save className="h-5 w-5 text-buy-navy" /> العقود المحفوظة</h2>
                <ul className="space-y-2">
                  {saved.map((s) => (
                    <li key={s.id} className="rounded-lg border border-border p-3 text-sm">
                      <div className="flex items-center justify-between"><b>{s.who}</b><span className="rounded bg-success-soft px-2 text-[11px] font-bold text-success">موقّع</span></div>
                      <div className="text-xs text-muted-foreground"><span dir="ltr">{d.id}</span> — {s.date}</div>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => window.print()} className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs"><Download className="h-3.5 w-3.5" /> تحميل</button>
                        <button onClick={() => window.print()} className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs"><Printer className="h-3.5 w-3.5" /> طباعة</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent dir="rtl" className="max-w-lg">
            <DialogHeader><DialogTitle className="flex items-center gap-2 text-right"><PenLine className="h-5 w-5" /> التوقيع الإلكتروني على العقد</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-2">
              {(["us", "client"] as Party[]).map((p) => (
                <button key={p} onClick={() => setParty(p)} className={`flex items-center justify-center gap-2 rounded-lg border py-2 text-sm font-bold ${party === p ? "border-buy-navy bg-buy-navy text-background" : "border-border"}`}>
                  {sig[p] && <Check className="h-4 w-4" />}{p === "us" ? "الطرف الأول (نحن)" : "الطرف الثاني (العميل)"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">ارسم توقيعك داخل المربع بالماوس أو بإصبعك. (عرض توضيحي — ليس توقيعاً قانونياً موثقاً)</p>
            <SignPad key={party} onDone={approve} />
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
