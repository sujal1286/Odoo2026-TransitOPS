import type { Context } from "hono";
import { DriverService } from "../services/driver.service";
import { successResponse, errorResponse } from "../lib/api-response";
import { createDriverSchema, updateDriverSchema } from "../schemas/driver.schema";

export class DriverController {
  static async getDrivers(c: Context) {
    try {
      const { status, search, available } = c.req.query();
      const drivers = await DriverService.getDrivers({
        status,
        search,
        available: available === "true",
      });
      return successResponse(c, drivers);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }

  static async createDriver(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createDriverSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      const existing = await DriverService.getDriverByLicenseNumber(parsed.data.licenseNumber);
      if (existing) {
        return errorResponse(c, "Driver with this license number already exists", "CONFLICT_ERROR", 409);
      }

      const driver = await DriverService.createDriver(parsed.data);
      return successResponse(c, driver, 201);
    } catch (err: any) {
      return errorResponse(c, err.message, "INTERNAL_ERROR", 500);
    }
  }

  static async updateDriver(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const body = await c.req.json();

      const parsed = updateDriverSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      if (parsed.data.licenseNumber) {
        const existing = await DriverService.getDriverByLicenseNumber(parsed.data.licenseNumber);
        if (existing && existing.id !== id) {
          return errorResponse(c, "Driver with this license number already exists", "CONFLICT_ERROR", 409);
        }
      }

      const driver = await DriverService.updateDriver(id, parsed.data as any);
      return successResponse(c, driver);
    } catch (err: any) {
      return errorResponse(c, err.message, "INTERNAL_ERROR", 500);
    }
  }
}
