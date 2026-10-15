import { createFileRoute } from '@tanstack/react-router';
import { PurchaseSuccessPage } from '@/components/purchase-success';
const title='تم استلام طلب شراء المنصة بنجاح — تكامل بلس';
const description='تفاصيل طلب اشتراك تكامل بلس ومتابعة مراحله من استلام الطلب إلى إصدار العقد.';
export const Route=createFileRoute('/purchase-success')({
 head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:PurchaseSuccessPage,
});