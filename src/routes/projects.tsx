import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/projects";
const t = "المشاريع والمهام — تكامل بلس";
const d = "إدارة المشاريع ومتابعة المهام وتحقيق الأهداف مع مخطط جانت والتقويم.";
export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Projects,
});
