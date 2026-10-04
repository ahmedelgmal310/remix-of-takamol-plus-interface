import { createFileRoute } from "@tanstack/react-router";
import { TreasuriesBanks } from "@/components/treasuries-banks";
const t = "الخزائن والبنوك — تكامل بلس";
const d = "متابعة أرصدة الخزائن والحسابات البنكية والإيرادات والمصروفات وآخر الحركات المالية.";
export const Route = createFileRoute("/finance_/treasuries")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: TreasuriesBanks,
});
