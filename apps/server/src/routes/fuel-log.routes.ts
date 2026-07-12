import { Hono } from "hono";
import { FuelLogController } from "../controllers/fuel-log.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/", FuelLogController.getFuelLogs);
router.post("/", roleMiddleware(["FLEET_MANAGER", "DISPATCHER", "DRIVER"]), FuelLogController.createFuelLog);

export default router;
