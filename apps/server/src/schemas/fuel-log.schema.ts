import { z } from "zod";

export const createFuelLogSchema = z.object({
  vehicleId: z.string().uuid({ message: "A valid Vehicle ID is required" }),
  tripId: z.string().uuid({ message: "A valid Trip ID is required" }).optional(),
  liters: z.number().positive({ message: "Fuel liters must be a positive number" }),
  cost: z.number().positive({ message: "Fuel cost must be a positive number" }),
  date: z.string().transform((str) => new Date(str)).optional(),
});
