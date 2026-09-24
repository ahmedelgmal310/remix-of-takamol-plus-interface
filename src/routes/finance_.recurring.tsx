import { createFileRoute } from "@tanstack/react-router";
import { RecurringCosts } from "@/components/recurring-costs";
const t = "التكاليف المتكررة — تكامل بلس";
const d = "إدارة التكاليف المتكررة كالإيجار والرواتب والمرافق ومتابعة مواعيد استحقاقها.";
export const Route = createFileRoute("/finance_/recurring")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: RecurringCosts,
});
