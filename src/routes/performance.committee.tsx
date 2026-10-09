import { createFileRoute } from "@tanstack/react-router";
import { EvaluationCommitteesPage } from "@/components/hr-reference-suite";
const t="تقييم المرشحين من اللجان — تكامل بلس";const d="إدارة تقييم الموظفين المرشحين للترقيات أو المبادرات عبر لجان التقييم.";
export const Route=createFileRoute("/performance/committee")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:EvaluationCommitteesPage});
