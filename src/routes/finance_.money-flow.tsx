import { createFileRoute } from "@tanstack/react-router";
import { MoneyFlow } from "@/components/money-flow";
const t = "حركة الأموال — تكامل بلس";
const d = "متابعة حركة الإيرادات والمصروفات والتحويلات وجميع العمليات المالية.";
export const Route = createFileRoute("/finance_/money-flow")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MoneyFlow,
});
