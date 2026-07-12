import { Hono } from "hono";
import { ReportController } from "../controllers/report.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/analytics", roleMiddleware(["FLEET_MANAGER", "FINANCIAL_ANALYST"]), ReportController.getVehicleAnalytics);

export default router;
