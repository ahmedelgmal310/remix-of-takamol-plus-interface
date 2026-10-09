import { createFileRoute } from "@tanstack/react-router";
import { LetterSuccessPage } from "@/components/letters-approvals-reference";
const t="تم إصدار خطاب التعريف — تكامل بلس",d="معاينة نتيجة إصدار خطاب تعريف الموظف وإجراءات المستند.";
export const Route=createFileRoute("/employees/letters/success")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:LetterSuccessPage});
