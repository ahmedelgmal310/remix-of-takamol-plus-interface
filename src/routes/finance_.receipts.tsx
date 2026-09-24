import { createFileRoute } from "@tanstack/react-router";
import { ReceiptVouchers } from "@/components/receipt-vouchers";
const t = "سندات القبض — تكامل بلس";
const d = "إدارة ومتابعة سندات القبض والمبالغ المحصلة والمعلقة وتقاريرها حسب طريقة الدفع.";
export const Route = createFileRoute("/finance_/receipts")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ReceiptVouchers,
});
