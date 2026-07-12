import type { Context } from "hono";
import { VehicleService } from "../services/vehicle.service";
import { successResponse, errorResponse } from "../lib/api-response";
import { createVehicleSchema, updateVehicleSchema } from "../schemas/vehicle.schema";

export class VehicleController {
  static async getVehicles(c: Context) {
    try {
      const { status, type, region, search } = c.req.query();
      const vehicles = await VehicleService.getVehicles({ status, type, region, search });
      return successResponse(c, vehicles);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }

  static async createVehicle(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createVehicleSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      const existing = await VehicleService.getVehicleByRegNumber(parsed.data.registrationNumber);
      if (existing) {
        return errorResponse(c, "Vehicle with this registration number already exists", "CONFLICT_ERROR", 409);
      }

      const vehicle = await VehicleService.createVehicle(parsed.data);
      return successResponse(c, vehicle, 201);
    } catch (err: any) {
      return errorResponse(c, err.message, "INTERNAL_ERROR", 500);
    }
  }

  static async updateVehicle(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const body = await c.req.json();
      
      const parsed = updateVehicleSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      if (parsed.data.registrationNumber) {
        const existing = await VehicleService.getVehicleByRegNumber(parsed.data.registrationNumber);
        if (existing && existing.id !== id) {
          return errorResponse(c, "Vehicle with this registration number already exists", "CONFLICT_ERROR", 409);
        }
      }

      const vehicle = await VehicleService.updateVehicle(id, parsed.data);
      return successResponse(c, vehicle);
    } catch (err: any) {
      return errorResponse(c, err.message, "INTERNAL_ERROR", 500);
    }
  }
}
