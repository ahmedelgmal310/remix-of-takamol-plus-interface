import { Gift } from "lucide-react";
import { ReferenceDashboard, type ReferenceDashboardConfig } from "@/components/reference-dashboard";
import { rewardReferenceRows } from "@/data/mockData";
const config: ReferenceDashboardConfig = { title:"المكافآت", subtitle:"إدارة طلبات المكافآت ومتابعة حالتها", crumb:"الموارد البشرية / النقل والترقية والمكافآت / المكافآت", panelTitle:"نموذج طلب مكافأة", icon:<Gift size={21}/>, mode:"reward", rows:rewardReferenceRows, stats:[{label:"إجمالي المكافآت",value:"248",sub:"بقيمة 1,250,000 ريال",tone:"blue"},{label:"مصروفة",value:"180",sub:"72%",tone:"green"},{label:"تحت الإجراء",value:"42",sub:"17%",tone:"orange"},{label:"مرفوضة",value:"26",sub:"11%",tone:"red"}] };
export function RewardIssuePage(){return <ReferenceDashboard config={config}/>;}