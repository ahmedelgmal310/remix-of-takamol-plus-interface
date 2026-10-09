import { createFileRoute } from "@tanstack/react-router";
import { CandidateEvaluationDocument } from "@/components/hr-reference-suite";

export const Route = createFileRoute("/recruitment/evaluation")({
  head: () => ({
    meta: [
      { title: "اختيار المرشح الأفضل — تكامل بلس" },
      { name: "description", content: "نتائج تقييم المرشحين والمفاضلة لاختيار الأنسب للوظيفة." },
      { property: "og:title", content: "اختيار المرشح الأفضل — تكامل بلس" },
      { property: "og:description", content: "نتائج تقييم المرشحين والمفاضلة لاختيار الأنسب للوظيفة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CandidateEvaluationDocument,
});