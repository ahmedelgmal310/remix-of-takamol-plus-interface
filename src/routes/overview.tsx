import { createFileRoute } from "@tanstack/react-router";
import { OverviewDashboard } from "@/components/overview-dashboard";

const t = "نظرة عامة — تكاملة بلس";
const d = "نظرة عامة على أنظمة الموارد البشرية والمالية وخدمة العملاء في تكاملة بلس مع المؤشرات والعمليات الأخيرة.";

export const Route = createFileRoute("/overview")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: OverviewDashboard,
});
