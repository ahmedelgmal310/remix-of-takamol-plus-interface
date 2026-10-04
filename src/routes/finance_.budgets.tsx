import { createFileRoute } from "@tanstack/react-router";
import { Budgets } from "@/components/budgets";
const t = "الميزانيات — تكامل بلس";
const d = "متابعة الميزانيات المعتمدة والمنصرف والمتبقي والفائض حسب الأقسام والمشاريع.";
export const Route = createFileRoute("/finance_/budgets")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Budgets,
});
