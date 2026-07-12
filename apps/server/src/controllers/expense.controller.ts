import type { Context } from "hono";
import { ExpenseService } from "../services/expense.service";
import { createExpenseSchema } from "../schemas/expense.schema";
import { successResponse, errorResponse } from "../lib/api-response";

export class ExpenseController {
  static async getExpenses(c: Context) {
    try {
      const expenses = await ExpenseService.getExpenses();
      return successResponse(c, expenses);
    } catch (err: any) {
      return errorResponse(c, err.message, "DATABASE_ERROR", 500);
    }
  }

  static async createExpense(c: Context) {
    try {
      const body = await c.req.json();
      const parsed = createExpenseSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse(c, "Invalid request payload", "VALIDATION_ERROR", 400, parsed.error.format());
      }

      const expense = await ExpenseService.createExpense(parsed.data);
      return successResponse(c, expense, 201);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("not found")) {
        return errorResponse(c, msg, "NOT_FOUND_ERROR", 404);
      }
      return errorResponse(c, msg, "INTERNAL_ERROR", 500);
    }
  }
}
