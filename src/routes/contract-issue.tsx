import { createFileRoute } from "@tanstack/react-router";
import { ContractIssue } from "@/components/contract-issue";
const t = "إصدار العقد والتوقيع الإلكتروني — تكامل بلس";
const d = "إصدار عقد اشتراك العميل في تكامل بلس وتوقيعه إلكترونياً وحفظ نسخة لدى الطرفين.";
export const Route = createFileRoute("/contract-issue")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ContractIssue,
});
