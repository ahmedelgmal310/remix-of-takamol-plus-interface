import { createFileRoute } from "@tanstack/react-router";
import { ApprovalsPage } from "@/components/letters-approvals-reference";
const t="الاعتمادات والموافقات — تكامل بلس",d="مراجعة واعتماد طلبات الموظفين ومتابعة مراحل الموافقة.";
export const Route=createFileRoute("/requests/approvals")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:ApprovalsPage});
