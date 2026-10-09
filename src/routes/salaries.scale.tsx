import { createFileRoute } from "@tanstack/react-router";
import { SalaryScaleOverview } from "@/components/hr-reference-suite";

export const Route = createFileRoute("/salaries/scale")({
  head: () => ({ meta: [
    { title: "سلم الرواتب — تكامل بلس" },
    { name: "description", content: "إدارة سلم الرواتب وتسكين الموظفين على الدرجات والفئات الوظيفية." },
    { property: "og:title", content: "سلم الرواتب — تكامل بلس" },
    { property: "og:description", content: "إدارة سلم الرواتب وتسكين الموظفين على الدرجات والفئات الوظيفية." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SalaryScaleOverview,
});
