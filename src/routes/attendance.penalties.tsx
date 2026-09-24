import { createFileRoute } from "@tanstack/react-router";
import { PenaltiesRegulation } from "@/components/penalties-regulation";
export const Route = createFileRoute("/attendance/penalties")({
  head: () => ({ meta: [
    { title: "لائحة الجزاءات — تكامل بلس" },
    { name: "description", content: "إدارة أنواع المخالفات والجزاءات حسب سياسة الشركة وتطبيقها على الموظفين." },
    { property: "og:title", content: "لائحة الجزاءات — تكامل بلس" },
    { property: "og:description", content: "إدارة أنواع المخالفات والجزاءات حسب سياسة الشركة وتطبيقها على الموظفين." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PenaltiesRegulation,
});
