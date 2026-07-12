import { createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import GeneralSettings from "@/components/settings/general-settings";
import RbacMatrix from "@/components/settings/rbac-matrix";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
      });
    }
    return { session };
  },
});

function SettingsPage() {
  return (
    <div className="p-6 space-y-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-100">Settings & RBAC</h1>
        <p className="text-xs text-zinc-500">Platform configuration and role-based access control matrix</p>
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
