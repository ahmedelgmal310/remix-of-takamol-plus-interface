import { createFileRoute } from "@tanstack/react-router";
import { EmployeeDocuments } from "@/components/employee-documents";
const t = "مستندات الموظف — تكامل بلس", d = "إدارة جميع مستندات الموظف ومتابعة حالة صلاحيتها.";
export const Route = createFileRoute("/employees/documents")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: EmployeeDocuments,
});
