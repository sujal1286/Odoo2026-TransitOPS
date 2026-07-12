import { z } from "zod";

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  maxLoadCapacity: z.number().positive(),
  odometer: z.number().nonnegative(),
  acquisitionCost: z.number().positive(),
  region: z.string().min(1),
  status: z.enum(["Available", "On Trip", "In Shop", "Retired"]).default("Available"),
});

export const updateVehicleSchema = z.object({
  registrationNumber: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  maxLoadCapacity: z.number().positive().optional(),
  odometer: z.number().nonnegative().optional(),
  acquisitionCost: z.number().positive().optional(),
  region: z.string().min(1).optional(),
  status: z.enum(["Available", "On Trip", "In Shop", "Retired"]).optional(),
});
