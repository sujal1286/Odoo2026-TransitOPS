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
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Fuel & Expense Management</h1>
          <p className="text-xs text-muted-foreground">Log purchases and track operational expenditure across fleet assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsFuelModalOpen(true)}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 flex items-center gap-1.5"
          >
            <Fuel className="h-4 w-4" />
            <span>+ Log Fuel</span>
          </Button>
          <Button
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs px-4 py-2 border-amber-800 flex items-center gap-1.5"
          >
            <Receipt className="h-4 w-4" />
            <span>+ Add Expense</span>
          </Button>
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
