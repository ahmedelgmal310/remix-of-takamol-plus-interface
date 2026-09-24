import { createFileRoute } from "@tanstack/react-router";
import { PlacementDecisionPage } from "@/components/salary-placement";

export const Route = createFileRoute("/salary-placement/decision")({
  head: () => ({
    meta: [
      { title: "إصدار قرار التسكين — تكامل بلس" },
      { name: "description", content: "إصدار قرار التسكين ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:title", content: "إصدار قرار التسكين — تكامل بلس" },
      { property: "og:description", content: "إصدار قرار التسكين ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacementDecisionPage,
});
