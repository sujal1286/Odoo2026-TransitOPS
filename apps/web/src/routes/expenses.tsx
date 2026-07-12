import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

function Expenses() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
      <p className="text-muted-foreground mt-2">Fuel and operational expenses.</p>
    </div>
  );
}
