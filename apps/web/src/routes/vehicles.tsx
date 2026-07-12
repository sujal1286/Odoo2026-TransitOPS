import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vehicles")({
  component: Vehicles,
});

function Vehicles() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
      <p className="text-muted-foreground mt-2">Vehicle registry and management.</p>
    </div>
  );
}
