import { Hono } from "hono";
import { MaintenanceController } from "../controllers/maintenance.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/", MaintenanceController.getLogs);
router.post("/", roleMiddleware(["FLEET_MANAGER"]), MaintenanceController.createMaintenance);
router.patch("/:id/close", roleMiddleware(["FLEET_MANAGER"]), MaintenanceController.closeMaintenance);

export default router;
