import {
  LayoutGrid,
  Code2,
  Clock3,
  Bell,
  LifeBuoy,
  Crown,
  KeyRound,
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
  { label: "لوحة القيادة", icon: House, href: "/" },
  { label: "اختيار النظام", icon: LayoutGrid, href: "/systems" },
  { label: "بوابة الموارد البشرية", icon: Users, href: "/hr" },
  { label: "المشاريع والمهام", icon: ClipboardList, href: "/projects" },
  { label: "خدمة ذاتية للموظف", icon: UserRoundCog, href: "/self-service" },
  { label: "خدمة العملاء", icon: Headset, children: [
    ["لوحة خدمة العملاء", "/customer-service"],
    ["صندوق الوارد", "/customer-service/inbox"],
    ["تقييم العملاء من الموظفين", "/customer-service/rating"],
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
    ["لجان التوظيف", "/recruitment/committees"],
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
    ["الموظفين", "/employees"],
    ["ملف الموظف الشامل", "/employees/profile"],
    ["الهيكل التنظيمي", "/employees/structure"],
    ["الأقسام", "/employees/departments"],
    ["تفاصيل الإدارة", "/employees/department"],
    ["مستندات الموظف", "/employees/documents"],
    ["النماذج", "/forms"],
    ["تسجيل موظف جديد", "/employees/new"],
    ["تهيئة الموظف", "/employees/onboarding"],
    ["التحقق من شهادة تعريف", "/verify-certificate"],
    ["إنشاء خطاب تعريف مالي", "/employees/financial-letter"],
    ["العهد للموظفين", "/employees/custody"],
    ["طلب نهاية الخدمة", "/employees/end-of-service"],
    ["إصدار شهادة تعريف إدارية", "/employees/admin-letter"],
    ["طلب نقل موظف", "/employees/transfer"],
    ["طلب ترقية موظف", "/employees/promotion"],
    ["المستفيدون", "/beneficiaries"],
  ] },
  { label: "عقود العمل", icon: FileText },
  { label: "الرواتب والبدلات", icon: WalletCards, children: [
    ["الرواتب والبدلات", "/salaries/payroll"],
    ["مسيرات الرواتب", "/salaries/runs"],
    ["سلم الرواتب", "/salaries/scale"],
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
    ["حسابات البنوك", "/finance/banks"],
    ["الخزائن والبنوك", "/finance/treasuries"],
    ["حركة الأموال", "/finance/money-flow"],
    ["حركة البنوك", "/finance/bank-movements"],
    ["التدفقات النقدية", "/finance/cash-flow"],
    ["سندات القبض", "/finance/receipts"],
    ["أوامر الصرف", "/finance/payment-orders"],
    ["قائمة الإدخالات للفواتير", "/finance/invoice-inputs"],
    ["التكاليف المتكررة", "/finance/recurring"],
  ] },
  { label: "المبيعات", icon: BriefcaseBusiness, children: [
    ["إدخالات المبيعات", "/sales"],
    ["تفاصيل الفاتورة", "/sales/invoice"],
    ["إدخال فاتورة مبيعات", "/sales/new"],
  ] },
  { label: "المشتريات", icon: ShoppingCart, children: [
    ["إدخال فاتورة مشتريات", "/purchases/new"],
  ] },
  { label: "التقارير", icon: FileText, children: [
    ["تقارير الموارد البشرية", "/reports/hr"],
    ["التقارير المالية", "/reports/financial"],
  ] },
  { label: "الإشعارات", icon: Bell, href: "/notifications" },
  { label: "باقات الاشتراك", icon: Crown, href: "/pricing" },
  { label: "شراء البرنامج", icon: ShoppingCart, href: "/purchase-program" },
  { label: "الوصول البرمجي (API)", icon: KeyRound, href: "/settings/api" },
  { label: "الدعم الفني", icon: LifeBuoy, href: "/support" },
  { label: "إدارة الصلاحيات", icon: KeyRound, href: "/settings/permissions" },
  { label: "سجل النشاطات", icon: Clock3, href: "/activity-log" },
  { label: "طلب تطوير برمجي", icon: Code2, href: "/development-requests" },
  { label: "الإعدادات", icon: Settings, href: "/settings" },
] as { label: string; icon: typeof House; href?: string; children?: [string, string][] }[];

// Local reference data for the dashboard and the employee onboarding preview.
export const homeSummary = [
  { title: "طلبات خدمة العملاء", value: "248", change: "20%", color: "blue" },
  { title: "إجمالي المعاملات", value: "1,025", change: "15%", color: "amber" },
  { title: "إجمالي المصروفات", value: "2,450,000", change: "8%", color: "green" },
  { title: "إجمالي الموظفين", value: "312", change: "12%", color: "violet" },
] as const;
export const homeDepartments = [
  { label: "الإدارة العامة", value: 68, color: "var(--primary)" },
  { label: "الشؤون الطبية", value: 56, color: "var(--success)" },
  { label: "الشؤون المالية", value: 50, color: "var(--warning)" },
  { label: "خدمة العملاء", value: 44, color: "var(--finance-orange)" },
  { label: "الموارد البشرية", value: 37, color: "var(--buy-violet)" },
  { label: "أخرى", value: 57, color: "var(--muted-foreground)" },
];
export const homeTicketStatuses = [
  { label: "مفتوحة", value: 36, color: "var(--destructive)" },
  { label: "قيد المعالجة", value: 84, color: "var(--warning)" },
  { label: "بانتظار العميل", value: 52, color: "var(--primary)" },
  { label: "تم الإغلاق", value: 76, color: "var(--success)" },
];
export const homeTransactionTypes = [
  { label: "معاملات مالية", value: 320, tone: "bg-primary" },
  { label: "طلبات موارد بشرية", value: 185, tone: "bg-success" },
  { label: "طلبات خدمة عملاء", value: 142, tone: "bg-warning" },
  { label: "معاملات إدارية", value: 96, tone: "bg-buy-violet" },
  { label: "أخرى", value: 58, tone: "bg-muted-foreground" },
];
export const homeRevenueMonths = [
  { month: "يناير", revenue: 190, expenses: 300 },
  { month: "فبراير", revenue: 300, expenses: 450 },
  { month: "مارس", revenue: 245, expenses: 385 },
  { month: "أبريل", revenue: 340, expenses: 530 },
  { month: "مايو", revenue: 270, expenses: 515 },
  { month: "يونيو", revenue: 420, expenses: 690 },
  { month: "يوليو", revenue: 610, expenses: 850 },
];
export const homeRecentEmployees = [
  { name: "أحمد العتيبي", job: "طبيب عام", dept: "الخدمات الطبية", date: "2026/10/04", status: "مفعل" },
  { name: "سارة القحطاني", job: "أخصائي مالي", dept: "الشؤون المالية", date: "2026/10/03", status: "مفعل" },
  { name: "خالد الشهري", job: "موظف خدمة عملاء", dept: "خدمة العملاء", date: "2026/10/02", status: "مفعل" },
  { name: "نورة المطيري", job: "مسؤول موارد بشرية", dept: "الموارد البشرية", date: "2026/10/02", status: "قيد التفعيل" },
  { name: "عبدالله الحربي", job: "إداري", dept: "الإدارة العامة", date: "2026/10/01", status: "مفعل" },
];

export type DirectoryEmployee = { id: string; name: string; job: string; department: string; identity: string; gender: "ذكر" | "أنثى"; joined: string; status: "على رأس العمل" | "في إجازة" | "منتهي خدمة"; nationality: string; birth: string; phone: string; email: string; address: string };
const directoryBase: Omit<DirectoryEmployee, "nationality" | "birth" | "phone" | "email" | "address">[] = [
  { id: "EMP-001", name: "د. أحمد العتيبي", job: "استشاري قلب", department: "الخدمات الطبية", identity: "1012345678", gender: "ذكر", joined: "2022/03/10", status: "على رأس العمل" },
  { id: "EMP-002", name: "د. سارة القحطاني", job: "أخصائي تمريض", department: "الخدمات الطبية", identity: "1023456734", gender: "أنثى", joined: "2022/05/14", status: "على رأس العمل" },
  { id: "EMP-003", name: "أ. خالد الشهري", job: "مدير مالي", department: "المالية", identity: "1034567856", gender: "ذكر", joined: "2021/11/01", status: "على رأس العمل" },
  { id: "EMP-004", name: "أ. نورة المطيري", job: "محاسب", department: "المالية", identity: "1045678978", gender: "أنثى", joined: "2022/01/20", status: "في إجازة" },
  { id: "EMP-005", name: "أ. محمد الحربي", job: "أخصائي موارد بشرية", department: "الموارد البشرية", identity: "1056789090", gender: "ذكر", joined: "2023/02/05", status: "على رأس العمل" },
  { id: "EMP-006", name: "أ. فاطمة الزهراني", job: "أخصائي خدمات عملاء", department: "خدمة العملاء", identity: "1067890132", gender: "أنثى", joined: "2023/06/18", status: "على رأس العمل" },
  { id: "EMP-007", name: "أ. عبدالله المالكي", job: "تقنية معلومات", department: "تقنية المعلومات", identity: "1078901265", gender: "ذكر", joined: "2022/09/12", status: "على رأس العمل" },
  { id: "EMP-008", name: "أ. ريم العتيبي", job: "أخصائي بيانات", department: "المالية", identity: "1089012343", gender: "أنثى", joined: "2024/01/25", status: "في إجازة" },
  { id: "EMP-009", name: "أ. علي القحطاني", job: "أخصائي مشتريات", department: "الإدارة العامة", identity: "1090123477", gender: "ذكر", joined: "2021/07/01", status: "على رأس العمل" },
  { id: "EMP-010", name: "أ. ياسر الشهري", job: "مساعد إداري", department: "الإدارة العامة", identity: "1101234521", gender: "ذكر", joined: "2020/12/15", status: "منتهي خدمة" },
  { id: "EMP-011", name: "د. هدى الغامدي", job: "أخصائي تمريض", department: "الخدمات الطبية", identity: "1112345622", gender: "أنثى", joined: "2023/03/14", status: "على رأس العمل" },
  { id: "EMP-012", name: "أ. فيصل الدوسري", job: "محاسب", department: "المالية", identity: "1123456733", gender: "ذكر", joined: "2022/08/03", status: "على رأس العمل" },
  { id: "EMP-013", name: "أ. ليلى العمري", job: "أخصائي موارد بشرية", department: "الموارد البشرية", identity: "1134567844", gender: "أنثى", joined: "2024/02/01", status: "على رأس العمل" },
  { id: "EMP-014", name: "أ. بندر السبيعي", job: "تقنية معلومات", department: "تقنية المعلومات", identity: "1145678955", gender: "ذكر", joined: "2023/01/16", status: "على رأس العمل" },
  { id: "EMP-015", name: "أ. مها الشمري", job: "أخصائي خدمات عملاء", department: "خدمة العملاء", identity: "1156789066", gender: "أنثى", joined: "2023/09/10", status: "في إجازة" },
  { id: "EMP-016", name: "أ. تركي العتيبي", job: "مساعد إداري", department: "الإدارة العامة", identity: "1167890177", gender: "ذكر", joined: "2022/11/07", status: "على رأس العمل" },
  { id: "EMP-017", name: "د. روان القحطاني", job: "أخصائي تمريض", department: "الخدمات الطبية", identity: "1178901288", gender: "أنثى", joined: "2021/04/19", status: "على رأس العمل" },
  { id: "EMP-018", name: "أ. ناصر الحربي", job: "مدير مالي", department: "المالية", identity: "1189012399", gender: "ذكر", joined: "2020/06/30", status: "منتهي خدمة" },
  { id: "EMP-019", name: "أ. هند المالكي", job: "أخصائي بيانات", department: "تقنية المعلومات", identity: "1190123401", gender: "أنثى", joined: "2023/12/11", status: "على رأس العمل" },
  { id: "EMP-020", name: "أ. ماجد الغامدي", job: "أخصائي مشتريات", department: "الإدارة العامة", identity: "1201234512", gender: "ذكر", joined: "2022/07/20", status: "على رأس العمل" },
  { id: "EMP-021", name: "د. خالد الزهراني", job: "استشاري قلب", department: "الخدمات الطبية", identity: "1212345623", gender: "ذكر", joined: "2024/05/01", status: "على رأس العمل" },
  { id: "EMP-022", name: "أ. منى الدوسري", job: "محاسب", department: "المالية", identity: "1223456734", gender: "أنثى", joined: "2023/08/09", status: "على رأس العمل" },
  { id: "EMP-023", name: "أ. عمر السالم", job: "تقنية معلومات", department: "تقنية المعلومات", identity: "1234567845", gender: "ذكر", joined: "2021/10/12", status: "على رأس العمل" },
  { id: "EMP-024", name: "أ. عبير الشمري", job: "أخصائي موارد بشرية", department: "الموارد البشرية", identity: "1245678956", gender: "أنثى", joined: "2020/04/08", status: "في إجازة" },
  { id: "EMP-025", name: "أ. راشد المطيري", job: "مساعد إداري", department: "الإدارة العامة", identity: "1256789067", gender: "ذكر", joined: "2022/02/15", status: "على رأس العمل" },
  { id: "EMP-026", name: "أ. سلوى الشهري", job: "أخصائي خدمات عملاء", department: "خدمة العملاء", identity: "1267890178", gender: "أنثى", joined: "2023/05/21", status: "على رأس العمل" },
  { id: "EMP-027", name: "أ. فهد القحطاني", job: "مدير مالي", department: "المالية", identity: "1278901289", gender: "ذكر", joined: "2021/09/01", status: "على رأس العمل" },
  { id: "EMP-028", name: "د. أمل العتيبي", job: "أخصائي تمريض", department: "الخدمات الطبية", identity: "1289012390", gender: "أنثى", joined: "2024/03/04", status: "على رأس العمل" },
  { id: "EMP-029", name: "أ. سعد المالكي", job: "أخصائي بيانات", department: "تقنية المعلومات", identity: "1290123401", gender: "ذكر", joined: "2022/12/18", status: "على رأس العمل" },
  { id: "EMP-030", name: "أ. بسمة الحربي", job: "أخصائي مشتريات", department: "الإدارة العامة", identity: "1301234512", gender: "أنثى", joined: "2023/07/03", status: "على رأس العمل" },
  { id: "EMP-031", name: "أ. إبراهيم العمري", job: "محاسب", department: "المالية", identity: "1312345623", gender: "ذكر", joined: "2022/10/10", status: "على رأس العمل" },
  { id: "EMP-032", name: "أ. دلال الغامدي", job: "أخصائي موارد بشرية", department: "الموارد البشرية", identity: "1323456734", gender: "أنثى", joined: "2024/04/16", status: "على رأس العمل" },
];
export const directoryEmployees: DirectoryEmployee[] = directoryBase.map((employee, index) => ({
  ...employee, nationality: "سعودي", birth: index === 0 ? "1985/06/12" : `199${index % 10}/0${index % 8 + 1}/12`,
  phone: index === 0 ? "05XXXXXXXX" : `05${String(12345678 + index).slice(0, 8)}`,
  email: index === 0 ? "ahmed@example.com" : `employee${index + 1}@example.com`,
  address: "الرياض - المملكة العربية السعودية",
}));
export const homeRecentTransactions = [
  { code: "FIN-001", kind: "صرف", amount: "25,000", status: "معتمدة", date: "2026/10/04" },
  { code: "FIN-002", kind: "تحويل", amount: "87,500", status: "قيد الاعتماد", date: "2026/10/04" },
  { code: "FIN-003", kind: "قبض", amount: "150,000", status: "معتمدة", date: "2026/10/03" },
  { code: "FIN-004", kind: "مصروف", amount: "12,000", status: "مرفوضة", date: "2026/10/02" },
  { code: "FIN-005", kind: "تسوية", amount: "30,000", status: "معتمدة", date: "2026/10/01" },
];
export const homeRecentTickets = [
  { code: "CS-001", id: "CS-001", subject: "استفسار عن راتب", priority: "مفتوحة", date: "2026/10/04" },
  { code: "CS-002", id: "CS-002", subject: "مشكلة في النظام", priority: "قيد المعالجة", date: "2026/10/03" },
  { code: "CS-003", id: "CS-003", subject: "طلب بيانات", priority: "بانتظار العميل", date: "2026/10/03" },
  { code: "CS-004", id: "CS-004", subject: "تحديث بيانات", priority: "مفتوحة", date: "2026/10/02" },
  { code: "CS-005", id: "CS-005", subject: "إغلاق حساب", priority: "مغلقة", date: "2026/10/01" },
];
export const onboardingStages = ["البيانات الأساسية", "الوظيفة والراتب", "الصلاحيات والأنظمة", "المستندات", "التجهيزات", "المراجعة والتفعيل"];
export const onboardingTasks = [
  { title: "إدخال البيانات الأساسية", status: "مكتمل" },
  { title: "تحديد الوظيفة والراتب", status: "مكتمل" },
  { title: "رفع واعتماد المستندات", status: "مكتمل" },
  { title: "إعداد الحسابات والصلاحيات", status: "مكتمل" },
  { title: "تجهيز أجهزة ومستلزمات العمل", status: "قيد التنفيذ" },
  { title: "التدريب والتعريف بالسياسات", status: "بانتظار" },
  { title: "توقيع الإقرارات", status: "بانتظار" },
  { title: "المراجعة والتفعيل", status: "بانتظار" },
] as const;
export const onboardingDocuments = [
  { title: "صورة الهوية الوطنية", status: "مرفوع" },
  { title: "صورة المؤهل العلمي", status: "مرفوع" },
  { title: "السيرة الذاتية", status: "مرفوع" },
  { title: "التصنيف المهني", status: "قيد المراجعة" },
  { title: "التأمين الصحي", status: "لم يرفع" },
  { title: "أخرى", status: "لم يرفع" },
] as const;

export const activityRows = [
  { user: "أحمد العتيبي", role: "مدير النظام", program: "الموارد البشرية", unit: "الموظفين", type: "إضافة", detail: "إضافة موظف جديد", ip: "192.168.1.10", status: "نجح", date: "2026/10/04", time: "14:32" },
  { user: "سارة القحطاني", role: "موظف موارد بشرية", program: "الموارد البشرية", unit: "الرواتب", type: "تعديل", detail: "تعديل بيانات راتب", ip: "192.168.1.15", status: "نجح", date: "2026/10/04", time: "13:45" },
  { user: "خالد الشهري", role: "المدير المالي", program: "الشؤون المالية", unit: "سندات الصرف", type: "اعتماد", detail: "اعتماد سند صرف رقم 4587", ip: "192.168.1.22", status: "نجح", date: "2026/10/04", time: "12:18" },
  { user: "نورة المطيري", role: "موظف مالي", program: "الشؤون المالية", unit: "الحسابات", type: "إضافة", detail: "إضافة حركة بنكية جديدة", ip: "192.168.1.18", status: "نجح", date: "2026/10/04", time: "11:30" },
  { user: "عبدالله الزهراني", role: "مدير خدمة العملاء", program: "خدمة العملاء", unit: "التذاكر", type: "تحديث", detail: "تغيير حالة التذكرة #1254", ip: "192.168.1.30", status: "نجح", date: "2026/10/04", time: "10:15" },
  { user: "سارة القحطاني", role: "موظف خدمة عملاء", program: "خدمة العملاء", unit: "العملاء", type: "عرض", detail: "عرض بيانات العميل", ip: "192.168.1.15", status: "نجح", date: "2026/10/04", time: "09:42" },
  { user: "أحمد العتيبي", role: "مدير النظام", program: "الإعدادات", unit: "المستخدمين", type: "تعديل", detail: "تحديث صلاحيات مستخدم", ip: "192.168.1.10", status: "نجح", date: "2026/10/04", time: "08:21" },
  { user: "محمد الغامدي", role: "موظف مالي", program: "الشؤون المالية", unit: "المستحقات", type: "حذف", detail: "حذف مستند مرفق", ip: "192.168.1.27", status: "فشل", date: "2026/10/03", time: "17:55" },
  { user: "نورة المطيري", role: "موظف موارد بشرية", program: "الموارد البشرية", unit: "الإجازات", type: "إضافة", detail: "إضافة طلب إجازة", ip: "192.168.1.18", status: "نجح", date: "2026/10/03", time: "16:30" },
  { user: "خالد الشهري", role: "المدير المالي", program: "الشؤون المالية", unit: "الميزانيات", type: "تعديل", detail: "تعديل ميزانية مشروع", ip: "192.168.1.22", status: "نجح", date: "2026/10/03", time: "15:12" },
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

export const payrollEmployees = [
  { id: "EMP-001", name: "د. أحمد العتيبي", department: "الخدمات الطبية", job: "استشاري قلب", kind: "سعودي", base: 35000, housing: 8000, transport: 2000, medical: 1500, other: 1000, deduction: 5200, status: "تم الصرف" },
  { id: "EMP-002", name: "د. سارة القحطاني", department: "التمريض", job: "أخصائي تمريض", kind: "سعودي", base: 28000, housing: 6000, transport: 1500, medical: 1000, other: 500, deduction: 4800, status: "تم الصرف" },
  { id: "EMP-003", name: "أ. خالد الشهري", department: "المالية", job: "محاسب أول", kind: "سعودي", base: 22000, housing: 4000, transport: 1000, medical: 1000, other: 500, deduction: 3700, status: "قيد المراجعة" },
  { id: "EMP-004", name: "أ. نورة المطيري", department: "تقنية المعلومات", job: "أخصائي نظم", kind: "سعودي", base: 18000, housing: 4000, transport: 1000, medical: 1000, other: 500, deduction: 2800, status: "تم الصرف" },
  { id: "EMP-005", name: "أ. محمد الحربي", department: "الموارد البشرية", job: "أخصائي موارد بشرية", kind: "سعودي", base: 16000, housing: 3500, transport: 500, medical: 1000, other: 500, deduction: 2500, status: "تم الصرف" },
  { id: "EMP-006", name: "أ. فاطمة الزهراني", department: "خدمة العملاء", job: "منسق إداري", kind: "غير سعودي", base: 14000, housing: 2500, transport: 1000, medical: 500, other: 500, deduction: 2300, status: "معلق" },
  { id: "EMP-007", name: "أ. عبدالله المالكي", department: "العمليات", job: "مشرف عمليات", kind: "سعودي", base: 12000, housing: 2500, transport: 500, medical: 1000, other: 500, deduction: 2100, status: "تم الصرف" },
  { id: "EMP-008", name: "أ. ريم العتيبي", department: "المشاريع", job: "أخصائي مشاريع", kind: "سعودي", base: 11000, housing: 2000, transport: 500, medical: 500, other: 500, deduction: 1000, status: "تم الصرف" },
] as const;

export const salaryRunEmployees = [
  { id: "EMP-001", name: "د. أحمد العتيبي", department: "الخدمات الطبية", section: "الاستشاري", job: "استشاري", kind: "سعودي", base: 35000, allowances: 5000, deductions: 3500, status: "مكتمل" },
  { id: "EMP-002", name: "د. سارة القحطاني", department: "الخدمات الطبية", section: "الخدمات", job: "أخصائي", kind: "سعودي", base: 28000, allowances: 4000, deductions: 2800, status: "مكتمل" },
  { id: "EMP-003", name: "أ. خالد الشهري", department: "الإدارة", section: "الإدارة", job: "مدير إدارة", kind: "سعودي", base: 22000, allowances: 3000, deductions: 2200, status: "مكتمل" },
  { id: "EMP-004", name: "أ. نورة المطيري", department: "المالية", section: "المالية", job: "محاسب", kind: "سعودي", base: 15000, allowances: 2000, deductions: 1200, status: "مراجعة" },
  { id: "EMP-005", name: "أ. محمد الحربي", department: "تقنية المعلومات", section: "المستشفى", job: "مطور نظم", kind: "سعودي", base: 18000, allowances: 2500, deductions: 1600, status: "مكتمل" },
  { id: "EMP-006", name: "أ. فاطمة الزهراني", department: "خدمة العملاء", section: "أخصائية خدمة عملاء", job: "أخصائي", kind: "غير سعودي", base: 12000, allowances: 1500, deductions: 900, status: "مكتمل" },
  { id: "EMP-007", name: "أ. عبدالله المالكي", department: "الإدارة", section: "مكتب الإدارة", job: "مدير", kind: "سعودي", base: 10000, allowances: 1000, deductions: 800, status: "معلق" },
  { id: "EMP-008", name: "أ. ريم العتيبي", department: "الموارد البشرية", section: "الموارد البشرية", job: "أخصائي", kind: "سعودي", base: 14000, allowances: 2000, deductions: 1100, status: "مكتمل" },
  { id: "EMP-009", name: "أ. علي القحطاني", department: "المالية", section: "أخصائي مالي", job: "محاسب", kind: "سعودي", base: 16000, allowances: 2500, deductions: 1300, status: "مكتمل" },
  { id: "EMP-010", name: "أ. ياسر الشهري", department: "تقنية المعلومات", section: "دعم فني", job: "دعم فني", kind: "غير سعودي", base: 11000, allowances: 1800, deductions: 900, status: "مكتمل" },
  { id: "EMP-011", name: "أ. هدى الغامدي", department: "الخدمات الطبية", section: "التمريض", job: "أخصائي", kind: "سعودي", base: 13000, allowances: 2000, deductions: 1200, status: "مكتمل" },
  { id: "EMP-012", name: "أ. فيصل الدوسري", department: "المالية", section: "المحاسبة", job: "محاسب", kind: "سعودي", base: 14500, allowances: 2300, deductions: 1400, status: "مراجعة" },
  { id: "EMP-013", name: "أ. ليلى العمري", department: "الموارد البشرية", section: "التوظيف", job: "أخصائي", kind: "سعودي", base: 12500, allowances: 1800, deductions: 1100, status: "مكتمل" },
  { id: "EMP-014", name: "أ. بندر السبيعي", department: "تقنية المعلومات", section: "الدعم", job: "دعم فني", kind: "سعودي", base: 11500, allowances: 1700, deductions: 1000, status: "مكتمل" },
  { id: "EMP-015", name: "أ. مها الشمري", department: "خدمة العملاء", section: "التواصل", job: "أخصائي", kind: "غير سعودي", base: 10500, allowances: 1500, deductions: 900, status: "معلق" },
  { id: "EMP-016", name: "أ. تركي العتيبي", department: "الإدارة", section: "العمليات", job: "مدير", kind: "سعودي", base: 17500, allowances: 2800, deductions: 1500, status: "مكتمل" },
  { id: "EMP-017", name: "أ. روان القحطاني", department: "الخدمات الطبية", section: "التمريض", job: "أخصائي", kind: "سعودي", base: 13000, allowances: 1900, deductions: 1100, status: "مكتمل" },
  { id: "EMP-018", name: "أ. ناصر الحربي", department: "المالية", section: "المحاسبة", job: "محاسب", kind: "سعودي", base: 15000, allowances: 2000, deductions: 1300, status: "مراجعة" },
  { id: "EMP-019", name: "أ. هند المالكي", department: "تقنية المعلومات", section: "البيانات", job: "مطور نظم", kind: "سعودي", base: 16500, allowances: 2200, deductions: 1450, status: "مكتمل" },
  { id: "EMP-020", name: "أ. ماجد الغامدي", department: "الإدارة", section: "المشتريات", job: "مدير", kind: "سعودي", base: 18000, allowances: 2600, deductions: 1600, status: "مكتمل" },
] as const;

export const payrollAllowanceTypes = [
  { id: "housing", name: "بدل سكن", value: 8000, original: 8000 },
  { id: "transport", name: "بدل نقل", value: 2000, original: 2000 },
  { id: "medical", name: "بدل طبي", value: 1500, original: 1500 },
  { id: "other", name: "بدل أعمال", value: 500, original: 500 },
];

export const payrollDeductionTypes = [
  { id: "social", name: "التأمينات الاجتماعية", value: 9.75, original: 9.75, unit: "%", share: 0.6 },
  { id: "tax", name: "ضريبة الدخل", value: 5, original: 5, unit: "%", share: 0.25 },
  { id: "advance", name: "سلف", value: 0, original: 0, unit: "ريال", share: 0.1 },
  { id: "absence", name: "غيابات", value: 0, original: 0, unit: "ريال", share: 0.04 },
  { id: "misc", name: "أخرى", value: 0, original: 0, unit: "ريال", share: 0.01 },
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

export const developmentRequests = [
  { id: "DEV-001", title: "إضافة تقرير الرواتب التفصيلي", program: "المالية", type: "تقرير", priority: "عالية", status: "قيد التنفيذ", date: "2026/10/01", description: "إضافة تقرير تفصيلي لرواتب الموظفين يشمل البدلات والاستقطاعات.", requester: "خالد الشهري" },
  { id: "DEV-002", title: "ربط العهد بالموظفين", program: "الموارد البشرية", type: "تكامل", priority: "متوسطة", status: "بانتظار الاعتماد", date: "2026/09/29", description: "ربط سجلات العهد بملفات الموظفين.", requester: "أحمد العتيبي" },
  { id: "DEV-003", title: "إضافة تصنيف التذاكر", program: "خدمة العملاء", type: "تطوير ميزة", priority: "منخفضة", status: "مكتملة", date: "2026/09/28", description: "تصنيف التذاكر حسب نوع الخدمة.", requester: "نورة المطيري" },
  { id: "DEV-004", title: "تحسين سرعة التقارير", program: "المالية", type: "تحسين أداء", priority: "متوسطة", status: "قيد التنفيذ", date: "2026/09/26", description: "تحسين سرعة تحميل التقارير المالية.", requester: "خالد الشهري" },
  { id: "DEV-005", title: "واجهة جديدة لطلب الإجازة", program: "الموارد البشرية", type: "واجهة مستخدم", priority: "عالية", status: "مكتملة", date: "2026/09/22", description: "تحديث نموذج تقديم الإجازة للموظفين.", requester: "أحمد العتيبي" },
  { id: "DEV-006", title: "إضافة إشعارات واتساب", program: "خدمة العملاء", type: "تكامل", priority: "عاجلة", status: "قيد التنفيذ", date: "2026/09/20", description: "إرسال إشعار واتساب عند وصول تذكرة جديدة.", requester: "نورة المطيري" },
  { id: "DEV-007", title: "إضافة صلاحيات جديدة", program: "الموارد البشرية", type: "صلاحيات", priority: "متوسطة", status: "مرفوضة", date: "2026/09/18", description: "إضافة صلاحيات جديدة لرؤساء الأقسام.", requester: "أحمد العتيبي" },
  { id: "DEV-008", title: "تصدير بيانات إلى إكسل", program: "المالية", type: "تقرير", priority: "منخفضة", status: "مكتملة", date: "2026/09/15", description: "تصدير بيانات التقارير المالية بصيغة إكسل.", requester: "خالد الشهري" },
];

export const formTemplates = [
  ["طلب توظيف", "نماذج التوظيف", "نموذج تقديم طلب توظيف جديد", "2026/10/01"],
  ["المقابلة الشخصية", "نماذج التوظيف", "نموذج تقييم المقابلة الشخصية", "2026/09/28"],
  ["عرض العمل", "نماذج التوظيف", "نموذج عرض عمل للمرشح", "2026/09/25"],
  ["عقد العمل", "نماذج التوظيف", "نموذج عقد عمل موظف", "2026/09/20"],
  ["مباشرة العمل", "شؤون الموظفين", "نموذج مباشرة عمل موظف", "2026/09/18"],
  ["إنهاء الخدمة", "شؤون الموظفين", "نموذج إنهاء خدمة موظف", "2026/09/15"],
  ["طلب إجازة", "نماذج الإجازات", "نموذج طلب إجازة اعتيادية/طارئة", "2026/09/10"],
  ["تقييم الأداء", "نماذج التقييم", "نموذج تقييم الأداء الوظيفي", "2026/09/05"],
  ["صرف بدل", "الرواتب والبدلات", "نموذج صرف بدل (سكن - نقل - نقل)", "2026/09/01"],
  ["طلب سلفة", "الرواتب والبدلات", "نموذج طلب سلفة مالية", "2026/08/28"],
  ["طلب نقل", "شؤون الموظفين", "نموذج طلب نقل موظف", "2026/08/25"],
  ["إخلاء طرف", "شؤون الموظفين", "نموذج إخلاء طرف موظف", "2026/08/20"],
  ["تعديل بيانات", "شؤون الموظفين", "نموذج تحديث بيانات الموظف", "2026/08/18"],
  ["ترشيح وظيفة", "نماذج التوظيف", "نموذج ترشيح لشغل وظيفة", "2026/08/15"],
  ["اعتماد التعيين", "نماذج التوظيف", "نموذج اعتماد تعيين مرشح", "2026/08/12"],
  ["كشف الرواتب", "الرواتب والبدلات", "نموذج كشف الرواتب", "2026/08/05"],
  ["تسوية مستحقات", "الرواتب والبدلات", "نموذج تسوية مستحقات", "2026/08/01"],
  ["جدول الإجازات", "نماذج الإجازات", "نموذج تخطيط الإجازات", "2026/07/28"],
  ["عودة من إجازة", "نماذج الإجازات", "نموذج مباشرة بعد الإجازة", "2026/07/25"],
  ["إجازة مرضية", "نماذج الإجازات", "نموذج طلب إجازة مرضية", "2026/07/20"],
  ["تقييم فترة التجربة", "نماذج التقييم", "نموذج تقييم موظف جديد", "2026/07/15"],
  ["تقييم الكفاءات", "نماذج التقييم", "نموذج تقييم الكفاءات", "2026/07/10"],
  ["محضر اجتماع", "أخرى", "نموذج محضر اجتماع", "2026/07/05"],
  ["طلب عهدة", "أخرى", "نموذج تسليم عهدة", "2026/07/01"],
] as const;

export const recruitmentCommittees = [
  { id: 1, name: "لجنة التوظيف - الخدمات الطبية", job: "استشاري قلب", department: "الخدمات الطبية", date: "2026/10/01", status: "نشطة", count: 35, description: "لجنة مقابلات لتقييم المتقدمين لاستشاري قلب في مستشفى العام" },
  { id: 2, name: "لجنة التوظيف - التمريض", job: "أخصائي تمريض", department: "التمريض", date: "2026/09/28", status: "نشطة", count: 52, description: "تقييم المرشحين للعمل في قسم التمريض" },
  { id: 3, name: "لجنة التوظيف - الإدارة المالية", job: "محاسب أول", department: "المالية", date: "2026/09/25", status: "مكتملة", count: 28, description: "مراجعة طلبات التوظيف للإدارة المالية" },
  { id: 4, name: "لجنة التوظيف - تقنية المعلومات", job: "أخصائي نظم", department: "تقنية المعلومات", date: "2026/09/20", status: "نشطة", count: 41, description: "تقييم الخبرات التقنية للمتقدمين" },
  { id: 5, name: "لجنة التوظيف - الموارد البشرية", job: "أخصائي موارد بشرية", department: "الموارد البشرية", date: "2026/09/15", status: "مكتملة", count: 22, description: "مقابلات المرشحين في إدارة الموارد البشرية" },
  { id: 6, name: "لجنة التوظيف - الخدمات المساندة", job: "مساعد إداري", department: "الإدارة العامة", date: "2026/09/10", status: "مغلقة", count: 18, description: "تقييم المتقدمين للخدمات المساندة" },
];

export const committeeMembers = [
  { name: "أ. د حمد العيسي", role: "رئيس اللجنة", job: "المدير الطبي" },
  { name: "د. سارة القحطاني", role: "عضو", job: "رئيس القسم" },
  { name: "أ. خالد الشهري", role: "عضو", job: "إدارة الموارد البشرية" },
  { name: "أ. نورة المطيري", role: "عضو", job: "الإدارة المالية" },
  { name: "أ. عبدالله الغامدي", role: "عضو", job: "الشؤون القانونية" },
];

export const committeeApplicants = [
  { name: "د. أحمد السبيعي", qualification: "دكتوراه", experience: "10 سنوات", status: "قيد المراجعة", date: "2026/10/02" },
  { name: "د. نواف العتيبي", qualification: "دكتوراه", experience: "8 سنوات", status: "مقابلة مجدولة", date: "2026/09/30" },
  { name: "د. ريم الحامد", qualification: "بورد", experience: "12 سنة", status: "مرفوض", date: "2026/09/28" },
  { name: "د. عبدالعزيز المالكي", qualification: "دكتوراه", experience: "9 سنوات", status: "تم الترشيح", date: "2026/09/27" },
  { name: "د. فاطمة علي", qualification: "استشاري", experience: "7 سنوات", status: "قيد المراجعة", date: "2026/09/25" },
];

export const departmentRows = [
  { id: 1, name: "الإدارة التنفيذية", code: "EXE", manager: "أ. محمد العتيبي", employees: 12, branches: 4, parent: "الإدارة التنفيذية", type: "تشغيلي", status: "نشط", description: "الإشراف على أعمال الجهة وإداراتها." },
  { id: 2, name: "الخدمات الطبية", code: "MED", manager: "د. خالد الشهري", employees: 58, branches: 8, parent: "الإدارة التنفيذية", type: "تشغيلي", status: "نشط", description: "يختص بتقديم الخدمات الطبية والعلاجية للمرضى" },
  { id: 3, name: "التمريض", code: "NUR", manager: "أ. سارة القحطاني", employees: 46, branches: 6, parent: "الخدمات الطبية", type: "تشغيلي", status: "نشط", description: "تنظيم خدمات التمريض ورعاية المرضى." },
  { id: 4, name: "الإدارة المالية", code: "FIN", manager: "أ. نورة المطيري", employees: 18, branches: 3, parent: "الإدارة التنفيذية", type: "إداري", status: "نشط", description: "إدارة الشؤون المالية والحسابات." },
  { id: 5, name: "الموارد البشرية", code: "HR", manager: "أ. عبدالله الزهراني", employees: 16, branches: 4, parent: "الإدارة التنفيذية", type: "إداري", status: "نشط", description: "شؤون الموظفين والتوظيف والتطوير." },
  { id: 6, name: "تقنية المعلومات", code: "IT", manager: "أ. فيصل السبيعي", employees: 22, branches: 5, parent: "الإدارة التنفيذية", type: "تقني", status: "نشط", description: "الأنظمة والتقنيات والدعم الفني." },
  { id: 7, name: "الخدمات المساندة", code: "SUP", manager: "أ. أحمد الحربي", employees: 28, branches: 4, parent: "الإدارة التنفيذية", type: "تشغيلي", status: "نشط", description: "الخدمات المساندة للجهة." },
  { id: 8, name: "العلاقات العامة", code: "PR", manager: "أ. ريم العنزي", employees: 10, branches: 2, parent: "الإدارة التنفيذية", type: "إداري", status: "نشط", description: "العلاقات العامة والاتصال." },
  { id: 9, name: "الشؤون القانونية", code: "LAW", manager: "أ. فاطمة علي", employees: 8, branches: 2, parent: "الإدارة التنفيذية", type: "إداري", status: "نشط", description: "الاستشارات والشؤون القانونية." },
  { id: 10, name: "إدارة المشاريع", code: "PM", manager: "أ. منصور الغامدي", employees: 12, branches: 4, parent: "الإدارة التنفيذية", type: "تشغيلي", status: "نشط", description: "تنسيق المشاريع ومتابعة تنفيذها." },
  { id: 11, name: "الصيدلة", code: "PHA", manager: "د. عادل المطيري", employees: 4, branches: 0, parent: "الخدمات الطبية", type: "تشغيلي", status: "نشط", description: "إدارة الصيدلية والدواء." },
  { id: 12, name: "المختبر", code: "LAB", manager: "د. مها الحربي", employees: 16, branches: 0, parent: "الخدمات الطبية", type: "تشغيلي", status: "نشط", description: "التحاليل المخبرية." },
  { id: 13, name: "الموارد العلاجية", code: "THR", manager: "د. يوسف الشمري", employees: 11, branches: 0, parent: "الخدمات الطبية", type: "تشغيلي", status: "نشط", description: "خدمات العلاج المساندة." },
  { id: 14, name: "المشتريات", code: "PUR", manager: "أ. هدى السالم", employees: 13, branches: 0, parent: "الإدارة المالية", type: "إداري", status: "نشط", description: "طلبات الشراء والموردون." },
  { id: 15, name: "التوظيف", code: "REC", manager: "أ. منى السبيعي", employees: 9, branches: 0, parent: "الموارد البشرية", type: "إداري", status: "نشط", description: "استقطاب الموظفين الجدد." },
  { id: 16, name: "التدريب والتطوير", code: "TRN", manager: "أ. عادل القحطاني", employees: 7, branches: 0, parent: "الموارد البشرية", type: "إداري", status: "نشط", description: "برامج التطوير المهني." },
  { id: 17, name: "الدعم الفني", code: "HELP", manager: "أ. خالد المانع", employees: 10, branches: 0, parent: "تقنية المعلومات", type: "تقني", status: "نشط", description: "حل المشكلات التقنية." },
  { id: 18, name: "الخدمات العامة", code: "GEN", manager: "أ. بندر الشهري", employees: 12, branches: 0, parent: "الخدمات المساندة", type: "تشغيلي", status: "متوقف", description: "الخدمات العامة والمرافق." },
];

// Aggregate reference figures for the illustrative HR reports dashboard.
export const hrReportJobs = [
  { name: "إدارة عليا", saudi: 22, other: 10, salarySaudi: 18000, salaryOther: 13000 },
  { name: "أخصائي", saudi: 68, other: 42, salarySaudi: 14000, salaryOther: 10000 },
  { name: "فني", saudi: 34, other: 28, salarySaudi: 9000, salaryOther: 6500 },
  { name: "إداري", saudi: 32, other: 36, salarySaudi: 10000, salaryOther: 8000 },
  { name: "خدمات مساندة", saudi: 18, other: 14, salarySaudi: 7000, salaryOther: 5000 },
  { name: "أخرى", saudi: 8, other: 0, salarySaudi: 6500, salaryOther: 0 },
] as const;

export const hrReportDepartments = [
  { name: "الخدمات الطبية", saudi: 48, other: 36 },
  { name: "التمريض", saudi: 32, other: 26 },
  { name: "المالية", saudi: 24, other: 12 },
  { name: "تقنية المعلومات", saudi: 20, other: 12 },
  { name: "الموارد البشرية", saudi: 18, other: 10 },
  { name: "خدمة العملاء", saudi: 14, other: 10 },
  { name: "الإدارة العامة", saudi: 10, other: 18 },
  { name: "أقسام أخرى", saudi: 16, other: 6 },
] as const;

export const hrReportMonths = [
  { name: "يناير", saudi: 82, other: 34 }, { name: "فبراير", saudi: 98, other: 41 },
  { name: "مارس", saudi: 110, other: 46 }, { name: "أبريل", saudi: 118, other: 52 },
  { name: "مايو", saudi: 136, other: 60 }, { name: "يونيو", saudi: 141, other: 66 },
  { name: "يوليو", saudi: 150, other: 73 }, { name: "أغسطس", saudi: 160, other: 78 },
  { name: "سبتمبر", saudi: 172, other: 84 }, { name: "أكتوبر", saudi: 182, other: 90 },
] as const;

// ============= Treasuries & banks (client-only demo) =============
export type TbKind = "إيداع" | "صرف" | "تحويل";
export type TbMovement = { id: number; date: string; kind: TbKind; desc: string; account: string; amount: number; after: number; user: string; attach: boolean; status: string };
export const tbBanks = [
  { id: "rajhi", name: "مصرف الراجحي", short: "الراجحي", iban: "SA** **** ***** 1234", balance: 1250000, logo: "alrajhi" as string | null, chartTreas: 270000 },
  { id: "snb", name: "البنك الأهلي", short: "الأهلي", iban: "SA** **** ***** 5678", balance: 850000, logo: "snb" as string | null, chartTreas: 120000 },
  { id: "inma", name: "مصرف الإنماء", short: "الإنماء", iban: "SA** **** ***** 9012", balance: 450000, logo: null as string | null, chartTreas: 200000 },
  { id: "riyad", name: "بنك الرياض", short: "الرياض", iban: "SA** **** ***** 3456", balance: 300000, logo: null as string | null, chartTreas: 260000 },
];
export const tbTreasuries = [
  { id: "main", name: "الخزينة الرئيسية", balance: 250000, chartBank: 170000 },
  { id: "proj", name: "خزينة المشاريع", balance: 150000, chartBank: 160000 },
  { id: "emer", name: "خزينة الطوارئ", balance: 50000, chartBank: 90000 },
];
export const tbMovements: TbMovement[] = [
  { id: 1, date: "2026/10/04", kind: "إيداع", desc: "إيراد خدمات طبية", account: "مصرف الراجحي", amount: 150000, after: 1250000, user: "أ. سارة القحطاني", attach: true, status: "مكتملة" },
  { id: 2, date: "2026/10/04", kind: "صرف", desc: "دفع رواتب", account: "البنك الأهلي", amount: 70000, after: 780000, user: "أ. محمد العتيبي", attach: true, status: "مكتملة" },
  { id: 3, date: "2026/10/03", kind: "تحويل", desc: "تحويل لمشروع العيادات", account: "خزينة المشاريع", amount: 50000, after: 150000, user: "أ. خالد الشهري", attach: true, status: "مكتملة" },
  { id: 4, date: "2026/10/02", kind: "إيداع", desc: "إيراد استشارات", account: "مصرف الإنماء", amount: 120000, after: 450000, user: "أ. نورة القحطاني", attach: false, status: "مكتملة" },
  { id: 5, date: "2026/10/01", kind: "صرف", desc: "مصاريف تشغيلية", account: "خزينة الطوارئ", amount: 30000, after: 50000, user: "أ. عبدالله الحربي", attach: false, status: "مكتملة" },
];
export const tbMonthly = [
  { m: "يناير", inc: 70000, exp: 20000 }, { m: "فبراير", inc: 115000, exp: 55000 }, { m: "مارس", inc: 100000, exp: 42000 },
  { m: "أبريل", inc: 140000, exp: 75000 }, { m: "مايو", inc: 105000, exp: 60000 }, { m: "يونيو", inc: 150000, exp: 92000 },
  { m: "يوليو", inc: 205000, exp: 118000 }, { m: "أغسطس", inc: 170000, exp: 115000 }, { m: "سبتمبر", inc: 225000, exp: 128000 },
  { m: "أكتوبر", inc: 210000, exp: 115000 },
];

// ============= Beneficiaries (client-only demo) =============
export type BenStatus = "معتمد" | "قيد المراجعة" | "مرفوض";
export type Beneficiary = { id: number; name: string; gender: "m" | "f"; nationality: string; idNo: string; specialty: string; type: "طبيب" | "كادر صحي"; status: BenStatus; date: string; phone: string; email: string };
export const beneficiariesSeed: Beneficiary[] = [
  { id: 1, name: "د. أحمد العتيبي", gender: "m", nationality: "سعودي", idNo: "1012345678", specialty: "استشاري قلب", type: "طبيب", status: "معتمد", date: "2026/10/04", phone: "0501234567", email: "ahmed@sample.com" },
  { id: 2, name: "د. سارة المطيري", gender: "f", nationality: "سعودية", idNo: "1012345679", specialty: "استشاري جلدية", type: "طبيب", status: "معتمد", date: "2026/10/04", phone: "0501234568", email: "user2@sample.com" },
  { id: 3, name: "أ. خالد الشهري", gender: "m", nationality: "سعودي", idNo: "1012345680", specialty: "أخصائي تمريض", type: "كادر صحي", status: "قيد المراجعة", date: "2026/10/03", phone: "0501234569", email: "user3@sample.com" },
  { id: 4, name: "أ. نورة القحطاني", gender: "f", nationality: "سعودية", idNo: "1012345681", specialty: "فني مختبرات", type: "كادر صحي", status: "معتمد", date: "2026/10/03", phone: "0501234570", email: "user4@sample.com" },
  { id: 5, name: "د. محمد الحربي", gender: "m", nationality: "سعودي", idNo: "1012345682", specialty: "أخصائي أشعة", type: "طبيب", status: "معتمد", date: "2026/10/02", phone: "0501234571", email: "user5@sample.com" },
  { id: 6, name: "أ. ريم العتيبي", gender: "f", nationality: "سعودية", idNo: "1012345683", specialty: "صيدلاني", type: "كادر صحي", status: "مرفوض", date: "2026/10/02", phone: "0501234572", email: "user6@sample.com" },
  { id: 7, name: "د. عبدالله الزهراني", gender: "m", nationality: "سعودي", idNo: "1012345684", specialty: "استشاري عظام", type: "طبيب", status: "معتمد", date: "2026/10/01", phone: "0501234573", email: "user7@sample.com" },
  { id: 8, name: "أ. فاطمة الشهري", gender: "f", nationality: "سعودية", idNo: "1012345685", specialty: "أخصائي تغذية", type: "كادر صحي", status: "قيد المراجعة", date: "2026/10/01", phone: "0501234574", email: "user8@sample.com" },
  { id: 9, name: "د. علي القحطاني", gender: "m", nationality: "سعودي", idNo: "1012345686", specialty: "استشاري أطفال", type: "طبيب", status: "معتمد", date: "2026/09/30", phone: "0501234575", email: "user9@sample.com" },
  { id: 10, name: "أ. ياسر المالكي", gender: "m", nationality: "سعودي", idNo: "1012345687", specialty: "فني أشعة", type: "كادر صحي", status: "مرفوض", date: "2026/09/29", phone: "0501234576", email: "user10@sample.com" },
  { id: 11, name: "د. هند الدوسري", gender: "f", nationality: "سعودية", idNo: "1012345688", specialty: "استشاري نساء وولادة", type: "طبيب", status: "معتمد", date: "2026/09/28", phone: "0501234577", email: "user11@sample.com" },
  { id: 12, name: "أ. سلطان العنزي", gender: "m", nationality: "سعودي", idNo: "1012345689", specialty: "فني تخدير", type: "كادر صحي", status: "معتمد", date: "2026/09/27", phone: "0501234578", email: "user12@sample.com" },
  { id: 13, name: "د. منى الغامدي", gender: "f", nationality: "سعودية", idNo: "1012345690", specialty: "أخصائي باطنية", type: "طبيب", status: "قيد المراجعة", date: "2026/09/26", phone: "0501234579", email: "user13@sample.com" },
  { id: 14, name: "أ. فهد السبيعي", gender: "m", nationality: "سعودي", idNo: "1012345691", specialty: "أخصائي علاج طبيعي", type: "كادر صحي", status: "معتمد", date: "2026/09/25", phone: "0501234580", email: "user14@sample.com" },
  { id: 15, name: "د. لمى الشمري", gender: "f", nationality: "سعودية", idNo: "1012345692", specialty: "استشاري عيون", type: "طبيب", status: "معتمد", date: "2026/09/24", phone: "0501234581", email: "user15@sample.com" },
  { id: 16, name: "د. Omar Khan", gender: "m", nationality: "باكستاني", idNo: "1012345693", specialty: "أخصائي جراحة", type: "طبيب", status: "معتمد", date: "2026/09/23", phone: "0501234582", email: "user16@sample.com" },
  { id: 17, name: "أ. عبير الحارثي", gender: "f", nationality: "سعودية", idNo: "1012345694", specialty: "أخصائي تمريض", type: "كادر صحي", status: "مرفوض", date: "2026/09/22", phone: "0501234583", email: "user17@sample.com" },
  { id: 18, name: "د. ماجد العمري", gender: "m", nationality: "سعودي", idNo: "1012345695", specialty: "استشاري أعصاب", type: "طبيب", status: "معتمد", date: "2026/09/21", phone: "0501234584", email: "user18@sample.com" },
  { id: 19, name: "أ. جواهر البقمي", gender: "f", nationality: "سعودية", idNo: "1012345696", specialty: "فني مختبرات", type: "كادر صحي", status: "معتمد", date: "2026/09/20", phone: "0501234585", email: "user19@sample.com" },
  { id: 20, name: "د. ناصر القرني", gender: "m", nationality: "سعودي", idNo: "1012345697", specialty: "استشاري أنف وأذن", type: "طبيب", status: "قيد المراجعة", date: "2026/09/19", phone: "0501234586", email: "user20@sample.com" },
  { id: 21, name: "أ. Maria Santos", gender: "f", nationality: "فلبينية", idNo: "1012345698", specialty: "أخصائي تمريض", type: "كادر صحي", status: "معتمد", date: "2026/09/18", phone: "0501234587", email: "user21@sample.com" },
  { id: 22, name: "د. تركي الرشيد", gender: "m", nationality: "سعودي", idNo: "1012345699", specialty: "أخصائي أسنان", type: "طبيب", status: "معتمد", date: "2026/09/17", phone: "0501234588", email: "user22@sample.com" },
  { id: 23, name: "أ. أمل الجهني", gender: "f", nationality: "سعودية", idNo: "1012345700", specialty: "صيدلاني", type: "كادر صحي", status: "معتمد", date: "2026/09/16", phone: "0501234589", email: "user23@sample.com" },
  { id: 24, name: "د. بدر المطيري", gender: "m", nationality: "سعودي", idNo: "1012345701", specialty: "استشاري مسالك", type: "طبيب", status: "معتمد", date: "2026/09/15", phone: "0501234590", email: "user24@sample.com" },
];
