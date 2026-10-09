import { createFileRoute } from "@tanstack/react-router";
import { PayrollGroupDocument } from "@/components/hr-reference-suite";
const title="مسير رواتب الموظفين — تكامل بلس",description="مستند توضيحي لمسير رواتب الموظفين الشهري.";
export const Route=createFileRoute("/salaries/payroll-sheet")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:PayrollGroupDocument});
