import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.string().min(1),
  licenseExpiryDate: z.string().transform((str) => new Date(str)),
  contactNumber: z.string().min(1),
  safetyScore: z.number().min(0).max(100).default(100),
  status: z.enum(["Available", "On Trip", "Off Duty", "Suspended"]).default("Available"),
});

export const updateDriverSchema = z.object({
  name: z.string().min(1).optional(),
  licenseNumber: z.string().min(1).optional(),
  licenseCategory: z.string().min(1).optional(),
  licenseExpiryDate: z.string().transform((str) => new Date(str)).optional(),
  contactNumber: z.string().min(1).optional(),
  safetyScore: z.number().min(0).max(100).optional(),
  status: z.enum(["Available", "On Trip", "Off Duty", "Suspended"]).optional(),
});
