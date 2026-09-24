import { createFileRoute } from "@tanstack/react-router";
import { FinancialReports } from "@/components/financial-reports";
const t = "التقارير المالية — تكامل بلس";
const d = "متابعة الأداء المالي والإيرادات والمصروفات وصافي الربح والتقارير التفصيلية للمؤسسة.";
export const Route = createFileRoute("/reports/financial")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: FinancialReports,
});
