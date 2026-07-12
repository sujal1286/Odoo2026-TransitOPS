import { Hono } from "hono";
import { VehicleController } from "../controllers/vehicle.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/", VehicleController.getVehicles);
router.post("/", roleMiddleware(["FLEET_MANAGER"]), VehicleController.createVehicle);
router.patch("/:id", roleMiddleware(["FLEET_MANAGER"]), VehicleController.updateVehicle);

export default router;
