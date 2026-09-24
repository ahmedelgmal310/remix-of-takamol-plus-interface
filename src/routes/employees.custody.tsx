import { createFileRoute } from "@tanstack/react-router";
import { CustodyPage } from "@/components/employee-custody";
const t="العهد للموظفين — تكامل بلس";const d="إدارة جميع العهد والأصول المسلمة للموظفين ومتابعة حالتها وتسجيل عهد جديدة.";
export const Route=createFileRoute("/employees/custody")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:CustodyPage});
