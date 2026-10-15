import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CareersLogin } from "@/components/careers-login";
import { readPortalOrganization, type PortalOrganization } from "@/components/careers-login.data";
const title = "بوابة المتقدمين والموظفين — الفرص الصحية";
const description = "بوابة فرص الأطباء والكادر الصحي، تسجيل دخول المتقدمين والموظفين وخطوات التقديم على الوظائف.";
export const Route = createFileRoute("/careers_/login")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: CareersLoginRoute,
});
function CareersLoginRoute() {
  const [settings, setSettings] = useState<PortalOrganization>({});
  useEffect(() => { setSettings(readPortalOrganization(window.history.state)); }, []);
  return <CareersLogin organizationSettings={settings}/>;
}
