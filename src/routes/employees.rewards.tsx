import { createFileRoute } from '@tanstack/react-router';
import { EmployeeRewardsReference } from '@/components/employee-rewards-reference';
const title='المكافآت — تكامل بلس',description='مكافآت الموظف وحوافزه المالية وتقاريرها التوضيحية.';
export const Route=createFileRoute('/employees/rewards')({head:()=>({meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:EmployeeRewardsReference});
