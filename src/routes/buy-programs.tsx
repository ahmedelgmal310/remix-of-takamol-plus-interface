import { createFileRoute } from "@tanstack/react-router";
import { BuyPrograms } from "@/components/buy-programs";
const t = "شراء البرامج — تكامل بلس";
const d = "اختر برامج تكامل بلس وأكمل الطلب والدفع وتابع حالة طلباتك من حسابك.";
export const Route = createFileRoute("/buy-programs")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: BuyPrograms,
});
