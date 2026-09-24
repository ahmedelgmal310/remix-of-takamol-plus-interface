import {
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  GraduationCap,
  HeartPulse,
  House,
  Settings,
  ShieldCheck,
  Users,
  UserRoundCog,
  WalletCards,
} from "lucide-react";

export const sidebarGroups = [
  { label: "الرئيسية", icon: House },
  { label: "طلبات التوظيف", icon: ClipboardList, href: "/recruitment/requests" },
  { label: "الفحص الطبي", icon: HeartPulse, href: "/medical-exam/request" },
  { label: "الموظفين", icon: Users },
  { label: "عقود العمل", icon: FileText },
  { label: "الرواتب والبدلات", icon: WalletCards, open: true },
  { label: "الحضور والانصراف", icon: CalendarDays },
  { label: "الإجازات", icon: CalendarDays },
  { label: "التدريب والتطوير", icon: GraduationCap },
  { label: "الأداء الوظيفي", icon: ChartNoAxesCombined },
  { label: "التقارير", icon: FileText },
  { label: "الإعدادات", icon: Settings },
];

export const salaryRows = [
  ["الدرجة الأولى", "الفئة الأولى", "5,000", "750", "1,000", "6,750"],
  ["الدرجة الثانية", "الفئة الأولى", "5,500", "750", "1,000", "7,250"],
  ["الدرجة الثالثة", "الفئة الثانية", "6,500", "750", "1,200", "8,450"],
  ["الدرجة الرابعة", "الفئة الثانية", "7,500", "750", "1,200", "9,450"],
  ["الدرجة الخامسة", "الفئة الثالثة", "9,000", "750", "1,500", "11,250"],
  ["الدرجة السادسة", "الفئة الثالثة", "10,500", "750", "1,500", "12,750"],
  ["الدرجة السابعة", "الفئة الرابعة", "12,000", "750", "1,800", "14,550"],
  ["الدرجة الثامنة", "الفئة الرابعة", "14,000", "750", "1,800", "16,550"],
  ["الدرجة التاسعة", "الفئة الخامسة", "16,000", "750", "2,000", "18,750"],
  ["الدرجة العاشرة", "الفئة الخامسة", "18,000", "750", "2,000", "20,750"],
];

export const stats = [
  { label: "الفئات الوظيفية", value: "6", trend: "1%", icon: BriefcaseBusiness, tone: "orange" },
  { label: "الدرجات الوظيفية", value: "12", trend: "2%", icon: FileText, tone: "blue" },
  { label: "إجمالي الموظفين", value: "148", trend: "5%", icon: Users, tone: "purple" },
  { label: "متوسط الراتب", value: "12,450 ر.س", trend: "8%", icon: Banknote, tone: "green" },
] as const;

export const quickActions = [
  { title: "إضافة موظف جديد", subtitle: "تسجيل بيانات الموظف", icon: UserRoundCog, tone: "blue" },
  { title: "تقرير تغيير الرواتب", subtitle: "تقرير تفصيلي", icon: FileText, tone: "sky" },
  { title: "تحديث بيانات الموظفين", subtitle: "بشكل جماعي", icon: Users, tone: "purple" },
  { title: "تصدير سلم الرواتب", subtitle: "Excel / PDF", icon: ShieldCheck, tone: "green" },
] as const;

export const recruitmentSteps = [
  { id: "requests", number: 1, title: "استقبال طلبات التوظيف", subtitle: "استقبال جميع طلبات التوظيف من مختلف القنوات وفرزها تلقائياً" },
  { id: "screening", number: 2, title: "فرز السير الذاتية", subtitle: "مراجعة السير الذاتية واختيار المرشحين المناسبين" },
  { id: "medical", number: 3, title: "إجراء الفحص الطبي", subtitle: "تحديد موعد الفحص الطبي ومتابعة نتائجه" },
  { id: "offer", number: 4, title: "إصدار عرض وظيفي", subtitle: "إعداد وإرسال عرض وظيفي للمرشح" },
  { id: "decision", number: 5, title: "موافقة أو رفض المرشح", subtitle: "استقبال رد المرشح على العرض الوظيفي" },
  { id: "appointment", number: 6, title: "إصدار قرار التعيين", subtitle: "إصدار قرار التعيين وحفظه في النظام وإشعار المعنيين" },
  { id: "tracking", number: 7, title: "متابعة حالة التوظيف", subtitle: "متابعة جميع مراحل طلب التوظيف حتى التعيين" },
  { id: "reports", number: 8, title: "التقارير والتحليلات", subtitle: "تقارير مفصلة لعملية التوظيف وأداء القنوات" },
  { id: "registration", number: 9, title: "تسجيل الموظف في النظام", subtitle: "إضافة بيانات الموظف بعد التعيين وربطه بجميع الأنظمة" },
] as const;

export const recruitmentStats = [
  { label: "إجمالي الطلبات", value: "128", trend: "12%", icon: ClipboardList, tone: "blue" },
  { label: "طلبات جديدة", value: "36", trend: "8%", icon: FileText, tone: "sky" },
  { label: "قيد الفرز", value: "42", trend: "4%", icon: BriefcaseBusiness, tone: "orange" },
  { label: "مقبولة", value: "32", trend: "6%", icon: Banknote, tone: "green" },
] as const;

export const jobApplications = [
  { id: "1", name: "محمد علي السبيعي", job: "محاسب", date: "2025/09/21", source: "بوابة التوظيف", status: "جديد" },
  { id: "2", name: "سارة أحمد الغامدي", job: "أخصائي موارد بشرية", date: "2025/09/20", source: "لينكد إن", status: "قيد الفرز" },
  { id: "3", name: "نورة محمد العتيبي", job: "محلل نظم", date: "2025/09/19", source: "ترشيح موظف", status: "مقبول" },
  { id: "4", name: "تركي فيصل العنزي", job: "مطور برمجيات", date: "2025/09/18", source: "الموقع الإلكتروني", status: "مرفوض" },
] as const;

export const candidates = [
  { name: "أحمد محمد العتيبي", job: "محاسب", status: "مناسب", initials: "أع" },
  { name: "سارة أحمد الغامدي", job: "أخصائي موارد بشرية", status: "مناسب", initials: "سغ" },
  { name: "خالد فهد الشهري", job: "محاسب", status: "مناسب", initials: "خش" },
  { name: "ريم علي القحطاني", job: "مدير مشاريع", status: "تحت المراجعة", initials: "رق" },
] as const;

export const candidateDetails = [
  ["الجنسية", "سعودي"], ["تاريخ الميلاد", "1995/05/12"], ["رقم الهوية", "1234567890"],
  ["رقم الجوال", "0501234567"], ["البريد الإلكتروني", "ahmed@example.com"], ["المؤهل العلمي", "بكالوريوس محاسبة"],
] as const;

export const hiringTimeline = [
  { label: "استلام الطلب", date: "2025/09/21" }, { label: "الفرز الأولي", date: "2025/09/23" },
  { label: "الفحص الطبي", date: "2025/09/24" }, { label: "الموافقة", date: "2025/09/25" },
  { label: "عرض وظيفي", date: "2025/09/26" }, { label: "التعيين", date: "2025/10/01" },
] as const;

export const employeeSystems = ["البيانات الشخصية", "الحسابات والرواتب", "الحضور والانصراف", "التأمينات الاجتماعية", "الملف الوظيفي", "الأصول والعهد"] as const;

export const medicalFlowSteps = [
  { id: "request", number: 1, title: "إرسال طلب الفحص الطبي", short: "إرسال طلب الفحص الطبي", subtitle: "من الموارد البشرية إلى المركز الطبي" },
  { id: "tests", number: 2, title: "طلب التحاليل المطلوبة من الشركة", short: "طلب التحاليل من الشركة", subtitle: "إرسال التحاليل المطلوبة للشركة" },
  { id: "center", number: 3, title: "إجراء الفحص الطبي في المركز المعتمد", short: "إجراء الفحص الطبي", subtitle: "في المركز الطبي المعتمد" },
  { id: "result", number: 4, title: "إصدار نتيجة الفحص الطبي", short: "إصدار النتيجة", subtitle: "مطابق / غير مطابق" },
  { id: "company", number: 5, title: "عودة التقرير إلى الشركة والموارد البشرية", short: "إرسال النتيجة للشركة", subtitle: "وإعادتها لنظام الشركة" },
  { id: "hr", number: 6, title: "استكمال الإجراءات من قبل الموارد البشرية", short: "استكمال الإجراءات", subtitle: "من قبل الموارد البشرية" },
  { id: "employee", number: 7, title: "إصدار النتيجة للموظف", short: "إشعار الموظف", subtitle: "بنتيجة الفحص الطبي" },
  { id: "tracking", number: 8, title: "شاشة المتابعة والتقارير", short: "المتابعة والتقارير", subtitle: "متابعة حالة الفحوصات والتقارير بسهولة" },
] as const;

export const medicalTests = [
  ["صورة الدم الكاملة (CBC)", "1", "مطلوب"],
  ["تحليل السكر التراكمي", "1", "مطلوب"],
  ["تحليل وظائف الكبد", "1", "مطلوب"],
  ["تحليل وظائف الكلى", "1", "مطلوب"],
  ["تحليل المخدرات", "1", "مطلوب"],
] as const;

export const medicalTrackingRows = [
  ["أحمد العتيبي", "مطابق", "مركز الحياة الطبي", "2025/09/22", "تم الإشعار"],
  ["علي الحربي", "غير مطابق", "مركز صحة الرياض", "2025/09/20", "لم يتم"],
  ["خالد المطيري", "مطابق", "مركز الحياة الطبي", "2025/09/19", "تم الإشعار"],
  ["سارة الشمري", "قيد الفحص", "مركز المملكة الطبي", "2025/09/18", "لم يتم"],
  ["ريم العتيبي", "مطابق", "مركز الحياة الطبي", "2025/09/17", "تم الإشعار"],
] as const;