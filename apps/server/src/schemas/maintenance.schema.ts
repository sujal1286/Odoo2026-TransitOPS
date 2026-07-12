import { z } from "zod";

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().uuid({ message: "A valid Vehicle ID is required" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long" }),
  cost: z.number().nonnegative({ message: "Maintenance cost cannot be negative" }),
  startDate: z.string().transform((str) => new Date(str)).optional(),
});

export const closeMaintenanceSchema = z.object({
  endDate: z.string().transform((str) => new Date(str)).optional(),
});
