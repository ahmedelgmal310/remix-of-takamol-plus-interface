import { createFileRoute } from "@tanstack/react-router";
import { Notifications } from "@/components/notifications";
const t = "الإشعارات — تكامل بلس";
const d = "متابعة جميع الإشعارات والتنبيهات والمهام والطلبات والرسائل الخاصة بك في مكان واحد.";
export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Notifications,
});
