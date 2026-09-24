import { createFileRoute } from "@tanstack/react-router";
import { SalesInvoiceNew } from "@/components/sales-invoice-new";
const t = "إدخال فاتورة مبيعات — تكامل بلس";
const d = "إضافة فاتورة مبيعات جديدة مع اختيار العميل والأصناف وحساب الضريبة والإجمالي تلقائيًا.";
export const Route = createFileRoute("/sales_/new")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SalesInvoiceNew,
});
