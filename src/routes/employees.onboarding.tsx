import { createFileRoute } from "@tanstack/react-router";
import { EmployeeOnboarding } from "@/components/employee-onboarding";
const title = "تهيئة الموظف — تكامل بلس";
const description = "تهيئة الموظف الجديد ومتابعة بياناته ومستنداته ومهام التهيئة في تكامل بلس.";
export const Route = createFileRoute("/employees/onboarding")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: EmployeeOnboarding,
});
