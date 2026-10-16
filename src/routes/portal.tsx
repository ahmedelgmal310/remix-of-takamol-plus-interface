import { createFileRoute } from "@tanstack/react-router";
import { ApplicantPortal } from "@/components/applicant-portal";

const title = "بوابة المتقدم — طلباتي | تكامل بلس";
const description = "متابعة طلبات التوظيف وخدمات المتقدمين للأطباء والكادر الصحي في منصة تكامل بلس.";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: PortalRoute,
});

// لا توجد خدمة طلبات متصلة بعد؛ تُمرَّر البيانات عبر الخصائص عند الربط
function PortalRoute() {
  return <ApplicantPortal />;
}
