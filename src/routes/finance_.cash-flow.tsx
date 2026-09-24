import { createFileRoute } from "@tanstack/react-router";
import { CashFlow } from "@/components/cash-flow";
const t = "التدفقات النقدية — تكامل بلس";
const d = "مراقبة حركة النقد الداخل والخارج وصافي التدفق والرصيد النقدي.";
export const Route = createFileRoute("/finance_/cash-flow")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: CashFlow,
});
