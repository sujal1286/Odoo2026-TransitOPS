import { z } from "zod";

export const createTripSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  vehicleId: z.string().uuid(),
  driverId: z.string().uuid(),
  cargoWeight: z.number().positive(),
  plannedDistance: z.number().positive(),
  revenue: z.number().nonnegative().default(0.0),
});

export const completeTripSchema = z.object({
  endOdometer: z.number().positive(),
  fuelLiters: z.number().positive().optional(),
  fuelCost: z.number().positive().optional(),
});
