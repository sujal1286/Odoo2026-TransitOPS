import { createFileRoute } from "@tanstack/react-router";

import GeneralSettings from "@/components/settings/general-settings";
import RbacMatrix from "@/components/settings/rbac-matrix";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Settings & RBAC</h1>
        <p className="text-xs text-muted-foreground">Platform configuration and role-based access control matrix</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <GeneralSettings />
        </div>
        <div className="lg:col-span-2">
          <RbacMatrix />
        </div>
      </div>
    </div>
  );
}
