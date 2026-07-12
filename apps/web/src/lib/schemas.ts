import { z } from "zod";

export const RoleEnum = z.enum([
  "FLEET_MANAGER",
  "DISPATCHER",
  "SAFETY_OFFICER",
  "FINANCIAL_ANALYST",
  "DRIVER",
]);

export type Role = z.infer<typeof RoleEnum>;

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: RoleEnum,
});

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  name: z.string().min(1, "Name/Model is required"),
  type: z.string().min(1, "Type is required"),
  maxLoadCapacity: z.number().min(0, "Capacity must be non-negative"),
  odometer: z.number().min(0, "Odometer must be non-negative"),
  acquisitionCost: z.number().min(0, "Acquisition cost must be non-negative"),
  region: z.string().min(1, "Region is required"),
  status: z.enum(["Available", "On Trip", "In Shop", "Retired"]),
});

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  safetyScore: z.number().min(0).max(100),
  status: z.enum(["Available", "On Trip", "Off Duty", "Suspended"]),
});
