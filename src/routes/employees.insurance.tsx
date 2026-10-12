import { createFileRoute } from '@tanstack/react-router';
import { EmployeeDocuments } from '@/components/employee-documents';
const title='التأمين الطبي — تكامل بلس',description='بيانات تأمين الموظف والتابعين وملف البوليصة التجريبية.';
export const Route=createFileRoute('/employees/insurance')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:InsurancePage});
function InsurancePage(){return <EmployeeDocuments insurancePage/>}
