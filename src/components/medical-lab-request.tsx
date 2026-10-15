import { useRef, useState, type ReactNode, type InputHTMLAttributes } from "react";
import { ChevronDown, ChevronLeft, CloudUpload, FlaskConical, Home, IdCard, Info, Mail, Phone, Plus, Save, Search, Send, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { medicalLabRequestReference, type LabTest } from "@/data/mockData";
import { canAddLabTest, filterLabTests, validLabAttachment } from "@/lib/medical-lab-request-rules";
import tubes from "@/assets/lab-tubes.jpg";
import clipboard from "@/assets/lab-request-clipboard.png";
import s from "./medical-lab-request.module.css";

type RequestData = typeof medicalLabRequestReference;
function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className={s['field']}><span>{label}{required && <b className={s['required']}>*</b>}</span>{children}</label>;
}
function Input({ icon, ...props }: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return <div className={s['control']}><input {...props} className={`${s['input']} ${icon ? s['withIcon'] : ''}`} />{icon && <span className={s['controlIcon']}>{icon}</span>}</div>;
}
function Select({ value, options, onChange, required }: { value: string; options: string[]; onChange: (value: string) => void; required?: boolean }) {
  return <div className={s['control']}><select required={required} className={`${s['input']} ${s['select']}`} value={value} onChange={e => onChange(e.target.value)}><option value="">—</option>{options.map(o => <option key={o}>{o}</option>)}</select><ChevronDown size={14} className={s['controlIcon']} /></div>;
}
function Section({ number, title, extra, children }: { number: number; title: string; extra?: ReactNode; children: ReactNode }) {
  return <section className={s['panel']}><div className={s['sectionHead']}><h2><span className={s['number']}>{number}</span>{title}</h2>{extra}</div>{children}</section>;
}

export function MedicalLabRequestPage({ data = medicalLabRequestReference }: { data?: RequestData }) {
  const [emp, setEmp] = useState({ ...data.employee });
  const [req, setReq] = useState({ ...data.request });
  const [tests, setTests] = useState<LabTest[]>([...data.selectedTests]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('الكل');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [picker, setPicker] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState<{ emp: typeof emp; req: typeof req; tests: LabTest[]; notes: string; files: File[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const displayed = filterLabTests(tests, query, tab);
  const message = (text: string, invalid = false) => { setNotice(text); setError(invalid); };
  const attach = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted = Array.from(incoming).filter(validLabAttachment);
    setFiles(previous => [...previous, ...accepted]);
    if (accepted.length < incoming.length) message('الملفات المقبولة PDF, JPG, PNG فقط، بحد أقصى 5 ميجابايت لكل ملف.', true);
  };
  const reset = () => {
    setEmp({ ...data.employee }); setReq({ ...data.request }); setTests([...data.selectedTests]);
    setNotes(''); setFiles([]); setQuery(''); setTab('الكل'); setDraft(null); message('تم إلغاء التعديلات وإعادة بيانات العرض.');
  };
  const saveDraft = () => { setDraft({ emp: { ...emp }, req: { ...req }, tests: [...tests], notes, files: [...files] }); message('تم حفظ مسودة تجريبية في هذه الجلسة فقط؛ لا يتم حفظها بعد تحديث الصفحة.'); };
  const restore = () => { if (!draft) return; setEmp(draft.emp); setReq(draft.req); setTests(draft.tests); setNotes(draft.notes); setFiles(draft.files); message('تم استعادة المسودة التجريبية.'); };
  return <AppShell><main dir="rtl" className={s['page']} data-lab-request><div className={s['inner']}>
    <nav className={s['breadcrumb']} aria-label="مسار الصفحة"><Home size={13} />الرئيسية<ChevronLeft size={11} />طلبات الفحص<ChevronLeft size={11} />طلب جديد</nav>
    <header className={s['hero']}><img className={s['heroPhoto']} src={tubes} width={1152} height={576} alt="أنابيب تحاليل في المختبر" /><span className={s['heroIcon']}><FlaskConical size={37} /></span><div className={s['heroText']}><h1>طلب فحص مخبري جديد</h1><p>قم بإدخال بيانات الطلب واختيار التحاليل المطلوبة</p></div></header>
    {notice && <div role={error ? 'alert' : 'status'} className={`${s['notice']} ${error ? s['error'] : ''}`}>{notice}{draft && !error && <Button type="button" variant="link" onClick={restore}>استعادة المسودة</Button>}</div>}
    <div className={s['columns']}>
      <form className={s['form']} onSubmit={e => { e.preventDefault(); if (!tests.length) { message('يرجى إضافة تحليل واحد على الأقل.', true); return; } message(`تم إرسال الطلب تجريبياً لـ ${emp.name} ويضم ${tests.length} تحاليل؛ لم يُرسل إلى أي مختبر فعلي.`); }}>
        <Section number={1} title="بيانات الموظف / المراجع">
          <div className={`${s['fields']} ${s['employeeTop']}`}>
            <Field label="رقم الموظف" required><Input required icon={<UserRound size={14} />} value={emp.id} onChange={e => setEmp({ ...emp, id: e.target.value })} /></Field>
            <Field label="اسم الموظف" required><Input required value={emp.name} onChange={e => setEmp({ ...emp, name: e.target.value })} /></Field>
            <Field label="الجهة / الإدارة"><Select value={emp.dept} options={data.departments} onChange={dept => setEmp({ ...emp, dept })} /></Field>
            <Field label="المسمى الوظيفي"><Select value={emp.job} options={data.jobs} onChange={job => setEmp({ ...emp, job })} /></Field>
          </div>
          <div className={s['fields']}>
            <Field label="رقم الهوية" required><Input required icon={<IdCard size={14} />} value={emp.nid} onChange={e => setEmp({ ...emp, nid: e.target.value })} /></Field>
            <Field label="رقم الجوال" required><Input required type="tel" icon={<Phone size={14} />} value={emp.phone} onChange={e => setEmp({ ...emp, phone: e.target.value })} /></Field>
            <Field label="البريد الإلكتروني"><Input type="email" icon={<Mail size={14} />} value={emp.email} onChange={e => setEmp({ ...emp, email: e.target.value })} /></Field>
          </div>
        </Section>
        <Section number={2} title="تفاصيل الطلب"><div className={s['fields']}>
          <Field label="نوع الفحص" required><Select required value={req.type} options={data.examTypes} onChange={type => setReq({ ...req, type })} /></Field>
          <Field label="الأولوية"><Select value={req.priority} options={data.priorities} onChange={priority => setReq({ ...req, priority })} /></Field>
          <Field label="الجهة الطالبة" required><Select required value={req.from} options={data.requesters} onChange={from => setReq({ ...req, from })} /></Field>
          <div className={s['wide']}><Field label="سبب الطلب"><Input value={req.reason} onChange={e => setReq({ ...req, reason: e.target.value })} /></Field></div>
        </div></Section>
        <Section number={3} title="التحاليل المطلوبة" extra={<div className={s['search']}><Input aria-label="البحث في التحاليل المختارة" icon={<Search size={15} />} placeholder="ابحث عن تحليل ..." value={query} onChange={e => setQuery(e.target.value)} /></div>}>
          <div className={s['tabs']} role="tablist" aria-label="تصنيفات التحاليل">{['الكل', ...data.categories].map(c => <Button type="button" variant="ghost" key={c} role="tab" aria-selected={tab === c} onClick={() => setTab(c)}>{c}</Button>)}</div>
          <div className={s['scroll']}><table className={s['table']} aria-label="التحاليل المختارة"><thead><tr>{['#', 'اسم التحليل', 'الرمز', 'النوع', 'ملاحظات', 'إجراءات'].map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{displayed.map((t, i) => <tr key={t.code}><td>{i + 1}</td><td>{t.name || '—'}</td><td><bdi>{t.code || '—'}</bdi></td><td>{t.kind || '—'}</td><td>{t.note || '—'}</td><td><Button type="button" variant="ghost" size="icon" title={`حذف ${t.name}`} aria-label={`حذف ${t.name}`} className={s['remove']} onClick={() => setTests(previous => previous.filter(item => item.code !== t.code))}><Trash2 /></Button></td></tr>)}{!displayed.length && <tr><td colSpan={6}>لا توجد تحاليل مطابقة.</td></tr>}</tbody></table></div>
          <Button type="button" variant="ghost" className={s['addZone']} onClick={() => setPicker(true)}><span><Plus size={22} /></span><span><b>إضافة تحليل آخر</b><small>ابحث عن التحليل أو أضفه يدوياً</small></span></Button>
        </Section>
        <Section number={4} title="المرفقات (اختياري)"><div className={s['attachmentGrid']}>
          <Field label="ملاحظات إضافية"><textarea className={`${s['input']} ${s['textarea']}`} value={notes} onChange={e => setNotes(e.target.value)} placeholder="أكتب أي ملاحظات أو تعليمات خاصة بالمختبر ..." /></Field>
          <div><Button type="button" variant="ghost" className={s['dropZone']} onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); attach(e.dataTransfer.files); }}><CloudUpload /><span><b>اسحب الملفات هنا أو اضغط للاختيار</b><small>PDF, JPG, PNG . الحد الأقصى 5 ميجابايت</small></span></Button><input ref={fileRef} type="file" hidden multiple accept=".pdf,.jpg,.jpeg,.png" aria-label="إرفاق ملفات طبية" onChange={e => { attach(e.target.files); e.target.value = ''; }} />
          {files.length > 0 && <ul className={s['files']}>{files.map((f, i) => <li key={`${f.name}-${i}`}><span>{f.name}</span><Button type="button" variant="ghost" size="icon" aria-label={`إزالة ${f.name}`} onClick={() => setFiles(previous => previous.filter((_, index) => index !== i))}><X /></Button></li>)}</ul>}</div>
        </div></Section>
        <div className={s['actions']}><Button type="submit" className={s['submit']}><Send />إرسال الطلب</Button><Button type="button" variant="outline" onClick={saveDraft}><Save />حفظ كمسودة</Button><Button type="button" variant="outline" onClick={reset}><X />إلغاء</Button></div>
      </form>
      <aside className={s['aside']}><section className={s['panel']}><h2><span className={s['infoIcon']}><Info size={17} /></span>معلومات مهمة</h2><ul>{data.guidance.map(g => <li key={g}>{g}</li>)}</ul></section><section className={s['panel']}><h2><ShieldCheck className="text-primary" size={24} />سياسة الخصوصية</h2><p>جميع البيانات الطبية سرية وتستخدم فقط لأغراض الفحص الطبي وفق سياسة أمن المعلومات.</p></section><div className={s['illustration']}><img src={clipboard} alt="لوحة فحص مخبري مع علامة صح" width={512} height={512} loading="lazy" /><b>معاً نحو</b><p>بيئة عمل صحية وآمنة</p></div></aside>
    </div>
    <p className={s['demo']}>عرض تجريبي — الطلبات والمسودات والمرفقات لا تُحفظ بعد تحديث الصفحة ولا تُرسل إلى مختبر فعلي.</p>
    <TestPicker open={picker} onClose={() => setPicker(false)} data={data} selected={tests} onAdd={test => { setTests(previous => [...previous, test]); setTab('الكل'); setQuery(''); message(`تمت إضافة تحليل «${test.name}» إلى الطلب.`); }} />
  </div></main></AppShell>;
}

function TestPicker({ open, onClose, data, selected, onAdd }: { open: boolean; onClose: () => void; data: RequestData; selected: LabTest[]; onAdd: (test: LabTest) => void }) {
  const [manual, setManual] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');
  const [test, setTest] = useState<LabTest>({ name: '', code: '', kind: data.sampleTypes[0] ?? '', note: '', cat: data.categories.at(-1) ?? '' });
  const [error, setError] = useState('');
  const available = filterLabTests(data.catalog, query, category).filter(t => !selected.some(p => p.code === t.code));
  const add = (value: LabTest) => { if (!canAddLabTest(value, selected)) { setError('أدخل اسم التحليل ورمزاً غير مكرر.'); return; } onAdd(value); setError(''); setTest({ ...test, name: '', code: '', note: '' }); onClose(); };
  return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}><DialogContent dir="rtl" className={s['picker']}><DialogHeader><DialogTitle className="text-right">إضافة تحليل</DialogTitle><DialogDescription className="text-right">كتالوج التحاليل</DialogDescription></DialogHeader>
    <div className={s['pickerModes']}><Button type="button" variant="outline" aria-pressed={!manual} onClick={() => setManual(false)}>من الكتالوج</Button><Button type="button" variant="outline" aria-pressed={manual} onClick={() => setManual(true)}>إضافة يدوية</Button></div>
    {error && <p role="alert" className={`${s['notice']} ${s['error']}`}>{error}</p>}
    {manual ? <form className={s['fields']} onSubmit={e => { e.preventDefault(); add(test); }}>
      <div className={s['wide']}><Field label="اسم التحليل" required><Input required value={test.name} onChange={e => setTest({ ...test, name: e.target.value })} /></Field></div>
      <Field label="الرمز" required><Input required value={test.code} onChange={e => setTest({ ...test, code: e.target.value })} /></Field>
      <Field label="النوع"><Select value={test.kind} options={data.sampleTypes} onChange={kind => setTest({ ...test, kind })} /></Field>
      <Field label="التصنيف"><Select value={test.cat} options={data.categories} onChange={cat => setTest({ ...test, cat })} /></Field>
      <div className={s['wide']}><Field label="ملاحظات"><Input value={test.note} onChange={e => setTest({ ...test, note: e.target.value })} /></Field></div>
      <Button type="submit" className={s['wide']}><Plus />إضافة التحليل</Button>
    </form> : <><Input aria-label="البحث في كتالوج التحاليل" icon={<Search size={15} />} placeholder="ابحث عن تحليل ..." value={query} onChange={e => setQuery(e.target.value)} /><Select value={category} options={['الكل', ...data.categories]} onChange={setCategory} /><ul className={s['pickerList']}>{available.map(t => <li key={t.code}><div><b>{t.name}</b> <bdi>{t.code}</bdi><small>{t.cat} · {t.kind}</small></div><Button type="button" aria-label={`إضافة ${t.name}`} onClick={() => add(t)}><Plus />إضافة</Button></li>)}{!available.length && <li>لا توجد نتائج مطابقة.</li>}</ul></>}
  </DialogContent></Dialog>;
}