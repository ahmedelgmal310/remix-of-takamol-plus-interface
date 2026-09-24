import { createFileRoute } from "@tanstack/react-router";
import { JobPostingPage } from "@/components/job-posting";
const t="طرح وظيفة جديدة — تكامل بلس";const d="إنشاء إعلان وظيفي، نشره على القنوات، واستقبال طلبات المرشحين وفرزها.";
export const Route=createFileRoute("/recruitment/job-posting")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:JobPostingPage});
