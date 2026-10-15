import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Award, Check, ChevronLeft, Download, Eye, FilePlus2, Folder, List, Mail, Minus, MoreVertical, Plus, Printer, Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { letterValue as value, type IssuedAdminLetter, type LetterOrganizationSettings } from "./admin-letter-issued-data";
import css from "./admin-letter-issued.module.css";

export interface AdminLetterIssuedProps {
  letter?: IssuedAdminLetter;
  organizationSettings?: LetterOrganizationSettings;
  onEmail?: () => void;
  onShare?: () => void;
  onEmployeeProfile?: (employeeId: string) => void;
  onServiceCertificate?: () => void;
}
const noop = () => {};
const emptyLetter: IssuedAdminLetter = {};
const emptySettings: LetterOrganizationSettings = {};

function LetterPaper({ letter, settings }: { letter: IssuedAdminLetter; settings: LetterOrganizationSettings }) {
  return <article className={`${css["paper"]} bg-card text-card-foreground`} aria-label="مستند خطاب التعريف">
    <header className={`${css["paperHeader"]} border-letter-navy`}>
      <div className="flex max-w-[55%] items-center gap-3 text-3xl font-black text-letter-navy">
        {settings.logoUrl && <img src={settings.logoUrl} alt="شعار المنشأة" className="h-16 max-w-48 object-contain" />}
        <span className="break-words">{value(settings.name)}</span>
      </div>
      <div className="text-center text-[15px] leading-8"><p>{value(settings.country)}</p><p>{value(settings.hrDepartment)}</p><p>رقم الخطاب: <bdi>{value(letter.number)}</bdi></p><p>التاريخ: <bdi>{value(letter.issuedAt)}</bdi></p></div>
    </header>
    <h2 className="mt-10 text-center text-3xl font-extrabold text-letter-navy">{value(letter.type)}</h2>
    <div className={css["letterBody"]}>
      <p className="mb-5 font-bold">{value(letter.recipient)}</p>
      {letter.body ? <p className="whitespace-pre-wrap break-words">{letter.body}</p> : <>
        <p>نفيد بأن الأستاذ/ <b>{value(letter.employeeName)}</b></p>
        <p>يحمل الهوية الوطنية رقم (<bdi>{value(letter.nationalId)}</bdi>)</p>
        <p>يعمل لدينا في {value(settings.name)} منذ تاريخ <bdi>{value(letter.hireDate)}</bdi></p>
        <p>بمسمى: <b>{value(letter.jobTitle)}</b></p><p>في قسم: <b>{value(letter.department)}</b></p>
        <p className="mt-6">وقد تم إصدار هذا الخطاب بناءً على طلبه دون أدنى مسؤولية على المنشأة.</p>
      </>}
      <p className="mt-12 text-center">وتفضلوا بقبول فائق الاحترام ...</p>
    </div>
    <footer className={css["letterFooter"]}>
      <div className="text-center"><p>{value(settings.hrDepartment)}</p><p>{value(settings.name)}</p>
        <div className="mt-4 grid size-36 place-items-center rounded-full border-[3px] border-double border-letter-stamp p-3 text-base font-bold text-letter-stamp"><span className="grid size-full place-items-center rounded-full border border-letter-stamp/60">{value(settings.name)}</span></div>
      </div>
      <div className="text-center text-sm">{letter.qrImageUrl ? <img src={letter.qrImageUrl} alt="رمز التحقق من الخطاب" className="mx-auto size-24 object-contain" /> : <span className="grid size-24 place-items-center border border-border text-2xl">—</span>}<p className="mt-2">للتحقق من صحة الخطاب</p><p>امسح الباركود</p></div>
    </footer>
    <svg className={`${css["waves"]} text-muted`} viewBox="0 0 794 126" preserveAspectRatio="none" aria-hidden="true"><path fill="currentColor" d="M0 28 C250 -50 500 180 794 30 L794 126 L0 126Z" /><path className="text-border" fill="currentColor" d="M0 55 C220 -10 490 160 794 80 L794 126 L0 126Z" /></svg>
  </article>;
}

function ScaledPaper({ letter, settings, zoom = 100 }: { letter: IssuedAdminLetter; settings: LetterOrganizationSettings; zoom?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0]?.contentRect.width ?? 0));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const scale = width / 794 * zoom / 100;
  return <div ref={container} className={css["viewport"]}><div style={{ width: width * zoom / 100, height: 1123 * scale }}><div style={{ width: 794, transform: `scale(${scale})`, transformOrigin: "top left" }}><LetterPaper letter={letter} settings={settings} /></div></div></div>;
}

export function AdminLetterIssuedPage({ letter = emptyLetter, organizationSettings = emptySettings, onEmail = noop, onShare = noop, onEmployeeProfile, onServiceCertificate }: AdminLetterIssuedProps) {
  const [zoom, setZoom] = useState(100);
  const [preview, setPreview] = useState(false);
  const [pdf, setPdf] = useState<Blob>();
  const [error, setError] = useState("");
  const exportNode = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    const create = async () => {
      try {
        await document.fonts.ready;
        const node = exportNode.current;
        if (!node) return;
        await Promise.all(Array.from(node.querySelectorAll("img")).map(image => image.decode()));
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
        const canvas = await html2canvas(node, { scale: 1.5, useCORS: true, logging: false });
        const documentPdf = new jsPDF({ unit: "mm", format: "a4" });
        documentPdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297);
        if (!cancelled) setPdf(documentPdf.output("blob"));
      } catch { if (!cancelled) setError("تعذر تجهيز ملف PDF"); }
    };
    setPdf(undefined);
    setError("");
    void create();
    return () => { cancelled = true; };
  }, [letter, organizationSettings]);
  const download = () => {
    if (!pdf) return;
    const filename = `${letter.number?.replace(/[^\p{L}\p{N}_-]/gu, "_") || "letter"}.pdf`;
    const file = new File([pdf], filename, { type: "application/pdf" });
    if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
      void navigator.share({ files: [file] }).catch(() => {});
      return;
    }
    const url = URL.createObjectURL(pdf);
    const link = document.createElement("a"); link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };
  const fields = [["نوع الخطاب", letter.type], ["اسم الموظف", letter.employeeName], ["القسم", letter.department], ["رقم الخطاب", letter.number], ["تاريخ الإصدار", letter.issuedAt]];
  return <AppShell><main dir="rtl" data-issued-page className={css["page"]}>
    <nav aria-label="فتات التنقل" className="mb-5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground"><Link to="/">الرئيسية</Link><ChevronLeft size={12} /><span>الموارد البشرية</span><ChevronLeft size={12} /><Link to="/employees/letters">الخطابات وشهادات التعريف</Link><ChevronLeft size={12} /><Link to="/employees/admin-letter">إصدار خطاب تعريف</Link></nav>
    <div className={css["layout"]}>
      <section className={`${css["viewer"]} bg-card-foreground text-primary-foreground`} aria-label="عارض الخطاب">
        <div className={css["toolbar"]}><span className="text-xs"><span className="bg-foreground/30 px-2 py-1">1</span> / 1</span><span className="mx-1 h-5 w-px bg-border/30" /><Button size="icon" variant="ghost" title="تصغير" aria-label="تصغير" disabled={zoom <= 50} onClick={() => setZoom(z => z - 10)}><Minus /></Button><span className="w-12 bg-foreground/30 text-center text-xs">{zoom}%</span><Button size="icon" variant="ghost" title="تكبير" aria-label="تكبير" disabled={zoom >= 200} onClick={() => setZoom(z => z + 10)}><Plus /></Button><Button size="icon" variant="ghost" title="طباعة الخطاب" aria-label="طباعة الخطاب" onClick={() => window.print()}><Printer /></Button><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost" title="خيارات العارض" aria-label="خيارات العارض"><MoreVertical /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={() => setZoom(100)}>الحجم الأصلي</DropdownMenuItem><DropdownMenuItem disabled={!pdf} onSelect={download}>تحميل PDF</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>
        <ScaledPaper letter={letter} settings={organizationSettings} zoom={zoom} />
      </section>
      <section className={`${css["success"]} panel`}>
        <div className={css["celebration"]} aria-hidden="true"><span className={`${css["tick"]} bg-success text-primary-foreground`}><Check size={46} strokeWidth={3.5} /></span>{["bg-warning", "bg-chart-4", "bg-success", "bg-chart-4", "bg-warning", "bg-success", "bg-primary"].map((color, i) => <i key={i} className={`${css["confetti"]} ${color}`} />)}</div>
        <h1 className="text-2xl font-extrabold leading-relaxed text-letter-navy">تم إصدار خطاب التعريف بنجاح</h1>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">تم إصدار الخطاب وحفظه في ملف الموظف يمكنك تحميله أو مشاركته</p>
        <div className={`${css["summary"]} rounded-md bg-search`}><div><dl className={`${css["fields"]} text-letter-navy`}>{fields.map(([label, text]) => <div className="contents" key={label}><dt className="text-muted-foreground">{label}:</dt><dd><bdi>{value(text)}</bdi></dd></div>)}</dl><div className="mt-3 text-center"><span className="rounded-md bg-success-soft px-4 py-1 text-[11px] font-bold text-success">{letter.approved === true ? "معتمد" : "—"}</span></div></div><div className="overflow-hidden rounded-sm bg-card shadow-md" aria-hidden="true"><ScaledPaper letter={letter} settings={organizationSettings} /></div></div>
        <div className={css["actions"]}><Button className="bg-letter-navy text-primary-foreground hover:bg-letter-navy/90" disabled={!pdf} onClick={download}><Download />تحميل PDF</Button><Button variant="outline" className="border-letter-navy/40 text-letter-navy" onClick={() => window.print()}><Printer />طباعة</Button><Button variant="outline" className="border-letter-navy/40 text-letter-navy" onClick={onEmail}><Mail />إرسال بالبريد</Button><Button variant="outline" className="border-letter-navy/40 text-letter-navy" onClick={onShare}><Share2 />مشاركة الرابط</Button></div>
        <Button variant="outline" className="mt-2 h-10 w-full border-letter-navy/40 text-xs font-bold text-letter-navy" disabled={!letter.employeeId || !onEmployeeProfile} onClick={() => { if (letter.employeeId) onEmployeeProfile?.(letter.employeeId); }}><Folder />الانتقال إلى ملف الموظف</Button>
        <h2 className="mt-6 mb-2 text-right text-sm font-extrabold text-letter-navy">ماذا تريد أن تفعل الآن؟</h2>
        <div className={`${css["shortcuts"]} text-letter-navy`}><Button variant="outline" onClick={() => setPreview(true)}><Eye className="text-primary" />معاينة الخطاب</Button><Button asChild variant="outline"><Link to="/employees/letters"><List className="text-primary" />العودة إلى قائمة الخطابات</Link></Button><Button variant="outline" disabled={!onServiceCertificate} onClick={onServiceCertificate}><Award className="text-primary" />إصدار شهادة خدمة</Button><Button asChild variant="outline"><Link to="/employees/admin-letter"><FilePlus2 className="text-primary" />إصدار خطاب آخر</Link></Button></div>
        {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
      </section>
    </div>
    <p className="mt-3 text-[10px] text-muted-foreground">عرض تجريبي؛ لا يتم حفظ الخطاب أو إرساله فعليًا.</p>
    <div ref={exportNode} className={css["export"]} aria-hidden="true"><LetterPaper letter={letter} settings={organizationSettings} /></div>
    <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-h-[90vh] max-w-2xl overflow-auto" dir="rtl"><DialogHeader><DialogTitle>معاينة الخطاب</DialogTitle></DialogHeader><ScaledPaper letter={letter} settings={organizationSettings} /></DialogContent></Dialog>
  </main></AppShell>;
}