import { createFileRoute } from "@tanstack/react-router";
import { LabsJoinPage, type JoinStage } from "@/components/labs-join";
import { labsJoinReference } from "@/data/mockData";

const title = "انضمام مركز طبي | تكامل بلس";
const description = "سجّل مركزك الطبي في منصة تكامل بلس وتابع حالة طلب الانضمام.";

export const Route = createFileRoute("/labs/join")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: LabsJoinRoute,
});

// لا توجد خدمة انضمام متصلة؛ الإرسال تجريبي محلي يولّد رقماً بالصيغة المعتمدة
function LabsJoinRoute() {
  const stagesFor = (at: string): JoinStage[] => [
    { title: "تم استلام الطلب", description: "تم استلام طلبك بنجاح", state: "done", at },
    { title: "قيد المراجعة", description: "جاري مراجعة البيانات والمستندات", state: "current" },
    { title: "اعتماد الطلب", description: "سيتم إشعارك بعد اعتماد الطلب", state: "pending" },
    { title: "تفعيل الحساب", description: "سيتم تفعيل حسابك وإرسال بيانات الدخول", state: "pending" },
  ];
  let last: { no: string; at: string } | null = null;
  return <LabsJoinPage {...labsJoinReference}
    onSubmit={() => { const d = new Date(); const at = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} - ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; last = { no: `${labsJoinReference.requestPrefix}${String(Math.floor(Math.random() * 9000) + 1000)}`, at }; return { requestNo: last.no, submittedAt: at }; }}
    onTrack={(_by, v) => (last && v.replace("#", "") === last.no ? stagesFor(last.at) : null)}
  />;
}
