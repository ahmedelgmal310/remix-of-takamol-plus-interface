import { createFileRoute } from "@tanstack/react-router";
import { EmployeePromotionPage } from "@/components/employee-promotion";
const t = "طلب ترقية موظف — تكامل بلس";
const d = "إدارة طلبات ترقية الموظفين مع الأداء والتأثير المالي ومسار الموافقة.";
export const Route = createFileRoute("/employees/promotion")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: EmployeePromotionPage,
});
