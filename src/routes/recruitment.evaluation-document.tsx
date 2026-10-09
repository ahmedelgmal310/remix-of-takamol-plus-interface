import { createFileRoute } from "@tanstack/react-router";
import { CandidateEvaluationDocument } from "@/components/hr-reference-suite";
const title="نموذج تقييم المرشحين — تكامل بلس",description="نموذج توضيحي لتقييم المرشحين للوظائف.";
export const Route=createFileRoute("/recruitment/evaluation-document")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:CandidateEvaluationDocument});
