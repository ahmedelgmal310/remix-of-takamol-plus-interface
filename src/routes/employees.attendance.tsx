import { createFileRoute } from '@tanstack/react-router';
import { EmployeeAttendanceReference } from '@/components/employee-attendance-reference';
const title='الحضور والانصراف — تكامل بلس',description='سجل حضور الموظف وساعات العمل والتقرير الشهري.';
export const Route=createFileRoute('/employees/attendance')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:EmployeeAttendanceReference});
