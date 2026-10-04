import { createFileRoute } from "@tanstack/react-router";
import { Beneficiaries } from "@/components/beneficiaries";
const t = "المستفيدون — تكامل بلس";
const d = "إدارة المستفيدين من الأطباء والكادر الصحي ومتابعة حالات الاعتماد والمستندات والعقود.";
export const Route = createFileRoute("/beneficiaries")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Beneficiaries,
});
