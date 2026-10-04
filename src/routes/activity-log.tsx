import { createFileRoute } from "@tanstack/react-router";
import { ActivityLog } from "@/components/activity-log";
const title = "سجل النشاطات — تكامل بلس";
const description = "سجل النشاطات والعمليات والإجراءات في منصة تكامل بلس.";
export const Route = createFileRoute("/activity-log")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ActivityLog,
});