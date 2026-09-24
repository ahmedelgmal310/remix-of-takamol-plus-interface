import { createFileRoute } from "@tanstack/react-router";
import { PlacementConfirmPage } from "@/components/salary-placement";

export const Route = createFileRoute("/salary-placement/confirm")({
  head: () => ({
    meta: [
      { title: "إشعار التسكين وتأكيد العملية — تكامل بلس" },
      { name: "description", content: "إشعار التسكين وتأكيد العملية ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:title", content: "إشعار التسكين وتأكيد العملية — تكامل بلس" },
      { property: "og:description", content: "إشعار التسكين وتأكيد العملية ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacementConfirmPage,
});
