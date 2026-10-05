import { createFileRoute } from "@tanstack/react-router";
import { Register } from "@/components/register";
const title = "تسجيل مستخدم جديد — تكامل بلس";
const description = "واجهة إنشاء حساب تجريبي جديد في منصة تكامل بلس.";
export const Route = createFileRoute("/register")({ head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Register });