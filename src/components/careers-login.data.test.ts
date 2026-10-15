import { test } from "node:test";
import { strict as assert } from "node:assert";
import { filterPortalJobs, portalValue, readPortalOrganization } from "./careers-login.data";
test("absent jobs never create fabricated records", () => {
  assert.deepEqual(filterPortalJobs([], "", "", ""), []);
  assert.equal(portalValue(undefined), "—");
});
test("organization identity comes only from supplied settings", () => {
  assert.deepEqual(readPortalOrganization(undefined), {});
  assert.deepEqual(readPortalOrganization({ organizationSettings: { name: "جهة اختبار", logoUrl: "/test-logo.svg" } }), { name: "جهة اختبار", logoUrl: "/test-logo.svg" });
});
test("search region and contract combine on supplied jobs", () => {
  const jobs = [{ id: "a", title: "فرصة اختبار أولى", specialty: "تخصص اختبار", region: "منطقة أ", contract: "دائم" }, { id: "b", title: "فرصة اختبار ثانية", region: "منطقة ب", contract: "مؤقت" }];
  assert.deepEqual(filterPortalJobs(jobs, "تخصص اختبار", "منطقة أ", "دائم").map(job => job.id), ["a"]);
  assert.deepEqual(filterPortalJobs(jobs, "تخصص اختبار", "منطقة ب", "دائم"), []);
});
