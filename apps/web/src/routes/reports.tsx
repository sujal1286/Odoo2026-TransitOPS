import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reports")({
  component: Reports,
});

function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <p className="text-muted-foreground mt-2">Analytics and ROI.</p>
    </div>
  );
}
