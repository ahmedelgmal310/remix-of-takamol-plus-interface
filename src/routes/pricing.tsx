import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/pricing";
const t = "باقات الاشتراك — تكامل بلس";
const d = "باقات اشتراك مرنة تناسب جميع احتياجاتك: الأساسية والاحترافية والمميزة والمؤسسات.";
export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Pricing,
});
