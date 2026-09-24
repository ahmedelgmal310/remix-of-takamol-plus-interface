import {
  ShoppingCart,
  Headset,
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
  { label: "الرئيسية", icon: House, href: "/" },
  { label: "خدمة ذاتية للموظف", icon: UserRoundCog, href: "/self-service" },
  { label: "خدمة العملاء", icon: Headset, children: [
    ["لوحة خدمة العملاء", "/customer-service"],
    ["صندوق الوارد", "/customer-service/inbox"],
  ] },
  { label: "طلبات التوظيف", icon: ClipboardList, children: [
    ["طرح وظيفة جديدة", "/recruitment/job-posting"],
    ["صفحة الوظائف للمرشحين", "/careers"],
    ["استقبال طلبات التوظيف", "/recruitment/requests"],
    ["فرز السير الذاتية", "/recruitment/screening"],
    ["اختيار المرشح الأفضل", "/recruitment/evaluation"],
    ["موافقة أو رفض المرشح", "/recruitment/decision"],
    ["إصدار عرض وظيفي", "/recruitment/offer"],
    ["إجراء الفحص الطبي", "/recruitment/medical"],
    ["إصدار قرار التعيين", "/recruitment/appointment"],
    ["تسجيل الموظف", "/recruitment/registration"],
    ["متابعة طلب التوظيف", "/recruitment/tracking"],
    ["تقارير التوظيف", "/recruitment/reports"],
  ] },
  { label: "الفحص الطبي", icon: HeartPulse, children: [
    ["إرسال طلب الفحص الطبي", "/medical-exam/request"],
    ["طلب التحاليل المطلوبة", "/medical-exam/tests"],
    ["إجراء الفحص الطبي", "/medical-exam/center"],
    ["نتيجة الفحص الطبي", "/medical-exam/result"],
    ["تقرير الفحص الطبي", "/medical-exam/company"],
    ["إشعار الموظف بالنتيجة", "/medical-exam/employee"],
    ["استكمال إجراءات الموارد البشرية", "/medical-exam/hr"],
    ["طلبات الفحص", "/medical-exam/tracking"],
    ["لوحة المركز الطبي", "/medical-exam/dashboard"],
  ] },
  { label: "الموظفين", icon: Users, children: [
    ["ملف الموظف الشامل", "/employees/profile"],
    ["تفاصيل الإدارة", "/employees/department"],
    ["مستندات الموظف", "/employees/documents"],
    ["تسجيل موظف جديد", "/employees/new"],
    ["التحقق من شهادة تعريف", "/verify-certificate"],
    ["إنشاء خطاب تعريف مالي", "/employees/financial-letter"],
    ["العهد للموظفين", "/employees/custody"],
    ["طلب نهاية الخدمة", "/employees/end-of-service"],
    ["إصدار شهادة تعريف إدارية", "/employees/admin-letter"],
    ["طلب نقل موظف", "/employees/transfer"],
    ["طلب ترقية موظف", "/employees/promotion"],
  ] },
  { label: "عقود العمل", icon: FileText },
  { label: "الرواتب والبدلات", icon: WalletCards, children: [
    ["سلم الرواتب", "/"],
    ["السلف للموظفين", "/salaries/advances"],
    ["اختيار الموظف للتسكين", "/salary-placement/select"],
    ["مطابقة بيانات الموظف", "/salary-placement/match"],
    ["إصدار قرار التسكين", "/salary-placement/decision"],
    ["سحب البيانات والتسكين", "/salary-placement/pull"],
    ["انعكاس التسكين في الملف", "/salary-placement/profile"],
    ["إشعار التسكين والتأكيد", "/salary-placement/confirm"],
    ["إصدار مكافأة", "/rewards/issue"],
  ] },
  { label: "الحضور والانصراف", icon: CalendarDays, children: [
    ["البصمة والحضور", "/attendance/check-in"],
    ["طلب استئذان", "/attendance/permission"],
    ["لائحة الجزاءات", "/attendance/penalties"],
  ] },
  { label: "الإجازات", icon: CalendarDays, children: [
    ["طلب إجازة جديد", "/leaves/new"],
    ["متابعة الطلبات والموافقات", "/requests/tracking"],
  ] },
  { label: "التدريب والتطوير", icon: GraduationCap },
  { label: "الأداء الوظيفي", icon: ChartNoAxesCombined, children: [
    ["التقييم الوظيفي", "/performance/evaluation"],
    ["إعداد معايير التقييم", "/performance/criteria"],
    ["تقييم المرشحين من اللجان", "/performance/committee"],
    ["نتائج تقييم المرشحين", "/performance/results"],
  ] },
  { label: "الشؤون المالية", icon: Banknote, children: [
    ["لوحة الشؤون المالية", "/finance"],
    ["إقفال الشهر", "/finance/month-close"],
  ] },
  { label: "المبيعات", icon: BriefcaseBusiness, children: [
    ["إدخالات المبيعات", "/sales"],
    ["إدخال فاتورة مبيعات", "/sales/new"],
  ] },
  { label: "المشتريات", icon: ShoppingCart, children: [
    ["إدخال فاتورة مشتريات", "/purchases/new"],
  ] },
  { label: "التقارير", icon: FileText },
  { label: "الإعدادات", icon: Settings },
] as { label: string; icon: typeof House; href?: string; children?: [string, string][] }[];

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
  { title: "عرض تقرير الرواتب", subtitle: "تقرير تفصيلي", icon: FileText, tone: "sky" },
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
  { label: "مرفوضة", value: "18", trend: "2%", icon: Users, tone: "purple" },
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
  { label: "استلام الطلب", date: "2025/09/21" }, { label: "عرض وظيفي", date: "2025/09/25" },
  { label: "الفحص الطبي", date: "2025/09/24" }, { label: "المقابلة", date: "2025/09/23" },
  { label: "عرض وظيفي", date: "2025/09/25" }, { label: "التعيين", date: "2025/10/01" },
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
  ["سارة الغامدي", "غير مطابق", "مركز الصحة الدولي", "2025/09/20", "لم يتم"],
  ["خالد المطيري", "مطابق", "مركز الحياة الطبي", "2025/09/18", "تم الإشعار"],
  ["نواف الشمري", "قيد المراجعة", "مركز المدينة الطبي", "2025/09/16", "لم يتم"],
  ["هبة السبيعي", "مطابق", "مركز الحياة الطبي", "2025/09/14", "تم الإشعار"],
] as const;

export const candidateEvaluationCriteria = [
  { label: "المؤهلات العلمية", weight: "20%", icon: GraduationCap },
  { label: "الخبرات العملية", weight: "25%", icon: BriefcaseBusiness },
  { label: "الاختبار المهني", weight: "20%", icon: ClipboardList },
  { label: "المقابلة الشخصية", weight: "20%", icon: Users },
  { label: "الملاءمة الثقافية", weight: "15%", icon: ShieldCheck },
] as const;

export const evaluatedCandidates = [
  { number: 1, name: "سارة عبدالله أحمد", id: "CND-001", image: "sara", scores: ["18.9", "23.0", "19.0", "18.0", "13.5"], total: "92.4", rank: "الترتيب الأول", recommended: true },
  { number: 2, name: "أحمد محمد السبيعي", id: "CND-002", image: "ahmed", scores: ["17.2", "22.0", "18.0", "17.5", "12.0"], total: "86.7", rank: "الترتيب الثاني", recommended: false },
  { number: 3, name: "ريم فهد العتيبي", id: "CND-003", image: "reem", scores: ["16.1", "20.0", "15.5", "16.0", "11.0"], total: "78.6", rank: "الترتيب الثالث", recommended: false },
  { number: 4, name: "خالد علي الغامدي", id: "CND-004", image: "khaled", scores: ["14.8", "18.0", "14.0", "15.0", "10.5"], total: "72.3", rank: "الترتيب الرابع", recommended: false },
  { number: 5, name: "نورة سعد القحطاني", id: "CND-005", image: "noura", scores: ["13.6", "15.0", "11.5", "12.0", "8.0"], total: "60.1", rank: "الترتيب الخامس", recommended: false },
] as const;

export const rewardEmployee = {
  name: "محمد عبدالله الحربي",
  id: "1001",
  status: "موظف نشط",
  department: "المبيعات",
  position: "أخصائي مبيعات",
  branch: "الرياض",
  hireDate: "2022/03/15",
  basicSalary: "12,000 ريال",
} as const;

export const rewardPreviewRows = [
  ["الراتب الأساسي", "12,000 ريال"],
  ["نسبة المكافأة", "10%"],
  ["قيمة المكافأة", "1,200 ريال"],
] as const;

export const employeeRewardHistory = [
  ["2025/09/30", "مكافأة سنوية", "من الراتب", "1,200 ريال", "تم الصرف"],
  ["2025/04/15", "مكافأة أداء", "يدوي", "2,000 ريال", "تم الصرف"],
  ["2024/09/30", "مكافأة سنوية", "من الراتب", "1,100 ريال", "تم الصرف"],
  ["2023/09/30", "مكافأة سنوية", "من الراتب", "900 ريال", "تم الصرف"],
] as const;

export const rewardQuickStats = [
  ["إجمالي المكافآت", "48"],
  ["إجمالي المبالغ المصروفة", "86,400 ريال"],
  ["متوسط المكافأة", "1,800 ريال"],
] as const;

export const attendanceLog = [
  ["الحضور", "2025/09/25", "08:13 ص", "مكتمل"],
  ["الانصراف", "2025/09/24", "04:59 م", "مكتمل"],
  ["الحضور", "2025/09/24", "08:06 ص", "مكتمل"],
  ["الانصراف", "2025/09/23", "05:02 م", "مكتمل"],
] as const;

export const requestTrackingRows = [
  ["إجازة سنوية", "2025/09/20", "سارة أحمد", "بانتظار الموافقة", "مراجعة"],
  ["استئذان", "2025/09/18", "محمد أحمد", "تمت الموافقة", "مراجعة"],
  ["إجازة مرضية", "2025/09/17", "خالد المطيري", "مرفوض", "مراجعة"],
  ["استئذان", "2025/09/16", "نورة السبيعي", "بانتظار المراجعة", "مراجعة"],
  ["إجازة سنوية", "2025/09/15", "عبدالله الحربي", "تمت الموافقة", "مراجعة"],
] as const;

export const employeeProfileFields = [
  ["الهوية الوطنية", "1023456789"],
  ["المسمى الوظيفي", "أخصائي موارد بشرية"],
  ["الإدارة / القسم", "إدارة الموارد البشرية"],
  ["تاريخ التعيين", "2024/03/10"],
  ["الراتب الأساسي", "12,000 ريال"],
  ["حالة الموظف", "على رأس العمل"],
  ["نوع العقد", "عقد دائم"],
  ["رقم العقد", "HR-2024-015"],
] as const;

export const certificateVerificationData = {
  certificateNumber: "REF-2025-001",
  nationalId: "1012345678",
  employeeName: "محمد عبدالله العتيبي",
  certificateType: "تعريف موظف",
  issueDate: "2025/09/10",
  issuer: "تنفيذ إدارة الموارد البشرية",
  employeeNumber: "10456",
  directManager: "أحمد علي",
} as const;

export const evaluationCriteria = [
  ["1", "جودة العمل", "20%", "5", "20.00"],
  ["2", "الالتزام بالأنظمة والحضور", "15%", "4", "12.00"],
  ["3", "المعرفة والمهارات الفنية", "20%", "4", "16.00"],
  ["4", "التواصل والعمل الجماعي", "15%", "3", "9.00"],
  ["5", "المبادرة والابتكار", "15%", "4", "12.00"],
  ["6", "تحقيق الأهداف", "15%", "4", "12.00"],
] as const;

export const developmentPlanRows = [
  ["1", "المهارات القيادية", "الالتحاق بدورة القيادة الفعالة", "3 أشهر", "إدارة الموارد البشرية"],
  ["2", "التواصل الفعال", "ورش عمل في مهارات التواصل", "3 أشهر", "المدير المباشر"],
] as const;

export const financeStats = [
  ["حركة التدفقات", "2,680,450 ر.س", "إجمالي التدفقات الشهرية", "عرض التقرير", "flow"],
  ["الحسابات البنكية", "3", "حسابات نشطة", "عرض التفاصيل", "bank"],
  ["المعاملات الجديدة", "12", "معاملة بانتظار المراجعة", "عرض التفاصيل", "document"],
  ["أوامر الدفع", "5", "أوامر بانتظار التنفيذ", "عرض التفاصيل", "card"],
  ["أوامر الصرف", "8", "أوامر بانتظار الموافقة", "عرض التفاصيل", "cash"],
] as const;

export const salesCustomers = [
  "شركة التقنية الحديثة",
  "مؤسسة الخليج للتجارة",
  "شركة الأمل للمقاولات",
  "مركز الراحة الطبي",
  "شركة السلام الصناعية",
] as const;

// [رقم الفاتورة, التاريخ, العميل, إجمالي المبلغ, الضريبة 15%, المبلغ الإجمالي, طريقة الدفع, الحالة]
export const salesInvoices = [
  ["INV-000125", "2025/09/25", "شركة التقنية الحديثة", "12,580.00", "1,887.00", "14,467.00", "تحويل بنكي", "مدفوعة"],
  ["INV-000124", "2025/09/24", "مؤسسة الخليج للتجارة", "8,450.00", "1,267.50", "9,717.50", "تحويل بنكي", "قيد المراجعة"],
  ["INV-000123", "2025/09/22", "شركة الأمل للمقاولات", "25,300.00", "3,795.00", "29,095.00", "بطاقة ائتمانية", "معلقة"],
  ["INV-000122", "2025/09/18", "مركز الراحة الطبي", "9,780.00", "1,467.00", "11,247.00", "تحويل بنكي", "مدفوعة"],
  ["INV-000121", "2025/09/10", "شركة السلام الصناعية", "17,500.00", "2,625.00", "20,125.00", "نقدي", "معلقة"],
  ["INV-000120", "2025/09/08", "شركة التقنية الحديثة", "22,400.00", "3,360.00", "25,760.00", "تحويل بنكي", "مدفوعة"],
  ["INV-000119", "2025/09/06", "مؤسسة الخليج للتجارة", "15,200.00", "2,280.00", "17,480.00", "نقدي", "مدفوعة"],
  ["INV-000118", "2025/09/04", "شركة الأمل للمقاولات", "31,750.00", "4,762.50", "36,512.50", "تحويل بنكي", "مدفوعة"],
  ["INV-000117", "2025/09/02", "مركز الراحة الطبي", "11,900.00", "1,785.00", "13,685.00", "بطاقة ائتمانية", "قيد المراجعة"],
  ["INV-000116", "2025/08/28", "شركة السلام الصناعية", "19,600.00", "2,940.00", "22,540.00", "تحويل بنكي", "مدفوعة"],
] as const;

export const salesProducts = [
  { name: "شاشة سمارت 55 بوصة", barcode: "100125", price: 1200 },
  { name: "سماعات بلوتوث", barcode: "200458", price: 150 },
  { name: "شاحن سريع", barcode: "300789", price: 100 },
  { name: "لابتوب 14 بوصة", barcode: "400112", price: 3200 },
  { name: "ماوس لاسلكي", barcode: "500231", price: 85 },
  { name: "لوحة مفاتيح", barcode: "500348", price: 120 },
  { name: "كابل HDMI", barcode: "600417", price: 45 },
];

export const purchaseSuppliers = [
  { name: "شركة التوريد العالمية", code: "SUP-000125", cr: "1234567890" },
  { name: "مؤسسة الإمداد التقني", code: "SUP-000118", cr: "1010456789" },
  { name: "شركة الحلول المكتبية", code: "SUP-000102", cr: "2050987654" },
];

export const purchaseProducts = [
  { name: "لابتوب ديل", sku: "SKU-001", price: 3000 },
  { name: "ماوس لاسلكي", sku: "SKU-002", price: 75 },
  { name: "لوحة مفاتيح", sku: "SKU-003", price: 150 },
  { name: "شاشة 27 بوصة", sku: "SKU-004", price: 1100 },
  { name: "طابعة ليزر", sku: "SKU-005", price: 950 },
  { name: "سماعة رأس", sku: "SKU-006", price: 180 },
];

export const salesDistribution = [
  ["شركة التقنية الحديثة", 34, "var(--chart-1)"],
  ["مؤسسة الخليج للتجارة", 22, "var(--chart-2)"],
  ["شركة الأمل للمقاولات", 18, "var(--chart-3)"],
  ["مركز الراحة الطبي", 14, "var(--chart-4)"],
  ["أخرى", 12, "var(--chart-5)"],
] as const;

export const financeAccounts = [
  ["البنك الأهلي", "SA12 8000 1234 5678 9012", "1,250,000"],
  ["مصرف الراجحي", "SA33 8000 8765 4321 0987", "856,430"],
  ["البنك السعودي الفرنسي", "SA55 5000 1111 2222 3333", "432,780"],
] as const;

export const financeTransactions = [
  ["#MF-00123", "أمر صرف", "25,000 ر.س", "مؤسسة التقنية", "بانتظار الموافقة", "2025/09/18"],
  ["#MF-00122", "أمر دفع", "120,000 ر.س", "شركة الخدمات", "تمت الموافقة", "2025/09/17"],
  ["#MF-00121", "قيد محاسبي", "8,500 ر.س", "المورد العمومي", "تم الترحيل", "2025/09/16"],
  ["#MF-00120", "استلام نقدي", "15,000 ر.س", "عميل رقم 1024", "بانتظار المراجعة", "2025/09/15"],
] as const;
export const placementEmployees = [
  { id: 1, name: "أحمد محمد الشمري", nationalId: "1114322222", department: "المبيعات", title: "مندوب مبيعات", status: "فعال" },
  { id: 2, name: "سالم علي العتيبي", nationalId: "1122334455", department: "المشتريات", title: "أخصائي مشتريات", status: "فعال" },
  { id: 3, name: "عبدالله فهد القحطاني", nationalId: "1234567890", department: "المالية", title: "محاسب", status: "فعال" },
  { id: 4, name: "فاطمة محمد العتيبي", nationalId: "9876543210", department: "الموارد البشرية", title: "أخصائي موارد بشرية", status: "فعال" },
  { id: 5, name: "خالد ناصر السبيعي", nationalId: "1357924680", department: "التشغيل", title: "فني تشغيل", status: "فعال" },
];

export const placementEmployee = {
  name: "عبدالله فهد القحطاني", nationalId: "1234567890", department: "المالية", title: "محاسب",
  contractType: "عقد دائم", startDate: "2025/09/01", grade: "الدرجة الثالثة", number: "1234",
  category: "الفئة السابعة", workplace: "المالية", qualification: "دبلوم موارد بشرية",
  basicSalary: "9,200", allowances: "1,800", housing: "0", total: "11,000",
  decisionNo: "2025/784", placementDate: "2025/09/22", operationNo: "#SAL-2025-0427", operationTime: "2025/09/22 - 10:35 ص",
};

export type CareerJob = { id: string; title: string; dept: string; city: string; type: string; date: string; vacancies: number; isNew?: boolean; desc: string; reqs: string[] };
const genericReqs = ["بكالوريوس في تخصص ذي صلة", "خبرة من 2 - 4 سنوات", "مهارات تواصل عالية", "إجادة استخدام الحاسب الآلي", "إجادة اللغة الإنجليزية"];
export const careerJobs: CareerJob[] = [
  { id: "J1", title: "محاسب أول", dept: "المالية", city: "الرياض", type: "دوام كامل", date: "2025/09/28", vacancies: 1, isNew: true, desc: "المساهمة في إعداد التقارير المالية وتحليل البيانات وإعداد الميزانيات ومتابعة العمليات المحاسبية وفقاً للمعايير المالية المعتمدة.", reqs: ["بكالوريوس في المحاسبة أو تخصص ذي صلة", "خبرة من 3 - 5 سنوات", "إجادة استخدام البرامج المحاسبية", "مهارات تحليلية عالية", "إجادة اللغة الإنجليزية"] },
  { id: "J2", title: "أخصائي موارد بشرية", dept: "الموارد البشرية", city: "الرياض", type: "دوام كامل", date: "2025/09/27", vacancies: 2, desc: "إدارة إجراءات التوظيف وشؤون الموظفين ومتابعة الحضور والرواتب وتطبيق سياسات الموارد البشرية.", reqs: genericReqs },
  { id: "J3", title: "مطور نظم", dept: "تقنية المعلومات", city: "الرياض", type: "دوام كامل", date: "2025/09/26", vacancies: 1, desc: "تطوير وصيانة الأنظمة الداخلية وتحسين أدائها وتكاملها مع الأنظمة الأخرى.", reqs: genericReqs },
  { id: "J4", title: "أخصائي خدمة عملاء", dept: "خدمة العملاء", city: "جدة", type: "دوام كامل", date: "2025/09/25", vacancies: 3, desc: "استقبال استفسارات العملاء ومعالجتها بكفاءة ومتابعة الطلبات حتى الإغلاق.", reqs: genericReqs },
  { id: "J5", title: "أخصائي تسويق رقمي", dept: "التسويق والاتصال", city: "الرياض", type: "دوام كامل", date: "2025/09/24", vacancies: 1, desc: "إدارة الحملات الرقمية وقنوات التواصل الاجتماعي وقياس الأداء.", reqs: genericReqs },
  { id: "J6", title: "مساعد إداري", dept: "الإدارة التنفيذية", city: "الدمام", type: "دوام كامل", date: "2025/09/23", vacancies: 1, desc: "تنظيم المواعيد والمراسلات ودعم الأعمال الإدارية اليومية.", reqs: genericReqs },
  { id: "J7", title: "محلل مالي", dept: "المالية", city: "جدة", type: "دوام كامل", date: "2025/09/22", vacancies: 1, desc: "تحليل الأداء المالي وإعداد التوقعات والتقارير الدورية.", reqs: genericReqs },
  { id: "J8", title: "مصمم جرافيك", dept: "التسويق والاتصال", city: "عن بعد", type: "دوام جزئي", date: "2025/09/21", vacancies: 1, desc: "تصميم المواد التسويقية والهوية البصرية للحملات.", reqs: genericReqs },
  { id: "J9", title: "متدرب موارد بشرية", dept: "الموارد البشرية", city: "الرياض", type: "تدريب تعاوني", date: "2025/09/20", vacancies: 2, desc: "دعم فريق الموارد البشرية في الأعمال اليومية واكتساب الخبرة العملية.", reqs: genericReqs },
  { id: "J10", title: "مهندس دعم فني", dept: "تقنية المعلومات", city: "الدمام", type: "عقد مؤقت", date: "2025/09/19", vacancies: 1, desc: "تقديم الدعم الفني للمستخدمين وصيانة الأجهزة والشبكات.", reqs: genericReqs },
  { id: "J11", title: "مشرف خدمة عملاء", dept: "خدمة العملاء", city: "الرياض", type: "دوام كامل", date: "2025/09/18", vacancies: 1, desc: "الإشراف على فريق خدمة العملاء ومتابعة مؤشرات الجودة.", reqs: genericReqs },
  { id: "J12", title: "منسق مشتريات", dept: "أخرى", city: "جدة", type: "دوام كامل", date: "2025/09/17", vacancies: 1, desc: "تنسيق طلبات الشراء ومتابعة الموردين والعقود.", reqs: genericReqs },
];

export type LabTest = { name: string; code: string; kind: string; note: string; cat: string };
export const labCategories = ["تحاليل أساسية", "تحاليل وظيفية", "تحاليل فيروسات", "تحاليل هرمونات", "تحاليل أخرى"];
export const labCatalog: LabTest[] = [
  { name: "صورة الدم الكاملة", code: "CBC", kind: "دم", note: "—", cat: "تحاليل أساسية" },
  { name: "سكر الدم", code: "FBS", kind: "دم", note: "صائم 8 ساعات", cat: "تحاليل أساسية" },
  { name: "تحليل الدهون", code: "Lipid Profile", kind: "دم", note: "—", cat: "تحاليل وظيفية" },
  { name: "وظائف الكبد", code: "LFT", kind: "دم", note: "—", cat: "تحاليل وظيفية" },
  { name: "وظائف الكلى", code: "KFT", kind: "دم", note: "—", cat: "تحاليل وظيفية" },
  { name: "تحليل البول الكامل", code: "Urine R/E", kind: "بول", note: "عينة صباحية", cat: "تحاليل أساسية" },
  { name: "التهاب الكبد B", code: "HBsAg", kind: "دم", note: "—", cat: "تحاليل فيروسات" },
  { name: "التهاب الكبد C", code: "HCV Ab", kind: "دم", note: "—", cat: "تحاليل فيروسات" },
  { name: "نقص المناعة المكتسبة", code: "HIV", kind: "دم", note: "—", cat: "تحاليل فيروسات" },
  { name: "هرمون الغدة الدرقية", code: "TSH", kind: "دم", note: "—", cat: "تحاليل هرمونات" },
  { name: "فيتامين د", code: "Vit D", kind: "دم", note: "—", cat: "تحاليل أخرى" },
  { name: "فحص الدرن", code: "TB Test", kind: "أشعة", note: "—", cat: "تحاليل أخرى" },
];

export type ExamStatus = "منتهية" | "بالانتظار" | "تم إعادتها";
export type ExamRequest = { id: string; title: string; type: string; dept: string; by: string; date: string; status: ExamStatus; reason: string };
const examSeed: Omit<ExamRequest, "id">[] = [
  { title: "فحص عقد طبي", type: "قانوني", dept: "الموارد البشرية", by: "سارة العتيبي", date: "2025/09/23", status: "منتهية", reason: "-" },
  { title: "فحص لائحة تنظيمية", type: "إداري", dept: "الإدارة العامة", by: "محمد القحطاني", date: "2025/09/22", status: "بالانتظار", reason: "-" },
  { title: "فحص تقرير مالي", type: "مالي", dept: "المالية", by: "نورة الشهري", date: "2025/09/21", status: "تم إعادتها", reason: "نقص في المرفقات المطلوبة" },
  { title: "فحص سياسة أمن المعلومات", type: "تقني", dept: "تقنية المعلومات", by: "عبدالله الزهراني", date: "2025/09/21", status: "تم إعادتها", reason: "يحتاج إلى توضيح النقاط رقم 3 و 5" },
  { title: "فحص نموذج تعاقد", type: "قانوني", dept: "المشتريات", by: "ريم المطيري", date: "2025/09/20", status: "منتهية", reason: "-" },
  { title: "فحص طلب إضافة وظيفة", type: "إداري", dept: "الموارد البشرية", by: "خالد الحربي", date: "2025/09/20", status: "بالانتظار", reason: "-" },
  { title: "فحص ميزانية مشروع", type: "مالي", dept: "المالية", by: "أمل السالم", date: "2025/09/19", status: "منتهية", reason: "-" },
  { title: "فحص عقد استشارات", type: "قانوني", dept: "الإدارة العامة", by: "فيصل الدوسري", date: "2025/09/18", status: "تم إعادتها", reason: "تعديل الصياغة القانونية وإرفاق النسخة المحدثة" },
  { title: "فحص إجراء", type: "إداري", dept: "الجودة", by: "ليلى العمري", date: "2025/09/18", status: "بالانتظار", reason: "-" },
  { title: "فحص تقرير أداء", type: "مالي", dept: "المالية", by: "تركي العتيبي", date: "2025/09/17", status: "منتهية", reason: "-" },
];
const extraTitles = ["فحص عقد توريد", "فحص سياسة الإجازات", "فحص تقرير ربعي", "فحص خطة تدريب", "فحص نموذج تقييم", "فحص لائحة المشتريات", "فحص عقد صيانة", "فحص إجراءات السلامة", "فحص تقرير تدقيق", "فحص عقد عمل", "فحص طلب شراء", "فحص سياسة الخصوصية", "فحص خطة تشغيلية"];
const extraPeople = ["هند القرني", "سعود العنزي", "منيرة الدوسري", "ماجد الغامدي", "دانة الشمري", "بندر المالكي"];
const extraDepts: [string, string][] = [["قانوني", "الشؤون القانونية"], ["إداري", "الإدارة العامة"], ["مالي", "المالية"], ["تقني", "تقنية المعلومات"]];
export const examRequests: ExamRequest[] = [
  ...examSeed,
  ...Array.from({ length: 26 }, (_, i) => {
    const [type, dept] = extraDepts[i % 4]!;
    const status: ExamStatus = i < 20 ? "منتهية" : i < 25 ? "بالانتظار" : "تم إعادتها";
    return { title: extraTitles[i % extraTitles.length]!, type, dept, by: extraPeople[i % extraPeople.length]!, date: `2025/09/${String(16 - Math.floor(i / 2)).padStart(2, "0")}`, status, reason: status === "تم إعادتها" ? "يحتاج إلى استكمال البيانات" : "-" };
  }),
].map((r, i) => ({ ...r, id: `REQ-2025-${String(i + 1).padStart(3, "0")}` }));
