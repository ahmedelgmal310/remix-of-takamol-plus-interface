export interface VerifyInput { code: string; nationalId: string; issuedOn: string }
export interface VerifyOrganization { name?: string; logoUrl?: string }
export interface VerifiedCertificate {
  code?: string; employeeName?: string; employeeId?: string; nationalId?: string;
  jobTitle?: string; department?: string; hireDate?: string; issuedOn?: string;
  status?: string; body?: string; qrImageUrl?: string; signatureImageUrl?: string;
  downloadUrl?: string;
}
export type VerifyResult = { valid: true; certificate?: VerifiedCertificate } | { valid: false; reasons?: string[] };
export type VerifyHandler = (input: VerifyInput) => Promise<VerifyResult>;
export const displayVerifyValue = (value?: string) => value?.trim() || "—";
export function validVerifyInput(input: VerifyInput) {
  return Boolean(input.code.trim() && input.nationalId.trim() && /^\d{4}-\d{2}-\d{2}$/.test(input.issuedOn));
}
export function readVerifyOrganization(state: unknown): VerifyOrganization {
  if (!state || typeof state !== "object") return {};
  const raw = (state as Record<string, unknown>)["organizationSettings"];
  if (!raw || typeof raw !== "object") return {};
  const settings = raw as Record<string, unknown>;
  return {
    ...(typeof settings["name"] === "string" ? { name: settings["name"] } : {}),
    ...(typeof settings["logoUrl"] === "string" ? { logoUrl: settings["logoUrl"] } : {}),
  };
}