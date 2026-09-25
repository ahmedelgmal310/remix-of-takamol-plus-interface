import { createFileRoute } from "@tanstack/react-router";
import { OrgStructure } from "@/components/org-structure";
const t = "الهيكل التنظيمي — تكامل بلس";
const d = "عرض الهيكل التنظيمي للجهة مع الرواتب والتكاليف وعدد الموظفين في كل إدارة.";
export const Route = createFileRoute("/employees/structure")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: OrgStructure,
});
