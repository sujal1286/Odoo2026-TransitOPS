import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import vehicleRouter from "./vehicle.routes";
import driverRouter from "./driver.routes";
import kpiRouter from "./kpi.routes";

const router = new Hono();

router.use("/*", authMiddleware);

router.route("/vehicles", vehicleRouter);
router.route("/drivers", driverRouter);
router.route("/dashboard", kpiRouter);

export default router;
