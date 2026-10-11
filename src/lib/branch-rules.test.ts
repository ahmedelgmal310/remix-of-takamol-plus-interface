import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { branchReferenceRows, branchReportSummary } from "../data/mockData";
describe("Branch reference rules", () => {
  it("has eight branches, six active and two inactive", () => {
    assert.equal(branchReferenceRows.length, 8);
    assert.equal(branchReferenceRows.filter(r => r.active).length, 6);
    assert.equal(branchReferenceRows.filter(r => !r.active).length, 2);
  });
  it("retains the report's reference expenses and contract counts", () => {
    assert.deepEqual(branchReportSummary, {expenses:345600, contractors:18, expired:3, active:24, total:28});
  });
});