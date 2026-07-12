import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Fuel, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import FuelLogsTable from "@/components/expenses/fuel-logs-table";
import ExpensesPivotTable from "@/components/expenses/expenses-pivot-table";
import FuelModal from "@/components/expenses/fuel-modal";
import ExpenseModal from "@/components/expenses/expense-modal";

export const Route = createFileRoute("/dashboard/expenses")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  return (
    <div className="min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">
              Expense Operations
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Fuel & Expense Management
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Log purchases, track operational spend, and review cost flow across the fleet from a single workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              onClick={() => setIsFuelModalOpen(true)}
              className="w-full border-amber-800 bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 sm:w-auto"
            >
              <Fuel className="h-4 w-4" />
              <span>Log Fuel</span>
            </Button>
            <Button
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full border-zinc-950 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white sm:w-auto"
            >
              <Receipt className="h-4 w-4" />
              <span>Add Expense</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FuelLogsTable />
        <ExpensesPivotTable />
      </div>

      <FuelModal isOpen={isFuelModalOpen} onClose={() => setIsFuelModalOpen(false)} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
    </div>
  );
}
