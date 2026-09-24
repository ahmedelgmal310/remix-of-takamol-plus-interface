import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Crown,
  Download,
  Medal,
  Printer,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { candidateEvaluationCriteria, evaluatedCandidates } from "@/data/mockData";
import saraImage from "@/assets/candidate-sara.jpg";
import ahmedImage from "@/assets/candidate-ahmed.jpg";
import reemImage from "@/assets/candidate-reem.jpg";
import khaledImage from "@/assets/candidate-khaled.jpg";
import nouraImage from "@/assets/candidate-noura.jpg";

const candidateImages = { sara: saraImage, ahmed: ahmedImage, reem: reemImage, khaled: khaledImage, noura: nouraImage };

export function CandidateEvaluationPage() {
  return (
    <AppShell>
      <main className="p-3 sm:p-5 lg:px-6 lg:py-3">
        <div className="mb-2 flex items-center gap-2 text-[9px] text-muted-foreground">
          <span>الرئيسية</span><span>‹</span><span>الموارد البشرية</span><span>‹</span><span>التوظيف</span><span>‹</span><span>تقييم المرشحين</span><span>‹</span><b className="text-primary">نتيجة التقييم</b>
        </div>

        <header className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold">اختيار المرشح الأفضل</h1>
            <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">عرض نتائج التقييم والمفاضلة بين المرشحين واختيار الأنسب للوظيفة</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm"><Check />اعتماد المرشح</Button>
            <Button size="sm" variant="outline"><Download />تصدير</Button>
            <Button size="sm" variant="outline"><Printer />طباعة</Button>
            <Button size="sm" variant="outline"><ArrowLeft />رجوع</Button>
          </div>
        </header>

        <section className="panel mb-3 grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
          <Summary icon={CalendarDays} label="تاريخ المقابلات" value="2025/09/20 - 2025/09/28" />
          <Summary icon={Users} label="عدد المرشحين" value="5" />
          <Summary icon={Building2} label="القسم" value="الإدارة المالية" />
          <Summary icon={BriefcaseBusiness} label="الوظيفة" value="محاسب أول" />
        </section>

        <section className="panel overflow-x-auto p-2">
          <div className="grid min-w-[920px] grid-cols-[repeat(5,minmax(132px,1fr))_165px] gap-2" dir="rtl">
            <CriteriaColumn />
            {evaluatedCandidates.map((candidate) => (
              <CandidateColumn key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </section>

        <section className="mt-3 grid items-center gap-4 rounded-md border border-success/40 bg-success-soft p-3 sm:grid-cols-[230px_minmax(0,1fr)_72px]">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-success text-primary-foreground"><Check size={18} /></span>
            <div><b className="block text-xs text-success">سارة عبدالله أحمد</b><span className="text-[9px] text-muted-foreground">المرشح الأنسب للوظيفة</span></div>
          </div>
          <div className="text-center"><h2 className="text-xs font-extrabold text-success">التوصية النهائية</h2><p className="mt-1 text-[10px] leading-5">بناءً على نتائج التقييم والمفاضلات، توصي اللجنة باختيار المرشحة <b className="text-primary">سارة عبدالله أحمد</b><br />لشغل وظيفة محاسب أول في الإدارة المالية.</p></div>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-success/10 text-success"><Trophy size={32} /></span>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-2">
          <ApprovalPanel />
          <NotesPanel />
        </section>
      </main>
    </AppShell>
  );
}

function Summary({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="flex min-h-12 items-center gap-3 border-l border-border px-2 last:border-l-0"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary"><Icon size={19} /></span><div><span className="block text-[9px] text-muted-foreground">{label}</span><b className="text-[11px]">{value}</b></div></div>;
}

function CandidateColumn({ candidate }: { candidate: (typeof evaluatedCandidates)[number] }) {
  const image = candidateImages[candidate.image];
  return <article className={`relative overflow-hidden rounded-md border ${candidate.recommended ? "border-success bg-success-soft/40" : "border-border bg-card"}`}>
    {candidate.recommended && <div className="bg-success py-1.5 text-center text-[9px] font-bold text-primary-foreground">المرشح الموصى به</div>}
    <div className={`relative flex h-[132px] flex-col items-center justify-center px-2 ${candidate.recommended ? "pt-2" : "pt-3"}`}>
      {candidate.recommended && <Crown className="absolute left-2 top-2 text-warning" size={18} />}
      <b className="mb-2 text-[9px]">المرشح رقم ({candidate.number})</b>
      <img src={image} alt={candidate.name} width={816} height={816} loading="lazy" className="h-14 w-14 rounded-full border border-border object-cover" />
      <strong className="mt-1 text-[10px] text-foreground">{candidate.name}</strong>
      <span className="text-[8px] text-primary">{candidate.id}</span>
    </div>
    <div className="grid gap-1.5 p-1.5">
      {candidate.scores.map((score, index) => <div key={`${candidate.id}-${index}`} className={`grid h-8 place-items-center rounded border text-[10px] font-bold ${candidate.recommended ? "border-success/20 bg-success/10 text-success" : "border-border bg-background"}`}>{score}</div>)}
      <div className={`grid h-9 place-items-center rounded text-sm font-extrabold ${candidate.recommended ? "bg-success/15 text-success" : "bg-search text-primary"}`}>{candidate.total}</div>
      <div className={`flex h-9 items-center justify-center gap-1 rounded text-[9px] font-bold ${candidate.recommended ? "border border-success bg-success-soft text-success" : "bg-search text-primary"}`}><Medal size={14} className={candidate.number <= 3 ? "text-warning" : "text-muted-foreground"} />{candidate.rank}</div>
    </div>
  </article>;
}

function CriteriaColumn() {
  return <aside className="pt-[100px]"><h2 className="mb-[20px] text-center text-xs font-extrabold">معايير التقييم</h2><div className="grid gap-1.5">{candidateEvaluationCriteria.map(({ label, weight, icon: Icon }) => <div key={label} className="flex h-8 items-center gap-2 border-b border-border px-1"><Icon className="shrink-0 text-primary" size={15} /><span className="text-[9px] font-bold">{label} <small className="text-primary">({weight})</small></span></div>)}<div className="flex h-9 items-center px-1 text-[10px] font-extrabold">إجمالي الدرجة <small className="mr-1 text-primary">(من 100)</small></div><div className="flex h-9 items-center px-1 text-[10px] font-extrabold">الترتيب النهائي</div></div></aside>;
}

function ApprovalPanel() {
  return <section className="panel p-3"><h2 className="flex items-center gap-2 border-b border-border pb-2 text-xs font-extrabold"><CheckCircle2 className="text-primary" size={18} />اعتماد النتيجة</h2><div className="mt-3 grid gap-2 sm:grid-cols-3"><ResultField icon={UserRound} label="اعتماد من" value="رئيس اللجنة" /><ResultField icon={CalendarDays} label="تاريخ الاعتماد" value="2025/09/28" /><div className="rounded-md border border-border p-2"><span className="block text-[8px] text-muted-foreground">حالة الاعتماد</span><b className="mt-1 inline-flex items-center gap-1 rounded bg-success-soft px-2 py-1 text-[9px] text-success"><Check size={12} />تم الاعتماد</b></div></div></section>;
}

function ResultField({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="rounded-md border border-border p-2"><span className="block text-[8px] text-muted-foreground">{label}</span><b className="mt-1 flex items-center gap-2 text-[9px]"><Icon className="text-primary" size={14} />{value}</b></div>;
}

function NotesPanel() {
  return <section className="panel p-3"><h2 className="flex items-center gap-2 border-b border-border pb-2 text-xs font-extrabold"><ClipboardCheck className="text-primary" size={18} />ملاحظات اللجنة</h2><div className="mt-3 rounded-md border border-input bg-background p-3"><p className="min-h-10 text-[9px] leading-5">أظهرت المرشحة تميزاً في المهارات العملية والمعرفة المهنية، مع توافق عالٍ مع متطلبات الوظيفة وثقافة الجهة.</p><span className="block text-left text-[8px] text-muted-foreground">96/500</span></div></section>;
}