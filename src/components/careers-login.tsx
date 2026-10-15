import { useMemo, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bell, BriefcaseBusiness, CalendarDays, CheckCheck, ChevronLeft, ClipboardList, Eye, EyeOff, FilePlus2, FileText, Heart, Home, LockKeyhole, LogIn, MapPin, MessageSquare, Search, Send, Settings, ShieldCheck, Stethoscope, Upload, UserRound, UserRoundPlus, UsersRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import medicalHero from "@/assets/applicant-portal-medical.jpg";
import { applicationStepReady, filterPortalJobs, portalValue, type PortalApplication, type PortalApplyHandler, type PortalJob, type PortalLoginHandler, type PortalOrganization } from "./careers-login.data";
import styles from "./careers-login.module.css";

export interface CareersLoginProps {
  organizationSettings?: PortalOrganization | undefined; jobs?: readonly PortalJob[] | undefined;
  onApplicantLogin?: PortalLoginHandler | undefined; onEmployeeLogin?: PortalLoginHandler | undefined;
  onApply?: PortalApplyHandler | undefined; onSaveDraft?: PortalApplyHandler | undefined;
  onRegister?: (() => void) | undefined; onForgotPassword?: ((portal: "applicant" | "employee") => void) | undefined;
  onNotifications?: (() => void) | undefined; onSettings?: (() => void) | undefined;
}
const emptyJobs: readonly PortalJob[] = [];
const emptyApplication: PortalApplication = { jobId: "", specialty: "", contract: "", city: "", availableOn: "", weeklyHours: "", experience: "", fullName: "", email: "", phone: "", qualifications: "", files: [] };
const stepLabels = ["بيانات الوظيفة", "البيانات الشخصية", "المؤهلات والخبرات", "إرفاق المستندات", "مراجعة وإرسال"];
const journey = [
  { title: "البحث عن الوظائف", text: "اختر الوظيفة المناسبة لك", icon: Search },
  { title: "تعبئة الطلب", text: "إدخال بياناتك وإرفاق المستندات", icon: FileText },
  { title: "إرسال الطلب", text: "إتمام التقديم", icon: Send },
  { title: "متابعة الطلب", text: "من خلال حسابك", icon: CheckCheck },
  { title: "استلام الإشعارات", text: "بحالة طلبك ونتائج التوظيف", icon: Bell },
];
function LoginGateway({ kind, onLogin, onRegister, onForgotPassword }: { kind: "applicant" | "employee"; onLogin?: PortalLoginHandler | undefined; onRegister?: (() => void) | undefined; onForgotPassword?: CareersLoginProps["onForgotPassword"] }) {
  const applicant = kind === "applicant";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!onLogin) { setMessage("خدمة تسجيل الدخول غير متصلة حاليًا؛ لم يتم تسجيل الدخول."); return; }
    setPending(true); setMessage("");
    try { const result = await onLogin({ identifier: identifier.trim(), password, remember }); setMessage(result.message || (result.success ? "تم تسجيل الدخول بنجاح" : "تعذّر تسجيل الدخول؛ راجع بياناتك.")); }
    catch { setMessage("تعذّر الاتصال بخدمة الدخول. حاول مرة أخرى."); }
    finally { setPending(false); }
  };
  return <section className={`${styles["gateway"]} ${applicant ? styles["applicant"] : ""}`} aria-label={applicant ? "بوابة المتقدمين" : "بوابة الموظفين"}>
    <div className={styles["gatewayTitle"]}><div><h2>{applicant ? "بوابة المتقدمين" : "بوابة الموظفين"}</h2><p>{applicant ? "للباحثين عن وظائف جديدة" : "للموظفين الحاليين وإدارة حساباتهم"}</p></div>{applicant ? <UsersRound/> : <UserRound/>}</div>
    <form onSubmit={submit}>
      <label className={styles["credential"]}><input required aria-label={applicant ? "البريد الإلكتروني أو رقم الهوية" : "اسم المستخدم أو البريد الإلكتروني"} placeholder={applicant ? "البريد الإلكتروني أو رقم الهوية" : "اسم المستخدم أو البريد الإلكتروني"} autoComplete="username" value={identifier} onChange={event => setIdentifier(event.target.value)} /><UserRound/></label>
      <label className={styles["credential"]}><input required aria-label="كلمة المرور" placeholder="كلمة المرور" autoComplete="current-password" type={visible ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)}/><Button type="button" variant="ghost" size="icon" title={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff/> : <Eye/>}</Button><LockKeyhole/></label>
      <div className={styles["remember"]}><Button type="button" variant="link" onClick={() => onForgotPassword ? onForgotPassword(kind) : setMessage("استعادة كلمة المرور غير متصلة حاليًا.")}>نسيت كلمة المرور؟</Button><label><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)}/>تذكرني</label></div>
      <Button type="submit" disabled={pending} className={applicant ? styles["purple"] : ""}>{pending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}<LogIn/></Button>
      {applicant && <Button type="button" variant="outline" className={styles["purpleOutline"]} onClick={() => onRegister ? onRegister() : setMessage("إنشاء الحسابات غير متصل حاليًا.")}><UserRoundPlus/>مستخدم جديد</Button>}
    </form>{message && <p role="status" className={styles["message"]}>{message}</p>}
  </section>;
}
function Field({ label, children, required = false, full = false }: { label: string; children: ReactNode; required?: boolean; full?: boolean }) {
  return <label className={`${styles["field"]} ${full ? styles["full"] : ""}`}><span>{label} {required && <span className={styles["required"]}>*</span>}</span>{children}</label>;
}
function ApplicationPanel({ jobs, input, update, onApply, onSaveDraft, panelRef }: { jobs: readonly PortalJob[]; input: PortalApplication; update: (data: Partial<PortalApplication>) => void; onApply?: PortalApplyHandler | undefined; onSaveDraft?: PortalApplyHandler | undefined; panelRef: RefObject<HTMLElement | null> }) {
  const [step, setStep] = useState(0), [message, setMessage] = useState(""), [pending, setPending] = useState(false);
  const activeJob = jobs.find(job => job.id === input.jobId);
  const cities = Array.from(new Set(jobs.map(job => job.city).filter((value): value is string => Boolean(value))));
  const specialties = Array.from(new Set(jobs.map(job => job.specialty).filter((value): value is string => Boolean(value))));
  const call = async (handler: PortalApplyHandler | undefined, draft: boolean) => {
    if (!handler) { setMessage(draft ? "حفظ المسودات غير متصل؛ بياناتك موجودة في هذه الصفحة فقط وتُفقد عند تحديثها." : "خدمة التقديم غير متصلة حاليًا؛ لم يتم إرسال الطلب."); return; }
    setPending(true); setMessage("");
    try { const result = await handler({ ...input, files: [...input.files] }); setMessage(result.message || (result.success ? (draft ? "تم حفظ المسودة" : "تم إرسال الطلب بنجاح") : "تعذّر إتمام الإجراء. حاول مرة أخرى.")); }
    catch { setMessage("تعذّر إتمام الإجراء. حاول مرة أخرى."); }
    finally { setPending(false); }
  };
  const next = (event: FormEvent) => {
    event.preventDefault();
    if (!applicationStepReady(step, input)) { setMessage("أكمل البيانات المطلوبة للمتابعة."); return; }
    setMessage("");
    if (step < 4) setStep(value => value + 1); else void call(onApply, false);
  };
  return <aside ref={panelRef} className={styles["application"]} aria-label="التقديم على وظيفة">
    <div className={styles["bandTitle"]}><h2><FilePlus2 className="text-primary"/>التقديم على وظيفة</h2></div>
    <div className={styles["tracker"]}>{stepLabels.map((label, index) => <div key={label} data-current={index === step} aria-current={index === step ? "step" : undefined}><span>{index + 1}</span>{label}</div>)}</div>
    <form onSubmit={next}>
      {step === 0 && <div className={styles["formGrid"]}>
        <Field label="الوظيفة المطلوبة" required><select required aria-label="الوظيفة المطلوبة" value={input.jobId} onChange={event => { const job = jobs.find(item => item.id === event.target.value); update({ jobId: event.target.value, specialty: job?.specialty || "", city: job?.city || "", contract: job?.contract || "", weeklyHours: job?.weeklyHours === undefined ? "" : String(job.weeklyHours) }); }}><option value="">{jobs.length ? "اختر الوظيفة" : "—"}</option>{jobs.map(job => <option key={job.id} value={job.id}>{portalValue(job.title)}</option>)}</select></Field>
        <Field label="التخصص" required><select required aria-label="التخصص" value={input.specialty} onChange={event => update({ specialty: event.target.value })}><option value="">{specialties.length ? "اختر التخصص" : "—"}</option>{specialties.map(value => <option key={value}>{value}</option>)}</select></Field>
        <fieldset className={styles["field"]}><legend>نوع العقد <span className={styles["required"]}>*</span></legend><div className={styles["contract"]}>{["دائم", "مؤقت"].map(value => <label key={value}><input type="radio" required name="contract" value={value} checked={input.contract === value} onChange={() => update({ contract: value })}/>{value}</label>)}{input.contract && !["دائم", "مؤقت"].includes(input.contract) && <label><input type="radio" name="contract" checked readOnly/>{input.contract}</label>}</div></fieldset>
        <Field label="المدينة" required><select required aria-label="المدينة" value={input.city} onChange={event => update({ city: event.target.value })}><option value="">{cities.length ? "اختر المدينة" : "—"}</option>{cities.map(value => <option key={value}>{value}</option>)}</select></Field>
        <Field label="تاريخ التوفر" required><input required type="date" aria-label="تاريخ التوفر" value={input.availableOn} onChange={event => update({ availableOn: event.target.value })}/></Field>
        <Field label="عدد الساعات الأسبوعية" required><div className={styles["hours"]}><input required type="number" min="1" aria-label="عدد الساعات الأسبوعية" value={input.weeklyHours} onChange={event => update({ weeklyHours: event.target.value })}/><span>ساعة</span></div></Field>
        <Field label="نبذة عن الخبرات والمهارات" full><textarea aria-label="نبذة عن الخبرات والمهارات" placeholder="اكتب نبذة مختصرة عن خبراتك…" value={input.experience} onChange={event => update({ experience: event.target.value })}/></Field>
      </div>}
      {step === 1 && <div className={styles["formGrid"]}>
        <Field label="الاسم الكامل" required full><input required aria-label="الاسم الكامل" value={input.fullName} onChange={event => update({ fullName: event.target.value })}/></Field>
        <Field label="البريد الإلكتروني" required full><input required type="email" aria-label="البريد الإلكتروني للتقديم" value={input.email} onChange={event => update({ email: event.target.value })}/></Field>
        <Field label="رقم الجوال" required full><input required type="tel" aria-label="رقم الجوال" value={input.phone} onChange={event => update({ phone: event.target.value })}/></Field>
      </div>}
      {step === 2 && <Field label="المؤهلات والخبرات" required full><textarea required aria-label="المؤهلات والخبرات" value={input.qualifications} onChange={event => update({ qualifications: event.target.value })}/></Field>}
      {step === 3 && <label className={styles["upload"]}><Upload/>إرفاق المستندات<input aria-label="إرفاق المستندات" type="file" multiple onChange={event => update({ files: Array.from(event.target.files || []) })}/><span>{input.files.map(file => file.name).join("، ") || "لم يتم إرفاق مستندات"}</span></label>}
      {step === 4 && <dl className={styles["review"]}>{[["الوظيفة", portalValue(activeJob?.title)], ["التخصص", input.specialty], ["نوع العقد", input.contract], ["المدينة", input.city], ["تاريخ التوفر", input.availableOn], ["الساعات الأسبوعية", input.weeklyHours], ["الاسم", input.fullName], ["البريد الإلكتروني", input.email], ["الجوال", input.phone], ["المؤهلات والخبرات", input.qualifications], ["الخبرات والمهارات", input.experience], ["المستندات", input.files.map(file => file.name).join("، ")]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{portalValue(value)}</dd></div>)}</dl>}
      <div className={styles["actions"]}><Button type="submit" disabled={pending}>{pending ? "جارٍ التنفيذ…" : step === 4 ? "إرسال الطلب" : "التالي"}{step === 4 ? <Send/> : <ArrowLeft/>}</Button><Button type="button" variant="outline" disabled={pending} onClick={() => void call(onSaveDraft, true)}><Save/>حفظ كمسودة</Button></div>
      {step > 0 && <Button type="button" variant="link" onClick={() => { setStep(value => value - 1); setMessage(""); }}>السابق</Button>}
      {message && <p role="status" className={styles["message"]}>{message}</p>}
    </form>
  </aside>;
}
export function CareersLogin({ organizationSettings = {}, jobs = emptyJobs, onApplicantLogin, onEmployeeLogin, onApply, onSaveDraft, onRegister, onForgotPassword, onNotifications, onSettings }: CareersLoginProps) {
  const [query, setQuery] = useState(""), [region, setRegion] = useState(""), [contract, setContract] = useState("");
  const [saved, setSaved] = useState<string[]>([]), [input, setInput] = useState<PortalApplication>(emptyApplication), [notice, setNotice] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const filtered = useMemo(() => filterPortalJobs(jobs, query, region, contract), [jobs, query, region, contract]);
  const regions = Array.from(new Set(jobs.map(job => job.region || job.city).filter((value): value is string => Boolean(value))));
  const contracts = Array.from(new Set(jobs.map(job => job.contract).filter((value): value is string => Boolean(value))));
  const update = (data: Partial<PortalApplication>) => setInput(previous => ({ ...previous, ...data }));
  const apply = (job: PortalJob) => { update({ jobId: job.id, specialty: job.specialty || "", city: job.city || "", contract: job.contract || "", weeklyHours: job.weeklyHours === undefined ? "" : String(job.weeklyHours) }); panelRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" }); };
  return <div dir="rtl" className={styles["page"]}>
    <header className={styles["header"]}>
      <Link to="/" className={styles["brand"]}>{organizationSettings.logoUrl && <img src={organizationSettings.logoUrl} alt={organizationSettings.name || "شعار المنشأة"} width={64} height={48}/>}<span>{portalValue(organizationSettings.name)}</span></Link>
      <nav aria-label="القائمة الرئيسية">{[{ to: "/" as const, label: "الرئيسية", icon: Home }, { to: "/careers" as const, label: "الوظائف", icon: BriefcaseBusiness }, { to: "/features" as const, label: "الوظيفية", icon: FileText }, { to: "/about" as const, label: "للمؤسسات", icon: ClipboardList }, { to: "/contact" as const, label: "تواصل معنا", icon: MessageSquare }].map(({ to, label, icon: Icon }) => <Link key={label} to={to}><Icon/>{label}</Link>)}</nav>
      <label className={`${styles["search"]} ${styles["headerSearch"]}`}><Search size={21}/><input aria-label="البحث العلوي" placeholder="ابحث عن وظيفة أو تخصّص…" value={query} onChange={event => setQuery(event.target.value)}/></label>
      <div className={styles["tools"]}><Button variant="ghost" size="icon" title="الإشعارات" aria-label="الإشعارات" onClick={() => onNotifications ? onNotifications() : setNotice("لا توجد إشعارات متصلة حاليًا.")}><Bell/></Button><Button variant="ghost" size="icon" title="الإعدادات" aria-label="الإعدادات" onClick={() => onSettings ? onSettings() : setNotice("لم يتم توصيل إعدادات الحساب.")}><Settings/></Button></div>
    </header>
    <section className={styles["hero"]}>
      <img src={medicalHero} className={styles["heroImage"]} width={1920} height={800} alt="فريق من الأطباء والكادر الصحي في مستشفى حديث"/>
      <div className={styles["heroText"]}><h1>فرص وظيفية<strong>للأطباء والكادر الصحي</strong></h1><p>انضم إلى بيئة عمل مرنة واحترافية<br/>مع منصة {portalValue(organizationSettings.name)}</p><div className={styles["benefits"]}>{[{ icon: ShieldCheck, text: "بيئة عمل موثوقة" }, { icon: MapPin, text: "في جميع المناطق" }, { icon: Stethoscope, text: "تخصصات متعددة" }, { icon: BriefcaseBusiness, text: "فرص متنوعة" }].map(({ icon: Icon, text }) => <div key={text}><Icon/>{text}</div>)}</div></div>
      <div className={styles["gateways"]}><LoginGateway kind="applicant" onLogin={onApplicantLogin} onRegister={onRegister} onForgotPassword={onForgotPassword}/><LoginGateway kind="employee" onLogin={onEmployeeLogin} onForgotPassword={onForgotPassword}/></div>
    </section>
    {notice && <p role="status" className={styles["notice"]}>{notice}</p>}
    <main className={styles["body"]}>
      <div className={styles["listArea"]}>
        <section className={styles["steps"]}><h2>خطوات التقديم على وظيفة</h2><div className={styles["stepStrip"]}>{journey.map(({ title, text, icon: Icon }, index) => <div key={title} className={styles["stepItem"]}><div className={styles["stepIcon"]}><Icon/><b>{["١", "٢", "٣", "٤", "٥"][index]}</b></div><strong>{title}</strong><p>{text}</p></div>)}</div></section>
        <section aria-label="الوظائف المتاحة"><div className={styles["bandTitle"]}><h2>الوظائف المتاحة</h2><Button asChild size="sm"><Link to="/careers">عرض جميع الوظائف<ChevronLeft/></Link></Button></div>
          <div className={styles["jobFilters"]}><label className={styles["search"]}><Search size={18}/><input aria-label="بحث الوظائف" placeholder="ابحث عن وظيفة أو تخصص أو موقع…" value={query} onChange={event => setQuery(event.target.value)}/></label><select aria-label="المنطقة" value={region} onChange={event => setRegion(event.target.value)}><option value="">جميع المناطق</option>{regions.map(value => <option key={value}>{value}</option>)}</select><select aria-label="تصفية نوع العقد" value={contract} onChange={event => setContract(event.target.value)}><option value="">نوع العقد</option>{contracts.map(value => <option key={value}>{value}</option>)}</select></div>
          <div className={styles["jobs"]}>{filtered.slice(0, 4).map((job, index) => <article key={job.id} className={styles["job"]}><div className={styles["jobImage"]}>{job.imageUrl ? <img src={job.imageUrl} loading="lazy" width={300} height={150} alt={job.title || "صورة الوظيفة"}/> : <BriefcaseBusiness/>}<span data-temporary={job.contract === "مؤقت"}>{portalValue(job.schedule || job.contract)}</span><Button variant="ghost" size="icon" title={saved.includes(job.id) ? "إلغاء حفظ الوظيفة" : "حفظ الوظيفة"} aria-label={`${saved.includes(job.id) ? "إلغاء حفظ" : "حفظ"} ${portalValue(job.title)}`} aria-pressed={saved.includes(job.id)} onClick={() => setSaved(previous => previous.includes(job.id) ? previous.filter(id => id !== job.id) : [...previous, job.id])}><Heart className={saved.includes(job.id) ? "fill-primary text-primary" : ""}/></Button></div><div className={styles["jobBody"]}><h3>{portalValue(job.title)}</h3><p>{portalValue(job.organization)} · {portalValue(job.city)}</p><div className={styles["jobMeta"]}><CalendarDays/>{portalValue(job.weeklyHours)} ساعة أسبوعيًا<span>{portalValue(job.contract)}</span></div><div className={styles["jobMeta"]}><Stethoscope/>{portalValue(job.specialty)}</div><Button className={index % 2 === 0 ? styles["purple"] : ""} onClick={() => apply(job)}>التقديم الآن</Button></div></article>)}
            {filtered.length === 0 && <div className={styles["empty"]}><BriefcaseBusiness/><h3>{jobs.length ? "لا توجد وظائف مطابقة" : "لا توجد وظائف متاحة حاليًا"}</h3><p>{jobs.length ? "جرّب تغيير البحث أو المرشحات." : "ستظهر الفرص هنا عند توفير بيانات الوظائف."}</p>{jobs.length > 0 && <Button variant="outline" onClick={() => { setQuery(""); setRegion(""); setContract(""); }}>إعادة تعيين</Button>}</div>}
          </div>
        </section>
      </div>
      <ApplicationPanel jobs={jobs} input={input} update={update} onApply={onApply} onSaveDraft={onSaveDraft} panelRef={panelRef}/>
    </main>
    <p className={styles["notice"]}>واجهة توضيحية — لا توجد خدمات دخول أو تقديم أو حفظ متصلة افتراضيًا.</p>
  </div>;
}
