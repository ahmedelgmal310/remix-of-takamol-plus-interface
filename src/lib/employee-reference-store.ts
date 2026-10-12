import { useSyncExternalStore } from "react";
import { employeeReferencePerson, employeeReferenceSalary, employeeReferenceDocuments, employeeReferenceDependents, employeeReferenceInsurance, employeeReferenceLeaves, employeeAttendanceRows, employeeAdvanceRows, employeeRewardRows } from "@/data/mockData";
const initial = {person:employeeReferencePerson,salary:employeeReferenceSalary,documents:employeeReferenceDocuments,dependents:employeeReferenceDependents,insurance:employeeReferenceInsurance,leaves:employeeReferenceLeaves,attendance:employeeAttendanceRows,advances:employeeAdvanceRows,rewards:employeeRewardRows};
export type EmployeeReferenceState = typeof initial;
let state = initial;
const listeners = new Set<() => void>();
export function updateEmployeeReference(update: (s:EmployeeReferenceState)=>EmployeeReferenceState) { state=update(state); listeners.forEach(l=>l()); }
export function useEmployeeReference() { return useSyncExternalStore(l=>{listeners.add(l);return ()=>{listeners.delete(l);};},()=>state,()=>initial); }
export function salaryTotals(s: typeof employeeReferenceSalary) {const allowances=s.housing+s.transport+s.communication+s.medical;const deductions=s.social+s.tax;return {allowances,deductions,gross:s.basic+allowances,net:s.basic+allowances-deductions};}
export function acceptedEmployeeFile(file:{type:string;size:number},limitMB=10) { return ["application/pdf","image/jpeg","image/png"].includes(file.type) && file.size<=limitMB*1024*1024; }
export function leaveDays(start:string,end:string) {const days=(Date.parse(end)-Date.parse(start))/86400000+1;return Number.isFinite(days)&&days>0?days:0;}
export function validEmployeeAmount(amount:number) {return Number.isFinite(amount)&&amount>0;}
export function employeeWorkHours(start:string,end:string) {const toMinutes=(v:string)=>{const [h,m]=v.split(':').map(Number);return h*60+m};const mins=toMinutes(end)-toMinutes(start);return Number.isFinite(mins)&&mins>=0?`${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`:'';}