import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="grid min-h-[100dvh] w-full lg:grid-cols-2 bg-zinc-950 text-zinc-50 font-sans">
      {/* Left Pane - Light Theme */}
      <div className="hidden flex-col bg-[#cfd4d8] text-zinc-900 lg:flex p-12 lg:p-24 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* Mock Logo */}
            <div className="w-12 h-12 bg-amber-600/20 border-2 border-amber-600/40 rounded flex items-center justify-center">
               <div className="grid grid-cols-3 gap-0.5 w-6 h-6">
                 {[...Array(9)].map((_, i) => (
                   <div key={i} className="bg-amber-600/80 rounded-sm" />
                 ))}
               </div>
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">TransitOps</h1>
              <p className="text-sm font-medium text-zinc-600">Smart Transport Operations Platform</p>
            </div>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-xl font-medium mb-4">One login, four roles:</h2>
          <ul className="space-y-3 font-medium text-zinc-800">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-700" />
              Fleet Manager
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-700" />
              Dispatcher
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-700" />
              Safety Officer
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-700" />
              Financial Analyst
            </li>
          </ul>
        </div>

        <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
          TRANSITOPS © 2026 · RBAC EN41
        </div>
      </div>

      {/* Right Pane - Dark Theme */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-[#111113]">
        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-medium tracking-tight mb-2 text-zinc-100">
            {showSignIn ? "Sign in to your account" : "Create an account"}
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            {showSignIn ? "Enter your credentials to continue" : "Sign up to join TransitOps"}
          </p>
          
          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}

          <div className="mt-12 text-sm text-zinc-400">
            <p className="mb-2">Access is scoped by role after login:</p>
            <ul className="space-y-1 pl-1">
              <li>• Fleet Manager → Fleet, Maintenance</li>
              <li>• Dispatcher → Dashboard, Trips</li>
              <li>• Safety Officer → Drivers, Compliance</li>
              <li>• Financial Analyst → Fuel & Expenses, Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
