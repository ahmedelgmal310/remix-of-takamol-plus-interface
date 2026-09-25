import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassword } from "@/components/forgot-password";
const t = "استعادة كلمة المرور — تكامل بلس";
const d = "استعد الوصول إلى حسابك في تكامل بلس بخطوات بسيطة وآمنة.";
export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ForgotPassword,
});
