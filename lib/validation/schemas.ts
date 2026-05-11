import { z } from "zod";

export const organisationProfileSchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(2),
  employeeCount: z.coerce.number().int().positive(),
  cloudProviders: z.array(z.enum(["azure", "aws", "microsoft365"])).default(["azure"]),
  usesMicrosoft365: z.coerce.boolean().default(false),
  handlesSensitive: z.coerce.boolean().default(false),
  hasRemoteWorkers: z.coerce.boolean().default(false),
  hasContractors: z.coerce.boolean().default(false),
  backupApproach: z.string().min(3),
  mfaApproach: z.string().min(3),
  deviceManagement: z.string().min(3),
  incidentMaturity: z.string().min(3)
});

export const azureConnectionSchema = z.object({
  name: z.string().min(2),
  tenantId: z.string().min(8),
  clientId: z.string().min(8),
  clientSecret: z.string().min(8),
  subscriptionId: z.string().min(8)
});
