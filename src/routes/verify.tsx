import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { VerifyPage } from "@/components/verify-page";
import { readVerifyOrganization, type VerifyOrganization } from "@/components/verify-data";
export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [
    { title: "التحقق من شهادة تعريف موظف — تكامل بلس" },
    { name: "description", content: "التحقق من شهادة تعريف موظف باستخدام رقم الوثيقة والهوية الوطنية وتاريخ الإصدار." },
    { property: "og:title", content: "التحقق من شهادة تعريف موظف — تكامل بلس" },
    { property: "og:description", content: "تحقق من بيانات شهادة التعريف الصادرة إلكترونيًا." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: VerifyRoute,
});
function VerifyRoute() {
  const [settings, setSettings] = useState<VerifyOrganization>({});
  useEffect(() => { setSettings(readVerifyOrganization(window.history.state)); }, []);
  return <VerifyPage organizationSettings={settings} />;
}
