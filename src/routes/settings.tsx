import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/settings";
const t = "الإعدادات — تكامل بلس";
const d = "إدارة إعدادات النظام: الصلاحيات، الفريق، الاشتراك، الضرائب، الأمان، الحضور والبصمة والعملات.";
export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SettingsPage,
});
