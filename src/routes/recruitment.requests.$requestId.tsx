import { createFileRoute } from "@tanstack/react-router";
import { RegistrationRequestDetailsPage } from "@/components/registration-request-details";

export const Route = createFileRoute("/recruitment/requests/$requestId")({
  head: ({ params }) => { const title = `تفاصيل طلب ${params.requestId} — تكامل بلس`; const description = "مراجعة بيانات ومستندات طلب التسجيل واتخاذ الإجراء المناسب."; return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }; },
  component: RegistrationRequestDetailsPage,
});