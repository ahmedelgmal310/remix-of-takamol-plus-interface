import { createFileRoute } from "@tanstack/react-router";
import { PurchaseInvoiceNew } from "@/components/purchase-invoice-new";
const t = "إدخال فاتورة مشتريات — تكامل بلس";
const d = "إدخال بيانات فاتورة المشتريات والمورد وتفاصيل الأصناف والمبالغ والمرفقات.";
export const Route = createFileRoute("/purchases/new")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PurchaseInvoiceNew,
});
