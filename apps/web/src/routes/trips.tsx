import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trips")({
  component: Trips,
});

function Trips() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Trips</h1>
      <p className="text-muted-foreground mt-2">Trip lifecycle and dispatch.</p>
    </div>
  );
}
