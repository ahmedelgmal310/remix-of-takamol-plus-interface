import { createFileRoute } from '@tanstack/react-router';
import { EmployeeSalaryReference } from '@/components/employee-salary-reference';
const title='الراتب والبدلات — تكامل بلس',description='تفاصيل راتب الموظف وبدلاته وخصوماته ومسيرات الرواتب.';
export const Route=createFileRoute('/employees/salary')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:EmployeeSalaryReference});
