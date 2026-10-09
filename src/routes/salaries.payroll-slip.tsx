import { createFileRoute } from "@tanstack/react-router";
import { PayrollSlipDocument } from "@/components/hr-reference-suite";
const title="مسير راتب موظف — تكامل بلس",description="مستند توضيحي لمسير راتب موظف واحد.";
export const Route=createFileRoute("/salaries/payroll-slip")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:PayrollSlipDocument});
