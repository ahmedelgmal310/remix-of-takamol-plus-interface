import { createFileRoute } from "@tanstack/react-router";
import { HrReports } from "@/components/hr-reports";

const title = "تقارير الموارد البشرية — تكامل بلس";
const description = "تقارير الموظفين حسب الجنسية والفئة الوظيفية والقسم مع مؤشرات القوى العاملة والرواتب.";
export const Route = createFileRoute("/reports/hr")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HrReports,
});