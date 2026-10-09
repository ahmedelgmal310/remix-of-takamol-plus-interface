import { createFileRoute } from "@tanstack/react-router";
import { SalaryJobsPage } from "@/components/hr-reference-suite";
const title="الوظائف المرتبطة — تكامل بلس",description="الوظائف المرتبطة بسلم الرواتب والبدلات والمكافآت.";
export const Route=createFileRoute("/salaries/jobs")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SalaryJobsPage});
