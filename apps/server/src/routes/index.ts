import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import vehicleRouter from "./vehicle.routes";
import driverRouter from "./driver.routes";
import kpiRouter from "./kpi.routes";
import tripRouter from "./trip.routes";

const router = new Hono();

router.use("/*", authMiddleware);

router.route("/vehicles", vehicleRouter);
router.route("/drivers", driverRouter);
router.route("/dashboard", kpiRouter);
router.route("/trips", tripRouter);

export default router;
