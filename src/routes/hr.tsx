import { createFileRoute } from "@tanstack/react-router";
import { HrPortal } from "@/components/hr-portal";
const t = "بوابة الموارد البشرية — تكامل بلس";
const d = "انتقل بسرعة بين شاشات الموارد البشرية: الموظفون والمنشآت والعقود والرواتب والإجازات والتقارير.";
export const Route = createFileRoute("/hr")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HrPortal,
});
