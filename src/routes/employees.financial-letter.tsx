import { createFileRoute } from "@tanstack/react-router";
import { FinancialLetterPage } from "@/components/financial-letter";
const t="إنشاء خطاب تعريف مالي — تكامل بلس";const d="تعبئة بيانات الموظف والراتب وإصدار خطاب تعريف مالي جاهز للطباعة.";
export const Route=createFileRoute("/employees/financial-letter")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:FinancialLetterPage});
