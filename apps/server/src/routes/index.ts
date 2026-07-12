import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import vehicleRouter from "./vehicle.routes";
import driverRouter from "./driver.routes";
import kpiRouter from "./kpi.routes";
import tripRouter from "./trip.routes";
import maintenanceRouter from "./maintenance.routes";
import fuelLogRouter from "./fuel-log.routes";
import expenseRouter from "./expense.routes";

const router = new Hono();

router.use("/*", authMiddleware);

router.route("/vehicles", vehicleRouter);
router.route("/drivers", driverRouter);
router.route("/dashboard", kpiRouter);
router.route("/trips", tripRouter);
router.route("/maintenance", maintenanceRouter);
router.route("/fuel-logs", fuelLogRouter);
router.route("/expenses", expenseRouter);

export default router;
