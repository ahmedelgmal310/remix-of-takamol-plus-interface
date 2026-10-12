import { createFileRoute } from '@tanstack/react-router';
import { EmployeeAdvancesReference } from '@/components/employee-advances-reference';
const title='السلف — تكامل بلس',description='طلبات سلف الموظف ومتابعة الصرف والسداد بصورة توضيحية.';
export const Route=createFileRoute('/employees/advances')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:EmployeeAdvancesReference});
