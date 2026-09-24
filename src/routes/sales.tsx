import { createFileRoute } from "@tanstack/react-router";
import { SalesEntries } from "@/components/sales";
const t = "إدخالات المبيعات — تكامل بلس";
const d = "إدارة وتسجيل فواتير المبيعات ومتابعة حالتها وتوزيعها حسب العملاء.";
export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SalesEntries,
});
