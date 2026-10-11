import { createFileRoute } from "@tanstack/react-router";
import { BranchForm } from "@/components/branch-form";
const title = "إضافة فرع جديد — تكامل بلس", description = "بيانات الفرع وصورته وموقعه والمدير المسؤول وحالة التفعيل.";
export const Route = createFileRoute("/branches/new")({validateSearch: (search: Record<string, unknown>): { edit?: number } => ({edit: Number(search.edit) > 0 ? Number(search.edit) : undefined}),head: () => ({meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component: BranchNewPage});
function BranchNewPage() { const {edit} = Route.useSearch(); return <BranchForm edit={edit}/>; }