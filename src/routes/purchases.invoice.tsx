import { createFileRoute } from "@tanstack/react-router";
import { PurchaseInvoiceDoc } from "@/components/purchase-invoice-doc";

export const Route = createFileRoute("/purchases/invoice")({
  head: () => ({
    meta: [
      { title: "فاتورة شراء PI-2026-000125 — تكاملة بلس" },
      { name: "description", content: "عرض وطباعة فاتورة شراء بتفاصيل المورد والمشتري والأصناف والضريبة والاعتمادات." },
      { property: "og:title", content: "فاتورة شراء — تكاملة بلس" },
      { property: "og:description", content: "فاتورة شراء قابلة للطباعة بتصميم تكاملة بلس." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PurchaseInvoiceDoc,
});
