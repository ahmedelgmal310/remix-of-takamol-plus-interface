import { createFileRoute } from "@tanstack/react-router";
import { AllowancesRewardsPage } from "@/components/salary-reference-pages";
const t="البدلات والمكافآت — تكامل بلس",d="إدارة أنواع البدلات والمكافآت وحالات صرفها.";
export const Route=createFileRoute("/salaries/allowances")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:AllowancesRewardsPage});
