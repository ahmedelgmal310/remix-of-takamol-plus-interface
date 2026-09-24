import { createFileRoute } from "@tanstack/react-router";
import { BankMovements } from "@/components/bank-movements";
const t = "حركة البنوك — تكامل بلس";
const d = "متابعة جميع معاملات البنوك والإيداعات والسحوبات والحوالات والرصيد الحالي.";
export const Route = createFileRoute("/finance_/bank-movements")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: BankMovements,
});
