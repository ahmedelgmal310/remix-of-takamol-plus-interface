import { test } from "node:test";
import { strict as assert } from "node:assert";
import { displayVerifyValue, readVerifyOrganization, validVerifyInput } from "./verify-data";
test("verification requires code, nationalId and issuedOn together", () => {
  const input = { code: "REF-2025-001", nationalId: "1012345678", issuedOn: "2025-09-10" };
  assert.equal(validVerifyInput(input), true);
  for (const key of ["code", "nationalId", "issuedOn"] as const) assert.equal(validVerifyInput({ ...input, [key]: "" }), false);
});
test("missing certificate values stay missing", () => {
  assert.equal(displayVerifyValue(undefined), "—");
  assert.equal(displayVerifyValue("  "), "—");
});
test("organization comes only from supplied settings", () => {
  assert.deepEqual(readVerifyOrganization(null), {});
  assert.deepEqual(readVerifyOrganization({ organizationSettings: { name: "جهة اختبار", logoUrl: "/test.svg" } }), { name: "جهة اختبار", logoUrl: "/test.svg" });
});
