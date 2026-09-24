import { createFileRoute } from "@tanstack/react-router";
import { MedicalCenterDashboard } from "@/components/medical-center-dashboard";
export const Route = createFileRoute("/medical-exam/dashboard")({
  head: () => ({ meta: [
    { title: "لوحة المركز الطبي — تكامل بلس" },
    { name: "description", content: "متابعة طلبات الفحص الطبي من الاستلام حتى إرسال النتيجة للشركة." },
    { property: "og:title", content: "لوحة المركز الطبي — تكامل بلس" },
    { property: "og:description", content: "متابعة طلبات الفحص الطبي من الاستلام حتى إرسال النتيجة للشركة." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: MedicalCenterDashboard,
});
