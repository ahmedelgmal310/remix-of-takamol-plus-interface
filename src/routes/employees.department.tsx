import { createFileRoute } from "@tanstack/react-router";
import { DepartmentDetails } from "@/components/department-details";
export const Route = createFileRoute("/employees/department")({
  head: () => ({ meta: [
    { title: "تفاصيل الإدارة — تكامل بلس" },
    { name: "description", content: "عرض المناصب والموظفين والرواتب الخاصة بكل إدارة في الهيكل التنظيمي." },
    { property: "og:title", content: "تفاصيل الإدارة — تكامل بلس" },
    { property: "og:description", content: "عرض المناصب والموظفين والرواتب الخاصة بكل إدارة في الهيكل التنظيمي." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DepartmentDetails,
});
