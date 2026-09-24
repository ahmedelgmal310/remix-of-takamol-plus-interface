import { createFileRoute } from "@tanstack/react-router";
import { RewardIssuePage } from "@/components/reward-issue";

export const Route = createFileRoute("/rewards/issue")({
  head: () => ({
    meta: [
      { title: "إصدار مكافأة — تكامل بلس" },
      { name: "description", content: "إصدار مكافأة للموظف واحتساب قيمتها ومراجعتها." },
      { property: "og:title", content: "إصدار مكافأة — تكامل بلس" },
      { property: "og:description", content: "إصدار مكافأة للموظف واحتساب قيمتها ومراجعتها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RewardIssuePage,
});