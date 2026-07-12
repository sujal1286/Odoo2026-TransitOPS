import { Hono } from "hono";
import { DriverController } from "../controllers/driver.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/", DriverController.getDrivers);
router.post("/", roleMiddleware(["FLEET_MANAGER", "SAFETY_OFFICER"]), DriverController.createDriver);
router.patch("/:id", roleMiddleware(["FLEET_MANAGER", "SAFETY_OFFICER"]), DriverController.updateDriver);

export default router;
