export interface IssuedAdminLetter {
  type?: string;
  employeeName?: string;
  employeeId?: string;
  department?: string;
  number?: string;
  issuedAt?: string;
  nationalId?: string;
  jobTitle?: string;
  hireDate?: string;
  recipient?: string;
  body?: string;
  approved?: boolean;
  qrImageUrl?: string;
}
export interface LetterOrganizationSettings {
  name?: string;
  country?: string;
  hrDepartment?: string;
  logoUrl?: string;
}
export const letterValue = (value?: string) => value?.trim() || "—";
function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}
function strings<T extends string>(value: unknown, keys: readonly T[]): Partial<Record<T, string>> {
  const source = record(value);
  const result: Partial<Record<T, string>> = {};
  for (const key of keys) {
    const item = source[key];
    if (typeof item === "string") result[key] = item;
  }
  return result;
}
/** Navigation state: { issuedLetter, organizationSettings }. */
export function readIssuedLetterState(state: unknown): { letter: IssuedAdminLetter; organizationSettings: LetterOrganizationSettings } {
  const source = record(state);
  const raw = record(source.issuedLetter);
  return {
    letter: { ...strings(raw, ["type", "employeeName", "employeeId", "department", "number", "issuedAt", "nationalId", "jobTitle", "hireDate", "recipient", "body", "qrImageUrl"]), ...(typeof raw.approved === "boolean" ? { approved: raw.approved } : {}) },
    organizationSettings: strings(source.organizationSettings, ["name", "country", "hrDepartment", "logoUrl"]),
  };
}