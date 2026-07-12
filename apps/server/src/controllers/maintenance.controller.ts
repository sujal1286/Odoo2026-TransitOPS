import type { Context } from "hono";
import { MaintenanceService } from "../services/maintenance.service";
import { createMaintenanceSchema, closeMaintenanceSchema } from "../schemas/maintenance.schema";
import { successResponse, errorResponse } from "../lib/api-response";

export class MaintenanceController {
  static async getLogs(c: Context) {
    try {
      const logs = await MaintenanceService.getLogs();
      return successResponse(c, logs);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }

  static async createMaintenance(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createMaintenanceSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      const log = await MaintenanceService.createMaintenance(parsed.data);
      return successResponse(c, log, 201);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      if (msg.includes("retired") || msg.includes("active trip")) {
        return errorResponse(c, msg, "BUSINESS_RULE_ERROR", 400);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }

  static async closeMaintenance(c: Context) {
    try {
      const id = c.req.param("id") as string;
      const body = await c.req.json().catch(() => ({}));
      const parsed = closeMaintenanceSchema.safeParse(body);
      
      const endDate = parsed.success ? parsed.data.endDate : undefined;
      const log = await MaintenanceService.closeMaintenance(id, endDate);
      return successResponse(c, log);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      if (msg.includes("already closed")) {
        return errorResponse(c, msg, "BUSINESS_RULE_ERROR", 400);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }
}
