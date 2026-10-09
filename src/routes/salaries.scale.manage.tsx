import { createFileRoute } from "@tanstack/react-router";
import { SalaryScaleManagePage } from "@/components/salary-reference-pages";
const t="إدارة سلم الرواتب — تكامل بلس",d="إدارة درجات سلم الرواتب والبدلات والإعدادات المرتبطة.";
export const Route=createFileRoute("/salaries/scale/manage")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SalaryScaleManagePage});
