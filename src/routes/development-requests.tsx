import { createFileRoute } from "@tanstack/react-router";
import { DevelopmentRequests } from "@/components/development-requests";
const title = "طلب تطوير برمجي — تكامل بلس";
const description = "إنشاء طلبات التطوير البرمجي ومتابعة حالاتها ومرفقاتها في تكامل بلس.";
export const Route = createFileRoute("/development-requests")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: DevelopmentRequests,
});
