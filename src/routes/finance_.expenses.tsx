import { createFileRoute } from "@tanstack/react-router";
import { FinanceExpenses } from "@/components/finance-reference-pages";
const title="المصروفات — تكامل بلس",description="إدارة المصروفات والاعتمادات والمستندات في تكامل بلس";
export const Route=createFileRoute("/finance_/expenses")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:FinanceExpenses});