import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/components/login";
const title = "تسجيل الدخول — تكامل بلس";
const description = "سجل الدخول إلى منصة تكامل بلس لإدارة الموارد البشرية والمالية وخدمة العملاء.";
export const Route = createFileRoute("/login")({ head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Login });