import { createFileRoute } from "@tanstack/react-router";
import { SalaryPayrollReferencePage } from "@/components/salary-reference-pages";

export const Route = createFileRoute("/salaries/payroll")({
  head: () => ({ meta: [
    { title: "الرواتب والبدلات — تكامل بلس" },
    { name: "description", content: "متابعة مسير الرواتب والبدلات والخصومات للموظفين في تكامل بلس." },
    { property: "og:title", content: "الرواتب والبدلات — تكامل بلس" },
    { property: "og:description", content: "متابعة مسير الرواتب والبدلات والخصومات للموظفين في تكامل بلس." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SalaryPayrollReferencePage,
});
