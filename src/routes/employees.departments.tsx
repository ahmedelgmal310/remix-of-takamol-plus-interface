import { createFileRoute } from "@tanstack/react-router";
import { DepartmentsDashboard } from "@/components/departments-dashboard";

export const Route = createFileRoute("/employees/departments")({
  head: () => ({ meta: [
    { title: "الأقسام — تكامل بلس" },
    { name: "description", content: "عرض الأقسام وإدارتها والهيكل التنظيمي وتوزيع الموظفين في تكامل بلس." },
    { property: "og:title", content: "الأقسام — تكامل بلس" },
    { property: "og:description", content: "عرض الأقسام وإدارتها والهيكل التنظيمي وتوزيع الموظفين في تكامل بلس." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DepartmentsDashboard,
});
