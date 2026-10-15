import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLetterIssuedPage } from "@/components/admin-letter-issued";
import { readIssuedLetterState } from "@/components/admin-letter-issued-data";

const title = "تم إصدار خطاب التعريف بنجاح — تكامل بلس";
const description = "معاينة خطاب التعريف بعد الإصدار وتحميله وطباعته، مع إجراءات مشاركة محلية تجريبية.";
export const Route = createFileRoute("/employees/admin-letter_/issued")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: IssuedRoute,
});
function IssuedRoute() {
  const [data, setData] = useState(() => readIssuedLetterState(undefined));
  useEffect(() => { setData(readIssuedLetterState(window.history.state)); }, []);
  return <AdminLetterIssuedPage letter={data.letter} organizationSettings={data.organizationSettings} onEmail={() => {}} onShare={() => {}} />;
}