import { createFileRoute } from "@tanstack/react-router";
import { PenaltiesRegulation, penaltiesReferenceApplication } from "@/components/penalties-regulation";
import { penaltyApprovalSteps } from "@/components/penalties-regulation.data";
export const Route = createFileRoute("/attendance/penalties")({
  head: () => ({ meta: [
    { title: "لائحة الجزاءات — تكامل بلس" },
    { name: "description", content: "إدارة أنواع المخالفات والجزاءات حسب سياسة الشركة وتطبيقها على الموظفين." },
    { property: "og:title", content: "لائحة الجزاءات — تكامل بلس" },
    { property: "og:description", content: "إدارة أنواع المخالفات والجزاءات حسب سياسة الشركة وتطبيقها على الموظفين." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PenaltiesRegulation applicationEmployees={penaltiesReferenceApplication.employees} applicationRules={penaltiesReferenceApplication.rules} initialEmployeeId={penaltiesReferenceApplication.employees[0]?.id} approvalSteps={penaltyApprovalSteps} />,
});
