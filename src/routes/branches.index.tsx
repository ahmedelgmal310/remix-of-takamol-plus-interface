import { createFileRoute } from "@tanstack/react-router";
import { BranchManagement } from "@/components/branch-management";
const title = "إدارة الفروع — تكامل بلس", description = "إدارة فروع المنشأة ومتابعة المدن وحالة تفعيل كل فرع.";
export const Route = createFileRoute("/branches/")({head: () => ({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component: BranchManagement});