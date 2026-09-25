import { createFileRoute } from "@tanstack/react-router";
import { Support } from "@/components/support";
const t = "الدعم الفني — تكامل بلس";
const d = "تواصل مع فريق الدعم الفني واحصل على إجابات لأسئلتك ومتابعة طلباتك.";
export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Support,
});
