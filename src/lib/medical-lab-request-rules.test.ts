import { test } from "node:test";
import assert from "node:assert/strict";
import { validLabAttachment, filterLabTests, canAddLabTest } from "./medical-lab-request-rules";
import { medicalLabRequestReference as data } from "../data/mockData";

test("laboratory attachments accept PDF JPG PNG only", () => {
  for (const [name, type] of [["report.pdf", "application/pdf"], ["scan.jpg", "image/jpeg"], ["scan.png", "image/png"]]) {
    assert.equal(validLabAttachment({ name: name ?? "", type: type ?? "", size: 100 }), true);
  }
  assert.equal(validLabAttachment({ name: "report.docx", type: "", size: 100 }), false);
  assert.equal(validLabAttachment({ name: "report.pdf", type: "image/png", size: 100 }), false);
});
test("laboratory attachment limit is five megabytes", () => {
  assert.equal(validLabAttachment({ name: "report.pdf", type: "application/pdf", size: 5 * 1024 * 1024 }), true);
  assert.equal(validLabAttachment({ name: "report.pdf", type: "application/pdf", size: 5 * 1024 * 1024 + 1 }), false);
});
test("catalog search and manual additions retain selected tests without duplicates", () => {
  assert.deepEqual(filterLabTests(data.catalog, "fbs", "تحاليل أساسية").map(t => t.code), ["FBS"]);
  assert.equal(filterLabTests(data.catalog, "fbs", "تحاليل وظيفية").length, 0);
  assert.equal(canAddLabTest({ name: "تحليل يدوي", code: "NEW", kind: "دم", note: "", cat: "تحاليل أخرى" }, data.selectedTests), true);
  assert.equal(canAddLabTest({ name: "مكرر", code: "cbc", kind: "دم", note: "", cat: "تحاليل أخرى" }, data.selectedTests), false);
});