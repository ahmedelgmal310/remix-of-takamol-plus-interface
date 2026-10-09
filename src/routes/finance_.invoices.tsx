import { createFileRoute } from "@tanstack/react-router";
import { FinanceInvoices } from "@/components/finance-reference-pages";
const title="قائمة الفواتير — تكامل بلس",description="إدارة الفواتير ومتابعة حالتها وسدادها في تكامل بلس";
export const Route=createFileRoute("/finance_/invoices")({head:()=>({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:FinanceInvoices});