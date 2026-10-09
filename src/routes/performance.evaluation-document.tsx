import { createFileRoute } from "@tanstack/react-router";
import { PerformanceEvaluationDocument } from "@/components/hr-reference-suite";
const title="نموذج تقييم الأداء — تكامل بلس",description="نموذج توضيحي لتقييم الأداء الوظيفي للموظفين.";
export const Route=createFileRoute("/performance/evaluation-document")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:PerformanceEvaluationDocument});
