import { createFileRoute } from "@tanstack/react-router";
import { InvoiceDetails } from "@/components/invoice-details";
const t = "تفاصيل الفاتورة — تكامل بلس";
const d = "عرض تفاصيل فاتورة المبيعات وبنودها وحالة الدفع والمرفقات.";
export const Route = createFileRoute("/sales_/invoice")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s['id'] === "string" ? { id: s['id'] } : {}),
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});
function Page() {
  const { id } = Route.useSearch();
  return <InvoiceDetails key={id ?? "default"} id={id} />;
}
