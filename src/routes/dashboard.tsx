import { createFileRoute } from "@tanstack/react-router";
import { HomeDashboard } from "@/components/home-dashboard";
const t = "لوحة القيادة — تكامل بلس";
const d = "لوحة القيادة في تكامل بلس تعرض الموارد البشرية والمالية وخدمة العملاء والإحصائيات والمهام الأخيرة.";
export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HomeDashboard,
});