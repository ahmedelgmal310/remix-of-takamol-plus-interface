import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton as BaseSkeleton } from "@/components/ui/skeleton";

type Tone = "orange" | "blue" | "purple" | "green" | "sky";

const toneText: Record<Tone, string> = {
  orange: "tone-orange",
  blue: "tone-blue",
  purple: "tone-purple",
  green: "tone-green",
  sky: "tone-sky",
};

export function StatCard({ label, value, trend, icon: Icon, tone }: { label: string; value: string; trend: string; icon: LucideIcon; tone: Tone }) {
  return (
    <article className="panel flex h-[89px] items-start justify-between p-3">
      <div>
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-extrabold ${tone==="orange"?toneText[tone]:"text-brand-deep"}`}>{value}</p>
        <p className="mt-1 text-[9px] text-muted-foreground">مقارنة بالشهر الماضي</p>
      </div>
      <div className="flex flex-col items-end gap-2.5">
        <span className={`icon-well size-11 rounded-full ${toneText[tone]}`}><Icon size={22} /></span>
        <span className="text-[10px] font-bold text-success">↑ {trend}</span>
      </div>
    </article>
  );
}

export function PageHeader({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2"><Icon className="text-primary" size={22} /><h1 className="text-lg font-extrabold text-foreground">{title}</h1></div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">{children}</div>;
}

export function DataTable({ children }: { children: ReactNode }) {
  return <div className="w-full overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-center text-[10px]">{children}</table></div>;
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-md bg-success-soft px-2 py-1 text-xs font-bold text-success">{children}</span>;
}

export function Timeline() {
  return <div className="h-px w-full bg-border" aria-hidden="true" />;
}

export function Modal({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div role="dialog" className="fixed inset-0 z-50 grid place-items-center bg-overlay p-4"><div className="panel max-w-md p-6">{children}</div></div>;
}

export function EmptyState({ kind = "empty" }: { kind?: "empty" | "error" | "denied" }) {
  const map = {
    empty: { icon: Inbox, title: "لا توجد بيانات", text: "أضف أول درجة وظيفية لعرضها هنا.", action: "إضافة درجة" },
    error: { icon: AlertTriangle, title: "تعذّر تحميل البيانات", text: "تحقق من الاتصال ثم حاول مرة أخرى.", action: "إعادة المحاولة" },
    denied: { icon: LockKeyhole, title: "لا توجد صلاحية", text: "ليس لديك إذن لعرض سلم الرواتب.", action: "العودة للرئيسية" },
  };
  const item = map[kind];
  const Icon = item.icon;
  return <div className="grid min-h-64 place-items-center p-8 text-center"><div><Icon className="mx-auto text-muted-foreground" size={34} /><h3 className="mt-3 font-bold">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.text}</p><Button className="mt-4">{item.action}</Button></div></div>;
}

export function Skeleton() {
  return <div className="space-y-4 p-4"><div className="grid gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <BaseSkeleton key={index} className="h-28" />)}</div><BaseSkeleton className="h-96" /></div>;
}