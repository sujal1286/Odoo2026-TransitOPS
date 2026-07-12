import type { Context } from "hono";
import { KpiService } from "../services/kpi.service";
import { successResponse, errorResponse } from "../lib/api-response";

export class KpiController {
  static async getDashboardKpis(c: Context) {
    try {
      const kpis = await KpiService.getDashboardKpis();
      return successResponse(c, kpis);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }
}
