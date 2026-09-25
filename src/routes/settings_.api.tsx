import { createFileRoute } from "@tanstack/react-router";
import { ApiAccess } from "@/components/api-access";
const t = "الوصول البرمجي (API) — تكامل بلس";
const d = "اربط نظامك مع تكامل بلس بكل سهولة وأمان عبر مفاتيح API وأمثلة الاستخدام والتوثيق.";
export const Route = createFileRoute("/settings_/api")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ApiAccess,
});
