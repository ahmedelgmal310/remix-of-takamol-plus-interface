import { createFileRoute } from "@tanstack/react-router";
import { AttendanceDashboardPage } from "@/components/attendance-reference";
const t="الحضور والانصراف — تكامل بلس",d="متابعة حضور وانصراف الموظفين وإحصاءات الدوام اليومية.";
export const Route=createFileRoute("/attendance/")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:AttendanceDashboardPage});
