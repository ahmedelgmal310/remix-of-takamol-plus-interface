import { createFileRoute } from "@tanstack/react-router";
import { SalaryRuns } from "@/components/salary-runs";

export const Route = createFileRoute("/salaries/runs")({
  head: () => ({ meta: [
    { title: "مسيرات الرواتب — تكامل بلس" },
    { name: "description", content: "عرض مسيرات الرواتب وتفاصيلها ومؤشرات الرواتب والخصومات في تكامل بلس." },
    { property: "og:title", content: "مسيرات الرواتب — تكامل بلس" },
    { property: "og:description", content: "عرض مسيرات الرواتب وتفاصيلها ومؤشرات الرواتب والخصومات في تكامل بلس." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SalaryRuns,
});
