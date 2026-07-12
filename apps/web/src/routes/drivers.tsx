import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/drivers")({
  component: Drivers,
});

function Drivers() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
      <p className="text-muted-foreground mt-2">Driver management and status.</p>
    </div>
  );
}
