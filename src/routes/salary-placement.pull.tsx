import { createFileRoute } from "@tanstack/react-router";
import { PlacementPullPage } from "@/components/salary-placement";

export const Route = createFileRoute("/salary-placement/pull")({
  head: () => ({
    meta: [
      { title: "سحب بيانات الموظف وتسكينه — تكامل بلس" },
      { name: "description", content: "سحب بيانات الموظف وتسكينه ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:title", content: "سحب بيانات الموظف وتسكينه — تكامل بلس" },
      { property: "og:description", content: "سحب بيانات الموظف وتسكينه ضمن آلية تسكين الموظف في سلم الرواتب." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlacementPullPage,
});
