import { createFileRoute } from "@tanstack/react-router";
import { MonthClose } from "@/components/month-close";
const t = "إقفال الشهر — تكامل بلس";
const d = "إدارة إقفال الشهر للرواتب والمصروفات والإيرادات والقيود المحاسبية والتقارير الختامية.";
export const Route = createFileRoute("/finance_/month-close")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MonthClose,
});
