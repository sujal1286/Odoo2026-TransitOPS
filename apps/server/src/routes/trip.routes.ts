import { Hono } from "hono";
import { TripController } from "../controllers/trip.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/", TripController.getTrips);
router.post("/", roleMiddleware(["FLEET_MANAGER", "DISPATCHER"]), TripController.createTrip);
router.patch("/:id/dispatch", roleMiddleware(["FLEET_MANAGER", "DISPATCHER"]), TripController.dispatchTrip);
router.patch("/:id/complete", roleMiddleware(["FLEET_MANAGER", "DISPATCHER", "DRIVER"]), TripController.completeTrip);
router.patch("/:id/cancel", roleMiddleware(["FLEET_MANAGER", "DISPATCHER"]), TripController.cancelTrip);

export default router;
