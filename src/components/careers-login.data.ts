export interface PortalOrganization { name?: string | undefined; logoUrl?: string | undefined }
export interface PortalJob {
  id: string; title?: string | undefined; organization?: string | undefined; specialty?: string | undefined;
  city?: string | undefined; region?: string | undefined; contract?: string | undefined; weeklyHours?: number | undefined;
  imageUrl?: string | undefined; schedule?: string | undefined;
}
export interface PortalCredentials { identifier: string; password: string; remember: boolean }
export interface PortalApplication {
  jobId: string; specialty: string; contract: string; city: string; availableOn: string;
  weeklyHours: string; experience: string; fullName: string; email: string;
  phone: string; qualifications: string; files: File[];
}
export interface PortalActionResult { success: boolean; message?: string | undefined }
export type PortalLoginHandler = (input: PortalCredentials) => Promise<PortalActionResult>;
export type PortalApplyHandler = (input: PortalApplication) => Promise<PortalActionResult>;
export const portalValue = (value?: string | undefined | number) => value === undefined || value === null || String(value).trim() === "" ? "—" : String(value);
export function filterPortalJobs(jobs: readonly PortalJob[], query: string, region: string, contract: string) {
  const term = query.trim().toLocaleLowerCase();
  return jobs.filter(job => (!term || [job.title, job.organization, job.specialty].some(value => value?.toLocaleLowerCase().includes(term))) && (!region || (job.region || job.city) === region) && (!contract || job.contract === contract));
}
export function readPortalOrganization(state: unknown): PortalOrganization {
  if (!state || typeof state !== "object") return {};
  const raw = (state as Record<string, unknown>)["organizationSettings"];
  if (!raw || typeof raw !== "object") return {};
  const settings = raw as Record<string, unknown>;
  return { name: typeof settings["name"] === "string" ? settings["name"] : undefined, logoUrl: typeof settings["logoUrl"] === "string" ? settings["logoUrl"] : undefined };
}
export function applicationStepReady(step: number, input: PortalApplication) {
  if (step === 0) return Boolean(input.jobId && input.specialty.trim() && input.contract && input.city.trim() && input.availableOn && Number(input.weeklyHours) > 0);
  if (step === 1) return Boolean(input.fullName.trim() && /^\S+@\S+\.\S+$/.test(input.email) && input.phone.trim());
  if (step === 2) return Boolean(input.qualifications.trim());
  if (step === 3) return input.files.length > 0;
  return true;
}