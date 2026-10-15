import {createFileRoute} from '@tanstack/react-router';
import {PersonalCustodyPage} from '@/components/personal-custody';
const title='عهدة الموظف — تكامل بلس';
const description='عهد وأصول الموظف، سجل حركتها وطلبات العهد الجديدة في ملف الموظف.';
export const Route=createFileRoute('/employee-custody')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:PersonalCustodyPage});
