import { useSyncExternalStore } from "react";
import { employeeReferencePerson, employeeReferenceSalary, employeeReferenceDocuments, employeeReferenceDependents, employeeReferenceInsurance, employeeReferenceLeaves } from "@/data/mockData";
const initial = {person:employeeReferencePerson,salary:employeeReferenceSalary,documents:employeeReferenceDocuments,dependents:employeeReferenceDependents,insurance:employeeReferenceInsurance,leaves:employeeReferenceLeaves};
export type EmployeeReferenceState = typeof initial;
let state = initial;
const listeners = new Set<() => void>();
export function updateEmployeeReference(update: (s:EmployeeReferenceState)=>EmployeeReferenceState) { state=update(state); listeners.forEach(l=>l()); }
export function useEmployeeReference() { return useSyncExternalStore(l=>{listeners.add(l);return ()=>{listeners.delete(l);};},()=>state,()=>initial); }
export function salaryTotals(s: typeof employeeReferenceSalary) {const allowances=s.housing+s.transport+s.communication+s.medical;const deductions=s.social+s.tax;return {allowances,deductions,gross:s.basic+allowances,net:s.basic+allowances-deductions};}
export function acceptedEmployeeFile(file:{type:string;size:number},limitMB=10) { return ["application/pdf","image/jpeg","image/png"].includes(file.type) && file.size<=limitMB*1024*1024; }
export function leaveDays(start:string,end:string) {const days=(Date.parse(end)-Date.parse(start))/86400000+1;return Number.isFinite(days)&&days>0?days:0;}