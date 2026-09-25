import { createFileRoute } from "@tanstack/react-router";
import { Permissions } from "@/components/permissions";
const t = "جدول الصلاحيات — تكامل بلس";
const d = "إدارة صلاحيات المستخدمين حسب الأدوار والأنظمة في منصة تكامل بلس.";
export const Route = createFileRoute("/settings_/permissions")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Permissions,
});
