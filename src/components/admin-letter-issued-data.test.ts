import { test } from "node:test";
import assert from "node:assert/strict";
import { letterValue, readIssuedLetterState } from "./admin-letter-issued-data";

test("missing employee, letter number and issue date display a dash", () => {
  const { letter, organizationSettings } = readIssuedLetterState(undefined);
  assert.equal(letterValue(letter.employeeName), "—");
  assert.equal(letterValue(letter.number), "—");
  assert.equal(letterValue(letter.issuedAt), "—");
  assert.equal(letterValue(organizationSettings.name), "—");
});
test("letter and organization values come only from supplied navigation state", () => {
  const input = { issuedLetter: { employeeName: "موظف الاختبار", number: "TEST-42", issuedAt: "2030/01/02", approved: true }, organizationSettings: { name: "منشأة الاختبار" } };
  const data = readIssuedLetterState(input);
  assert.equal(data.letter.employeeName, input.issuedLetter.employeeName);
  assert.equal(data.letter.number, input.issuedLetter.number);
  assert.equal(data.letter.issuedAt, input.issuedLetter.issuedAt);
  assert.equal(data.organizationSettings.name, input.organizationSettings.name);
  assert.equal(data.letter.approved, true);
});
test("invalid values do not fabricate names or approval", () => {
  const data = readIssuedLetterState({ issuedLetter: { employeeName: 42, approved: "true" }, organizationSettings: { name: null } });
  assert.equal(letterValue(data.letter.employeeName), "—");
  assert.equal(letterValue(data.organizationSettings.name), "—");
  assert.equal(data.letter.approved, undefined);
});