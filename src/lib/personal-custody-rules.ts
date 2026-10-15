import type { PersonalCustodyAsset, PersonalCustodyMovement } from '@/data/mockData';
export function employeeCustodyRows(rows:PersonalCustodyAsset[], employeeId:string, query='',status='',department='',date='') {
 return rows.filter(r=>r.employeeId===employeeId && (!query || `${r.name} ${r.serial} ${r.category}`.includes(query)) && (!status||r.status===status) && (!department||r.department===department) && (!date||r.issued===date));
}
export function employeeCustodyHistory(rows:PersonalCustodyMovement[],employeeId:string) {return rows.filter(r=>r.employeeId===employeeId);}
export function custodyCounts(rows:PersonalCustodyAsset[],employeeId:string) {const own=employeeCustodyRows(rows,employeeId);return {total:own.length,current:own.filter(r=>r.status==='current').length,temporary:own.filter(r=>r.status==='temporary').length,returned:own.filter(r=>r.status==='returned').length};}
export function validCustodyRequest(type:string,name:string,category:string,quantity:number) {return Boolean(type&&name.trim()&&category&&Number.isInteger(quantity)&&quantity>0);}