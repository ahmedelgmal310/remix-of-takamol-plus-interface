import { createFileRoute } from "@tanstack/react-router";
import { RegistrationRequestsPage } from "@/components/registration-requests";

const title = "طلبات التسجيل الجديدة — تكامل بلس";
const description = "مراجعة وإدارة طلبات تسجيل المستخدمين.";
export const Route = createFileRoute("/recruitment/requests/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: RegistrationRequestsPage,
});