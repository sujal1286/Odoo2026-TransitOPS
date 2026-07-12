import type { Context } from "hono";
import { ReportService } from "../services/report.service";
import { successResponse, errorResponse } from "../lib/api-response";

export class ReportController {
  static async getVehicleAnalytics(c: Context) {
    try {
      const analytics = await ReportService.getVehicleAnalytics();
      return successResponse(c, analytics);
    } catch (err: any) {
      return errorResponse(
        c,
        err.message || "Failed to retrieve vehicle analytics report. Please try again.",
        "DATABASE_ERROR",
        500
      );
    }
  }
}
