import { createFileRoute } from "@tanstack/react-router";
import { AdminLetterPage } from "@/components/admin-letter";
const t="إصدار شهادة تعريف إدارية — تكامل بلس";const d="إصدار شهادة تعريف إدارية للموظف مع التخصيص والتوقيع والاعتماد الإلكتروني.";
export const Route=createFileRoute("/employees/admin-letter")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:AdminLetterPage});
