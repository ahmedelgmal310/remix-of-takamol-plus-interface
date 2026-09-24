import { createFileRoute } from "@tanstack/react-router";
import { EmployeeAdvancesPage } from "@/components/employee-advances";
const t="السلف للموظفين — تكامل بلس";const d="إدارة طلبات السلف وحساب الاستحقاق بناءً على الراتب والخبرة ومكافأة نهاية الخدمة.";
export const Route=createFileRoute("/salaries/advances")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:EmployeeAdvancesPage});
