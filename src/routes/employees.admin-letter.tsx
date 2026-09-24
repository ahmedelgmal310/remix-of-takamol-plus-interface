import { createFileRoute } from "@tanstack/react-router";
import { AdminLetterPage } from "@/components/admin-letter";
const t="إنشاء خطاب تعريف إداري — تكامل بلس";const d="املأ بيانات الموظف واطبع خطاب التعريف الإداري الرسمي بصيغة A4.";
export const Route=createFileRoute("/employees/admin-letter")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:AdminLetterPage});
