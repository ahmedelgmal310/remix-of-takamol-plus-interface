export type PenaltyApprovalStep = { title: string; description: string; completed?: boolean };
export const penaltyApprovalSteps: PenaltyApprovalStep[] = [
  { title: "إرسال الطلب", description: "يتم إرسال الطلب إلى المدير المباشر", completed: true },
  { title: "اعتماد المدير المباشر", description: "موافقة أو رفض الطلب", completed: true },
  { title: "مراجعة الموارد البشرية", description: "التحقق من البيانات وتأكيد الجزاء", completed: true },
  { title: "اعتماد الإدارة العليا", description: "الموافقة النهائية" },
  { title: "تسجيل الجزاء", description: "تطبيق الجزاء في النظام (الحضور · حزم الرواتب)" },
];
export function isPenaltyAttachment(file: { name: string; size: number; type: string }) {
  return /\.(pdf|jpe?g|png)$/i.test(file.name)
    && (!file.type || ["application/pdf", "image/jpeg", "image/png"].includes(file.type))
    && file.size <= 10 * 1024 * 1024;
}