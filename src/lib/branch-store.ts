import { useSyncExternalStore } from "react";
import { branchReferenceRows, type BranchRecord } from "@/data/mockData";

let records = branchReferenceRows;
const listeners = new Set<() => void>();
export function updateBranches(next: BranchRecord[]) {
  records = next;
  listeners.forEach(listener => listener());
}
export function useBranches() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => records, () => branchReferenceRows);
}
export function filterBranches(rows: BranchRecord[], search: string, city: string, status: string) {
  return rows.filter(row => (!search || `${row.name} ${row.city}`.includes(search)) && (!city || row.city === city) && (!status || row.active === (status === "active")));
}