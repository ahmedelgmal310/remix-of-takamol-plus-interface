import { createFileRoute } from "@tanstack/react-router";
import { BankAccounts } from "@/components/bank-accounts";
const t = "حسابات البنوك — تكامل بلس";
const d = "إدارة أرصدة الحسابات البنكية ومتابعة عمليات السحب والإيداع والتحويلات والتسويات.";
export const Route = createFileRoute("/finance_/banks")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: BankAccounts,
});
