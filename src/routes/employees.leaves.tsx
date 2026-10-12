import { createFileRoute } from '@tanstack/react-router';
import { EmployeeLeavesReference } from '@/components/employee-leaves-reference';
const title='إجازات الموظف — تكامل بلس',description='إجازات الموظف وأرصدة الأيام وطلبات الإجازة التجريبية.';
export const Route=createFileRoute('/employees/leaves')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:EmployeeLeavesReference});
