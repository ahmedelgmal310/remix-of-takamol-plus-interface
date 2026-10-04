import { createFileRoute } from "@tanstack/react-router";
import { PurchaseOrderDoc } from "@/components/purchase-order-doc";

export const Route = createFileRoute("/purchases/order")({
  head: () => ({
    meta: [
      { title: "أمر شراء PO-2026-000098 — تكاملة بلس" },
      { name: "description", content: "عرض وطباعة أمر شراء بتفاصيل المورد والأصناف ومعلومات التسليم والشروط والاعتمادات." },
      { property: "og:title", content: "أمر شراء — تكاملة بلس" },
      { property: "og:description", content: "أمر شراء قابل للطباعة بتصميم تكاملة بلس." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PurchaseOrderDoc,
});
