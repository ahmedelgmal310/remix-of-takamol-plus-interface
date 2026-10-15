import type { LabTest } from "@/data/mockData";

export function validLabAttachment(file: { name: string; size: number; type: string }) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const types: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
  return !!extension && !!types[extension] && (!file.type || file.type === types[extension]) && file.size <= 5 * 1024 * 1024;
}

export function filterLabTests(tests: LabTest[], query: string, category: string) {
  const q = query.trim().toLowerCase();
  return tests.filter(t => (category === "الكل" || t.cat === category) && `${t.name} ${t.code}`.toLowerCase().includes(q));
}

export function canAddLabTest(test: LabTest, selected: LabTest[]) {
  return !!test.name.trim() && !!test.code.trim() && !selected.some(t => t.code.trim().toLowerCase() === test.code.trim().toLowerCase());
}