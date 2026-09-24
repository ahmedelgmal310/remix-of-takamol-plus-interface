import { createFileRoute } from "@tanstack/react-router";
import { CustomerInbox } from "@/components/customer-inbox";
const t = "صندوق الوارد — خدمة العملاء — تكامل بلس";
const d = "استقبال رسائل العملاء من واتساب والمحادثة المباشرة والبريد والرد عليها.";
export const Route = createFileRoute("/customer-service/inbox")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: CustomerInbox,
});
