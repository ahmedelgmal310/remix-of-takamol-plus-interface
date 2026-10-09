import { createFileRoute } from "@tanstack/react-router";
import { SalaryCriteriaPage } from "@/components/hr-reference-suite";
const title="معايير وشروط الرواتب — تكامل بلس",description="إدارة معايير وشروط سلم الرواتب والأقسام المرتبطة.";
export const Route=createFileRoute("/salaries/criteria")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SalaryCriteriaPage});
