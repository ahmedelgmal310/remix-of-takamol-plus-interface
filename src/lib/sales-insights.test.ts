import { test, expect } from "bun:test";
import { customerSlices } from "@/components/sales-insights";

test("المركز مجموع المبالغ والنسب محسوبة منها", () => {
  const r = customerSlices([{ name: "أ", amount: 300 }, { name: "ب", amount: 100 }]);
  expect(r.total).toBe(400);
  expect(r.slices.map((s) => s.percent)).toEqual([75, 25]);
});

test("العميل السادس فما فوق يُضمّ في «أخرى»", () => {
  const r = customerSlices([1, 2, 3, 4, 5, 6].map((n) => ({ name: `ع${n}`, amount: n * 10 })));
  expect(r.slices).toHaveLength(5);
  expect(r.slices[4]).toMatchObject({ name: "أخرى", amount: 30 });
});

test("لا مبيعات = لا كسور", () => {
  expect(customerSlices([]).slices).toHaveLength(0);
});
