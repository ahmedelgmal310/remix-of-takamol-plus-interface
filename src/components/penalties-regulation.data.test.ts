import { test } from "node:test";
import assert from "node:assert/strict";
import { isPenaltyAttachment } from "./penalties-regulation.data";
test("accepts PDF, JPG and PNG only", () => {
  for (const [name, type] of [["file.pdf", "application/pdf"], ["file.jpg", "image/jpeg"], ["file.png", "image/png"]] as const) {
    assert.equal(isPenaltyAttachment({ name, type, size: 100 }), true);
  }
  assert.equal(isPenaltyAttachment({ name: "file.docx", type: "application/octet-stream", size: 100 }), false);
  assert.equal(isPenaltyAttachment({ name: "file.png", type: "text/html", size: 100 }), false);
});
test("enforces 10 megabytes per file", () => {
  assert.equal(isPenaltyAttachment({ name: "file.pdf", type: "application/pdf", size: 10 * 1024 * 1024 }), true);
  assert.equal(isPenaltyAttachment({ name: "file.pdf", type: "application/pdf", size: 10 * 1024 * 1024 + 1 }), false);
});