import { createFileRoute } from "@tanstack/react-router";
import { AttendanceManagePage } from "@/components/attendance-reference";
const t="إدارة الحضور والانصراف — تكامل بلس",d="مراجعة وتعديل سجلات حضور وانصراف الموظفين.";
export const Route=createFileRoute("/attendance/manage")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:AttendanceManagePage});
