import { createFileRoute } from "@tanstack/react-router";
import { LettersCertificatesPage } from "@/components/letters-approvals-reference";
const t="الخطابات وشهادات التعريف — تكامل بلس",d="إصدار وإدارة خطابات وشهادات تعريف الموظفين.";
export const Route=createFileRoute("/employees/letters")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:LettersCertificatesPage});
