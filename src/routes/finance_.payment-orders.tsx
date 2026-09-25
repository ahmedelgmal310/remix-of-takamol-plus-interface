import { createFileRoute } from "@tanstack/react-router";
import { PaymentOrders } from "@/components/payment-orders";
const t = "أوامر الصرف — تكامل بلس";
const d = "إدارة ومتابعة أوامر الصرف واعتمادها ومراقبة تفاصيلها وتوزيعها حسب الإدارات.";
export const Route = createFileRoute("/finance_/payment-orders")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PaymentOrders,
});
