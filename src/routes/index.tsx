import { createFileRoute } from "@tanstack/react-router";
import { HomeDashboard } from "@/components/home-dashboard";
const t = "الرئيسية — تكامل بلس";
const d = "لوحة ترحيب تكامل بلس: صندوق العمل والموافقات والطلبات المالية وتذاكر العملاء في مكان واحد.";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HomeDashboard,
});
