import { createFileRoute } from "@tanstack/react-router";
import { LeavesDashboard } from "@/components/leaves-dashboard";
const title="الإجازات — تكامل بلس",description="إدارة أرصدة وطلبات إجازات الموظفين.";
export const Route=createFileRoute("/leaves/")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:LeavesDashboard});