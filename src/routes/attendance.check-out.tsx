import { createFileRoute } from "@tanstack/react-router";
import { AttendancePunchPage } from "@/components/attendance-reference";
const t="تسجيل الانصراف — تكامل بلس",d="تسجيل انصراف الموظف وعرض حالة الدوام اليومية.";
export const Route=createFileRoute("/attendance/check-out")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:()=> <AttendancePunchPage mode="check-out"/>});
