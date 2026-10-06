import { createFileRoute } from "@tanstack/react-router";
import { ProgramOrders } from "@/components/program-orders";
const t = "طلبات شراء البرامج — تكامل بلس";
const d = "متابعة طلبات العملاء لشراء نسخ تكامل بلس من استلام الطلب ومراجعة الدفع حتى التفعيل.";
export const Route = createFileRoute("/program-orders")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ProgramOrders,
});
