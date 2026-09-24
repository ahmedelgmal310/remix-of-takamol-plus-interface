import { createFileRoute } from "@tanstack/react-router";
import { PlacementMatchPage } from "@/components/salary-placement";

export const Route = createFileRoute("/salary-placement/match")({
  head: () => ({
    meta: [
      { title: "عرض بيانات الموظف ومطابقتها — تكامل بلس" },
      { name: "description", content: "عرض بيانات الموظف ومطابقتها ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:title", content: "عرض بيانات الموظف ومطابقتها — تكامل بلس" },
      { property: "og:description", content: "عرض بيانات الموظف ومطابقتها ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacementMatchPage,
});
