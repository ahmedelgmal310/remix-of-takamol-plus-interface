import { createFileRoute } from "@tanstack/react-router";
import { PlacementSelectPage } from "@/components/salary-placement";

export const Route = createFileRoute("/salary-placement/select")({
  head: () => ({
    meta: [
      { title: "اختيار الموظف للتسكين — تكامل بلس" },
      { name: "description", content: "اختيار الموظف للتسكين ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:title", content: "اختيار الموظف للتسكين — تكامل بلس" },
      { property: "og:description", content: "اختيار الموظف للتسكين ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacementSelectPage,
});
