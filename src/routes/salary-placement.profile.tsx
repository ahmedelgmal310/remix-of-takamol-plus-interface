import { createFileRoute } from "@tanstack/react-router";
import { PlacementProfilePage } from "@/components/salary-placement";

export const Route = createFileRoute("/salary-placement/profile")({
  head: () => ({
    meta: [
      { title: "انعكاس التسكين في ملف الموظف — تكامل بلس" },
      { name: "description", content: "انعكاس التسكين في ملف الموظف ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:title", content: "انعكاس التسكين في ملف الموظف — تكامل بلس" },
      { property: "og:description", content: "انعكاس التسكين في ملف الموظف ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacementProfilePage,
});
