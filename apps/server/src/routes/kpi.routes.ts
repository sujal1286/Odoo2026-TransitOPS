import { Hono } from "hono";
import { KpiController } from "../controllers/kpi.controller";

const router = new Hono();

router.get("/kpis", KpiController.getDashboardKpis);

export default router;
