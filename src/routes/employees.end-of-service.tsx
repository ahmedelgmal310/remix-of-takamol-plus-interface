import { createFileRoute } from "@tanstack/react-router";
import { EndOfServicePage } from "@/components/end-of-service";
const t="طلب نهاية خدمة موظف — تكامل بلس";const d="إدارة طلبات نهاية الخدمة وتسوية مستحقات الموظفين وإخلاء الطرف.";
export const Route=createFileRoute("/employees/end-of-service")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:EndOfServicePage});
