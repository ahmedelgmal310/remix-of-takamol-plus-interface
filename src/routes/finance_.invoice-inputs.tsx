import { createFileRoute } from "@tanstack/react-router";
import { InvoiceInputs } from "@/components/invoice-inputs";
const t = "قائمة الإدخالات للفواتير — تكامل بلس";
const d = "جميع البيانات الأساسية المطلوبة لإصدار فواتير المبيعات والمشتريات والإدخالات المساندة.";
export const Route = createFileRoute("/finance_/invoice-inputs")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: InvoiceInputs,
});
