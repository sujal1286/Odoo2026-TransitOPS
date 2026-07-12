import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/maintenance")({
  component: Maintenance,
});

function Maintenance() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
      <p className="text-muted-foreground mt-2">Vehicle maintenance workflows.</p>
    </div>
  );
}
