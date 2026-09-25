import { createFileRoute } from "@tanstack/react-router";
import { CustomerRating } from "@/components/customer-rating";
const t = "تقييم العملاء من الموظفين — تكامل بلس";
const d = "متابعة التذاكر وأداء فريق خدمة العملاء وتقييمات العملاء في جميع قنوات التواصل.";
export const Route = createFileRoute("/customer-service/rating")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: CustomerRating,
});
