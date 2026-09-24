import { createFileRoute } from "@tanstack/react-router";
import { EmployeeTransferPage } from "@/components/employee-transfer";
const t = "طلب نقل موظف — تكامل بلس";
const d = "تقديم طلب نقل موظف بين الأقسام أو الفروع أو المواقع مع المرفقات وسير الموافقات.";
export const Route = createFileRoute("/employees/transfer")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: EmployeeTransferPage,
});
