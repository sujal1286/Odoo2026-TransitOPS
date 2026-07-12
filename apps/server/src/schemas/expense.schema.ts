import { z } from "zod";

export const createExpenseSchema = z.object({
  vehicleId: z.string().uuid({ message: "A valid Vehicle ID is required" }),
  tripId: z.string().uuid({ message: "A valid Trip ID is required" }).optional(),
  amount: z.number().positive({ message: "Expense amount must be a positive number" }),
  category: z.enum(["Tolls", "Food", "Maintenance", "Fuel", "Other"], {
    message: "Category must be Tolls, Food, Maintenance, Fuel, or Other",
  }),
  description: z.string().max(250, { message: "Description cannot exceed 250 characters" }).optional(),
  date: z.string().transform((str) => new Date(str)).optional(),
});
