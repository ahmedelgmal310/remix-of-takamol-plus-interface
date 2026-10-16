import { it } from "node:test";
import assert from "node:assert/strict";
import { customerSlices } from "../components/sales-insights";

it("المركز مجموع المبالغ والنسب محسوبة منها", () => {
  const r = customerSlices([{ name: "أ", amount: 300 }, { name: "ب", amount: 100 }]);
  assert.equal(r.total, 400);
  assert.deepEqual(r.slices.map((s) => s.percent), [75, 25]);
});

it("العميل السادس فما فوق يُضمّ في «أخرى»", () => {
  const r = customerSlices([1, 2, 3, 4, 5, 6].map((n) => ({ name: `ع${n}`, amount: n * 10 })));
  assert.equal(r.slices.length, 5);
  assert.equal(r.slices[4]?.name, "أخرى");
  assert.equal(r.slices[4]?.amount, 30);
});

it("لا مبيعات = لا كسور", () => {
  assert.equal(customerSlices([]).slices.length, 0);
});
