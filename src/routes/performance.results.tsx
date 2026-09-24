import { createFileRoute } from "@tanstack/react-router";
import { EvaluationResultsPage } from "@/components/evaluation-results";
const t = "نتائج تقييم المرشحين — تكامل بلس";
const d = "عرض الدرجات النهائية والمفاضلة بين المرشحين وتوصية لجنة التقييم.";
export const Route = createFileRoute("/performance/results")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: EvaluationResultsPage,
});
