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

export const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  cargoWeight: z.number().min(1, "Cargo weight must be greater than 0"),
  plannedDistance: z.number().min(1, "Planned distance must be greater than 0"),
  revenue: z.number().min(0),
});

export const completeTripSchema = z.object({
  endOdometer: z.number().min(1, "End odometer is required"),
  fuelLiters: z.number().min(0),
  fuelCost: z.number().min(0),
});

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  cost: z.number().min(0, "Cost must be non-negative"),
  startDate: z.string().min(1, "Start date is required"),
});

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  liters: z.number().positive("Liters must be positive"),
  cost: z.number().positive("Cost must be positive"),
  date: z.string().min(1, "Date is required"),
});

export const expenseSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  category: z.enum(["Tolls", "Food", "Maintenance", "Fuel", "Other"]),
  description: z.string().max(250, "Description cannot exceed 250 characters").optional(),
  date: z.string().min(1, "Date is required"),
});

