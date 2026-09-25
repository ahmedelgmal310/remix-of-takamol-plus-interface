import { createFileRoute } from "@tanstack/react-router";
import { SystemSelect } from "@/components/system-select";
const t = "اختيار النظام — تكامل بلس";
const d = "اختر النظام الذي ترغب في استخدامه: الموارد البشرية، المالية، العقود، المشاريع، خدمة العملاء وغيرها.";
export const Route = createFileRoute("/systems")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SystemSelect,
});
