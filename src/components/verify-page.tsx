import { useState, type ReactNode, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarIcon, Check, Clock3, Download, FileText, Globe, IdCard, LoaderCircle, LockKeyhole, Printer, RefreshCw, Search, ShieldCheck, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { displayVerifyValue as value, validVerifyInput, type VerifyHandler, type VerifyOrganization, type VerifyResult, type VerifiedCertificate } from "./verify-data";
import hero from "@/assets/verify-document-banner.jpg";
import s from "./verify-page.module.css";

export interface VerifyPageProps {
  organizationSettings?: VerifyOrganization;
  onVerify?: VerifyHandler;
  exampleCertificate?: VerifiedCertificate;
  renderCaptcha?: (onVerified: (verified: boolean) => void) => ReactNode;
}
function OrganizationBrand({ settings, paper = false }: { settings: VerifyOrganization; paper?: boolean }) {
  return <div className={paper ? s["paperBrand"] : s["brand"]}>{settings.logoUrl ? <img src={settings.logoUrl} alt={value(settings.name)} /> : <span>{value(settings.name)}</span>}</div>;
}
function CertificatePreview({ settings, certificate = {} }: { settings: VerifyOrganization; certificate?: VerifiedCertificate }) {
  const rows = [["رقم الموظف", certificate.employeeId], ["رقم الهوية", certificate.nationalId], ["الإدارة", certificate.department], ["تاريخ المباشرة", certificate.hireDate], ["تاريخ الإصدار", certificate.issuedOn]];
  return <article className={s["paper"]} aria-label="معاينة شهادة التعريف"><OrganizationBrand settings={settings} paper /><h3>شهادة تعريف</h3><p>{certificate.body ? certificate.body : <>تشهد إدارة الموارد البشرية بأن الموظف / {value(certificate.employeeName)}<br />يعمل لديها في وظيفة {value(certificate.jobTitle)}<br />وذلك حسب البيانات المبينة أدناه:</>}</p><dl>{rows.map(([label, item]) => <div key={label}><dt>{label}</dt><dd>{value(item)}</dd></div>)}</dl><div className={s["paperFooter"]}><div>{certificate.signatureImageUrl ? <img src={certificate.signatureImageUrl} className={s["signature"]} alt="توقيع الجهة المصدرة" /> : <span>—</span>}<p>إدارة الموارد البشرية</p></div><span>يمكن التحقق من صحة الشهادة<br />عبر صفحة التحقق من المستندات</span>{certificate.qrImageUrl ? <img className={s["qr"]} src={certificate.qrImageUrl} alt="رمز التحقق من الشهادة" /> : <span aria-label="رمز التحقق غير متوفر">—</span>}</div></article>;
}
function VerificationResult({ result, retry }: { result: VerifyResult; retry: () => void }) {
  const certificate = result.valid ? result.certificate ?? {} : {};
  const rows = [["رقم الوثيقة", certificate.code], ["اسم الموظف", certificate.employeeName], ["الوظيفة", certificate.jobTitle], ["الإدارة", certificate.department], ["تاريخ الإصدار", certificate.issuedOn], ["حالة الشهادة", certificate.status]];
  const reasons = !result.valid && result.reasons?.length ? result.reasons : ["رقم الوثيقة غير صحيح", "البيانات المدخلة لا تطابق السجلات", "الشهادة قد تكون ملغاة أو منتهية", "يرجى مراجعة بيانات الشهادة وإعادة المحاولة"];
  return <section data-verify-print className={`${s["result"]} ${result.valid ? "" : s["invalid"]}`} role="status"><div className={s["resultHeading"]}><span className={s["resultIcon"]}>{result.valid ? <Check size={28} /> : <X size={28} />}</span><div><h2>{result.valid ? "الشهادة صحيحة" : "الشهادة غير صحيحة"}</h2><p>{result.valid ? "تم التحقق من صحة الشهادة وأنها صادرة من منصة تكامل بلس" : "تعذر التحقق من صحة الشهادة، يرجى التأكد من البيانات المدخلة"}</p></div></div>{result.valid ? <><dl className={s["resultData"]}>{rows.map(([label, item]) => <div key={label}><dt>{label}</dt><dd>{label === "حالة الشهادة" && item ? <span className={s["badge"]}>{item}</span> : value(item)}</dd></div>)}</dl><div className={s["actions"]}><Button variant="outline" onClick={() => window.print()}><Printer />طباعة النتيجة</Button>{certificate.downloadUrl && /^https?:\/\//.test(certificate.downloadUrl) ? <Button asChild variant="outline"><a href={certificate.downloadUrl} download rel="noopener noreferrer" target="_blank"><Download />تحميل نسخة الشهادة</a></Button> : <Button variant="outline" disabled title="لم تصل نسخة الشهادة"><Download />تحميل نسخة الشهادة</Button>}</div></> : <><div className={s["reasons"]}><strong className="text-destructive">أسباب محتملة:</strong><ul>{reasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul><p>يرجى التواصل مع الجهة في حال استمرار المشكلة</p></div><div className="mt-4 text-center"><Button variant="outline" onClick={retry}><RefreshCw />إعادة المحاولة</Button></div></>}</section>;
}
export function VerifyPage({ organizationSettings = {}, onVerify, exampleCertificate, renderCaptcha }: VerifyPageProps) {
  const [code, setCode] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [date, setDate] = useState<Date>();
  const [dateOpen, setDateOpen] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerifyResult>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = { code: code.trim(), nationalId: nationalId.trim(), issuedOn: date ? format(date, "yyyy-MM-dd") : "" };
    if (!validVerifyInput(input)) { setError("يرجى إدخال الحقول الثلاثة المطلوبة"); return; }
    if (!captcha) { setError("يرجى تأكيد أنك لست برنامج روبوت"); return; }
    if (!onVerify) { setError("خدمة التحقق غير متصلة حاليًا، يرجى المحاولة لاحقًا"); return; }
    setBusy(true); setError(""); setResult(undefined);
    try {
      const response = await onVerify(input);
      if (!response || typeof response.valid !== "boolean") throw new Error("Invalid verification response");
      setResult(response);
    } catch { setError("تعذر الاتصال بخدمة التحقق، يرجى المحاولة مرة أخرى"); }
    finally { setBusy(false); }
  }
  return <main data-verify-page dir="rtl" className={s["page"]}><header className={s["header"]}><div className={s["headerInner"]}><Link to="/" aria-label="الرئيسية"><OrganizationBrand settings={organizationSettings} /></Link><nav className={s["nav"]} aria-label="التنقل"><Link to="/">الرئيسية</Link><Link to="/features">الخدمات</Link><Link to="/verify" className={s["active"]}>التحقق من المستندات</Link><Link to="/support">الدعم الفني</Link></nav><Button variant="ghost" size="sm" aria-label="اللغة العربية"><Globe />العربية</Button></div></header><section className={s["hero"]}><img src={hero} width={1536} height={512} className={s["heroImage"]} alt="شهادة تعريف وعدسة للتحقق من المستندات" /><div className={s["heroContent"]}><div className={s["trust"]}><ShieldCheck /><span>مستندات موثوقة<br />لبيئة عمل آمنة</span></div><div className={s["heroText"]}><h1>التحقق من شهادة تعريف موظف</h1><p>تحقق من صحة شهادة التعريف الصادرة إلكترونياً من خلال إدخال البيانات التالية</p></div></div></section><div className={s["content"]}><div className={s["columns"]}><section className={s["panel"]}><h2>بيانات التحقق</h2><p className={s["subtitle"]}>يرجى إدخال بيانات الشهادة كما هي في المستند</p><form className={s["form"]} onSubmit={submit}><div className={s["field"]}><label htmlFor="verify-code">رقم الوثيقة / الشهادة <span className={s["required"]}>*</span></label><FileText /><input id="verify-code" name="code" value={code} onChange={event => { setCode(event.target.value); setResult(undefined); }} required placeholder="مثال: REF-2025-001" /></div><div className={s["field"]}><label htmlFor="verify-id">رقم الهوية الوطنية للموظف <span className={s["required"]}>*</span></label><IdCard /><input id="verify-id" name="nationalId" inputMode="numeric" value={nationalId} onChange={event => { setNationalId(event.target.value); setResult(undefined); }} required placeholder="مثال: 1012345678" /></div><div className={s["field"]}><label id="verify-date-label">تاريخ إصدار الشهادة <span className={s["required"]}>*</span></label><CalendarIcon /><Popover open={dateOpen} onOpenChange={setDateOpen}><PopoverTrigger asChild><Button variant="ghost" type="button" aria-labelledby="verify-date-label" className={s["date"]}>{date ? format(date, "yyyy/MM/dd") : "اختر التاريخ"}</Button></PopoverTrigger><PopoverContent align="end" className="w-auto p-0 pointer-events-auto"><Calendar mode="single" locale={ar} dir="rtl" captionLayout="dropdown" startMonth={new Date(1990, 0)} endMonth={new Date(2100, 11)} selected={date} onSelect={selected => { setDate(selected); setDateOpen(false); setResult(undefined); }} className="pointer-events-auto" /></PopoverContent></Popover></div>{renderCaptcha ? renderCaptcha(setCaptcha) : <div className={s["captcha"]}><label className={s["captchaLabel"]}><Checkbox checked={captcha} onCheckedChange={checked => setCaptcha(checked === true)} />أنا لست برنامج روبوت</label><span className={s["captchaMark"]}><RefreshCw size={25} />reCAPTCHA</span></div>}{error && <p role="alert" className={s["error"]}>{error}</p>}<Button className="w-full" disabled={busy} type="submit">{busy ? <LoaderCircle className="animate-spin" /> : <Search />}{busy ? "جارٍ التحقق..." : "تحقق من الشهادة"}</Button></form>{!renderCaptcha && <p className={s["notice"]}>مربع تأكيد تجريبي؛ حماية reCAPTCHA غير متصلة.</p>}</section><section className={`${s["panel"]} ${s["preview"]}`}><h2>مثال على شهادة التعريف</h2><CertificatePreview settings={organizationSettings} {...(exampleCertificate ? { certificate: exampleCertificate } : {})} /></section></div>{result && <VerificationResult result={result} retry={() => { setResult(undefined); setError(""); setCaptcha(false); }} />}<footer className={s["features"]}>{[[Clock3, "تحقق فوري", "احصل على النتيجة خلال ثوانٍ"], [ShieldCheck, "مستندات معتمدة", "صادرة من منصة تكامل بلس"], [LockKeyhole, "بيانات آمنة ومشفرة", "جميع عمليات التحقق موثقة"]].map(([Icon, title, description]) => { const FeatureIcon = Icon as typeof Clock3; return <div className={s["feature"]} key={String(title)}><FeatureIcon /><div><strong>{String(title)}</strong><p>{String(description)}</p></div></div>; })}</footer></div></main>;
}
