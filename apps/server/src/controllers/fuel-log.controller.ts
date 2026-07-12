import type { Context } from "hono";
import { FuelLogService } from "../services/fuel-log.service";
import { createFuelLogSchema } from "../schemas/fuel-log.schema";
import { successResponse, errorResponse } from "../lib/api-response";

export class FuelLogController {
  static async getFuelLogs(c: Context) {
    try {
      const logs = await FuelLogService.getFuelLogs();
      return successResponse(c, logs);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }

  static async createFuelLog(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createFuelLogSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      const log = await FuelLogService.createFuelLog(parsed.data);
      return successResponse(c, log, 201);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }
}
