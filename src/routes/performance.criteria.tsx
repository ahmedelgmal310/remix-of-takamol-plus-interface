import { createFileRoute } from "@tanstack/react-router";
import { EvaluationCriteriaSetup } from "@/components/evaluation-criteria-setup";
export const Route = createFileRoute("/performance/criteria")({
  head: () => ({ meta: [
    { title: "إعداد معايير التقييم — تكامل بلس" },
    { name: "description", content: "إضافة وتحديد عناصر التقييم والوزن النسبي لكل معيار لتقييم المرشحين." },
    { property: "og:title", content: "إعداد معايير التقييم — تكامل بلس" },
    { property: "og:description", content: "إضافة وتحديد عناصر التقييم والوزن النسبي لكل معيار لتقييم المرشحين." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: EvaluationCriteriaSetup,
});
