import { createFileRoute } from "@tanstack/react-router";
import { PurchaseProgram } from "@/components/purchase-program";

const title = "شراء البرنامج — تكامل بلس";
const description = "اختر برامج الموارد البشرية والشؤون المالية وخدمة العملاء المناسبة لمنشأتك في تكامل بلس.";
export const Route = createFileRoute("/purchase-program")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PurchaseProgram,
});