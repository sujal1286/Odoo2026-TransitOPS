import { Hono } from "hono";
import { ExpenseController } from "../controllers/expense.controller";
import { roleMiddleware } from "../middleware/auth";

const router = new Hono();

router.get("/", ExpenseController.getExpenses);
router.post("/", roleMiddleware(["FLEET_MANAGER", "DISPATCHER", "DRIVER", "FINANCIAL_ANALYST"]), ExpenseController.createExpense);

export default router;
