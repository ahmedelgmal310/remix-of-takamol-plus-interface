import { createFileRoute } from "@tanstack/react-router";
import { SelfServicePage } from "@/components/self-service";
const t="الخدمة الذاتية للموظف — تكامل بلس";const d="إدارة بياناتك وخدماتك الوظيفية بسهولة ومن مكان واحد: الراتب، السلف، الاستئذانات، العهد والمزيد.";
export const Route=createFileRoute("/self-service")({head:()=>({meta:[{title:t},{name:"description",content:d},{property:"og:title",content:t},{property:"og:description",content:d},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:SelfServicePage});
